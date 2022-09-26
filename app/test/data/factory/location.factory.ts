import { setSeederFactory } from 'typeorm-extension';
import { LocationEntity } from '../../../src/location/entities/location.entity';

export default setSeederFactory(LocationEntity, (faker) => {
    const location = new LocationEntity();
    location.address = `${faker.address.street()}, ${faker.address.city()}, ${faker.address.country()}`;
    location.imageUrl = faker.internet.url()
    location.lat = +faker.address.latitude()
    location.lng = +faker.address.longitude()
    return location;
})
