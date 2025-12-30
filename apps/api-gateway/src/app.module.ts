import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 1,
          limit: 10
        },
      ],
    }),
    EnvModule, 
    AuthModule, 
    TasksModule,
    WebsocketModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
