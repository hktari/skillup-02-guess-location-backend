import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import "reflect-metadata";
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppLogger } from './common/services/app-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  app.useLogger(app.get(AppLogger))

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      always: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
