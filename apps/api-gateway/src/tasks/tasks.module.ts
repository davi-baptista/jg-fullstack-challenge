import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { CreateTaskController } from './controllers/create-task.controller'
import { UpdateTaskController } from './controllers/update-task.controller'
import { DeleteTaskController } from './controllers/delete-task.controller'
import { GetTaskController } from './controllers/get-task.controller'
import { ListTasksController } from './controllers/list-tasks.controller'
import { CreateCommentController } from './controllers/create-comment.controller'
import { ListCommentsController } from './controllers/list-comments.controller'
import { EnvService } from '@/env/env.service'
import { EnvModule } from '@/env/env.module'

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'TASKS_SERVICE',
        imports: [EnvModule],
        inject: [EnvService],
        useFactory: (env: EnvService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [env.get('RABBITMQ_URL')],
            queue: env.get('RABBITMQ_TASKS_QUEUE'),
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [EnvModule],
        inject: [EnvService],
        useFactory: (env: EnvService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [env.get('RABBITMQ_URL')],
            queue: env.get('RABBITMQ_AUTH_QUEUE'),
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],

  controllers: [
    CreateTaskController,
    UpdateTaskController,
    DeleteTaskController,
    GetTaskController,
    ListTasksController,
    CreateCommentController,
    ListCommentsController,
  ],
})
export class TasksModule {}
