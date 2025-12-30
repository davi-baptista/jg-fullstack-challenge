import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { TaskAssigneeEntity } from './task-assignee.entity'
import { TaskCommentEntity } from './task-comment.entity'
import { TaskAuditLogEntity } from './task-audit-log.entity'

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 50})
  title: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'timestamptz', nullable: true, name: 'due_date' })
  dueDate?: Date

  @Column({ type: 'varchar', length: 20 })
  priority: string

  @Column({ type: 'varchar', length: 20} )
  status: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => TaskAssigneeEntity, assignee => assignee.task)
  assignees: TaskAssigneeEntity[]

  @OneToMany(() => TaskCommentEntity, comment => comment.task)
  comments: TaskCommentEntity[]

  @OneToMany(() => TaskAuditLogEntity, log => log.task)
  auditLogs: TaskAuditLogEntity[]
}
