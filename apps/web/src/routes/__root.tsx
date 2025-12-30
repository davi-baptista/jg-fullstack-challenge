import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getSocket } from '@/lib/ws-client'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth.store'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { api, refreshAccessTokenSilent } from '@/lib/api-client'

type NotificationEvent = {
  id: string
  userId: string
  type:
    | 'TASK_CREATED'
    | 'TASK_UPDATED'
    | 'TASK_DELETED'
    | 'TASK_COMMENT_CREATED'
  payload: {
    taskId?: string
  }
  createdAt: string
}

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    const { isAuthenticated } = useAuthStore.getState()
    
    const publicRoutes = ['/login', '/register']
    
    if (publicRoutes.includes(location.pathname)) {
      return
    }
    
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    }
    
    try {
      await api('/auth/refresh', { method: 'GET' })
    } catch (error) {
      try {
        await refreshAccessTokenSilent()
      } catch {
        useAuthStore.getState().logout()
        throw redirect({
          to: '/login',
        })
      }
    }
  },
  component: RootLayout,
})

function RootLayout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
    
    queryClient.clear()
    
    toast.success('Você saiu da sua conta')
  }

  useEffect(() => {
    const socket = getSocket()

    function onNotification(event: NotificationEvent) {
      switch (event.type) {
        case 'TASK_CREATED': {
          queryClient.invalidateQueries({ queryKey: ['tasks'] })

          toast.success('Nova task criada', {
            action: {
              label: 'Abrir',
              onClick: () => {
                if (event.payload.taskId) {
                  navigate({
                    to: '/tasks/$taskId',
                    params: { taskId: event.payload.taskId },
                  })
                }
              },
            },
          })
          break
        }

        case 'TASK_UPDATED': {
          queryClient.invalidateQueries({ queryKey: ['tasks'] })

          if (event.payload.taskId) {
            queryClient.invalidateQueries({
              queryKey: ['task', event.payload.taskId],
            })
          }

          toast('Task atualizada', {
            action: {
              label: 'Abrir',
              onClick: () => {
                if (event.payload.taskId) {
                  navigate({
                    to: '/tasks/$taskId',
                    params: { taskId: event.payload.taskId },
                  })
                }
              },
            },
          })
          break
        }

        case 'TASK_COMMENT_CREATED': {
          if (!event.payload.taskId) return

          queryClient.invalidateQueries({
            predicate: (query) =>
              Array.isArray(query.queryKey) &&
              query.queryKey[0] === 'comments' &&
              query.queryKey[1] === event.payload.taskId,
          })

          toast('Novo comentário em uma task', {
            action: {
              label: 'Abrir',
              onClick: () => {
                navigate({
                  to: '/tasks/$taskId',
                  params: { taskId: event.payload.taskId },
                })
              },
            },
          })
          break
        }

        case 'TASK_DELETED': {
          queryClient.invalidateQueries({ queryKey: ['tasks'] })

          if (event.payload.taskId) {
            queryClient.removeQueries({
              queryKey: ['task', event.payload.taskId],
            })
          }

          toast.error('Uma task foi removida')
          break
        }
      }
    }

    socket.on('notification', onNotification)
    return () => { socket.off('notification', onNotification) }
  }, [queryClient, navigate])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Cabeçalho com botão de logout */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Task Manager</h1>
              {user && (
                <span className="text-sm text-zinc-400">
                  | Olá, {user.name || user.email}
                </span>
              )}
            </div>
            
            {user && (
              <div className="flex items-center gap-4">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-5xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}