import { DataSource } from 'typeorm';
import { DatabaseConnection } from '../common/constants'
import { ConfigService } from '@nestjs/config'

export const databaseProviders = [
    {
        provide: DatabaseConnection,
        useFactory: async (configService: ConfigService) => {
            const dataSource = new DataSource({
                type: 'postgres',
                host: configService.get<string>('PGHOST'),
                port: configService.get<number>('PGPORT'),
                username: configService.get<string>('PGUSER'),
                password: configService.get<string>('PGPASSWORD'),
                database: configService.get<string>('PGDATABASE'),
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}',
                ],
                uuidExtension: 'pgcrypto',
                // synchronize: true,
                // dropSchema: true
            });
            return dataSource.initialize();
        },
        inject: [ConfigService]
    },
];
