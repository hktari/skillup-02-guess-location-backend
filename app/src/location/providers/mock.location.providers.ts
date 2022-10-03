import { LocationRepository } from '../../common/constants';

export const mocklocationProviders = [
  {
    provide: LocationRepository,
    useFactory: () => {},
    inject: [],
  },
];
