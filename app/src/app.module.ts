import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { UserModule } from './user/user.module';
import { LocationModule } from './location/location.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingModule } from './logging/logging.module';
import { AwsModule } from './aws/aws.module';

@Global()
@Module({
  imports: [AwsModule, LoggingModule, UserModule, LocationModule, DatabaseModule,
     ConfigModule.forRoot({ envFilePath:'./.env', isGlobal: true, }), AuthModule, LoggingModule, AwsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware)
      .forRoutes('*')
  }
}
