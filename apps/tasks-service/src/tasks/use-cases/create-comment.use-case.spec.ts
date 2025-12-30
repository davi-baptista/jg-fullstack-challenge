import { InMemoryTaskCommentsRepository } from '@test/repositories/in-memory-task-comments-repository'
import { CreateCommentUseCase } from './create-comment.use-case'
import { makeTask } from '@test/factories/make-task'
import { InMemoryTasksRepository } from '@test/repositories/in-memory-tasks-repository'
import { TaskNotFoundError } from './errors/task-not-found-error'

let tasksRepository: InMemoryTasksRepository
let commentsRepository: InMemoryTaskCommentsRepository
let eventsClientMock: any
let sut: CreateCommentUseCase

describe('Create Comment Use Case', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    commentsRepository = new InMemoryTaskCommentsRepository()
    eventsClientMock = { emit: vi.fn() }

    sut = new CreateCommentUseCase(
      tasksRepository,
      commentsRepository,
      eventsClientMock,
    )
  })

  it('should be able to create a comment', async () => {
    const task = await makeTask()
    await tasksRepository.create(task)

    await sut.execute({
      taskId: task.id,
      content: 'Nice task',
      authorId: '1',
    })

    expect(commentsRepository.items).toHaveLength(1)
    expect(commentsRepository.items[0]).toEqual(
      expect.objectContaining({
        taskId: task.id,
        content: 'Nice task',
        authorId: '1',
      }),
    )
  })

  it('should emit task.comment.created event', async () => {
    const task = await makeTask()
    await tasksRepository.create(task)

    await sut.execute({
      taskId: task.id,
      content: 'Nice task',
      authorId: '1',
    })

    expect(eventsClientMock.emit).toHaveBeenCalledWith(
      'task.comment.created',
      expect.objectContaining({
        taskId: task.id,
        authorId: '1',
        content: 'Nice task',
      }),
    )
  })

  it('should throw if task does not exist', async () => {
    await expect(
      sut.execute({
        taskId: 'non-existent-task',
        content: 'Not nice task',
        authorId: '1',
      }),
    ).rejects.toThrow(TaskNotFoundError)
  })
})
