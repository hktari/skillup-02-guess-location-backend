import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm"
import { SeederOptions } from "typeorm-extension";


console.log("ENTITIES PATH:", __dirname + './**/*.entity.ts')

const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'hktari',
    password: '123qweAsd.',
    database: 'geotagger',
    entities: [
        './**/*.entity.ts',
    ],
    factories: ['/../test/data/factory/**/*.ts'],
    seeds: ['/../test/data/seed/**/*.ts'],
    migrations: ['/migrations/**/*.ts'],
    synchronize: true
};

export const AppDataSource = new DataSource(options)


// host: process.env.PGHOST,
// port: +process.env.PGPORT,
// username: process.env.PGUSER,
// password: process.env.PGPASSWORD,
// database: process.env.PGDATABASE,
// entities: [
//     __dirname + './**/*.entity.ts',
// ],
// factories: [__dirname + '/../test/data/factory/**/*.ts'],
// seeds: [__dirname + '/../test/data/seed/**/*.ts'],
// migrations: [__dirname + '/migrations/**/*.ts'],
// synchronize: true
