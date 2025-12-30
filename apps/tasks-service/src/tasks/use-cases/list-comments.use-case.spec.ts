import { InMemoryTasksRepository } from '@test/repositories/in-memory-tasks-repository'
import { InMemoryTaskCommentsRepository } from '@test/repositories/in-memory-task-comments-repository'
import { ListCommentsUseCase } from './list-comments.use-case'
import { makeTask } from '@test/factories/make-task'
import { makeComment } from '@test/factories/make-comment'
import { TaskNotFoundError } from './errors/task-not-found-error'

let tasksRepository: InMemoryTasksRepository
let commentsRepository: InMemoryTaskCommentsRepository
let sut: ListCommentsUseCase

describe('List Comments Use Case', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    commentsRepository = new InMemoryTaskCommentsRepository()

    sut = new ListCommentsUseCase(tasksRepository, commentsRepository)
  })

  it('should be able to list comments of a task', async () => {
    const task = await makeTask()
    await tasksRepository.create(task)

    await commentsRepository.add(
      await makeComment({
        taskId: task.id,
        authorId: '1',
        content: 'First comment',
      }),
    )

    await commentsRepository.add(
      await makeComment({
        taskId: task.id,
        authorId: '2',
        content: 'Second comment',
      }),
    )

    const response = await sut.execute({
      taskId: task.id,
      page: 1,
      size: 10,
    })

    expect(response.total).toBe(2)
    expect(response.comments).toHaveLength(2)
    expect(response.comments[0]).toEqual(
      expect.objectContaining({
        content: 'First comment',
        authorId: '1',
      }),
    )
  })

  it('should be able to list comments of a task with pagination', async () => {
    const task = await makeTask()
    await tasksRepository.create(task)
    
    for (let i = 1; i <= 12; i++) {
      await commentsRepository.add(
        await makeComment({
          taskId: task.id,
          authorId: '1',
          content: `Comment ${i}`,
        }),
      )
    }

    const response = await sut.execute({
      taskId: task.id,
      page: 2,
      size: 10,
    })

    expect(response.total).toBe(12)
    expect(response.comments).toHaveLength(2)
    expect(response.comments[0]).toEqual(
      expect.objectContaining({
        content: 'Comment 11',
        authorId: '1',
      }),
    )
  })
})
