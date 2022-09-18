import { setSeederFactory } from 'typeorm-extension';
import { GuessLocationEntity } from '../../../src/location/entities/guess-location.entity';

export default setSeederFactory(GuessLocationEntity, (faker) => {
    const guess = new GuessLocationEntity();
    guess.address = `${faker.address.street()}, ${faker.address.city()}, ${faker.address.country()}`;
    guess.lat = +faker.address.latitude()
    guess.lng = +faker.address.longitude()
    return guess;
})
