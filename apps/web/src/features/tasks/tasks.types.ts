export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: string
  priority: TaskPriority
  status: TaskStatus
  createdAt: string
  updatedAt: string
  assignees: TaskAssignee[]
  comments: Comment[]
}

export interface TaskAssignee {
  userId: string
  name: string
  email: string
}

export interface CreateTaskPayload {
  title: string
  description?: string
  dueDate?: string
  priority: TaskPriority
  status: TaskStatus
  assignees: string[]
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  priority?: TaskPriority
  status?: TaskStatus
  dueDate?: string
  assignees?: string[]
}

export interface ListTasksResponse {
  total: number
  tasks: Task[]
}

export interface ListTasksPayload {
  page: number
  size: number
}

