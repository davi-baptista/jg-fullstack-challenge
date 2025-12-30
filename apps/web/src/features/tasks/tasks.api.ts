import { api } from '@/lib/api-client'
import { CreateTaskPayload, ListTasksPayload, ListTasksResponse, Task, UpdateTaskPayload } from './tasks.types'

export function listTasks({ page, size }: ListTasksPayload) {
  return api<ListTasksResponse>(`/tasks?page=${page}&size=${size}`)
}

export function getTaskById(taskId: string) {
  return api<Task>(`/tasks/${taskId}`)
}

export function updateTask(taskId: string, payload: UpdateTaskPayload) {
  return api<Task>(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteTask(taskId: string) {
  return api<void>(`/tasks/${taskId}`, {
    method: 'DELETE',
  })
}

export async function createTask(
  data: CreateTaskPayload,
): Promise<Task> {
  return api<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}