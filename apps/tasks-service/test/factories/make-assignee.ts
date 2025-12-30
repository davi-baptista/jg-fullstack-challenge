import { TaskAssigneeEntity } from '@/db/entities/task-assignee.entity'

interface MakeAssigneeProps {
  taskId: string
  userId: string
}


export async function makeAssignee({
  taskId,
  userId
}: MakeAssigneeProps) {
  const assignee = new TaskAssigneeEntity()

  assignee.taskId = taskId
  assignee.userId = userId
  
  return assignee
}

