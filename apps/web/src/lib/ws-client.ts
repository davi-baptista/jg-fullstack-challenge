import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/stores/auth.store'

let socket: Socket | null = null

export function getSocket() {
  if (socket) return socket

  const { accessToken } = useAuthStore.getState()

  socket = io(import.meta.env.VITE_WS_URL, {
    auth: {
      token: accessToken,
    },
  })

  return socket
}
