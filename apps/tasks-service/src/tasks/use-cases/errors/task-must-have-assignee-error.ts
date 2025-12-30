import { RpcException } from '@nestjs/microservices'

export class TaskMustHaveAssigneeError extends RpcException {
  constructor() {
    super({
      statusCode: 400,
      message: 'Task must have at least one assignee',
    })
  }
}