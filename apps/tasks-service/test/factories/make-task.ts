import { TaskEntity } from '@/db/entities/task.entity'
import { faker } from '@faker-js/faker'

interface MakeTaskProps {
  title?: string
  description?: string
  dueDate?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
}

export async function makeTask({
  title,
  description,
  dueDate,
  priority,
  status
}: MakeTaskProps = {}) {
  const task = new TaskEntity()

  task.title = title ?? faker.lorem.sentence()
  task.description = description ?? faker.lorem.sentence()
  task.dueDate = dueDate ? new Date(dueDate) : new Date()
  task.priority = priority ?? 'LOW'
  task.status = status ?? 'TODO'

  return task
}

