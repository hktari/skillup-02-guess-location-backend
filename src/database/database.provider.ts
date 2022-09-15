import { DataSource } from 'typeorm';
import { DatabaseConnection } from '../common/constants'

export const databaseProviders = [
    {
        provide: DatabaseConnection,
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: 'root',
                database: 'test',
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}',
                ],
                synchronize: true,
            });

            return dataSource.initialize();
        },
    },
];
