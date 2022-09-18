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
import { PaginatedCollection } from 'src/common/interface/PaginatedCollecton';
import { LocationEntity } from 'src/location/entities/location.entity';

describe('Location', () => {
    let app: INestApplication;
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

    });


    describe('GET /location', () => {
        it('should return a paginated list of location objects', (done) => {

            request(app.getHttpServer())
                .get('/location')
                .then(res => {
                    expect(res.body).toHaveProperty('startIdx', 0)
                    expect(res.body).toHaveProperty('pageSize', 10)
                    expect(res.body).toHaveProperty('totalItems', 30)
                    expect(res.body).toHaveProperty('items')

                    for (const location of res.body.items) {
                        expect(location).toHaveProperty('lat')
                        expect(location).toHaveProperty('lng')
                        expect(location).toHaveProperty('imageUrl')
                        expect(location).toHaveProperty('address')
                    }

                    done()
                })
        })
    })

    describe('GET /location/random', () => {
        it('should return 200 and a location object', (done) => {
            request(app.getHttpServer())
                .get('/location/random')
                .then(res => {
                    expect(res.statusCode).toBe(200)
                    expect(res.body).toMatchObject(new LocationEntity())
                    done()
                })
        })

        it('should return at least 3 different object out of 10 request', (done) => {
            const requestsList: Promise<LocationEntity>[] = []
            for (let i = 0; i < 10; i++) {
                requestsList.push(
                    request(app.getHttpServer())
                        .get('/location/random')
                        .then(res => res.body as LocationEntity))
            }

            Promise.all(requestsList).then(res => {
                const uniqueLocations = new Set(res.map(location => location.id))
                expect(uniqueLocations.size).toBeGreaterThanOrEqual(3)
                done()
            }, err => done(err))
        })
    })

    afterAll(async () => {
        await app?.close();
    })
});
