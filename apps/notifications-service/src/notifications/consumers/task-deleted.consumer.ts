import { Controller } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import type { TaskDeletedEvent } from '@jg/types/events/tasks'
import { CreateNotificationUseCase } from '../use-cases/create-notification.use-case'

@Controller()
export class TaskDeletedConsumer {
  constructor(
    private readonly createNotification: CreateNotificationUseCase,
  ) {}

  @EventPattern('task.deleted')
  async handle(event: TaskDeletedEvent) {
    for (const userId of event.assignees) {
      if (userId === event.deletedBy) continue

      await this.createNotification.execute({
        userId,
        type: 'TASK_DELETED',
        payload: event,
      })
    }
  }
}
