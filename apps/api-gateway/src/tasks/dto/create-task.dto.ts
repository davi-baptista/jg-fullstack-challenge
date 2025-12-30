import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator'

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}


export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({ example: 'Task title' })
  title: string

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Task description', required: false })
  description?: string

  @IsArray()
  @IsUUID('4', { each: true })
  @ApiProperty({
    example: ['550e8400-e29b-41d4-a716-446655440000'],
  })
  assignees: string[]

  @IsEnum(TaskPriority)
  @ApiProperty({ example: 'LOW' })
  priority: TaskPriority

  @IsEnum(TaskStatus)
  @ApiProperty({ example: 'TODO' })
  status: TaskStatus

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2023-01-01', required: false })
  dueDate?: string
}
