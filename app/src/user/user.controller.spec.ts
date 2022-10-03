import { Test, TestingModule } from '@nestjs/testing';
import { mocklocationProviders } from '../location/providers/mock.location.providers';
import { mockUserProviders } from './providers/mock.user.provider';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, ...mocklocationProviders, ...mockUserProviders],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOne', () => {
    it('should return a user', async () => {
      const result = {
        id: '0',
        email: 'test@exaple.com',
        password: 'secret',
        firstName: 'joža',
        lastName: 'grumpl',
        imageUrl: 'http://...',
        locations: [],
      };
      jest
        .spyOn(service, 'getOne')
        .mockImplementation((_) => Promise.resolve(result));

      expect(await controller.getSingle('0')).toBe(result);
    });

    // todo: move to e2e tests
    // it('should not contain the password', async () => {
    //   const result = new UserEntity()
    //   result.id = '0'
    //   result.email = 'test@exaple.com'
    //   result.password = 'secret'
    //   result.firstName = 'joža'
    //   result.lastName = 'grumpl'
    //   result.imageUrl = 'http://...'
    //   result.locations = []

    //   jest.spyOn(service, 'getOne').mockImplementation((_) => Promise.resolve(result))

    //   const transformedResult = await controller.getSingle('0')
    //   expect(transformedResult.password).toBeUndefined()
    // })
  });
});
