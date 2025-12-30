export interface AuthUser {
  id: string
  email: string
  name?: string
}

export interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean

  login: (data: { user: AuthUser; accessToken: string }) => void
  logout: () => void
}