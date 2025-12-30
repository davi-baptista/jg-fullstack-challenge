import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm'
import { TaskEntity } from './task.entity'

@Entity('task_audit_logs')
export class TaskAuditLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid', { name: 'task_id' })
  taskId: string

  @Column({ type: 'varchar', length: 50 })
  action: string

  @Column('uuid', { name: 'performed_by', nullable: true })
  performedBy?: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToOne(() => TaskEntity, task => task.auditLogs, {
    onDelete: 'CASCADE',
  })
  task: TaskEntity
}
