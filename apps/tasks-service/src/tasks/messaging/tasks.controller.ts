import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import type {
  CreateTaskPayload,
  UpdateTaskPayload,
  GetTaskPayload,
  ListTasksPayload,
  CreateCommentPayload,
  ListCommentsPayload,
  DeleteTaskPayload,
} from '@jg/types/http/tasks'

import { CreateTaskUseCase } from '../use-cases/create-task.use-case'
import { UpdateTaskUseCase } from '../use-cases/update-task.use-case'
import { GetTaskUseCase } from '../use-cases/get-task.use-case'
import { ListTasksUseCase } from '../use-cases/list-tasks.use-case'
import { CreateCommentUseCase } from '../use-cases/create-comment.use-case'
import { ListCommentsUseCase } from '../use-cases/list-comments.use-case'
import { DeleteTaskUseCase } from '../use-cases/delete-task.use-case'

@Controller()
export class TasksMessagesController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly getTaskUseCase: GetTaskUseCase,
    private readonly listTasksUseCase: ListTasksUseCase,
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly listCommentsUseCase: ListCommentsUseCase,
  ) {}

  // ---------- TASKS ----------

  @MessagePattern('tasks.create')
  create(payload: CreateTaskPayload) {
    return this.createTaskUseCase.execute(payload)
  }

  @MessagePattern('tasks.update')
  update(payload: UpdateTaskPayload) {
    return this.updateTaskUseCase.execute(payload)
  }
  
  @MessagePattern('tasks.delete')
  delete(payload: DeleteTaskPayload) {
    return this.deleteTaskUseCase.execute(payload)
  }

  @MessagePattern('tasks.get')
  get(payload: GetTaskPayload) {
    return this.getTaskUseCase.execute(payload)
  }

  @MessagePattern('tasks.list')
  list(payload: ListTasksPayload) {
    return this.listTasksUseCase.execute(payload)
  }

  // ---------- COMMENTS ----------

  @MessagePattern('tasks.comment.create')
  createComment(payload: CreateCommentPayload) {
    return this.createCommentUseCase.execute(payload)
  }

  @MessagePattern('tasks.comment.list')
  listComments(payload: ListCommentsPayload) {
    return this.listCommentsUseCase.execute(payload)
  }
}
