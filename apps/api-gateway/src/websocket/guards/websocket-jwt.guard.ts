import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Socket } from 'socket.io'

@Injectable()
export class WebSocketJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Socket>()

    const token = client.handshake.auth?.token
    if (!token) {
      throw new UnauthorizedException('Missing token')
    }

    try {
      const payload = this.jwtService.verify(token)
      client.data.userId = payload.sub
      return true
    } catch {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
