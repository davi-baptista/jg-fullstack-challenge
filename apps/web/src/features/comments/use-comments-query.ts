import { useQuery } from '@tanstack/react-query'
import { listComments } from './comments.api'

export function useCommentsQuery(
  taskId: string,
  page: number,
  size: number,
) {
  return useQuery({
    queryKey: ['comments', taskId, page],
    queryFn: () => listComments(taskId, page, size),
  })
}
