import { api } from '@/lib/api-client'
import type { ListCommentsResponse } from './comments.types'

export function listComments(
  taskId: string,
  page: number,
  size: number,
) {
  return api<ListCommentsResponse>(
    `/tasks/${taskId}/comments?page=${page}&size=${size}`,
  )
}

export function createComment(
  taskId: string,
  content: string,
) {
  return api<void>(`/tasks/${taskId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}
