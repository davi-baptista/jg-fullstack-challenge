import { RpcException } from '@nestjs/microservices'

export class TaskNotFoundError extends RpcException {
  constructor() {
    super({
      statusCode: 404,
      message: 'Task not found',
    })
  }
}