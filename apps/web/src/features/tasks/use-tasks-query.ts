import { useQuery } from '@tanstack/react-query'
import type { ListTasksPayload, ListTasksResponse } from './tasks.types'
import { listTasks } from './tasks.api';

export function useTasksQuery(params: ListTasksPayload) {
  return useQuery<ListTasksResponse>({
    queryKey: ['tasks', params.page, params.size],
    queryFn: () => listTasks(params),
  })
}
