import { DatabaseConnection, LocationRepository } from "../../common/constants";
import { DataSource } from 'typeorm'
import { LocationEntity } from "../entities/location.entity";

export const locationProviders = [
    {
        provide: LocationRepository,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(LocationEntity),
        inject: [DatabaseConnection],
    },
]