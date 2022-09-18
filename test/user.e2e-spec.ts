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

        it('should return 200 and a user object', () => {
            return request(app.getHttpServer())
                .get('/user/' + existingUser.id)
                .expect(200, res => {
                    expect(res.body).toContainEqual(existingUser)
                })
        })

        it('user object should contain locations', () => {
            return request(app.getHttpServer())
                .get('/user/' + existingUser.id)
                .expect(res => {
                    expect(res.body).toHaveProperty('locations')
                })
        })

    })
})