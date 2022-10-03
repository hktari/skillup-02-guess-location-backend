import { Module } from '@nestjs/common';
import { LoggingModule } from '../logging/logging.module';
import { AwsService } from './aws.service';

@Module({
  imports: [LoggingModule],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
