import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({ example: 'Comment content' })
  content: string
}
