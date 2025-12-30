import { NotificationsRepository } from '@/repositories/notifications-repository'
import { NotificationEntity } from '@/db/entities/notification.entity'

export class InMemoryNotificationsRepository implements NotificationsRepository {
  public items: NotificationEntity[] = []

  async add(notification: NotificationEntity): Promise<void> {
    this.items.push(notification)
  }
}
