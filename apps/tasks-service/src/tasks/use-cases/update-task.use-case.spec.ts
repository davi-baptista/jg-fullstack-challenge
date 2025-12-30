import { InMemoryTasksRepository } from '@test/repositories/in-memory-tasks-repository'
import { InMemoryTaskAuditLogsRepository } from '@test/repositories/in-memory-task-audit-logs-repository'
import { makeTask } from '@test/factories/make-task'
import { UpdateTaskUseCase } from './update-task.use-case'
import { makeAssignee } from '@test/factories/make-assignee'
import { InMemoryTaskAssigneesRepository } from '@test/repositories/in-memory-task-assignees-repository'

let tasksRepository: InMemoryTasksRepository
let taskAssigneesRepository: InMemoryTaskAssigneesRepository
let taskAuditLogRepository: InMemoryTaskAuditLogsRepository
let eventsClientMock: any
let sut: UpdateTaskUseCase

describe('Update Task Use Case', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    taskAssigneesRepository = new InMemoryTaskAssigneesRepository()
    taskAuditLogRepository = new InMemoryTaskAuditLogsRepository()
    eventsClientMock = { emit: vi.fn() }
    
    sut = new UpdateTaskUseCase(tasksRepository, taskAssigneesRepository, taskAuditLogRepository, eventsClientMock)
  },)

  it('should be able to update a task', async () => {
    const createdTask = await makeTask({ title: 'Example title'})

    await tasksRepository.create(createdTask)

    const createdAssignee = await makeAssignee({ taskId: createdTask.id, userId: '1' })

    await taskAssigneesRepository.add(createdAssignee)

    await sut.execute({
      taskId: createdTask.id,
      title: 'Other title',
      assignees: ['2'],
      updatedBy: '1'
    })

    expect(tasksRepository.items[0].title).toEqual('Other title')
    expect(taskAssigneesRepository.items[0].userId).toEqual('2')
  })

  it('should be able to emit task.updated event', async () => {
    const task = await makeTask({})
    
    await tasksRepository.create(task)

    await sut.execute({
      taskId: task.id,
      updatedBy: '1'
    })

    expect(eventsClientMock.emit).toHaveBeenCalledWith(
      'task.updated',
      expect.objectContaining({
        taskId: expect.any(String),
        updatedBy: '1',
      }),
    )
  })
})