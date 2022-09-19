import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LocationRepository, UserRepository } from '../common/constants';
import { Location } from './interfaces/Location.interface'
import { FindOptionsUtils, Repository } from 'typeorm'
import { UserService } from '../user/user.service';
import { LocationEntity } from './entities/location.entity';
import { UserEntity } from '../user/entities/user.entity';
import { PaginatedCollection } from '../common/interface/PaginatedCollection';
@Injectable()
export class LocationService {
    constructor(
        @Inject(LocationRepository) private locationRepository: Repository<LocationEntity>) {

    }

    async create(user: UserEntity, location: Location) {
        if (!user) {
            throw new Error('user is not defined')
        }

        const locationEntity = this.locationRepository.create()
        locationEntity.address = location.address
        locationEntity.imageUrl = location.imageUrl
        locationEntity.lat = location.lat
        locationEntity.lng = location.lng
        locationEntity.user = user

        return await this.locationRepository.save(locationEntity)
    }

    async findAll(startIdx: number, pageSize: number): Promise<PaginatedCollection<LocationEntity>> {
        const [items, totalItems] = await this.locationRepository.findAndCount({
            skip: startIdx,
            take: pageSize,
            order: {
                createdDate: "DESC",
            },
        })

        return {
            startIdx,
            pageSize,
            totalItems,
            items
        }
    }
}
