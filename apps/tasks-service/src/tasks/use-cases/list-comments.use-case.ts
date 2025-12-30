import { Injectable } from '@nestjs/common'
import { TasksRepository } from '@/repositories/tasks-repository'
import { TaskCommentsRepository } from '@/repositories/task-comments-repository'
import { ListCommentsPayload } from '@jg/types/http/tasks'
import { TaskNotFoundError } from './errors/task-not-found-error'

@Injectable()
export class ListCommentsUseCase {
  constructor(
    private tasksRepository: TasksRepository,
    private commentsRepository: TaskCommentsRepository,
  ) {}

  async execute({ taskId, page = 1, size = 10 }: ListCommentsPayload) {
    const task = await this.tasksRepository.findById(taskId)

    if (!task) {
        throw new TaskNotFoundError()
    }

    const { items, total } = await this.commentsRepository.findManyByTaskId({
      taskId,
      page,
      size,
    })

    return {
      total,
      comments: items.map(comment => ({
        id: comment.id,
        content: comment.content,
        authorId: comment.authorId,
        createdAt: comment.createdAt,
      })),
    }
  }
}
