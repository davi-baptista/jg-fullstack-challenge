import { RpcException } from "@nestjs/microservices";

export class UserAlreadyExistsError extends RpcException {
  constructor() {
    super({
      statusCode: 409,
      message: 'User already exists',
    })
  }
}
