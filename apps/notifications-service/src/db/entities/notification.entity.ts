import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  userId: string

  @Column()
  type: string

  @Column('jsonb')
  payload: Record<string, any>

  @Column({ default: false })
  read: boolean

  @CreateDateColumn()
  createdAt: Date
}
