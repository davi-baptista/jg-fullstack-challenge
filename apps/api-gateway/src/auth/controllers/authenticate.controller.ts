import {
  Body,
  Controller,
  Inject,
  Post,
  Res,
} from '@nestjs/common'
import { AuthenticateDto } from '../dto/authenticate.dto'
import { Public } from '../decorators/public.decorator'
import { ClientProxy } from '@nestjs/microservices'
import type { AuthenticatePayload } from '@jg/types/http/auth'
import { lastValueFrom } from 'rxjs'
import { AuthService } from '../auth.service'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import type { Response } from 'express'

@ApiTags('Auth')
@Public()
@Controller('/auth')
export class AuthenticateController {
  constructor(
    @Inject('AUTH_SERVICE') 
    private readonly authClient: ClientProxy, 
    private readonly authService: AuthService
  ) {}
  
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiBody({
    schema: {
      example: {
        email: 'john_doe@gmail',
        password: '123456'
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'User authenticated successfully',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.fake.access',
      }
    }
  })
  @Post('/login')
  async handle(
    @Body() body: AuthenticateDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const payload: AuthenticatePayload = body

    const result = await lastValueFrom(
      this.authClient.send('auth.authenticate', payload)
    )

    const { access_token, refresh_token } = this.authService.generateTokens(result.userId)

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    })

    return { 
      accessToken: access_token, 
    }
  }
}