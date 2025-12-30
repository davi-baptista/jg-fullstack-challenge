// src/users/repositories/typeorm-users.repository.ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { UserEntity } from '@/db/entities/user.entity'
import { UsersRepository } from '../../repositories/users-repository'

@Injectable()
export class TypeOrmUsersRepository implements UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}
  async findManyByIds(ids: string[]) {
    if (!ids.length) return []

    return this.repository.find({
      where: {
        id: In(ids),
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    })
  }

  async findByEmail(email: string) {
    return this.repository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        passwordHash: true,
        isActive: true,
      },
    })
  }

  async create(user: UserEntity) {
    await this.repository.save(user)
  }
}
