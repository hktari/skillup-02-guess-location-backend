import { DataSource, DataSourceOptions } from "typeorm";
import path from "path";
import { SeederOptions } from 'typeorm-extension';
export const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: process.env.PGHOST,
    port: +process.env.PGPORT,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    entities: [
        __dirname + '/../**/*.entity.ts',
    ],
    factories: [__dirname + '/../test/data/factory/**/*.ts'],
    seeds: [__dirname + '/../test/data/seed/**/*.ts'],
    synchronize: true
};

const dataSource = new DataSource(options);
export default dataSource