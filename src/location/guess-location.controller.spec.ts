import { Test, TestingModule } from '@nestjs/testing';
import { GuessLocationController } from './guess-location.controller';

describe('GuessLocationController', () => {
  let controller: GuessLocationController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuessLocationController],
    }).compile();

    controller = module.get<GuessLocationController>(GuessLocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
