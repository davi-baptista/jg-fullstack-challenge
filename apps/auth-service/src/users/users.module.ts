import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { UsersRepository } from '@/repositories/users-repository';
import { TypeOrmUsersRepository } from '@/db/repositories/typeorm.repository';
import { UsersMessagesController } from './messaging/users.controller';
import { ListUsersUseCase } from './use-cases/list-users.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [
    UsersMessagesController
  ],
  providers: [
    ListUsersUseCase,
    {
      provide: UsersRepository,
      useClass: TypeOrmUsersRepository,
    },
  ],
})
export class UsersModule {}
