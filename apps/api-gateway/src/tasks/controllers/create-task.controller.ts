import { Body, Controller, Inject, Post } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

import { CreateTaskDto } from '../dto/create-task.dto'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import type { JwtPayload } from '@/auth/strategies/jwt.strategy'
import type { CreateTaskPayload } from '@jg/types/http/tasks'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class CreateTaskController {
  constructor(
    @Inject('TASKS_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Create task' })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully.',
    schema: {
      example: {
        taskId: '550e8400-e29b-41d4-a716-446655440000',
      }
    }
  })
  @Post()
  async handle(
    @Body() body: CreateTaskDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const payload: CreateTaskPayload = {
      ...body,
      createdBy: user.sub,
    }

    return this.client.send(
      'tasks.create',
      payload,
    )
  }
}
