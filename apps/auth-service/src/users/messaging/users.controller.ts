import { MessagePattern } from "@nestjs/microservices"
import type { ListUsersPayload } from '@jg/types/http/users'
import { Controller } from "@nestjs/common"
import { ListUsersUseCase } from "../use-cases/list-users.use-case"

@Controller()
export class UsersMessagesController {
  constructor(
    private listUsersUseCase: ListUsersUseCase,
  ) {}

  @MessagePattern('users.list')
  listByIds(data: ListUsersPayload) {
    return this.listUsersUseCase.execute(data)
  }
}
