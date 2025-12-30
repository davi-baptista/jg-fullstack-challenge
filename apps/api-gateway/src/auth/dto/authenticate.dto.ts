import { IsEmail, MinLength } from 'class-validator'

export class AuthenticateDto {
  @IsEmail()
  email: string

  @MinLength(6)
  password: string
}