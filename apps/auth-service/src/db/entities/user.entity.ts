import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 50 })
    username: string

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string
    
    @Column({ type: 'varchar', length: 255 , name: 'password_hash', select: false })
    passwordHash: string

    @Column({ type: 'boolean', name: 'is_active', default: true })
    isActive: boolean

    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt: Date
}