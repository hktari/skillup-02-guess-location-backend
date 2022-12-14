import { Test, TestingModule } from '@nestjs/testing';
import { mockUserProviders } from '../user/providers/mock.user.provider';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { mocklocationProviders } from './providers/mock.location.providers';

describe('LocationController', () => {
  let controller: LocationController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        LocationService,
        ...mocklocationProviders,
        ...mockUserProviders,
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
