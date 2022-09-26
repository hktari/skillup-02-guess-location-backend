import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm"
import { SeederOptions } from "typeorm-extension";
import { UserEntity } from './user/entities/user.entity'
import { LocationEntity } from './location/entities/location.entity'
import { GuessLocationEntity } from './location/entities/guess-location.entity'

const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: process.env.PGHOST,
    port: +process.env.PGPORT || 5432,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    entities: [
        UserEntity,
        LocationEntity,
        GuessLocationEntity
    ],
    factories: ['test/data/factory/**/*.ts'],
    seeds: ['test/data/seed/**/*.ts'],
    migrations: ['db/migrations/**/*.ts'],
    uuidExtension: 'pgcrypto'
};

export const AppDataSource = new DataSource(options)