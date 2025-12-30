import { Module } from '@nestjs/common'
import { NotificationsGateway } from './gateways/notifications.gateway'
import { WebsocketLoggerService } from './services/websocket-logger.service'
import { WebSocketJwtGuard } from './guards/websocket-jwt.guard'
import { JwtModule } from '@nestjs/jwt'
import { WebsocketConnectionService } from './services/websocket-connection.service'
import { SocketUserStore } from './stores/socket-user.store'
import { WebsocketEmitterService } from './services/websocket-emitter.service'
import { NotificationCreatedController } from './controller/notification-created.controller'

@Module({
  providers: [
    NotificationsGateway, 
    WebsocketLoggerService, 
    WebsocketConnectionService,
    WebsocketEmitterService,
    SocketUserStore,
    WebSocketJwtGuard
  ],
  controllers: [NotificationCreatedController],
})
export class WebsocketModule {}