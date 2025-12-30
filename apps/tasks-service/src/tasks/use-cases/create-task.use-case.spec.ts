import { InMemoryTaskAssigneesRepository } from '@test/repositories/in-memory-task-assignees-repository'
import { CreateTaskUseCase } from './create-task.use-case'
import { InMemoryTasksRepository } from '@test/repositories/in-memory-tasks-repository'
import { InMemoryTaskAuditLogsRepository } from '@test/repositories/in-memory-task-audit-logs-repository'

let tasksRepository: InMemoryTasksRepository
let taskAssigneesRepository: InMemoryTaskAssigneesRepository
let taskAuditLogRepository: InMemoryTaskAuditLogsRepository
let eventsClientMock: any
let sut: CreateTaskUseCase

describe('Create Task Use Case', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    taskAssigneesRepository = new InMemoryTaskAssigneesRepository()
    taskAuditLogRepository = new InMemoryTaskAuditLogsRepository()
    eventsClientMock = { emit: vi.fn() }
    
    sut = new CreateTaskUseCase(tasksRepository, taskAssigneesRepository, taskAuditLogRepository, eventsClientMock)
  })

  it('should be able to create a task', async () => {
    const result = await sut.execute({
      title: 'Example Title',
      description: 'Example Description',
      dueDate: '2023-01-01',
      priority: 'LOW',
      status: 'TODO',
      assignees: ['1'],
      createdBy: '1'
    })

    expect(result).toEqual({
      id: result.id
    })
  })

  it('should be able to emit task.created event', async () => {
    await sut.execute({
      title: 'Example Title',
      description: 'Example Description',
      dueDate: '2023-01-01',
      priority: 'LOW',
      status: 'TODO',
      assignees: ['1'],
      createdBy: '1'
    })

    expect(eventsClientMock.emit).toHaveBeenCalledWith(
      'task.created',
      expect.objectContaining({
        taskId: expect.any(String),
        assignees: ['1'],
        createdBy: '1',
      }),
    )
  })
})