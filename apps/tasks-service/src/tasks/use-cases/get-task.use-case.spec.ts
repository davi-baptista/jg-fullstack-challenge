import { InMemoryTaskAssigneesRepository } from '@test/repositories/in-memory-task-assignees-repository'
import { InMemoryTasksRepository } from '@test/repositories/in-memory-tasks-repository'
import { makeTask } from '@test/factories/make-task'
import { InMemoryTaskCommentsRepository } from '@test/repositories/in-memory-task-comments-repository'
import { makeAssignee } from '@test/factories/make-assignee'
import { GetTaskUseCase } from './get-task.use-case'
import { makeComment } from '@test/factories/make-comment'
import { TaskNotFoundError } from './errors/task-not-found-error'

let tasksRepository: InMemoryTasksRepository
let taskAssigneesRepository: InMemoryTaskAssigneesRepository
let taskCommentsRepository: InMemoryTaskCommentsRepository
let sut: GetTaskUseCase

describe('Update Task Use Case', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    taskAssigneesRepository = new InMemoryTaskAssigneesRepository()
    taskCommentsRepository = new InMemoryTaskCommentsRepository()
    
    sut = new GetTaskUseCase(tasksRepository, taskAssigneesRepository, taskCommentsRepository)
  },)

  it('should be able to update a task', async () => {
    const createdTask = await makeTask({ title: 'Example title'})

    await tasksRepository.create(createdTask)

    const createdAssignee = await makeAssignee({ taskId: createdTask.id, userId: '1' })

    await taskAssigneesRepository.add(createdAssignee)

    const createdComment = await makeComment({ taskId: createdTask.id, authorId: '1' })

    await taskCommentsRepository.add(createdComment)

    const response = await sut.execute({
      taskId: createdTask.id,
    })

    expect(response).toEqual({
      id: createdTask.id,
      title: createdTask.title,
      description: createdTask.description,
      dueDate: createdTask.dueDate,
      priority: createdTask.priority,
      status: createdTask.status,
      createdAt: createdTask.createdAt,
      updatedAt: createdTask.updatedAt,
      assignees: [createdAssignee.userId],
      comments: [{
        id: createdComment.id,
        content: createdComment.content,
        authorId: createdComment.authorId,
        createdAt: createdComment.createdAt,
      }]
    })
  })

  it('should be not able to get a task that does not exist', async () => {
    await expect(
      sut.execute({
        taskId: '1',
      }),
    ).rejects.toThrow(TaskNotFoundError)
  })
})