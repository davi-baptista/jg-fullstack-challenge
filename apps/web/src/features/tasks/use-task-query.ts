import { useQuery } from '@tanstack/react-query'
import { getTaskById } from './tasks.api'
import type { Task } from './tasks.types'

export function useTaskQuery(taskId: string) {
  return useQuery<Task>({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById(taskId)
  })
}
