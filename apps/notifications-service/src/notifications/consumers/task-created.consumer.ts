import { Controller } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import type { TaskCreatedEvent } from '@jg/types/events/tasks'
import { CreateNotificationUseCase } from '../use-cases/create-notification.use-case'

@Controller()
export class TaskCreatedConsumer {
  constructor(
    private readonly createNotification: CreateNotificationUseCase,
  ) {}

  @EventPattern('task.created')
  async handle(event: TaskCreatedEvent) {
    for (const userId of event.assignees) {
      if (userId === event.createdBy) continue
      
      await this.createNotification.execute({
        userId,
        type: 'TASK_CREATED',
        payload: event,
      })
    }
  }
}
