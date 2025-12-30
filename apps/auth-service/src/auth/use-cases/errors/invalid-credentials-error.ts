import { RpcException } from '@nestjs/microservices'

export class InvalidCredentialsError extends RpcException {
  constructor() {
    super({
      statusCode: 401,
      message: 'Credentials are not valid',
    })
  }
}
