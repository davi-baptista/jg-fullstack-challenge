import { Injectable } from '@nestjs/common'

@Injectable()
export class SocketUserStore {
  private readonly users = new Map<string, Set<string>>()

  add(userId: string, socketId: string) {
    if (!this.users.has(userId)) {
      this.users.set(userId, new Set())
    }
    this.users.get(userId)!.add(socketId)
  }

  remove(userId: string, socketId: string) {
    const sockets = this.users.get(userId)
    if (!sockets) return

    sockets.delete(socketId)
    if (sockets.size === 0) {
      this.users.delete(userId)
    }
  }

  getSockets(userId: string): Set<string> {
    return this.users.get(userId) ?? new Set()
  }
}
