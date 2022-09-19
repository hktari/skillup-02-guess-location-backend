import { UserEntity } from '../src/user/entities/user.entity';
import * as request from 'supertest';

export function getAuthToken(app, { email, password }: UserEntity) {
    const validCredentials = {
        email,
        password
    }
    return request(app.getHttpServer())
        .post('/auth/login')
        .send(validCredentials)
        .then(res => res.body.access_token)
}
