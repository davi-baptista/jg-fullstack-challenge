import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createComment } from './comments.api'

export function useCreateComment(taskId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content: string) =>
      createComment(taskId, content),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', taskId],
      })
    },
  })
}
