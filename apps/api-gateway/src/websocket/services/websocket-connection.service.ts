import { Injectable } from '@nestjs/common'
import { Socket } from 'socket.io'
import { SocketUserStore } from '../stores/socket-user.store'

@Injectable()
export class WebsocketConnectionService {
  constructor(private store: SocketUserStore) {}

  register(client: Socket) {
    const userId = client.data.userId
    this.store.add(userId, client.id)
  }

  unregister(client: Socket) {
    const userId = client.data.userId
    if (!userId) return
    this.store.remove(userId, client.id)
  }
}
