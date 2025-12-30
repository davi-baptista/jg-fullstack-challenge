import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { RegisterUseCase } from './register.use-case'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()

    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register a user', async () => {
    await sut.execute({
      username: 'John Doe',
      email: 'john_doe@gmail.com',
      password: '123456',
    })

    expect(usersRepository.items).toEqual([expect.objectContaining({
      username: 'John Doe',
      email: 'john_doe@gmail.com',
    })])
  })

  it('should hash user password upon registration', async () => {
    await sut.execute({
      username: 'Example Name',
      email: 'example@example',
      password: '123456',
    })

    const user = usersRepository.items[0]
    
    const isPasswordCorrect = await compare('123456', user.passwordHash)

    expect(isPasswordCorrect).toBe(true)
  })
})