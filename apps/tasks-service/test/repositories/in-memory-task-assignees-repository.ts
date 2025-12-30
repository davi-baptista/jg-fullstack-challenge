import { TaskAssigneeEntity } from "@/db/entities/task-assignee.entity";
import { TaskAssigneesRepository } from "@/repositories/task-assignees-repository";

export class InMemoryTaskAssigneesRepository implements TaskAssigneesRepository {
  public items: TaskAssigneeEntity[] = []

  async add(assignee: TaskAssigneeEntity): Promise<void> {
    this.items.push(assignee)
  }

  async deleteByTaskId(taskId: string) {
    this.items = this.items.filter(item => item.taskId !== taskId)
  }

  async findByTaskId(taskId: string): Promise<TaskAssigneeEntity[]> {
    return this.items.filter(item => item.taskId === taskId)
  }

  async findByTaskIds(taskIds: string[]): Promise<TaskAssigneeEntity[]> {
    if (taskIds.length === 0) return []
    return this.items.filter(item => taskIds.includes(item.taskId))
  }
}