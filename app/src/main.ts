import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingService } from './logging/logging.service';
import { json } from 'express';
import { ConfigService } from '@nestjs/config';
import cors = require('cors');
import { UserService } from './user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  const logger = app.get(LoggingService);
  // todo: read log levels from config
  // logger.setLogLevels()

  app.useLogger(logger);

  // const corsOptions = {
  //   origin: `*`,
  //   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  // };

  // app.use(cors(corsOptions));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      always: true,
    }),
  );

  // create demo user
  const demoUser = {
    email: 'demo@example.com',
    password: 'secret',
    firstName: 'Demo',
    imageUrl: null,
    lastName: 'User',
  };

  const demoUserAdded = !!(await app
    .get(UserService)
    .getByEmail('demo@example.com'));
  if (!demoUserAdded) {
    logger.log('creating demo user...');
    await app.get(UserService).create(demoUser);
  }

  app.use(
    json({ limit: configService.get<string>('MAX_REQUEST_SIZE') ?? '10mb' }),
  );

  await app.listen(configService.getOrThrow<string>('BACKEND_PORT'));
}
bootstrap();
