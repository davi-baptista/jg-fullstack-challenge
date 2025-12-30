import { Injectable, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { TaskCommentEntity } from '@/db/entities/task-comment.entity'
import { TasksRepository } from '@/repositories/tasks-repository'
import { TaskCommentsRepository } from '@/repositories/task-comments-repository'
import { CreateCommentPayload } from '@jg/types/http/tasks'
import { TaskCommentCreatedEvent } from '@jg/types/events/tasks'
import { TaskNotFoundError } from './errors/task-not-found-error'

@Injectable()
export class CreateCommentUseCase {
  constructor(
    private tasksRepository: TasksRepository,
    private commentsRepository: TaskCommentsRepository,

    @Inject('TASKS_EVENTS')
    private eventsClient: ClientProxy,
  ) {}

  async execute({ taskId, content, authorId }: CreateCommentPayload) {
    const task = await this.tasksRepository.findById(taskId)

    if (!task) {
        throw new TaskNotFoundError()
    }

    const comment = new TaskCommentEntity()
    comment.taskId = taskId
    comment.content = content
    comment.authorId = authorId

    await this.commentsRepository.add(comment)

    const assignees = task.assignees.map(a => a.userId)

    this.eventsClient.emit('task.comment.created', <TaskCommentCreatedEvent>{
      taskId,
      authorId,
      content,
      assignees
    })

    return {
        commentId: comment.id
    }
  }
}
