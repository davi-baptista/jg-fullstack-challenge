import { Injectable } from '@nestjs/common'
import { TasksRepository } from '@/repositories/tasks-repository'
import { TaskAssigneesRepository } from '@/repositories/task-assignees-repository'
import { ListTasksPayload } from '@jg/types/http/tasks'

@Injectable()
export class ListTasksUseCase {
  constructor(
    private tasksRepository: TasksRepository,
    private assigneesRepository: TaskAssigneesRepository,
  ) {}

  async execute({ page = 1, size = 10 }: ListTasksPayload) {
    const { items: tasks, total } = await this.tasksRepository.findMany({
      page,
      size,
    })

    const taskIds = tasks.map(task => task.id)

    const assignees = await this.assigneesRepository.findByTaskIds(taskIds)

    return {
      total,
      tasks: tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        assignees: assignees
          .filter(a => a.taskId === task.id)
          .map(a => a.userId),
      })),
    }
  }
}
