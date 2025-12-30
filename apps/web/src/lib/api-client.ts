// src/lib/api.ts
import { useAuthStore } from '@/stores/auth.store'

const API_URL = import.meta.env.VITE_API_URL

let isRefreshing = false
let refreshPromise: Promise<string> | null = null

export async function refreshAccessToken(): Promise<string> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true

  refreshPromise = (async (): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Refresh failed')
      }

      const data: { accessToken: string } = await response.json()
      const store = useAuthStore.getState()

      if (!store.user) {
        throw new Error('User not found')
      }

      store.login({
        user: store.user,
        accessToken: data.accessToken,
      })

      return data.accessToken
    } catch {
      useAuthStore.getState().logout()
      throw new Error('Session expired')
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export async function refreshAccessTokenSilent(): Promise<void> {
  await refreshAccessToken()
}

export async function api<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const { accessToken } = useAuthStore.getState()

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.body && { 'Content-Type': 'application/json' }),

      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),

      ...(init.headers ?? {}),
    },
  })

  if (response.status === 401) {
    await refreshAccessTokenSilent()

    const newAccessToken = useAuthStore.getState().accessToken

    const retryResponse = await fetch(
      `${API_URL}${path}`,
      {
        ...init,
        credentials: 'include',
        headers: {
          ...(init.body && {
            'Content-Type': 'application/json',
          }),

          Authorization: `Bearer ${newAccessToken}`,

          ...(init.headers ?? {}),
        },
      },
    )

    if (retryResponse.status === 204) {
      return undefined as T
    }

    if (!retryResponse.ok) {
      const errorText = await retryResponse.text()
      throw new Error(
        errorText || 'Request failed after refresh',
      )
    }

    return retryResponse.json()
  }

  if (response.status === 204) {
    return undefined as T
  }

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'API error')
  }

  return response.json()
}