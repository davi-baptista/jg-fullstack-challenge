import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CreateTaskUseCase } from './use-cases/create-task.use-case'
import { TasksMessagesController } from './messaging/tasks.controller'
import { TaskEntity } from '@/db/entities/task.entity'
import { TaskAssigneeEntity } from '@/db/entities/task-assignee.entity'
import { TaskCommentEntity } from '@/db/entities/task-comment.entity'
import { TaskAuditLogEntity } from '@/db/entities/task-audit-log.entity'
import { TypeOrmTasksRepository } from '@/db/repositories/typeorm-tasks-repository'
import { UpdateTaskUseCase } from './use-cases/update-task.use-case'
import { DeleteTaskUseCase } from './use-cases/delete-task.use-case'
import { GetTaskUseCase } from './use-cases/get-task.use-case'
import { ListTasksUseCase } from './use-cases/list-tasks.use-case'
import { CreateCommentUseCase } from './use-cases/create-comment.use-case'
import { ListCommentsUseCase } from './use-cases/list-comments.use-case'
import { TypeOrmTaskCommentsRepository } from '@/db/repositories/typeorm-task-comments-repository'
import { TypeOrmTaskAssigneesRepository } from '@/db/repositories/typeorm-task-assignees-repository'
import { TypeOrmTaskAuditLogsRepository } from '@/db/repositories/typeorm-task-audit-logs-repository'
import { TasksRepository } from '@/repositories/tasks-repository'
import { TaskCommentsRepository } from '@/repositories/task-comments-repository'
import { TaskAssigneesRepository } from '@/repositories/task-assignees-repository'
import { TaskAuditLogsRepository } from '@/repositories/task-audit-logs-repository'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { EnvModule } from '@/env/env.module'
import { EnvService } from '@/env/env.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      TaskAssigneeEntity,
      TaskCommentEntity,
      TaskAuditLogEntity,
    ]),
    
    ClientsModule.registerAsync([
      {
        name: 'TASKS_EVENTS',
        imports: [EnvModule],
        inject: [EnvService],
        useFactory: (env: EnvService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [env.get('RABBITMQ_URL')],
            queue: env.get('RABBITMQ_TASK_EVENTS_QUEUE'),
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  controllers: [TasksMessagesController],
  providers: [
    CreateTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    GetTaskUseCase,
    ListTasksUseCase,
    CreateCommentUseCase,
    ListCommentsUseCase,
    {
      provide: TasksRepository,
      useClass: TypeOrmTasksRepository,
    },
    {
      provide: TaskCommentsRepository,
      useClass: TypeOrmTaskCommentsRepository,
    },
    {
      provide: TaskAssigneesRepository,
      useClass: TypeOrmTaskAssigneesRepository,
    },
    {
      provide: TaskAuditLogsRepository,
      useClass: TypeOrmTaskAuditLogsRepository,
    },
  ],
})
export class TasksModule {}
