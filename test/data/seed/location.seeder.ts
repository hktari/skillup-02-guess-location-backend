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
        const existingUser = await userRepository.findOne({
            where: {
                email: 'existing.user@example.com',
            }
        })

        const repository = dataSource.getRepository(LocationEntity);
        existingLocation = repository.create()
        existingLocation.address = 'Mariborska ulica 23'
        existingLocation.lat = 22.123122
        existingLocation.lng = 11.022322
        existingLocation.imageUrl = 'https://example.com'
        existingLocation.user = existingUser
        existingLocation = await repository.save(existingLocation)



        // ---------------------------------------------------

        // const userFactory = await factoryManager.get(LocationEntity);
        // // save 1 factory generated entity, to the database
        // await userFactory.save();

        // // save 5 factory generated entities, to the database
        // await userFactory.saveMany(5);
    }
}
