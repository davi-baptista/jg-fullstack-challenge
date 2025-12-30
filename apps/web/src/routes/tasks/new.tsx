import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import {
  createTaskSchema,
  CreateTaskFormData,
} from '@/features/tasks/create-task.schema'

import { useCreateTask } from '@/features/tasks/use-create-task'
import { useAuthStore } from '@/stores/auth.store'
import { ArrowLeft, Plus, AlertCircle, Clock, Eye, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/tasks/new')({
  component: NewTaskPage,
})

function NewTaskPage() {
  const navigate = useNavigate()
  const { mutateAsync: createTask, isPending } = useCreateTask()
  const user = useAuthStore((s) => s.user)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      status: 'TODO',
      priority: 'MEDIUM',
    },
  })

  async function onSubmit(data: CreateTaskFormData) {
    if (!user) {
      navigate({ to: '/login' })
      return
    }

    try {
      const response = await createTask({
        ...data,
        assignees: [user.id],
      })

      if (response && response.id) {
        navigate({
          to: '/tasks/$taskId',
          params: { taskId: response.id },
        })
      } else {
        console.error('Resposta inválida da API:', response)
        navigate({ to: '/' })
      }
    } catch (error) {
      console.error('Erro ao criar task:', error)
    }
  }

  const priorityColors = {
    LOW: 'text-green-500 border-green-500/30',
    MEDIUM: 'text-yellow-500 border-yellow-500/30',
    HIGH: 'text-orange-500 border-orange-500/30',
    URGENT: 'text-red-500 border-red-500/30',
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/' })}
          className="gap-2 text-zinc-400 hover:text-zinc-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Tarefa</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Crie uma nova tarefa e atribua aos responsáveis
          </p>
        </div>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50 text-zinc-400">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-zinc-400">
            <Plus className="h-5 w-5" />
            Detalhes da Tarefa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-300">
                Título *
              </Label>
              <Input
                id="title"
                placeholder="Ex: Implementar funcionalidade de login"
                {...register('title')}
                className="bg-zinc-900 border-zinc-800 focus:border-zinc-700"
              />
              {errors.title && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {errors.title.message}
                </div>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-300">
                Descrição
              </Label>
              <Textarea
                id="description"
                placeholder="Descreva os detalhes da tarefa..."
                {...register('description')}
                className="min-h-[120px] bg-zinc-900 border-zinc-800 focus:border-zinc-700 resize-none"
              />
            </div>

            {/* Status e Prioridade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div className="space-y-3">
                <Label className="text-zinc-300">Status</Label>
                <Select
                  defaultValue="TODO"
                  onValueChange={(v) => setValue('status', v as any)}
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-800 bg-zinc-900">
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
                <Label className="text-zinc-300">Prioridade</Label>
                <Select
                  defaultValue="MEDIUM"
                  onValueChange={(v) => setValue('priority', v as any)}
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-800 bg-zinc-900">
                    <SelectItem value="LOW" className={priorityColors.LOW}>
                      LOW
                    </SelectItem>
                    <SelectItem value="MEDIUM" className={priorityColors.MEDIUM}>
                      MEDIUM
                    </SelectItem>
                    <SelectItem value="HIGH" className={priorityColors.HIGH}>
                      HIGH
                    </SelectItem>
                    <SelectItem value="URGENT" className={priorityColors.URGENT}>
                      URGENT
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Informações do criador */}
            {user && (
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
                <Label className="text-zinc-400 text-sm mb-2 block">
                  Esta tarefa será atribuída automaticamente a:
                </Label>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-medium">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{user.email}</div>
                    <div className="text-xs text-zinc-500">Você</div>
                  </div>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/' })}
                className="flex-1 border-zinc-800 text-zinc-800 hover:text-white"
              >
                Cancelar
              </Button>
              
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 gap-2"
              >
                <Plus className="h-4 w-4" />
                {isPending ? 'Criando...' : 'Criar Tarefa'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}