import { TaskEntity } from "@/db/entities/task.entity"

export abstract class TasksRepository {
  abstract create(task: TaskEntity): Promise<TaskEntity>

  abstract findById(id: string): Promise<TaskEntity | null>

  abstract delete(id: string): Promise<void>

  abstract save(task: TaskEntity): Promise<void>

  abstract findMany(params: {
    page: number
    size: number
  }): Promise<{
    items: TaskEntity[]
    total: number
  }>
}
