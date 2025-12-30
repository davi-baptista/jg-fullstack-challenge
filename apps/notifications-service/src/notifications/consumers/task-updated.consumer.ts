import { Controller } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import type { TaskUpdatedEvent } from '@jg/types/events/tasks'
import { CreateNotificationUseCase } from '../use-cases/create-notification.use-case'

@Controller()
export class TaskUpdatedConsumer {
  constructor(
    private readonly createNotification: CreateNotificationUseCase,
  ) {}

  @EventPattern('task.updated')
  async handle(event: TaskUpdatedEvent) {
    const { assignees, assigneesDiff, updatedBy } = event
    
    for (const userId of assigneesDiff?.added ?? []) {
      if (userId === updatedBy) continue

      await this.createNotification.execute({
        userId,
        type: 'TASK_ASSIGNED',
        payload: event,
      })
    }
    
    for (const userId of assigneesDiff?.removed ?? []) {
      if (userId === updatedBy) continue

      await this.createNotification.execute({
        userId,
        type: 'TASK_UNASSIGNED',
        payload: event,
      })
    }
    
    for (const userId of assignees) {
      if (userId === updatedBy) continue
      if (assigneesDiff?.added.includes(userId)) continue
      
      await this.createNotification.execute({
        userId,
        type: 'TASK_UPDATED',
        payload: event,
      })
    }
  }
}
