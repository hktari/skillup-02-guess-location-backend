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

    await createTestData()
  });


  let existingUser;
  async function createTestData() {
    existingUser = userRepository.create()
    existingUser.email = 'test@example.com'
    existingUser.firstName = 'scott'
    existingUser.lastName = 'johnson'
    existingUser.password = 'secret'
    await userRepository.save(existingUser)
  }

  describe('/POST auth/login', () => {

    it(`should return access_token when correct credentials`, (done) => {
      const loginDto = {
        email: existingUser.email,
        password: existingUser.password
      }


      request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .then((response) => {
          expect(response.statusCode).toBe(201)
          expect(response.body).toHaveProperty('access_token')
          done()
        });
    });

    it('should return 400 when invalid credentials', (done) => {
      const invalidLoginDto = {
        email: 'nonexisting@example.com',
        password: 'secret'
      }

      request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLoginDto)
        .then(res => {
          expect(res.statusCode).toBe(400)
          done()
        })
    })
  })


  describe('/POST auth/signup', () => {
    it('should return 201 on unique credentials', (done) => {
      const signupDto = {
        email: 'uniqueuser@example.com',
        password: 'secret',
        firstName: 'unique',
        lastName: 'user'
      }
      const result = {
        email: signupDto.email,
        firstName: signupDto.firstName,
        lastName: signupDto.lastName,
        imageUrl: null
      }

      request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .then(res => {
          expect(res.statusCode).toBe(201)
          expect(res.body).toHaveProperty('email', signupDto.email)
          expect(res.body).toHaveProperty('firstName', signupDto.firstName)
          expect(res.body).toHaveProperty('lastName', signupDto.lastName)
          expect(res.body).toHaveProperty('email', signupDto.email)
          expect(res.body).not.toHaveProperty('password')
          done()
        })
    })

    it('should return 400 on duplicate email', (done) => {
      const signupDto = {
        ...existingUser,
      }

      request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .then((response) => {
          expect(response.statusCode).toBe(400)
          expect(response.body).toHaveProperty('error')
          done()
        })
    })
  })


  describe('/POST auth/forgot-password', () => {
    it('should return 200 when email exists', (done) => {
      const forgotPasswordDto = {
        email: existingUser.email
      }

      request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send(forgotPasswordDto)
        .then(res => {
          expect(res.statusCode).toBe(200)
          done()
        })
    })
  })

  afterAll(async () => {
    await app?.close();
  });
});
