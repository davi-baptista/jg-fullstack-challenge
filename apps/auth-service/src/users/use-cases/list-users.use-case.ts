import { Injectable } from '@nestjs/common'
import { UsersRepository } from 'src/repositories/users-repository'
import type { ListUsersPayload } from '@jg/types/http/users'

@Injectable()
export class ListUsersUseCase {
	constructor(
		private readonly usersRepository: UsersRepository
	) {}
	async execute({ userIds }: ListUsersPayload) {
		const users = await this.usersRepository.findManyByIds(userIds)

		return { users }
	}
}