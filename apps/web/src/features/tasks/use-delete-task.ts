import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTask } from './tasks.api'

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),

    onSuccess: (_, taskId) => {
      // Remove do cache de detalhe
      queryClient.removeQueries({
        queryKey: ['task', taskId],
      })

      // Revalida a lista
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      })
    },
  })
}
