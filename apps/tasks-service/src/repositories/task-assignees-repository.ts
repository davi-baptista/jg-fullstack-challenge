import { TaskAssigneeEntity } from "@/db/entities/task-assignee.entity"

export abstract class TaskAssigneesRepository {
  abstract add(assignee: TaskAssigneeEntity): Promise<void>
  abstract deleteByTaskId(taskId: string): Promise<void>
  abstract findByTaskId(taskId: string): Promise<TaskAssigneeEntity[]>
  abstract findByTaskIds(taskIds: string[]): Promise<TaskAssigneeEntity[]>
}
