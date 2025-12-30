import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { makeUser } from '@test/factories/make-user'
import { AuthenticateUseCase } from './authenticate.use-case'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()

    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate a user with valid credentials', async () => {
    const user = await makeUser({ email: 'john_doe@gmail.com', password: '123456' })
    await usersRepository.create(user)

    const result = await sut.execute({
      email: 'john_doe@gmail.com',
      password: '123456',
    })

    expect(result).toEqual({
      userId: user.id
    })
  })

  it('should not be able to authenticate a user with wrong credentials', async () => {
    const user = await makeUser({ email: 'john_doe@gmail.com', password: '123456' })
    
    await usersRepository.create(user)
    
    await expect(
      sut.execute({
        email: 'john_doe@gmail.com',
        password: '654321'
      }),
    ).rejects.toThrow(InvalidCredentialsError)
  })
})