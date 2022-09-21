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



/* ------------------------------- // utility ------------------------------- */

export function expectLocationEntity(location: any, expectRelations: boolean = true) {
    expect(location).toHaveProperty('id')
    expect(location).toHaveProperty('address')
    expect(location).toHaveProperty('lat')
    expect(location).toHaveProperty('lng')
    expect(location).toHaveProperty('imageUrl')
    expect(location).toHaveProperty('createdDate')
    if(expectRelations){
        expect(location).toHaveProperty('user')
        expect(location).toHaveProperty('guesses')    
    }
}

export function expectGuessLocationEntity(guessLocation: any, expectRelations: boolean = true) {
    expect(guessLocation).toHaveProperty('id')
    expect(guessLocation).toHaveProperty('lat')
    expect(guessLocation).toHaveProperty('lng')
    expect(guessLocation).toHaveProperty('address')
    expect(guessLocation).toHaveProperty('errorInMeters')
    if(expectRelations){
        expect(guessLocation).toHaveProperty('user')
        expect(guessLocation).toHaveProperty('location')    
    }
}

export function expectUserEntity(user: any, expectRelations: boolean = true) {
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('firstName')
    expect(user).toHaveProperty('lastName')
    expect(user).toHaveProperty('email')
    expect(user).not.toHaveProperty('password')
    expect(user).toHaveProperty('imageUrl')
    if (expectRelations) {
        expect(user).toHaveProperty('locations')
        expect(user).toHaveProperty('guesses')
    }
}