import { Controller, Get, Inject, Param, Query } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import type { ListCommentsPayload } from '@jg/types/http/tasks'
import { PaginationDto } from '../dto/pagination.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { lastValueFrom } from 'rxjs'

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class ListCommentsController {
  constructor(
    @Inject('TASKS_SERVICE')
    private readonly client: ClientProxy,

    @Inject('AUTH_SERVICE') 
    private readonly authClient: ClientProxy, 
  ) {}

  @ApiOperation({ summary: 'List comments' })
  @ApiResponse({
    status: 200,
    description: 'Comments listed successfully',
    schema: {
      example: {
        total: 1,
        comments: [],
      }
    }
  })
  @Get(':id/comments')
  async handle(
    @Param('id') taskId: string,
    @Query() query: PaginationDto,
  ) {
    const payload: ListCommentsPayload = {
      taskId,
      page: query.page,
      size: query.size,
    }

    const taskComments = await lastValueFrom(this.client.send('tasks.comment.list', payload))
    
    const authorIds = taskComments.comments.map(comment => comment.authorId)

    const { users } = await lastValueFrom(this.authClient.send('users.list', { userIds: authorIds }))

    const userMap = Object.fromEntries(users.map(user => [user.id, user]))

    return {
      total: taskComments.total,
      comments: taskComments.comments.map(comment => ({
        ...comment,
        name: userMap[comment.authorId].username,
        email: userMap[comment.authorId].email
      }))
    }
  }
}
