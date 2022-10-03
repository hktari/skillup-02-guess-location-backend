import {
  DatabaseConnection,
  GuessLocationRepository,
  LocationRepository,
} from '../../common/constants';
import { DataSource } from 'typeorm';
import { LocationEntity } from '../entities/location.entity';
import { GuessLocationEntity } from '../entities/guess-location.entity';

export const locationProviders = [
  {
    provide: LocationRepository,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(LocationEntity),
    inject: [DatabaseConnection],
  },
  {
    provide: GuessLocationRepository,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(GuessLocationEntity),
    inject: [DatabaseConnection],
  },
];
