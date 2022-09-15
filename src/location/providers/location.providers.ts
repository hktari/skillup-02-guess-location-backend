import { DatabaseConnection, LocationRepository } from "src/common/constants";
import { DataSource } from 'typeorm'
import { LocationEntity } from "../entities/LocationEntity";

export const locationProviders = [
    {
        provide: LocationRepository,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(LocationEntity),
        inject: [DatabaseConnection],
    },
]