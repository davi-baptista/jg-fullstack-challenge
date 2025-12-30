


import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator'

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

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Task title', required: false })
  title?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Task description', required: false })
  description?: string

  @IsOptional()
  @IsEnum(TaskPriority)
  @ApiProperty({ example: 'LOW', required: false })
  priority?: TaskPriority

  @IsOptional()
  @IsEnum(TaskStatus)
  @ApiProperty({ example: 'TODO', required: false })
  status?: TaskStatus

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2023-01-01', required: false })
  dueDate?: string

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @ApiProperty({ example: ['550e8400-e29b-41d4-a716-446655440000'], required: false })
  assignees?: string[]
}
