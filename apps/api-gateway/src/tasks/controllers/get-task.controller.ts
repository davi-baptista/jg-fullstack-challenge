import { Controller, Get, Inject, Param } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import type { GetTaskPayload } from '@jg/types/http/tasks'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { lastValueFrom } from 'rxjs'

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class GetTaskController {
  constructor(
    @Inject('TASKS_SERVICE')
    private readonly taskClient: ClientProxy,

    @Inject('AUTH_SERVICE') 
    private readonly authClient: ClientProxy, 
  ) {}

  @ApiOperation({ summary: 'Get task' })
  @ApiBody({
    schema: {
      example: {
        taskId: '550e8400-e29b-41d4-a716-446655440000s',
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    schema: {
      example: {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Task 1",
        "description": "Task 1 description",
        "dueDate": "2022-01-01T00:00:00.000Z",
        "priority": "HIGH",
        "status": "TODO",
        "createdAt": "2022-01-01T00:00:00.000Z",
        "updatedAt": "2022-01-01T00:00:00.000Z",
        "assignees": [
          {
            "name": "John Doe",
            "email": "johndoe@example.com",
            "userId": "550e8400-e29b-41d4-a716-446655440000"
          },
        ],
        "comments": []
      }
    }
  })
  @Get(':id')
  async handle(@Param('id') taskId: string) {
    const payload: GetTaskPayload = { taskId }
    
    const task = await lastValueFrom(this.taskClient.send('tasks.get', payload))

    const { users } = await lastValueFrom(this.authClient.send('users.list', { userIds: task.assignees }))

    return {
      ...task,
      assignees: users.map(user => ({
        name: user.username,
        email: user.email,
        userId: user.id
      }))
    }
  }
}
