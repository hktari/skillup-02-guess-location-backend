import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { GuessLocationController } from './guess-location.controller';
import { DatabaseModule } from '../database/database.module';
import { locationProviders } from './providers/location.providers';
import { UserModule } from '../user/user.module';
import { userProviders } from '../user/providers/user.provider';
import { UserService } from '../user/user.service';
import { CryptoService } from '../auth/crypto.service';
import { LoggingModule } from '../logging/logging.module';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [DatabaseModule, UserModule, LoggingModule, AwsModule],
  controllers: [LocationController, GuessLocationController],
  providers: [LocationService, ...locationProviders, UserService, ...userProviders, CryptoService]
})
export class LocationModule { }
