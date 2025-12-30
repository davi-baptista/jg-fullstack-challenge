import type { UserEntity } from "@/db/entities/user.entity"
import type { UsersRepository } from "@/repositories/users-repository"

export class InMemoryUsersRepository implements UsersRepository {
	public items: UserEntity[] = []
	
	async findByEmail(email: string) {
		return this.items.find(item => item.email === email) ?? null
	}
	async create(user: UserEntity) {
		this.items.push(user)
	}
	
	async findManyByIds(ids: string[]) {
		return this.items.filter(item => ids.includes(item.id))
	}
}