import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../common/constants';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { User } from './user.interface';
import { CryptoService } from '../auth/crypto.service';
import { PaginatedCollection } from '../common/interface/PaginatedCollection';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class UserService {
    constructor(@Inject(UserRepository) private userRepository: Repository<UserEntity>, private cryptoService: CryptoService, private logger: LoggingService) {

    }

    async create(user: User) {
        const userEntity = this.userRepository.create(user)
        return this.userRepository.save(userEntity)
    }

    async getAll(startIdx: number, pageSize: number): Promise<PaginatedCollection<UserEntity>> {
        const [items, totalItems] = await this.userRepository.findAndCount({
            skip: startIdx,
            take: pageSize
        })

        return {
            startIdx,
            pageSize,
            totalItems,
            items
        }
    }

    getOne(id: string) {
        return this.userRepository.findOne({
            where: { id },
            relations: {
                locations: true,
                guesses: true
            },
            order: {
                locations: {
                    createdDate: 'DESC'
                },
                guesses: {
                    createdDate: 'DESC'
                }
            }
        })
    }

    getByEmail(email: string, includeRelations: boolean = true) {
        this.logger.debug(`getByEmail(${email})`, 'UserService')

        const opts = {
            where: { email: email },
            relations: {
                locations: includeRelations,
                guesses: includeRelations
            }
        }

        if (includeRelations) {
            opts['order'] = {
                locations: {
                    createdDate: 'DESC'
                },
                guesses: {
                    createdDate: 'DESC'
                }
            }
        }

        return this.userRepository.findOne(opts)
    }

    async update({ email, firstName, lastName, imageUrl }) {
        const userEntity = await this.getByEmail(email, false)
        if (!userEntity) {
            throw new NotFoundException('user not found. email: ' + email)
        }

        userEntity.firstName = firstName
        userEntity.lastName = lastName
        userEntity.imageUrl = imageUrl

        await this.userRepository.save(userEntity)

        userEntity.email = email
        userEntity.imageUrl = imageUrl

        return userEntity
    }

    async setPassword(email: string, password: string) {
        const userEntity = await this.getByEmail(email, false)

        if (!userEntity) {
            throw new NotFoundException(`User with email ${email} not found`)
        }

        userEntity.password = await this.cryptoService.hashPassword(password)

        return await this.userRepository.save(userEntity)
    }
}
