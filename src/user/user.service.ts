import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../common/constants';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { User } from './user.interface';
import { CryptoService } from '../../src/auth/crypto.service';
import { PaginatedCollection } from 'src/common/interface/PaginatedCollection';

@Injectable()
export class UserService {
    constructor(@Inject(UserRepository) private userRepository: Repository<UserEntity>, private cryptoService: CryptoService) {

    }

    async create(user: User) {
        const userEntity = this.userRepository.create(user)
        userEntity.password = await this.cryptoService.hashPassword(user.password)
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
        })
    }

    getByEmail(email: string, includeRelations: boolean = true) {
        return this.userRepository.findOne({
            where: { email },
            relations: {
                locations: includeRelations,
                guesses: includeRelations
            },
        })
    }

    async update({ email, firstName, lastName, imageUrl }) {
        const userEntity = await this.getByEmail(email, false)
        if (!userEntity) {
            throw new NotFoundException('user not found. email: ' + email)
        }

        userEntity.email = email
        userEntity.firstName = firstName
        userEntity.lastName = lastName
        userEntity.imageUrl = imageUrl

        return await this.userRepository.save(userEntity)
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
