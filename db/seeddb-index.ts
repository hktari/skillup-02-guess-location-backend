import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';

import { UserEntity } from '../src/user/entities/user.entity';
import dataSource from './data-source'

(async () => {
    try {
        console.log('start seeding...')
        const dataSourceInit = await dataSource.initialize();

        await dataSourceInit.synchronize(false)
        await runSeeders(dataSourceInit);
        console.log('finished seeding...')
    } catch (error) {
        console.error('Error occured', error.toString())
    }
})();