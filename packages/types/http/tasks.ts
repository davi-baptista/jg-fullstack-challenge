
export interface CreateTaskPayload {
  title: string
  description?: string
  dueDate?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  assignees: string[]
  createdBy: string
}

export interface DeleteTaskPayload {
  taskId: string
  deletedBy: string
}

export interface UpdateTaskPayload {
  taskId: string
  title?: string
  description?: string
  dueDate?: string
  priority?: string
  status?: string
  assignees?: string[]
  updatedBy: string
}

export interface GetTaskPayload {
  taskId: string
}

export interface ListTasksPayload {
  page?: number
  size?: number
}

export interface CreateCommentPayload {
  taskId: string
  content: string
  authorId: string
}

export interface ListCommentsPayload {
  taskId: string
  page?: number
  size?: number
}
