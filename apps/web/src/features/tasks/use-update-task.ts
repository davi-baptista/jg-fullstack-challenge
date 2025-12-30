import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask } from './tasks.api'
import type { UpdateTaskPayload } from './tasks.types'
import { toast } from 'sonner'

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string
      data: UpdateTaskPayload
    }) => updateTask(taskId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey:['tasks', variables.taskId]
      })
      
      queryClient.invalidateQueries({
        queryKey: ['task'],
      })

      toast.success('Tarefa atualizada com sucesso')
    },

    onError: () => toast.error('Não foi possível atualizar a tarefa'),
  })
}
