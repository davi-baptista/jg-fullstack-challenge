import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { NotificationsGateway } from '../gateways/notifications.gateway'
import { WebsocketEmitterService } from '../services/websocket-emitter.service'

@Controller()
export class NotificationCreatedController {
  constructor(
    private readonly gateway: NotificationsGateway,
    private readonly emitter: WebsocketEmitterService,
  ) {}

  @EventPattern('notification.created')
  handle(
    @Payload() event: {
      id: string
      userId: string
      type: string
      payload: Record<string, any>
      createdAt: string
    },
  ) {
    this.emitter.emitToUser(
      this.gateway.server,
      event.userId,
      'notification',
      event,
    )
  }
}
