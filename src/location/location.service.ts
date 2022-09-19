import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LocationRepository, UserRepository } from '../common/constants';
import { Location } from './interfaces/Location.interface'
import { FindOptionsUtils, Repository } from 'typeorm'
import { UserService } from '../user/user.service';
import { LocationEntity } from './entities/location.entity';
import { UserEntity } from '../user/entities/user.entity';
import { PaginatedCollection } from '../common/interface/PaginatedCollection';
import { UpdateLocationDto } from './dto/UpdateLocationDto';
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

    findOne(id: string): Promise<LocationEntity> {
        return this.locationRepository.findOneOrFail({ where: { id } })
    }

    async update(id: string, { address, imageBase64, lat, lng }: UpdateLocationDto): Promise<LocationEntity> {
        const location = await this.locationRepository.findOneBy({ id })
        if (!location) {
            throw new NotFoundException(`Location with id ${id} was not found.`)
        }

        if (imageBase64) {
            // todo: get url
        }

        location.address = address
        location.lat = lat
        location.lng = lng
        location.imageUrl = 'TODO'

        return this.locationRepository.save(location)
    }

    async delete(id: string) {
        const location = await this.locationRepository.findOneBy({ id })
        if (!location) {
            throw new NotFoundException(`Location with id ${id} was not found.`)
        }

        await this.locationRepository.remove(location)
    }
}
