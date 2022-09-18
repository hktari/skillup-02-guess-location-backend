import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/auth.service';
import { DatabaseModule } from '../src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { Repository } from 'typeorm'
import { UserEntity } from '../src/user/entities/user.entity'
import { UserRepository } from '../src/common/constants';

describe('Auth', () => {
  let app: INestApplication;
  let authService = { findAll: () => ['test'] };
  let userRepository: Repository<UserEntity>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule, DatabaseModule, ConfigModule.forRoot({ envFilePath: '../test.env', isGlobal: true, })],
    })
      // .overrideProvider(AuthService)
      // .useValue(authService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    userRepository = moduleRef.get<Repository<UserEntity>>(UserRepository)
  });

  it(`/POST auth/login`, (done) => {
    const loginUser = userRepository.create()
    loginUser.email = 'test@example.com'
    loginUser.firstName = 'scott'
    loginUser.lastName = 'johnson'
    loginUser.password = 'secret'
    userRepository.save(loginUser)

    const loginDto = {
      email: loginUser.email,
      password: loginUser.password
    }

    
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .then((response) => {
        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('access_token')
        done()
      });
  });

  afterAll(async () => {
    await app?.close();
  });
});
