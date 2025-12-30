import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createTask } from './tasks.api'
import type { CreateTaskPayload } from './tasks.types'

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTaskPayload) =>
      createTask(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      })

      toast.success('Task criada com sucesso')
    },

    onError: () => {
      toast.error('Erro ao criar task')
    },
  })
}
