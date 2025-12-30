import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { NotificationEntity } from '@/db/entities/notification.entity'
import { NotificationsRepository } from '@/repositories/notifications-repository'

@Injectable()
export class TypeOrmNotificationsRepository implements NotificationsRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repository: Repository<NotificationEntity>,
  ) {}

  async add(notification: NotificationEntity): Promise<void> {
    await this.repository.save(notification)
  }
}
