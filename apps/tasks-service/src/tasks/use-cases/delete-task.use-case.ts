import { TaskAuditLogEntity } from '@/db/entities/task-audit-log.entity'
import { TaskAssigneesRepository } from '@/repositories/task-assignees-repository'
import { TaskAuditLogsRepository } from '@/repositories/task-audit-logs-repository'
import { TasksRepository } from '@/repositories/tasks-repository'
import { DeleteTaskPayload } from '@jg/types/http/tasks'
import { TaskDeletedEvent } from '@jg/types/events/tasks'
import { Injectable, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { TaskCommentsRepository } from '@/repositories/task-comments-repository'
import { TaskNotFoundError } from './errors/task-not-found-error'

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    private tasksRepository: TasksRepository,
    private assigneesRepository: TaskAssigneesRepository,
    private auditLogsRepository: TaskAuditLogsRepository,
    private commentsRepository: TaskCommentsRepository,

    @Inject('TASKS_EVENTS')
    private eventsClient: ClientProxy,
  ) {}

  async execute({ taskId, deletedBy }: DeleteTaskPayload) {
    const task = await this.tasksRepository.findById(taskId)
    
    if (!task) {
      throw new TaskNotFoundError()
    }

    const assignees = task.assignees.map(a => a.userId)

    await this.tasksRepository.delete(taskId)
    await this.assigneesRepository.deleteByTaskId(taskId)
    await this.commentsRepository.deleteByTaskId(taskId)

    const audit = new TaskAuditLogEntity()
    audit.taskId = taskId
    audit.action = 'DELETED'
    audit.performedBy = deletedBy

    await this.auditLogsRepository.add(audit)


    this.eventsClient.emit('task.deleted', <TaskDeletedEvent>{
      taskId,
      assignees,
      deletedBy,
    })
    
    return null
  }
}
