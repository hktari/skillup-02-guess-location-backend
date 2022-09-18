import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../../src/user/entities/user.entity';

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const repository = dataSource.getRepository(UserEntity);
        await repository.insert([
            {
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
