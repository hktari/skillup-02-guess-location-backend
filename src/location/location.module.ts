import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { GuessLocationController } from './guess-location.controller';
import { DatabaseModule } from '../database/database.module';
import { locationProviders } from './providers/location.providers';
import { UserModule } from '../user/user.module';
import { userProviders } from '../user/providers/user.provider';
import { UserService } from '../user/user.service';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [LocationController, GuessLocationController],
  providers: [LocationService, ...locationProviders, UserService, ...userProviders]
})
export class LocationModule { }
