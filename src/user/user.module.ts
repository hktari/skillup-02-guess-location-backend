import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { UserRepository } from '../common/constants';
import { userProviders } from './providers/user.provider';
import { AuthModule } from '../auth/auth.module';
import { CryptoService } from '../auth/crypto.service';
import { LoggingModule } from '../logging/logging.module';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [DatabaseModule, LoggingModule, AwsModule],
  controllers: [UserController],
  providers: [UserService, ...userProviders, CryptoService],
  exports: [UserService, ...userProviders]
})
export class UserModule {}
