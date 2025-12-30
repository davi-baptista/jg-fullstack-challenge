import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { useTaskQuery } from '@/features/tasks/use-task-query'
import { useUpdateTask } from '@/features/tasks/use-update-task'
import { useDeleteTask } from '@/features/tasks/use-delete-task'

import { useCommentsQuery } from '@/features/comments/use-comments-query'
import { useCreateComment } from '@/features/comments/use-create-comment'

import type {
  TaskPriority,
  TaskStatus,
} from '@/features/tasks/tasks.types'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Button } from '@/components/ui/button'
import { TaskDetailSkeleton } from '@/components/tasks/task-detail-skeleton'
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  MessageSquare, 
  Calendar,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye
} from 'lucide-react'

export const Route = createFileRoute('/tasks/$taskId')({
  component: TaskDetailPage,
})

function TaskDetailPage() {
  const { taskId } = Route.useParams()
  const navigate = useNavigate()

  const { data: task, isLoading, isError } = useTaskQuery(taskId)
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const [status, setStatus] = useState<TaskStatus | undefined>()
  const [priority, setPriority] = useState<TaskPriority | undefined>()

  const [page, setPage] = useState(1)
  const [comment, setComment] = useState('')

  const commentsQuery = useCommentsQuery(taskId, page, 5)
  const createComment = useCreateComment(taskId)

  useEffect(() => {
    if (task) {
      setStatus(task.status)
      setPriority(task.priority)
    }
  }, [task])

  if (isLoading) return <TaskDetailSkeleton />
  if (isError || !task) return <p>Erro ao carregar tarefa</p>

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'LOW': return 'text-green-500 border-green-500/30'
      case 'MEDIUM': return 'text-yellow-500 border-yellow-500/30'
      case 'HIGH': return 'text-orange-500 border-orange-500/30'
      case 'URGENT': return 'text-red-500 border-red-500/30'
      default: return 'text-zinc-400 border-zinc-500/30'
    }
  }

  async function handleUpdate() {
    await updateTask.mutateAsync({
      taskId,
      data: {
        status,
        priority,
      },
    })
  }

  async function handleDelete() {
    if (window.confirm('Tem certeza que deseja deletar esta task?')) {
      await deleteTask.mutateAsync(taskId)
      navigate({ to: '/' })
    }
  }

  async function handleCreateComment() {
    await createComment.mutateAsync(comment)
    setComment('')
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/' })}
          className="gap-2 text-zinc-400 hover:text-zinc-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para tasks
        </Button>
        
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      </div>

      {/* Task Content */}
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
          {task.dueDate && (
            <div className="flex items-center gap-2 mt-2 text-zinc-400">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                Vencimento: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="text-sm font-medium text-zinc-400 mb-3">Descrição</h3>
            <p className="text-zinc-300 leading-relaxed">{task.description}</p>
          </div>
        )}

        {/* Status & Priority Controls */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-4">Configurações</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div className="space-y-3">
              <label className="text-sm text-zinc-300">Status</label>
              <Select
                value={status ?? task.status}
                onValueChange={(v) => setStatus(v as TaskStatus)}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-400">
                  <SelectItem value="TODO" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    TODO
                  </SelectItem>
                  <SelectItem value="IN_PROGRESS" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    IN_PROGRESS
                  </SelectItem>
                  <SelectItem value="REVIEW" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    REVIEW
                  </SelectItem>
                  <SelectItem value="DONE" className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    DONE
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prioridade */}
            <div className="space-y-3">
              <label className="text-sm text-zinc-300">Prioridade</label>
              <Select
                value={priority ?? task.priority}
                onValueChange={(v) => setPriority(v as TaskPriority)}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900">
                  <SelectItem value="LOW" className={getPriorityColor('LOW')}>
                    LOW
                  </SelectItem>
                  <SelectItem value="MEDIUM" className={getPriorityColor('MEDIUM')}>
                    MEDIUM
                  </SelectItem>
                  <SelectItem value="HIGH" className={getPriorityColor('HIGH')}>
                    HIGH
                  </SelectItem>
                  <SelectItem value="URGENT" className={getPriorityColor('URGENT')}>
                    URGENT
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="mt-6 gap-2"
            onClick={handleUpdate}
            disabled={updateTask.isPending || (status === task.status && priority === task.priority)}
          >
            <Save className="h-4 w-4" />
            {updateTask.isPending ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>

        {/* Assignees */}
        {task.assignees.length > 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-4">
              <Users className="h-4 w-4" />
              Assignees
            </h3>
            <div className="flex flex-wrap gap-2">
              {task.assignees.map((a) => (
                <div
                  key={a.userId}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700"
                >
                  <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-medium">
                    {a.name?.charAt(0) || a.email.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{a.name || 'Usuário'}</div>
                    <div className="text-xs text-zinc-400">{a.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-6">
            <MessageSquare className="h-4 w-4" />
            Comentários ({commentsQuery.data?.total || 0})
          </h3>

          {/* Comments List */}
          <div className="space-y-4 mb-6">
            {commentsQuery.data?.comments.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-medium">
                    {c.name?.charAt(0) || c.email.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {c.name || c.email}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {new Date(c.createdAt).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
                <p className="text-zinc-300">{c.content}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {commentsQuery.data && commentsQuery.data.total > 0 && (
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-zinc-400">
                Página {page} de {Math.ceil(commentsQuery.data.total / 5)}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  disabled={page === 1 || commentsQuery.isLoading}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  disabled={
                    (commentsQuery.data?.comments.length ?? 0) < 5 ||
                    commentsQuery.isLoading
                  }
                  onClick={() => setPage((p) => p + 1)}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}

          {/* New Comment */}
          <div className="space-y-3">
            <textarea
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-4 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
              placeholder="Escreva um comentário..."
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleCreateComment}
                disabled={!comment || createComment.isPending}
                className="gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                {createComment.isPending ? 'Enviando...' : 'Comentar'}
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-red-900/30 bg-red-950/10 p-6">
          <h3 className="text-sm font-medium text-red-400 mb-4">Zona de perigo</h3>
          <p className="text-sm text-zinc-400 mb-4">
            Esta ação não pode ser desfeita. A task será permanentemente deletada.
          </p>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteTask.isPending}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {deleteTask.isPending ? 'Deletando...' : 'Deletar task'}
          </Button>
        </div>
      </div>
    </div>
  )
}