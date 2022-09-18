import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { LocationEntity } from '../../../src/location/entities/location.entity';
import { UserEntity } from '../../../src/user/entities/user.entity';

export let existingLocation: LocationEntity

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        console.log('locations...')

        const userRepository = dataSource.getRepository(UserEntity);
        let existingUser = await userRepository.create({
            email: 'existing.location.user@example.com',
            firstName: 'location',
            lastName: 'has',
            password: 'secret'
        })

        existingUser = await userRepository.save(existingUser)


        const locationRepository = dataSource.getRepository(LocationEntity);
        existingLocation = locationRepository.create()
        existingLocation.address = 'Mariborska ulica 23'
        existingLocation.lat = 22.123122
        existingLocation.lng = 11.022322
        existingLocation.imageUrl = 'https://example.com'
        existingLocation.user = existingUser
        existingLocation = await locationRepository.save(existingLocation)



        const locationFactory = await factoryManager.get(LocationEntity)

        await locationFactory.saveMany(4, { user: existingUser })
        // ---------------------------------------------------

        // const userFactory = await factoryManager.get(LocationEntity);
        // // save 1 factory generated entity, to the database
        // await userFactory.save();

        // // save 5 factory generated entities, to the database
        // await userFactory.saveMany(5);
    }
}
