import { forwardRef, Module } from '@nestjs/common';
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
import { GuessService } from './guess.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => UserModule), LoggingModule, AwsModule],
  controllers: [LocationController, GuessLocationController],
  providers: [LocationService, GuessService, ...locationProviders, UserService, ...userProviders, CryptoService],
  exports: [LocationService, GuessService, ...locationProviders]
})
export class LocationModule { }
