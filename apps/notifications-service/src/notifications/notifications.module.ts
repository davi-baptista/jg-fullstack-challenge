import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CreateNotificationUseCase } from './use-cases/create-notification.use-case'
import { TaskCreatedConsumer } from './consumers/task-created.consumer'
import { TaskUpdatedConsumer } from './consumers/task-updated.consumer'
import { TaskDeletedConsumer } from './consumers/task-deleted.consumer'
import { TaskCommentCreatedConsumer } from './consumers/task-comment-created.consumer'
import { NotificationEntity } from '@/db/entities/notification.entity'
import { NotificationsRepository } from '@/repositories/notifications-repository'
import { TypeOrmNotificationsRepository } from './repositories/typeorm-notifications-repository'
import { EnvModule } from '@/env/env.module'
import { EnvService } from '@/env/env.service'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity]),
        
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATIONS_EVENTS',
        imports: [EnvModule],
        inject: [EnvService],
        useFactory: (env: EnvService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [env.get('RABBITMQ_URL')],
            queue: env.get('RABBITMQ_NOTIFICATIONS_QUEUE'),
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  providers: [
    CreateNotificationUseCase,

    {
      provide: NotificationsRepository,
      useClass: TypeOrmNotificationsRepository,
    }
  ],
  controllers: [
    TaskCreatedConsumer,
    TaskUpdatedConsumer,
    TaskDeletedConsumer,
    TaskCommentCreatedConsumer,
  ],
})
export class NotificationsModule {}
