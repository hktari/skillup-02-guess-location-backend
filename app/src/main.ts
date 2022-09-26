import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import "reflect-metadata";
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingService } from './logging/logging.service';
import { json } from 'express';
import { ConfigService } from '@nestjs/config';
import cors = require('cors')

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });


  const configService = app.get(ConfigService)

  const logger = app.get(LoggingService)
  // todo: read log levels from config
  // logger.setLogLevels()

  app.useLogger(logger)

  var corsOptions = {
    origin: `*`,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

  app.use(cors(corsOptions))

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
