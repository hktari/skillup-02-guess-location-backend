import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { GuessLocationController } from './guess-location.controller';
import { DatabaseModule } from 'src/database/database.module';
import { locationProviders } from './providers/location.providers';
import { UserModule } from 'src/user/user.module';
import { userProviders } from 'src/user/providers/user.provider';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [LocationController, GuessLocationController],
  providers: [LocationService, ...locationProviders, UserService, ...userProviders]
})
export class LocationModule { }
