import { Injectable } from '@nestjs/common'
import { UsersRepository } from 'src/repositories/users-repository'
import { compare } from 'bcryptjs'
import type { AuthenticatePayload } from '@jg/types/http/auth'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

@Injectable()
export class AuthenticateUseCase {
    constructor(
        private readonly usersRepository: UsersRepository
    ) {}
    async execute({ email, password}: AuthenticatePayload) {
        const user = await this.usersRepository.findByEmail(email)

        if (!user) {
            throw new InvalidCredentialsError()
        }

        const isValidPassword = await compare(password, user.passwordHash)

        if (!isValidPassword) {
            throw new InvalidCredentialsError()
        }

        return { userId: user.id }
    }
}