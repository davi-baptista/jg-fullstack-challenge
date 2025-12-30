import { useAuthStore } from '@/stores/auth.store'
import { redirect } from '@tanstack/react-router'

export function requireAuth({ location }: { location: { pathname: string } }) {
  if (location.pathname === '/login') {
    return
  }
  
  const isAuthenticated = useAuthStore.getState().isAuthenticated

  if (!isAuthenticated) {
    throw redirect({
      to: '/login',
    })
  }
}
