import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from 'src/user/entities/user.entity';

const moduleMocker = new ModuleMocker(global);

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .useMocker((token) => {
        console.log('mocker');
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    console.log('compiled');
    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signup returns AuthService result', async () => {
    const signupDto: SignupDto = {
      email: 'test@example.com',
      firstName: 'john',
      lastName: 'scott',
      password: 'secret',
      imageBase64: '123qwe==',
    };
    const signupResult: UserEntity = {
      id: '0',
      email: 'test@example.com',
      firstName: 'john',
      lastName: 'scott',
      password: 'secret',
      imageUrl: 'https://...',
      locations: [],
    };
    jest.spyOn(service, 'signup').mockResolvedValue(signupResult);

    expect(await controller.signup(signupDto)).toBe(signupResult);
  });

  describe('login', () => {
    it('should return AuthService login result', async () => {
      const result = { access_token: 'asldkasj912ijk1' };
      jest.spyOn(service, 'login').mockResolvedValue(result);

      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'secret',
      };
      expect(await controller.login(loginDto)).toBe(result);
    });
  });
});
