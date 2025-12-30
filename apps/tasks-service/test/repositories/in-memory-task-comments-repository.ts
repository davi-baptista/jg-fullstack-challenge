import { TaskCommentEntity } from "@/db/entities/task-comment.entity";
import { TaskCommentsRepository } from "@/repositories/task-comments-repository";

export class InMemoryTaskCommentsRepository implements TaskCommentsRepository {
  public items: TaskCommentEntity[] = []
  
  async add(comment: TaskCommentEntity) {
    this.items.push(comment)
  }

  async deleteByTaskId(taskId: string) {
    this.items = this.items.filter(item => item.taskId !== taskId)
  }

  async findByTaskId(taskId: string): Promise<TaskCommentEntity[]> {
    return this.items.filter(item => item.taskId === taskId)
  }

  async findManyByTaskId(params: { taskId: string; page: number; size: number; }): Promise<{ items: TaskCommentEntity[]; total: number; }> {
    const start = (params.page - 1) * params.size
    const end = start + params.size

    const items = this.items.slice(start, end)

    return {
      items,
      total: this.items.length,
    }
  }
}