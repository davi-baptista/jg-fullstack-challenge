import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { ListUsersUseCase } from './list-users.use-case'
import { makeUser } from '@test/factories/make-user'

let usersRepository: InMemoryUsersRepository
let sut: ListUsersUseCase

describe('List Users Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new ListUsersUseCase(usersRepository)
  })

  it('should be able to list users by ids', async () => {
    const user1 = await makeUser({ username: 'John Doe', email: 'john@example.com' })
    const user2 = await makeUser({ username: 'Jane Doe', email: 'jane@example.com' })

    await usersRepository.create(user1)
    await usersRepository.create(user2)

    const result = await sut.execute({
      userIds: [user1.id, user2.id],
    })

    expect(result.users).toHaveLength(2)
    expect(result.users[0]).toEqual(
      expect.objectContaining({
        id: user1.id,
        username: 'John Doe',
        email: 'john@example.com',
      }),
    )
  })

  it('should return empty array when userIds is empty', async () => {
    const result = await sut.execute({
      userIds: [],
    })

    expect(result.users).toEqual([])
  })

  it('should return only users that exist', async () => {
    const user = await makeUser({ username: 'John Doe', email: 'john@example.com' })

    await usersRepository.create(user)

    const result = await sut.execute({
      userIds: ['non-existing-id', user.id],
    })

    expect(result.users).toHaveLength(1)
    expect(result.users[0].id).toBe(user.id)
  })
})
