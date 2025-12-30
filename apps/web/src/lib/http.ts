const API_BASE_URL = import.meta.env.VITE_API_URL

export async function http<T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${input}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw response
  }

  return response.json() as Promise<T>
}
