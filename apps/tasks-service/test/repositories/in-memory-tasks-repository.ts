import { TaskEntity } from "@/db/entities/task.entity"
import { TasksRepository } from "@/repositories/tasks-repository"
import { randomUUID } from "node:crypto"

export class InMemoryTasksRepository implements TasksRepository {
  public items: TaskEntity[] = []

  async create(task: TaskEntity) {
    task.id = randomUUID()
    this.items.push(task)
    return task
  }

  async findById(id: string){
    const task = this.items.find(item => item.id === id)
    
    if (!task) {
      return null
    }
    
    return {
      ...task,
      assignees: task.assignees || [],
    }
  }

  async delete(taskId: string) {
    const index = this.items.findIndex(item => item.id === taskId)

    if (index !== -1) {
      this.items.splice(index, 1)
    }
  }
  
  async save(task: TaskEntity) {
    const index = this.items.findIndex(item => item.id === task.id)

    if (index !== -1) {
      this.items[index] = task
    }
  }
  
  async findMany({ page, size }: { page: number; size: number; }) {
    const start = (page - 1) * size
    const end = start + size

    const items = this.items.slice(start, end)

    return {
      items,
      total: this.items.length,
    }
  }
}