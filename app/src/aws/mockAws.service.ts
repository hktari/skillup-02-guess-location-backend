import { Injectable } from '@nestjs/common';
import { IAwsService } from './aws.service';

@Injectable()
export class MockAwsService implements IAwsService {
  constructor() {}

  uploadImage(objectId: string, imageBase64: string): Promise<string> {
    return Promise.resolve(
      'https://clipground.com/images/image-placeholder-clipart-1.png',
    );
  }
}
