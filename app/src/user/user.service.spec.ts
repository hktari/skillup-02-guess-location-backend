import { TestingModule, Test } from '@nestjs/testing';
import { UserRepository } from '../common/constants';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;
  const existingUser: UserEntity = {
    id: 'existing-user',
    email: 'existing@example.com',
    password: 'secret',
    firstName: 'joža',
    lastName: 'mošt',
    imageUrl: 'http://example.com',
    locations: [],
    guesses: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .useMocker((token) => {
        if (token === UserRepository) {
          return { findOneBy: jest.fn().mockResolvedValue(existingUser) };
        }

        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    userService = module.get<UserService>(UserService);
  });

  describe('getOne', () => {
    it('should return a UserEntity object when exists', (done) => {
      userService
        .getByEmail(existingUser.email)
        .then((res) => {
          expect(res).toBe(existingUser);
          done();
        })
        .catch((err) => done(err));
    });
  });
});
