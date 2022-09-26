
import { DatabaseConnection, UserRepository } from '../../common/constants';
import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';


export const userProviders = [
    {
        provide: UserRepository,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(UserEntity),
        inject: [DatabaseConnection],
    },
];
