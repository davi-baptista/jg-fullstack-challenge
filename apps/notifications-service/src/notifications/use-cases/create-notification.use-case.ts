import { NotificationsRepository } from '@/repositories/notifications-repository'
import { NotificationEntity } from '@/db/entities/notification.entity'
import { Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { NotificationCreatedEvent } from '@jg/types/events/notifications'

export class CreateNotificationUseCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    
    @Inject('NOTIFICATIONS_EVENTS')
    private eventsClient: ClientProxy,
  ) {}

  async execute(params: {
    userId: string
    type: string
    payload: Record<string, any>
  }) {
    const notification = new NotificationEntity()
    notification.userId = params.userId
    notification.type = params.type
    notification.payload = params.payload

    await this.notificationsRepository.add(notification)

    this.eventsClient.emit('notification.created', <NotificationCreatedEvent>{
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      payload: notification.payload,
      createdAt: notification.createdAt,
    })
  }
}
