import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';
import { DatabaseModule } from '../src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from '../src/user/entities/user.entity'
import { LocationEntity } from '../src/location/entities/location.entity';
import { UserService } from '../src/user/user.service';
import { LocationService } from '../src/location/location.service';
import { expectGuessLocationEntity, expectLocationEntity } from './common.e2e';
import { UserModule } from '../src/user/user.module';
import { LocationModule } from '../src/location/location.module';
import { AuthModule } from '../src/auth/auth.module';

describe('User', () => {
    let app: INestApplication;
    let userService: UserService
    let authService: AuthService
    let locationService: LocationService
    let accessToken: string
    let existingUser: UserEntity
    let anotherUser: UserEntity
    let existingLocation: LocationEntity


    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [UserModule, AuthModule, LocationModule, DatabaseModule, ConfigModule.forRoot({ envFilePath: '../test.env', isGlobal: true, })],
        })
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
        authService = moduleRef.get<AuthService>(AuthService)
        userService = moduleRef.get<UserService>(UserService)
        locationService = moduleRef.get<LocationService>(LocationService)
    });

    beforeEach(async () => {
        const loginResponse = await authService.login('existing.user@example.com', 'secret')
        accessToken = loginResponse.access_token
        existingUser = await userService.getByEmail('existing.user@example.com')
        anotherUser = await userService.getByEmail('another.user@example.com')
        existingLocation = existingUser.locations[0]
    })

    describe('GET /user/:id', () => {
        it('should return 404 when non-existent user', () => {
            return request(app.getHttpServer())
                .get('/user/fd5b70ef-fba0-4fa8-977b-c534527b2361')
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
                        expectLocationEntity(location)
                    }
                })
        })

        it('user object should contain guesses', (done) => {
            request(app.getHttpServer())
                .get('/user/' + existingUser.id)
                .then(res => {
                    expect(res.body).toHaveProperty('guesses')
                    expect(res.body.guesses).toHaveLength(5)
                    for (const guess of res.body.guesses) {
                        expectGuessLocationEntity(guess)
                    }
                })
        })

    })

    afterAll(async () => {
        await app?.close();
    })

})