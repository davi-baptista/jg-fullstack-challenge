
export interface TaskCreatedEvent {
  taskId: string
  assignees: string[]
  createdBy: string
}

export interface TaskUpdatedEvent {
  taskId: string
  assignees: string[]
  assigneesDiff?: {
    added: string[]
    removed: string[]
  }
  updatedBy: string
  changes: {
    title?: string
    description?: string
    dueDate?: string
    priority?: string
    status?: string
    assigneesChanged: boolean
  }
}

export interface TaskDeletedEvent {
  taskId: string
  assignees: string[]
  deletedBy: string
}

export interface TaskCommentCreatedEvent {
  taskId: string
  authorId: string
  assignees: string[]
  content: string
}