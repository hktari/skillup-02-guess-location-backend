import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/auth.service';
import { DatabaseModule } from '../src/database/database.module';
import { ConfigModule } from '@nestjs/config';


describe('Auth', () => {
  let app: INestApplication;
  let catsService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule, DatabaseModule, ConfigModule.forRoot({ envFilePath: '../test.env', isGlobal: true, })],
    })
      .overrideProvider(AuthService)
      .useValue(catsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/POST auth/login`, () => {
    const result = { access_token: 'asldkasj912ijk1' }
    catsService['login'] = () => result

    return request(app.getHttpServer())
      .post('/auth/login')
      .expect(200)
      .expect(result);
  });

  afterAll(async () => {
    await app?.close();
  });
});
