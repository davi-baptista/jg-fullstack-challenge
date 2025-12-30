import { Controller, Get, Inject, Query } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { PaginationDto } from '../dto/pagination.dto'
import type { ListTasksPayload } from '@jg/types/http/tasks'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class ListTasksController {
  constructor(
    @Inject('TASKS_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'List tasks' })
  @ApiResponse({
    status: 200,
    description: 'Tasks listed successfully',
    schema: {
      example: {
        total: 1,
        tasks: []
      }
    }
  })
  @Get()
  async handle(@Query() query: PaginationDto) {
    const payload: ListTasksPayload = {
      page: query.page,
      size: query.size,
    }

    return this.client.send('tasks.list', payload)
  }
}
