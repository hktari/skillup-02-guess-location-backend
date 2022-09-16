import { Inject, Injectable } from '@nestjs/common';
import { LocationRepository, UserRepository } from '../common/constants';
import { Location } from './interfaces/Location.interface'
import { Repository } from 'typeorm'
import { UserService } from '../user/user.service';
import { LocationEntity } from './entities/location.entity';
import { UserEntity } from '../user/entities/user.entity';
@Injectable()
export class LocationService {
    constructor(
        @Inject(LocationRepository) private locationRepository: Repository<LocationEntity>,
        @Inject(UserService) private userService: UserService) {

    }

    async create(user: UserEntity, location: Location) {
        const locationEntity = this.locationRepository.create()
        locationEntity.address = location.address
        locationEntity.imageUrl = location.imageUrl
        locationEntity.lat = location.lat
        locationEntity.lng = location.lng
        locationEntity.user = user

        return await this.locationRepository.save(locationEntity)
    }
}
