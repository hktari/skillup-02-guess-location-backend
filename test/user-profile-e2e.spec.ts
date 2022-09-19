import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/auth.service';
import { DatabaseModule } from '../src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { EqualOperator, Repository } from 'typeorm'
import { UserEntity } from '../src/user/entities/user.entity'
import { UserRepository } from '../src/common/constants';
import { PaginatedCollection } from '../src/common/interface/PaginatedCollecton';
import { LocationEntity } from '../src/location/entities/location.entity';
import CreateLocationDto from '../src/location/dto/CreateLocationDto';
import { GuessLocationDto } from '../src/location/dto/GuessLocationDto';
import { existingLocation } from './data/seed/location.seeder';
import { GuessLocationEntity } from '../src/location/entities/guess-location.entity';
import { UserModule } from '../src/user/user.module';

import { existingUser } from './data/seed/user.seeder'
import { getAuthToken } from './common.e2e';

describe('User profile', () => {
    let app: INestApplication;


    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [DatabaseModule, ConfigModule.forRoot({ envFilePath: '../test.env', isGlobal: true, })],
        })
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();

    });


    describe('GET /user/my-profile', () => {
        it('should return 401 when not authenticated', (done) => {
            request(app.getHttpServer())
                .get('/user/my-profile')
                .then(res => {
                    expect(res.statusCode).toBe(401)
                    done()
                })
        })

        it('should return 200 and user object when authenticated', async (done) => {
            const result = { ...existingUser }
            delete result.password

            getAuthToken(app, existingUser).then(token => {
                request(app.getHttpServer())
                    .get('/user/my-profile')
                    .auth(token, { type: 'bearer' })
                    .then(res => {
                        expect(res.statusCode).toBe(200)
                        expect(res.body).toMatchObject(result)
                        done()
                    })
            })
        })
    })

    afterAll(async () => {
        await app?.close();
    })

})