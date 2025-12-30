import type { UserEntity } from "src/db/entities/user.entity"

export abstract class UsersRepository {
  abstract findByEmail(email: string): Promise<UserEntity | null>
  
  abstract create(user: UserEntity): Promise<void>

  abstract findManyByIds(ids: string[]): Promise<UserEntity[]>
}