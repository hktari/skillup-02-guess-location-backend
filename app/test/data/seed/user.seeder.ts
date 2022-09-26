import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../../src/user/entities/user.entity';
import { LocationEntity } from '../../../src/location/entities/location.entity';
import { GuessLocationEntity } from '../../../src/location/entities/guess-location.entity';

export const existingUser: UserEntity = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    firstName: 'Joža',
    lastName: 'Mošt',
    email: 'existing.user@example.com',
    password: '$2b$10$/JZHs9gRLkTA3CGKDO9JMuiccixHKSTbLb9.OFBR2mwi6RqbN6XiO', // 'secret'
    imageUrl: 'http://example.com',
    locations: [],
    guesses: []
}

export const existingUserPassword = 'secret'

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        console.log('users ....')

        const userRepository = dataSource.getRepository(UserEntity);
        const guessRepository = dataSource.getRepository(GuessLocationEntity)

        await userRepository.insert([
            existingUser
        ]);



        const userFactory = await factoryManager.get(UserEntity)
        const anotherUser = await userFactory.save({ email: 'another.user@example.com' })


        for (const user of [existingUser, anotherUser]) {
            // create location entries
            const locationFactory = await factoryManager.get(LocationEntity)
            await locationFactory.saveMany(5, { user: user })

            // create location entries with guess entries
            const guessFactory = await factoryManager.get(GuessLocationEntity)
            for (const location of await locationFactory.saveMany(5, { user: user })) {
                await guessFactory.save({ user: user, location: location })
            }
        }
    }
}
