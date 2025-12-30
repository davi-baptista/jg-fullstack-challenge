import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { TasksRepository } from '@/repositories/tasks-repository'
import { TaskEntity } from '@/db/entities/task.entity'

@Injectable()
export class TypeOrmTasksRepository implements TasksRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly repository: Repository<TaskEntity>,
  ) {}
  
  async create(task: TaskEntity) {
    return this.repository.save(task)
  }
  
  async findById(id: string) {
    return this.repository.findOne({
      where: { id },
      relations: ['assignees'],
    })
  }
  
  async delete(taskId: string) {
    await this.repository.delete(taskId)
  }

  async save(task: TaskEntity) {
    await this.repository.save(task)
  }

  async findMany(params: { page: number; size: number }) {
    const { page, size } = params
    const [tasks, total] = await this.repository.findAndCount({
      take: size,
      skip: (page - 1) * size,
      relations: ['assignees'],
      order: { createdAt: 'DESC' },
    })
    return { items: tasks, total }
  }
}
