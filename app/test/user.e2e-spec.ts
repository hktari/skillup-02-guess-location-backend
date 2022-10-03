import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, NestInterceptor } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';
import { DatabaseModule } from '../src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from '../src/user/entities/user.entity';
import { LocationEntity } from '../src/location/entities/location.entity';
import { UserService } from '../src/user/user.service';
import { LocationService } from '../src/location/location.service';
import {
  expectGuessLocationEntity,
  expectLocationEntity,
  expectUserEntity,
} from './common.e2e';
import { UserModule } from '../src/user/user.module';
import { LocationModule } from '../src/location/location.module';
import { AuthModule } from '../src/auth/auth.module';
import { UpdateUserProfileDto } from '../src/user/dto/UpdateUserProfileDto';
import { ChangePasswordDto } from '../src/user/dto/ChangePasswordDto';
import { LoggingModule } from '../src/logging/logging.module';
import { LoggingService } from '../src/logging/logging.service';
import { AwsModule } from '../src/aws/aws.module';
import { LoggingMiddleware } from '../src/common/middleware/logging.middleware';
import { Request, Response, NextFunction } from 'express';

describe('User', () => {
  let app: INestApplication;
  let userService: UserService;
  let authService: AuthService;
  let locationService: LocationService;
  let accessToken: string;
  let existingUser: UserEntity;
  let anotherUser: UserEntity;
  let existingLocation: LocationEntity;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AwsModule,
        LoggingModule,
        UserModule,
        AuthModule,
        LocationModule,
        DatabaseModule,
        ConfigModule.forRoot({ envFilePath: '../test.env', isGlobal: true }),
      ],
      providers: [LoggingMiddleware],
    }).compile();

    app = moduleRef.createNestApplication({ bufferLogs: true });
    app.useLogger(app.get<LoggingService>(LoggingService));
    app.use((req: Request, res: Response, next: NextFunction) => {
      const logger = app.get<LoggingService>(LoggingService);
      logger.log(`[${req.method}]: ${req.originalUrl}`);
      next();
    });

    await app.init();
    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    locationService = moduleRef.get<LocationService>(LocationService);
  });

  beforeEach(async () => {
    const loginResponse = await authService.login(
      'existing.user@example.com',
      'secret',
    );
    accessToken = loginResponse.access_token;

    existingUser = await userService.getByEmail('existing.user@example.com');
    delete existingUser.password;

    anotherUser = await userService.getByEmail('another.user@example.com');
    delete anotherUser.password;

    existingLocation = existingUser.locations[0];
  });

  describe('GET /user/:id', () => {
    it('should return 404 when non-existent user', () => {
      return request(app.getHttpServer())
        .get('/user/fd5b70ef-fba0-4fa8-977b-c534527b2361')
        .expect(404);
    });

    it('should return 200 and a user object', (done) => {
      request(app.getHttpServer())
        .get('/user/' + existingUser.id)
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expectUserEntity(res.body);
          done();
        });
    });

    it('user object should contain locations', (done) => {
      request(app.getHttpServer())
        .get('/user/' + existingUser.id)
        .then((res) => {
          expect(res.body).toHaveProperty('locations');
          expect(res.body.locations).toHaveLength(10);
          for (const location of res.body.locations) {
            expectLocationEntity(location, false);
          }
          done();
        })
        .catch((err) => done(err));
    });

    it('user object should contain guesses', (done) => {
      request(app.getHttpServer())
        .get('/user/' + existingUser.id)
        .then((res) => {
          expect(res.body).toHaveProperty('guesses');
          expect(res.body.guesses).toHaveLength(5);
          for (const guess of res.body.guesses) {
            expectGuessLocationEntity(guess, false);
          }
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('GET /user/:id/guess', () => {
    it('should return a paged collection of guess items', (done) => {
      const requestParams = {
        startIdx: 0,
        pageSize: 10,
        userId: existingUser.id,
      };

      request(app.getHttpServer())
        .get(`/user/${requestParams.userId}/guess`)
        .auth(accessToken, { type: 'bearer' })
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body).toHaveProperty('startIdx');
          expect(res.body).toHaveProperty('totalItems');
          expect(res.body).toHaveProperty('pageSize');
          expect(res.body).toHaveProperty('items');
          expect(res.body.items).toHaveLength(5);
          for (const item of res.body.items) {
            expectGuessLocationEntity(item);
          }
          done();
        })
        .catch((err) => done(err));
    });

    it('should return empty items array when nothing found', (done) => {
      request(app.getHttpServer())
        .get(`/user/${anotherUser.id}/guess`)
        .auth(accessToken, { type: 'bearer' })
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.items).toHaveLength(0);
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('GET /user/my-profile', () => {
    it('should return 401 when no Authentication header', (done) => {
      request(app.getHttpServer())
        .get('/user/my-profile')
        .expect(401)
        .then((res) => done())
        .catch((err) => done(err));
    });

    it('should return 200 and UserEntity when Authentication header', (done) => {
      request(app.getHttpServer())
        .get('/user/my-profile')
        .auth(accessToken, { type: 'bearer' })
        .then((res) => {
          expect(res.statusCode).toBe(200);

          const userObj = JSON.parse(JSON.stringify(res.body), (prop, val) => {
            if (prop === 'createdDate') {
              return new Date(val);
            } else return val;
          });

          expect({ ...userObj, locations: [], guesses: [] }).toEqual({
            ...existingUser,
            locations: [],
            guesses: [],
          });
          expect(userObj.locations).toMatchObject(existingUser.locations);
          expect(userObj.guesses).toMatchObject(existingUser.guesses);

          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('PUT /user/my-profile', () => {
    it('should return 401 when no Authentication header', (done) => {
      request(app.getHttpServer())
        .put('/user/my-profile')
        .expect(401)
        .then((res) => done())
        .catch((err) => done(err));
    });

    it('should return 200 and UserEntity when valid Authentication header', (done) => {
      const profileUpdateDto: UpdateUserProfileDto = {
        firstName: 'Marko',
        lastName: 'Zajeban',
      };
      const result = {
        ...existingUser,
        firstName: profileUpdateDto.firstName,
        lastName: profileUpdateDto.lastName,
      };

      delete result.locations;
      delete result.guesses;

      request(app.getHttpServer())
        .put('/user/my-profile')
        .send(profileUpdateDto)
        .auth(accessToken, { type: 'bearer' })
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual(result);
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('PUT /user/my-profile/password', () => {
    it('should return 401 when no Authentication header', (done) => {
      request(app.getHttpServer())
        .put('/user/my-profile/password')
        .expect(401)
        .then((res) => done())
        .catch((err) => done(err));
    });

    it('should return 400 when password length is less than 5', (done) => {
      const tooShortChangePasswordDto: ChangePasswordDto = {
        password: 'new',
      };

      request(app.getHttpServer())
        .put('/user/my-profile/password')
        .auth(accessToken, { type: 'bearer' })
        .send(tooShortChangePasswordDto)
        .expect(400)
        .then((res) => done())
        .catch((err) => done(err));
    });

    it('should return 200 when valid Authentication header', (done) => {
      const changePasswordDto: ChangePasswordDto = {
        password: 'new-secret',
      };

      request(app.getHttpServer())
        .put('/user/my-profile/password')
        .auth(accessToken, { type: 'bearer' })
        .send(changePasswordDto)
        .expect(200)
        .then((res) => done())
        .catch((err) => done(err));
    });
  });

  afterAll(async () => {
    await app?.close();
  });
});
