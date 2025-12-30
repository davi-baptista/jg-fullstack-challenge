import { TaskCommentEntity } from '@/db/entities/task-comment.entity'
import { faker } from '@faker-js/faker'

interface MakeCommentProps {
  taskId: string
  authorId: string
  content?: string
}


export async function makeComment({
  taskId,
  authorId,
  content
}: MakeCommentProps) {
  const comment = new TaskCommentEntity()
  
  comment.taskId = taskId
  comment.authorId = authorId
  comment.content = content || faker.lorem.sentence()
  
  return comment
}

