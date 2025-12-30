import { Type } from 'class-transformer'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class RegisterDto {
  @IsString()
  username: string

  @IsEmail()
  email: string

  @Type(() => String)
  @IsString()
  @MinLength(6)
  password: string
}