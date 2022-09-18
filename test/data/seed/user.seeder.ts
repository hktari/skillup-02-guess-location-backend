import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../../src/user/entities/user.entity';

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        console.log('users ....')
        const repository = dataSource.getRepository(UserEntity);
        await repository.insert([
            {
                id: '50e48a6f90bb4e79908418ccd7ce5735',
                firstName: 'Joža',
                lastName: 'Mošt',
                email: 'existing.user@example.com',
                password: 'secret'
            }
        ]);

        // ---------------------------------------------------

        const userFactory = await factoryManager.get(UserEntity);
        // save 1 factory generated entity, to the database
        await userFactory.save();

        // save 5 factory generated entities, to the database
        await userFactory.saveMany(5);
    }
}
