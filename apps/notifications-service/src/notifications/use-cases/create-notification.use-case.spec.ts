import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository'
import { CreateNotificationUseCase } from './create-notification.use-case'

describe('CreateNotificationUseCase', () => {
  let notificationsRepository: InMemoryNotificationsRepository
  let sut: CreateNotificationUseCase

  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new CreateNotificationUseCase(notificationsRepository)
  })

  it('should create a notification', async () => {
    await sut.execute({
      userId: 'user-1',
      type: 'TASK_CREATED',
      payload: {
        taskId: 'task-1',
      },
    })

    expect(notificationsRepository.items).toHaveLength(1)
    expect(notificationsRepository.items[0]).toBe(expect.objectContaining({
      userId: 'user-1',
      type: 'TASK_CREATED',
      payload: {
        taskId: 'task-1',
      },
    }))
  })
})
