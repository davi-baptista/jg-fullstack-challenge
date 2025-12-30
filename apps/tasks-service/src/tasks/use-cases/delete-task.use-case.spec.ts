import { InMemoryTaskAssigneesRepository } from '@test/repositories/in-memory-task-assignees-repository'
import { InMemoryTasksRepository } from '@test/repositories/in-memory-tasks-repository'
import { InMemoryTaskAuditLogsRepository } from '@test/repositories/in-memory-task-audit-logs-repository'
import { makeTask } from '@test/factories/make-task'
import { DeleteTaskUseCase } from './delete-task.use-case'
import { InMemoryTaskCommentsRepository } from '@test/repositories/in-memory-task-comments-repository'

let tasksRepository: InMemoryTasksRepository
let taskAssigneesRepository: InMemoryTaskAssigneesRepository
let taskAuditLogRepository: InMemoryTaskAuditLogsRepository
let taskCommentsRepository: InMemoryTaskCommentsRepository
let eventsClientMock: any
let sut: DeleteTaskUseCase

describe('Delete Task Use Case', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    taskAssigneesRepository = new InMemoryTaskAssigneesRepository()
    taskAuditLogRepository = new InMemoryTaskAuditLogsRepository()
    taskCommentsRepository = new InMemoryTaskCommentsRepository()
    eventsClientMock = { emit: vi.fn() }
    
    sut = new DeleteTaskUseCase(tasksRepository, taskAssigneesRepository, taskAuditLogRepository, taskCommentsRepository, eventsClientMock)
  },)

  it('should be able to delete a task', async () => {
    const task = await makeTask({})
    
    await tasksRepository.create(task)

    await sut.execute({
      taskId: task.id,
      deletedBy: '1'
    })

    expect(tasksRepository.items).toEqual([])
  })

  it('should be able to emit task.deleted event', async () => {
    const task = await makeTask({})
    
    await tasksRepository.create(task)

    await sut.execute({
      taskId: task.id,
      deletedBy: '1'
    })

    expect(eventsClientMock.emit).toHaveBeenCalledWith(
      'task.deleted',
      expect.objectContaining({
        taskId: expect.any(String),
        deletedBy: '1',
      }),
    )
  })
})