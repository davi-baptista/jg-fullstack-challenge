import { Body, Controller, Inject, Param, Put } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { UpdateTaskDto } from '../dto/update-task.dto'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import type { JwtPayload } from '@/auth/strategies/jwt.strategy'
import type { UpdateTaskPayload } from '@jg/types/http/tasks'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class UpdateTaskController {
  constructor(
    @Inject('TASKS_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    schema: {
      example: {
        task: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Example title',
          description: 'Example description',
          dueDate: '2023-01-01T00:00:00.000Z',
          priority: 'LOW',
          status: 'TODO',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          assignees: ['510e8400-e29b-41d4-a716-446655440000'],
        }
      }
    }
  })
  @Put(':id')
  async handle(
    @Param('id') taskId: string,
    @Body() body: UpdateTaskDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const payload: UpdateTaskPayload = {
      taskId,
      ...body,
      updatedBy: user.sub,
    }

    return this.client.send('tasks.update', payload)
  }
}
