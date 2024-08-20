import { Injectable } from '@nestjs/common';

@Injectable()
export class MockAwsService {
  constructor() {}

  uploadImage(objectId: string, imageBase64: string): Promise<string> {
    return Promise.resolve(
      'https://clipground.com/images/image-placeholder-clipart-1.png',
    );
  }
}
