import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GuessLocationRepository, LocationRepository, UserRepository } from '../common/constants';
import { Location } from './interfaces/Location.interface'
import { FindOptionsUtils, Repository } from 'typeorm'
import { UserService } from '../user/user.service';
import { LocationEntity } from './entities/location.entity';
import { UserEntity } from '../user/entities/user.entity';
import { PaginatedCollection } from '../common/interface/PaginatedCollection';
import { UpdateLocationDto } from './dto/UpdateLocationDto';
import { GuessLocationEntity } from './entities/guess-location.entity';
import { GuessLocationDto } from './dto/GuessLocationDto';
import { distanceInKmBetweenEarthCoordinates, distanceInMetersBetweenEarthCoordinates } from '../common/utility';
@Injectable()
export class LocationService {
    constructor(
        @Inject(LocationRepository) private locationRepository: Repository<LocationEntity>,
        @Inject(GuessLocationRepository) private guessLocationRepository: Repository<GuessLocationEntity>,
        private userService: UserService) {

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
        locationEntity.guesses = []

        return await this.locationRepository.save(locationEntity)
    }

    async findAll(startIdx: number, pageSize: number): Promise<PaginatedCollection<LocationEntity>> {
        const [items, totalItems] = await this.locationRepository.findAndCount({
            skip: startIdx,
            take: pageSize,
            order: {
                createdDate: "DESC",
            },
            relations: {
                user: true
            }
        })

        return {
            startIdx,
            pageSize,
            totalItems,
            items
        }
    }

    findOne(id: string): Promise<LocationEntity> {
        return this.locationRepository.findOne({
            where: { id },
            relations: {
                user: true,
                guesses: true
            },
        })
    }

    async update(id: string, { address, imageUrl, lat, lng }): Promise<LocationEntity> {
        const location = await this.locationRepository.findOneBy({ id })
        if (!location) {
            throw new NotFoundException(`Location with id ${id} was not found.`)
        }

        location.address = address
        location.lat = lat
        location.lng = lng
        location.imageUrl = imageUrl
        
        return this.locationRepository.save(location)
    }

    async delete(id: string) {
        const location = await this.locationRepository.findOneBy({ id })
        if (!location) {
            throw new NotFoundException(`Location with id ${id} was not found.`)
        }

        await this.locationRepository.remove(location)
    }

    async getRandom() {
        const locationCount = await this.locationRepository.count()
        if (locationCount === 0) {
            return null
        }

        const randomIdx = Math.floor(Math.random() * locationCount)
        const itemsList = await this.locationRepository.find({
            skip: randomIdx,
            relations: {
                user: true,
                guesses: true
            }
        })

        return itemsList[0]
    }

    async guessLocation(locationId: string, userId: string, { address, lat, lng }: GuessLocationDto): Promise<GuessLocationEntity> {
        const location = await this.findOne(locationId)
        if (!location) {
            throw new NotFoundException(`Location with id ${locationId} was not found.`)
        }


        const user: UserEntity = await this.userService.getOne(userId)
        if (!user) {
            throw new BadRequestException(`User with id ${userId} wasn't found`)
        }

        const errorInMeters: number = distanceInMetersBetweenEarthCoordinates(lat, lng, location.lat, location.lng)

        let locationGuess = this.guessLocationRepository.create({
            address,
            lat,
            lng,
            errorInMeters,
            user,
            location
        })

        locationGuess = await this.guessLocationRepository.save(locationGuess)

        location.guesses.push(locationGuess)
        await this.locationRepository.save(location)

        return locationGuess;
    }
}