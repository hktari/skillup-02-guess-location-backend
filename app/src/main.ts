import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import "reflect-metadata";
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingService } from './logging/logging.service';
import { json } from 'express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });


  const configService = app.get(ConfigService)

  const logger = app.get(LoggingService)
  // todo: read log levels from config
  // logger.setLogLevels()

  app.useLogger(logger)
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      always: true,
    }),
  );


  app.use(json({ limit: '5mb' }));

  await app.listen(configService.getOrThrow<string>('BACKEND_PORT'));
}
bootstrap();
