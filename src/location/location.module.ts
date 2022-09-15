import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { GuessLocationController } from './guess-location.controller';

@Module({
  controllers: [LocationController, GuessLocationController],
  providers: [LocationService]
})
export class LocationModule {}
