import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common'
import { Public } from '../decorators/public.decorator'
import { ClientProxy } from '@nestjs/microservices'
import { RegisterDto } from '../dto/register.dto'
import type { RegisterPayLoad } from '@jg/types/http/auth'
import { lastValueFrom } from 'rxjs'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Auth')
@Public()
@Controller('/auth')
export class RegisterController {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}
    
  @ApiOperation({ summary: 'Register user' })
  @ApiBody({
    schema: {
      example: {
        username: 'John Doe',
        email: 'john_doe@gmail.com',
        password: '123456'
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User created', 
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000'
      }
    } 
  })
  @Post('/register')
  async handle(@Body() body: RegisterDto) {
    const payload: RegisterPayLoad = body

    const result = await lastValueFrom(
      this.authClient.send('auth.register', payload)
    )

    const { userId } = result

    return { 
      id: userId
    }
  }
}