import { Module } from '@nestjs/common';
import { LoggingModule } from '../logging/logging.module';
import { AwsService } from './aws.service';
import { MockAwsService } from './mockAws.service';

@Module({
  imports: [LoggingModule],
  providers: [MockAwsService],
  exports: [MockAwsService],
})
export class AwsModule {}
