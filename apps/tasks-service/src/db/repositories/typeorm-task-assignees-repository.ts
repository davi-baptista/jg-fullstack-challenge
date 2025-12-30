import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { TaskAssigneeEntity } from '@/db/entities/task-assignee.entity'
import { TaskAssigneesRepository } from '@/repositories/task-assignees-repository'

@Injectable()
export class TypeOrmTaskAssigneesRepository implements TaskAssigneesRepository {
  constructor(
    @InjectRepository(TaskAssigneeEntity)
    private readonly repository: Repository<TaskAssigneeEntity>,
  ) {}

  async add(assignee: TaskAssigneeEntity) {
    await this.repository.save(assignee)
  }

  async deleteByTaskId(taskId: string) {
    await this.repository.delete({ taskId })
  }

  async findByTaskId(taskId: string) {
    return this.repository.find({
      where: { taskId },
    })
  }

  async findByTaskIds(taskIds: string[]) {
    if (taskIds.length === 0) return []

    return this.repository.find({
      where: {
        taskId: In(taskIds),
      },
    })
  }
}
