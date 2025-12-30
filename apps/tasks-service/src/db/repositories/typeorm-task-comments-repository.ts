import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { TaskCommentEntity } from '@/db/entities/task-comment.entity'
import { TaskCommentsRepository } from '@/repositories/task-comments-repository'

@Injectable()
export class TypeOrmTaskCommentsRepository implements TaskCommentsRepository {
  constructor(
    @InjectRepository(TaskCommentEntity)
    private readonly repository: Repository<TaskCommentEntity>,
  ) {}

  async add(comment: TaskCommentEntity) {
    await this.repository.save(comment)
  }

  async deleteByTaskId(taskId: string) {
    await this.repository.delete({ taskId })
  }

  async findByTaskId(taskId: string) {
    return this.repository.find({
      where: { taskId },
      order: { createdAt: 'ASC' },
    })
  }

  async findManyByTaskId(params: {
    taskId: string
    page: number
    size: number
  }) {
    const { taskId, page, size } = params

    const [items, total] = await this.repository.findAndCount({
      where: { taskId },
      take: size,
      skip: (page - 1) * size,
      order: { createdAt: 'DESC' },
    })

    return { items, total }
  }
}
