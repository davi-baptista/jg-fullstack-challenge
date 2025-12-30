import { Injectable } from '@nestjs/common'
import { UserEntity } from 'src/db/entities/user.entity'
import { hash } from 'bcryptjs'
import { UsersRepository } from 'src/repositories/users-repository'
import type { RegisterPayLoad } from '@jg/types/http/auth'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

@Injectable()
export class RegisterUseCase {
    constructor(
        private usersRepository: UsersRepository
    ) {}
    async execute({ username, email, password}: RegisterPayLoad) {
        const userWithSameEmail = await this.usersRepository.findByEmail(email)

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError()
        }

        const hashedPassword = await hash(password, 8)
        
        const user = new UserEntity()
        user.username = username
        user.email = email
        user.passwordHash = hashedPassword

        await this.usersRepository.create(user)

        return { userId: user.id }
    }
}