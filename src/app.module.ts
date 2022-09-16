import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { UserModule } from './user/user.module';
import { LocationModule } from './location/location.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { DatabaseModule } from './database/database.module';
import cors = require('cors')
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [UserModule, LocationModule, DatabaseModule, ConfigModule.forRoot({ isGlobal: true, })],
  controllers: [AppController, AuthController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors(), LoggingMiddleware)
      .forRoutes('*')
  }
}
