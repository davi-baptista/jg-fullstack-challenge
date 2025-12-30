import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import { ValidationPipe } from '@nestjs/common';
import { RpcExceptionFilter } from './common/filters/rpc-exception.filter';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalFilters(new RpcExceptionFilter())
  const envService = app.get(EnvService)
  
  app.enableCors({
    origin: true,
    credentials: true,
  })
  
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [envService.get('RABBITMQ_URL')],
      queue: envService.get('RABBITMQ_NOTIFICATIONS_QUEUE'),
      queueOptions: { durable: true },
    },
  })

  await app.startAllMicroservices()

  const server = app.getHttpAdapter().getInstance()
  server.set('trust proxy', 1)
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )
  
  app.setGlobalPrefix('api')
  
  app.use(cookieParser())

  const config = new DocumentBuilder()
    .setTitle('Jungle Gaming – Task Manager API')
    .setDescription('API Gateway – Sistema de Gestão de Tarefas Colaborativo')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(envService.get('PORT'));
}
bootstrap();
