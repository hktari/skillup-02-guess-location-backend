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
import { PaginatedCollection } from '../src/common/interface/PaginatedCollection';
import { LocationEntity } from '../src/location/entities/location.entity';
import CreateLocationDto from '../src/location/dto/CreateLocationDto';
import { GuessLocationDto } from '../src/location/dto/GuessLocationDto';
import { existingLocation } from './data/seed/location.seeder';
import { GuessLocationEntity } from '../src/location/entities/guess-location.entity';
import { UserModule } from '../src/user/user.module';

import { existingUser } from './data/seed/user.seeder'

describe('User', () => {
    let app: INestApplication;


    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [DatabaseModule, ConfigModule.forRoot({ envFilePath: '../test.env', isGlobal: true, })],
        })
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();

    });

    describe('GET /user/:id', () => {
        it('should return 404 when non-existent user', () => {
            return request(app.getHttpServer())
                .get('/user/no-exist')
                .expect(404)
        })

        it('should return 200 and a user object', (done) => {
            request(app.getHttpServer())
                .get('/user/' + existingUser.id)
                .then(res => {
                    expect(res.statusCode).toBe(200)
                    expect(res.body).toContainEqual(existingUser)
                    done()
                })
        })

        it('user object should contain locations', (done) => {
            request(app.getHttpServer())
                .get('/user/' + existingUser.id)
                .then(res => {
                    expect(res.body).toHaveProperty('locations')
                    expect(res.body.locations).toHaveLength(10)
                    for (const location of res.body.locations) {
                        expect(location).toHaveProperty('address')
                        expect(location).toHaveProperty('imageUrl')
                        expect(location).toHaveProperty('lat')
                        expect(location).toHaveProperty('lng')
                    }
                })
        })

        it('user object should contain guesses', (done) => {
            request(app.getHttpServer())
            .get('/user/'+existingUser.id)
            .then(res => {
                expect(res.body).toHaveProperty('guesses')
                expect(res.body.guesses).toHaveLength(5)
                for (const guess of res.body.guesses) {
                    expect(guess).toHaveProperty('address')
                    expect(guess).toHaveProperty('lat')
                    expect(guess).toHaveProperty('lng')
                    expect(guess).toHaveProperty('errorInMeters')
                }
            })
         })

    })

    afterAll(async () => {
        await app?.close();
    })

})