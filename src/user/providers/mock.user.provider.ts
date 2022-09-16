import { UserRepository } from "../../common/constants";

export const mockUserProviders = [
    {
        provide: UserRepository,
        useFactory: () => {},
        inject: [],
    },
];
