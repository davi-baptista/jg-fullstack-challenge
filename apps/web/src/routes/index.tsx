import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { useTasksQuery } from '@/features/tasks/use-tasks-query'
import { TasksSkeleton } from '@/components/tasks/tasks-skeleton'
import { useAuthStore } from '@/stores/auth.store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: TasksPage,
})

function TasksPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useTasksQuery({
    page,
    size: 5,
  })

  if (isLoading) return <TasksSkeleton />
  if (isError || !data) return <p>Erro ao carregar tarefas</p>

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'URGENT': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'IN_PROGRESS': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'REVIEW': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'DONE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
          <p className="text-zinc-400 mt-1">
            Total de {data.total} tarefas • Página {page} de {Math.ceil(data.total / 5)}
          </p>
        </div>

        <Button 
          onClick={() => navigate({ to: '/tasks/new' })}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Task
        </Button>
      </div>

      {/* Tasks List */}
      <div className="grid gap-4">
        {data.tasks.map((task) => (
          <Card 
            key={task.id}
            className="cursor-pointer border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 transition-all hover:border-zinc-700"
            onClick={() => navigate({ to: '/tasks/$taskId', params: { taskId: task.id } })}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(task.status)}`}
                    >
                      {task.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {task.dueDate && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-xs text-zinc-500">
                    Vencimento: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {data.total > 5 && (
        <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
          <div className="text-sm text-zinc-400">
            Mostrando {Math.min((page - 1) * 5 + 1, data.total)} a {Math.min(page * 5, data.total)} de {data.total} tarefas
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled={data.tasks.length < 5}
              onClick={() => setPage((p) => p + 1)}
              className="gap-2"
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {data.tasks.length === 0 && (
        <Card className="border-dashed border-zinc-800 bg-zinc-900/30">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-zinc-400" />
            </div>
            <CardTitle className="text-xl mb-2 text-zinc-600">Nenhuma tarefa encontrada</CardTitle>
            <p className="text-zinc-400 mb-6">
              Comece criando sua primeira tarefa
            </p>
            <Button 
              onClick={() => navigate({ to: '/tasks/new' })}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Criar primeira task
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}