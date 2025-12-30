import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { TasksModule } from './tasks/tasks.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [EnvModule, DbModule, TasksModule],
})
export class AppModule {}
