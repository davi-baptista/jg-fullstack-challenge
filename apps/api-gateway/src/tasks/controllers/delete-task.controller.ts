import { Controller, Delete, HttpCode, Inject, Param } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import type { JwtPayload } from '@/auth/strategies/jwt.strategy'
import type { DeleteTaskPayload } from '@jg/types/http/tasks'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class DeleteTaskController {
  constructor(
    @Inject('TASKS_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Delete task' })
  @ApiBody({
    schema: {
      example: {
        taskId: '550e8400-e29b-41d4-a716-446655440000',
      }
    }
  })
  @ApiResponse({
    status: 204,
    description: 'Task deleted successfully',
  })
  @HttpCode(204)
  @Delete(':id')
  async handle(
    @Param('id') taskId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const payload: DeleteTaskPayload = {
      taskId,
      deletedBy: user.sub,
    }

    return this.client.send('tasks.delete', payload)
  }
}
