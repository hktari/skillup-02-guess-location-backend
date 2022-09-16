import { DataSource } from 'typeorm';
import { DatabaseConnection } from '../../common/constants'

export const databaseProviders = [
    {
        provide: DatabaseConnection,
        useFactory: async () => {
            console.log(__dirname + '/../**/*.entity{.ts,.js}')
            const dataSource = new DataSource({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'hktari',
                password: '123qweAsd.',
                database: 'geotagger',
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}',
                ],
                uuidExtension: 'pgcrypto',
                synchronize: true,
            });

            return dataSource.initialize();
        },
    },
];
