import { NotificationEntity } from "src/db/entities/notification.entity";

export abstract class NotificationsRepository {
  abstract add(notification: NotificationEntity): Promise<void>
}
