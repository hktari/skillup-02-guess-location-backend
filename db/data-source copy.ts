import { DataSource, DataSourceOptions } from "typeorm";
import path from "path";

export const options: DataSourceOptions = {
    type: 'better-sqlite3',
    entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
    ],
    database: path.join(__dirname, 'db.sqlite'),
    // factories: ['test/data/factory/**/*{.ts,.js}'],
    // seeds: ['test/data/seed/**/*{.ts,.js}'],
    extra: {
        charset: "UTF8_GENERAL_CI"
    }
};

export const dataSource = new DataSource(options);