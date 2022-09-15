import { Inject, Injectable } from '@nestjs/common';
import { LocationRepository, UserRepository } from 'src/common/constants';
import { Location } from './interfaces/Location.interface'
import { Repository } from 'typeorm'
import { LocationEntity } from './entities/LocationEntity';
import { UserEntity } from 'src/user/entities/UserEntity';
@Injectable()
export class LocationService {
    constructor(
        @Inject(LocationRepository) private locationRepository: Repository<LocationEntity>,
        @Inject(UserRepository) private userRepository: Repository<UserEntity>) {

    }

    async create(location: Location) {
        const user = await this.userRepository.findOne({
            where: {
                id: location.userId
            }
        })

        if (!user) {
            throw new Error(`user with id: ${location.userId} not found`)
        }

        const locationEntity = this.locationRepository.create()
        locationEntity.address = location.address
        locationEntity.imageUrl = location.imageUrl
        locationEntity.lat = location.lat
        locationEntity.lng = location.lng
        locationEntity.user = user

        return await this.locationRepository.save(locationEntity)
    }
}
