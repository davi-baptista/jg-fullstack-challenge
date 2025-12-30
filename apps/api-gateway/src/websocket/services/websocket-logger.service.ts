import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class WebsocketLoggerService {
  private readonly logger = new Logger('WebsocketGateway')
  
  connected(socketId: string) {
    this.logger.log(`Client connected: ${socketId}`)
  }

  disconnected(socketId: string) {
    this.logger.log(`Client disconnected: ${socketId}`)
  }
}
