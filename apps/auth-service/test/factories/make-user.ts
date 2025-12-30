import { UserEntity } from '@/db/entities/user.entity'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'

interface MakeUserProps {
  username?: string
  email?: string
  password?: string
}

export async function makeUser({
  username,
  email,
  password,
}: MakeUserProps = {}) {
  const user = new UserEntity()

  user.username = username ?? faker.person.fullName()
  user.email = email ?? faker.internet.email()
  user.passwordHash = await hash(password ?? faker.internet.password(), 8)

  return user
}
