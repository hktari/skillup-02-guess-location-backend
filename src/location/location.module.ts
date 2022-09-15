import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { GuessLocationController } from './guess-location.controller';
import { DatabaseModule } from 'src/database/database.module';
import { locationProviders } from './providers/location.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [LocationController, GuessLocationController],
  providers: [LocationService, ...locationProviders]
})
export class LocationModule { }
