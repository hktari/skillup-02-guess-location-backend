import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { UserModule } from './user/user.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [UserModule, LocationModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {
  
}
