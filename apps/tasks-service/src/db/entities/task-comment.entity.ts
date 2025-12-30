import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm'
import { TaskEntity } from './task.entity'

@Entity('task_comments')
export class TaskCommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid', { name: 'task_id' })
  taskId: string

  @Column('uuid', { name: 'author_id' })
  authorId: string

  @Column('text')
  content: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToOne(() => TaskEntity, task => task.comments, {
    onDelete: 'CASCADE',
  })
  task: TaskEntity
}
