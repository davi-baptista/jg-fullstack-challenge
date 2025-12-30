import { TaskAssigneeEntity } from '@/db/entities/task-assignee.entity'
import { TaskAuditLogEntity } from '@/db/entities/task-audit-log.entity'
import { TaskEntity } from '@/db/entities/task.entity'
import { TaskAssigneesRepository } from '@/repositories/task-assignees-repository'
import { TaskAuditLogsRepository } from '@/repositories/task-audit-logs-repository'
import { TasksRepository } from '@/repositories/tasks-repository'
import { CreateTaskPayload } from '@jg/types/http/tasks'
import { TaskCreatedEvent } from '@jg/types/events/tasks'
import { Injectable, Inject } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { TaskMustHaveAssigneeError } from './errors/task-must-have-assignee-error'

@Injectable()
export class CreateTaskUseCase {
  constructor(
    private tasksRepository: TasksRepository,
    private assigneesRepository: TaskAssigneesRepository,
    private auditLogsRepository: TaskAuditLogsRepository,

    @Inject('TASKS_EVENTS')
    private eventsClient: ClientProxy,
  ) {}

  async execute({ title, description, dueDate, priority, status, assignees, createdBy }: CreateTaskPayload) {
    if (!assignees || assignees.length === 0) {
      throw new TaskMustHaveAssigneeError()
    }

    let parsedDueDate: Date | undefined

    if (dueDate) {
      parsedDueDate = new Date(dueDate)

      if (isNaN(parsedDueDate.getTime())) {
        throw new RpcException({
          statusCode: 400,
          message: 'Invalid due date',
        })
      }
    }
    
    const task = new TaskEntity()
    task.title = title
    task.description = description
    task.dueDate = parsedDueDate
    task.priority = priority
    task.status = status

    const savedTask = await this.tasksRepository.create(task)

    for (const userId of assignees) {
      const assignee = new TaskAssigneeEntity()
      assignee.taskId = savedTask.id
      assignee.userId = userId

      await this.assigneesRepository.add(assignee)
    }

    const audit = new TaskAuditLogEntity()
    audit.taskId = savedTask.id
    audit.action = 'CREATED'
    audit.performedBy = createdBy

    await this.auditLogsRepository.add(audit)

    this.eventsClient.emit('task.created', <TaskCreatedEvent>{
      taskId: savedTask.id,
      assignees,
      createdAt: savedTask.createdAt,
      createdBy,
    })
		
    return {
      id: savedTask.id,
    }
  }
}
