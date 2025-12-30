import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { RegisterUseCase } from './use-cases/register.use-case';
import { UsersRepository } from '@/repositories/users-repository';
import { TypeOrmUsersRepository } from '@/db/repositories/typeorm.repository';
import { AuthenticateUseCase } from './use-cases/authenticate.use-case';
import { AuthMessagesController } from './messaging/auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [
    AuthMessagesController
  ],
  providers: [
    RegisterUseCase,
    AuthenticateUseCase,
    {
      provide: UsersRepository,
      useClass: TypeOrmUsersRepository,
    },
  ],
})
export class AuthModule {}
