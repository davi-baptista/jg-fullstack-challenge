import { Body, Controller, Inject, Param, Post } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { CreateCommentDto } from '../dto/create-comment.dto'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import type { JwtPayload } from '@/auth/strategies/jwt.strategy'
import type { CreateCommentPayload } from '@jg/types/http/tasks'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class CreateCommentController {
  constructor(
    @Inject('TASKS_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Create a comment' })
  @ApiResponse({
    status: 201,
    description: 'The comment created successfully.',
    schema: {
      example: {
        commentId: '557a6d5e-3c2d-4a4d-9a9a-9a9a9a9a9a9a',
      }
    }
  })
  @Post(':id/comments')
  async handle(
    @Param('id') taskId: string,
    @Body() body: CreateCommentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const payload: CreateCommentPayload = {
      taskId,
      content: body.content,
      authorId: user.sub,
    }

    return this.client.send('tasks.comment.create', payload)
  }
}
