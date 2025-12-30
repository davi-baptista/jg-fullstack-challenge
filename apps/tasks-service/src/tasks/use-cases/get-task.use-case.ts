import { Injectable } from '@nestjs/common'
import { TasksRepository } from '@/repositories/tasks-repository'
import { TaskAssigneesRepository } from '@/repositories/task-assignees-repository'
import { TaskCommentsRepository } from '@/repositories/task-comments-repository'
import { RpcException } from '@nestjs/microservices'
import { GetTaskPayload } from '@jg/types/http/tasks'
import { TaskNotFoundError } from './errors/task-not-found-error'

@Injectable()
export class GetTaskUseCase {
  constructor(
    private tasksRepository: TasksRepository,
    private assigneesRepository: TaskAssigneesRepository,
    private commentsRepository: TaskCommentsRepository,
  ) {}

  async execute({ taskId }: GetTaskPayload) {
    const task = await this.tasksRepository.findById(taskId)

    if (!task) {
      throw new TaskNotFoundError()
    }

    const assignees = await this.assigneesRepository.findByTaskId(taskId)
    const comments = await this.commentsRepository.findByTaskId(taskId)

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      assignees: assignees.map(a => a.userId),
      comments: comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        authorId: comment.authorId,
        createdAt: comment.createdAt,
      })),
    }
  }
}
