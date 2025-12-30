import { Injectable } from '@nestjs/common'
import { Server } from 'socket.io'
import { SocketUserStore } from '../stores/socket-user.store'

@Injectable()
export class WebsocketEmitterService {
  constructor(private store: SocketUserStore) {}

  emitToUser(
    server: Server,
    userId: string,
    event: string,
    payload: any,
  ) {
    const sockets = this.store.getSockets(userId)

    sockets.forEach(socketId => {
      server.to(socketId).emit(event, payload)
    })
  }
}
