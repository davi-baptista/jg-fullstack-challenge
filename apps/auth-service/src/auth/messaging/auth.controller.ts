import { MessagePattern } from "@nestjs/microservices"
import { AuthenticateUseCase } from "../use-cases/authenticate.use-case"
import { RegisterUseCase } from "../use-cases/register.use-case"
import type { AuthenticatePayload, RegisterPayLoad } from '@jg/types/http/auth'
import { Controller } from "@nestjs/common"

@Controller()
export class AuthMessagesController {
  constructor(
    private authenticateUseCase: AuthenticateUseCase,
    private registerUseCase: RegisterUseCase,
  ) {}

  @MessagePattern('auth.register')
  register(data: RegisterPayLoad) {
    return this.registerUseCase.execute(data)
  }

  @MessagePattern('auth.authenticate')
  authenticate(data: AuthenticatePayload) {
    return this.authenticateUseCase.execute(data)
  }
}
