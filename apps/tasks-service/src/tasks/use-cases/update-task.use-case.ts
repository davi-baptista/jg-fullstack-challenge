import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { TasksRepository } from '@/repositories/tasks-repository'
import { TaskAssigneesRepository } from '@/repositories/task-assignees-repository'
import { TaskAuditLogsRepository } from '@/repositories/task-audit-logs-repository'
import { TaskAssigneeEntity } from '@/db/entities/task-assignee.entity'
import { TaskAuditLogEntity } from '@/db/entities/task-audit-log.entity'
import { TaskUpdatedEvent } from '@jg/types/events/tasks'
import { UpdateTaskPayload } from '@jg/types/http/tasks'
import { TaskNotFoundError } from './errors/task-not-found-error'

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    private tasksRepository: TasksRepository,
    private assigneesRepository: TaskAssigneesRepository,
    private auditLogsRepository: TaskAuditLogsRepository,

    @Inject('TASKS_EVENTS')
    private eventsClient: ClientProxy,
  ) {}

  async execute({ taskId, assignees, updatedBy, ...updates }: UpdateTaskPayload) {
    const task = await this.tasksRepository.findById(taskId)

    if (!task) {
      throw new TaskNotFoundError()
    }

    const previousAssignees = task.assignees.map(a => a.userId)

    if (updates.title !== undefined) task.title = updates.title
    if (updates.description !== undefined) task.description = updates.description
    if (updates.dueDate !== undefined) task.dueDate = new Date(updates.dueDate)
    if (updates.priority !== undefined) task.priority = updates.priority
    if (updates.status !== undefined) task.status = updates.status

    await this.tasksRepository.save(task)

    let finalAssignees = previousAssignees

    if (assignees) {
      await this.assigneesRepository.deleteByTaskId(taskId)

      for (const userId of assignees) {
        const assignee = new TaskAssigneeEntity()
        assignee.taskId = taskId
        assignee.userId = userId
        await this.assigneesRepository.add(assignee)
      }
      
      finalAssignees = assignees
    }
    
    const assigneesDiff = assignees
      ? {
          added: finalAssignees.filter(id => !previousAssignees.includes(id)),
          removed: previousAssignees.filter(id => !finalAssignees.includes(id)),
        }
      : undefined

    const audit = new TaskAuditLogEntity()
    audit.taskId = taskId
    audit.action = 'UPDATED'
    audit.performedBy = updatedBy

    await this.auditLogsRepository.add(audit)

    this.eventsClient.emit('task.updated', <TaskUpdatedEvent>{
      taskId,
      updatedBy,
      assignees: finalAssignees,
      assigneesDiff,
      changes: {
        ...(updates.title !== undefined && { title: updates.title }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.dueDate !== undefined && { dueDate: updates.dueDate }),
        ...(updates.priority !== undefined && { priority: updates.priority }),
        ...(updates.status !== undefined && { status: updates.status }),
        assigneesChanged: assignees !== undefined,
      },
    })

    return {
      ...task,
      assignees: finalAssignees
    }
  }
}
