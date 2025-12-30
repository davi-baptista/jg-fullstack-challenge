import {
  Get,
  Controller,
  Req,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Public } from '../decorators/public.decorator'
import { ApiOperation, ApiResponse, ApiTags, ApiCookieAuth } from '@nestjs/swagger'
import type { Request } from 'express'

@ApiTags('Auth')
@Public()
@Controller('auth')
export class RefreshTokenController {
  constructor(private readonly jwtService: JwtService) {}

  @ApiOperation({ summary: 'Refresh token' })
  @ApiCookieAuth('refreshToken')
  @ApiResponse({
    status: 200,
    description: 'Refresh token',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.fake.access',
      }
    }
  })
  @Get('refresh')
  async handle(@Req() req: Request) {
    const refreshToken = req.cookies?.refreshToken
    
    if (!refreshToken) {
      throw new UnauthorizedException()
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken)

      const accessToken = await this.jwtService.signAsync({
        sub: payload.sub,
      })

      return {
        access_token: accessToken,
      }
    } catch {
      throw new UnauthorizedException()
    }
  }
}
