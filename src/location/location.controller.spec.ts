import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '../user/user.module';
import { LocationController } from './location.controller';
import { LocationModule } from './location.module';
import { LocationService } from './location.service';
import { mocklocationProviders } from './providers/mock.location.providers';

describe('LocationController', () => {
  let controller: LocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [LocationService, ...mocklocationProviders],
    }).compile();

    controller = module.get<LocationController>(LocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
