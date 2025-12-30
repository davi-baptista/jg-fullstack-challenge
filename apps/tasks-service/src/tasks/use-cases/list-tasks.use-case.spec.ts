import { InMemoryTaskAssigneesRepository } from '@test/repositories/in-memory-task-assignees-repository'
import { InMemoryTasksRepository } from '@test/repositories/in-memory-tasks-repository'
import { makeTask } from '@test/factories/make-task'
import { makeAssignee } from '@test/factories/make-assignee'
import { ListTasksUseCase } from './list-tasks.use-case'

let tasksRepository: InMemoryTasksRepository
let taskAssigneesRepository: InMemoryTaskAssigneesRepository
let sut: ListTasksUseCase

describe('List Tasks Use Case', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    taskAssigneesRepository = new InMemoryTaskAssigneesRepository()
    
    sut = new ListTasksUseCase(tasksRepository, taskAssigneesRepository)
  },)

  it('should be able to list tasks', async () => {
    const createdTask1 = await makeTask({ title: 'Task 1'})
    const createdTask2 = await makeTask({ title: 'Task 2'})

    await tasksRepository.create(createdTask1)
    await tasksRepository.create(createdTask2)

    await taskAssigneesRepository.add(await makeAssignee({ taskId: createdTask1.id, userId: '1' }))
    await taskAssigneesRepository.add(await makeAssignee({ taskId: createdTask2.id, userId: '2' }))

    const response = await sut.execute({
      page: 1,
      size: 20
    })

    expect(response).toEqual({
      total: 2,
      tasks: [
        {
          id: createdTask1.id,
          title: createdTask1.title,
          description: createdTask1.description,
          dueDate: createdTask1.dueDate,
          priority: createdTask1.priority,
          status: createdTask1.status,
          createdAt: createdTask1.createdAt,
          updatedAt: createdTask1.updatedAt,
          assignees: ['1'],
        },
        {
          id: createdTask2.id,
          title: createdTask2.title,
          description: createdTask2.description,
          dueDate: createdTask2.dueDate,
          priority: createdTask2.priority,
          status: createdTask2.status,
          createdAt: createdTask2.createdAt,
          updatedAt: createdTask2.updatedAt,
          assignees: ['2'],
        },
      ],
    })
  })

  it('should be able to list tasks with pagination', async () => {
    for (let i = 1; i <= 12; i++) {
      await tasksRepository.create(await makeTask({ title: `Task ${i}`}))
    }

    const response = await sut.execute({
      page: 2,
      size: 10,
    })

    expect(response.total).toBe(12)
    expect(response.tasks).toHaveLength(2)
    expect(response.tasks[0].title).toBe('Task 11')
  })
})