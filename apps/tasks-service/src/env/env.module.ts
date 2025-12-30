import { Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (config) => envSchema.parse(config),
      isGlobal: true, // Disponível em todo o módulo
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
