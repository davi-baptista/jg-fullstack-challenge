import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { UseGuards } from '@nestjs/common'
import { WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { WebSocketJwtGuard } from '../guards/websocket-jwt.guard'
import { WebsocketLoggerService } from '../services/websocket-logger.service'
import { WebsocketConnectionService } from '../services/websocket-connection.service'
import { JwtService } from '@nestjs/jwt'

@UseGuards(WebSocketJwtGuard)
@WebSocketGateway({
  namespace: '/notifications',
  cors: { origin: '*' },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server

  constructor(
    private readonly jwtService: JwtService,
    private logger: WebsocketLoggerService,
    private connections: WebsocketConnectionService,
  ) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token

    if (!token) {
      client.disconnect()
      return
    }

    try {
      const payload = this.jwtService.verify(token)

      client.data.userId = payload.sub
      this.connections.register(client)
      this.logger.connected(client.id)
    } catch (err) {
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    this.connections.unregister(client)
    this.logger.disconnected(client.id)
  }
}
