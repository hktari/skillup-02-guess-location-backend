import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { SignupDto } from './dto/signup.dto';

const moduleMocker = new ModuleMocker(global);

describe('AuthController', () => {
  let controller: AuthController;

  const signupResult = { id: '0', email: 'test@example.com', firstName: 'john', lastName: 'scott', password: 'secret', imageUrl: 'https://...' }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController]
    })
      .useMocker((token) => {
        console.log('mocker')
        if (token === AuthService) {
          console.log('AuthService token')
          return { signup: jest.fn().mockResolvedValue(signupResult) };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      }).compile();

    console.log('compiled')
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signup returns AuthService result', async () => {
    const signupDto: SignupDto = { email: 'test@example.com', firstName: 'john', lastName: 'scott', password: 'secret', imageBase64: '123qwe==' }

    expect(await controller.signup(signupDto)).toBe(signupResult)
  })
});
