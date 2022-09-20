import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { LocationEntity } from '../../../src/location/entities/location.entity';
import { UserEntity } from '../../../src/user/entities/user.entity';

export const existingLocation: LocationEntity = {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    address: 'Mariborska ulica 23',
    lat: 22.123122,
    lng: 11.022322,
    imageUrl: 'https://example.com',
    createdDate: new Date(),
    guesses: [],
    user: {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
        email: 'existing.location.user@example.com',
        firstName: 'location',
        lastName: 'has',
        password: 'secret',
        imageUrl: 'https://example.com',
        locations: [],
        guesses: []
    }
}

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        console.log('locations...')

        const userRepository = dataSource.getRepository(UserEntity);
        await userRepository.insert(existingLocation.user)

        const locationRepository = dataSource.getRepository(LocationEntity);
        await locationRepository.insert(existingLocation)



        const locationFactory = await factoryManager.get(LocationEntity)

        await locationFactory.saveMany(4, { user: existingLocation.user })
        // ---------------------------------------------------

        // const userFactory = await factoryManager.get(LocationEntity);
        // // save 1 factory generated entity, to the database
        // await userFactory.save();

        // // save 5 factory generated entities, to the database
        // await userFactory.saveMany(5);
    }
}
