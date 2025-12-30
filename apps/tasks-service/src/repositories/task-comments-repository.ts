import { TaskCommentEntity } from "@/db/entities/task-comment.entity";

export abstract class TaskCommentsRepository {
  abstract add(comment: TaskCommentEntity): Promise<void>
  
  abstract deleteByTaskId(taskId: string): Promise<void>

  abstract findByTaskId(taskId: string): Promise<TaskCommentEntity[]>
  
  abstract findManyByTaskId(params: { taskId: string; page: number; size: number }): Promise<{ items: TaskCommentEntity[]; total: number }>
}
