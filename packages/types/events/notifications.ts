export interface NotificationCreatedEvent {
  id: string
  userId: string
  type: string
  payload: Record<string, any>
  createdAt: Date
}