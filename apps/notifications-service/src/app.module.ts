import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [EnvModule, DbModule, NotificationsModule],
})
export class AppModule {}
