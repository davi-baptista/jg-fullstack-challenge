import { Controller } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import type { TaskCommentCreatedEvent } from '@jg/types/events/tasks'
import { CreateNotificationUseCase } from '../use-cases/create-notification.use-case'

@Controller()
export class TaskCommentCreatedConsumer {
  constructor(
    private readonly createNotification: CreateNotificationUseCase,
  ) {}

  @EventPattern('task.comment.created')
  async handle(event: TaskCommentCreatedEvent) {
    for (const userId of event.assignees) {
      if (userId === event.authorId) continue

      await this.createNotification.execute({
        userId,
        type: 'TASK_COMMENT_CREATED',
        payload: event,
      })
    }
  }
}
