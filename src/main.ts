import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import "reflect-metadata";
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingService } from './logging/logging.service';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  app.useLogger(app.get(LoggingService))

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      always: true,
    }),
  );


  app.use(json({ limit: '50mb' }));

  await app.listen(3000);
}
bootstrap();
