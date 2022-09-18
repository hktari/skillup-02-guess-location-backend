import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../common/constants';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { User } from './user.interface';
import { CryptoService } from 'src/auth/crypto.service';

@Injectable()
export class UserService {
    constructor(@Inject(UserRepository) private userRepository: Repository<UserEntity>, private cryptoService: CryptoService) {

    }

    async create(user: User) {
        const userEntity = this.userRepository.create(user)
        userEntity.password = await this.cryptoService.hashPassword(user.password)
        return this.userRepository.save(userEntity)
    }

    getAll() {
        return this.userRepository.findAndCount()
    }

    getOne(email: string) {
        return this.userRepository.findOne({ where: { email } })
    }

    async update(user: User) {
        const userEntity = await this.userRepository.findOne({ where: { email: user.email } })
        if (!userEntity) {
            throw new NotFoundException('user not found. email: ' + user.email)
        }

        userEntity.email = user.email
        userEntity.firstName = user.firstName
        userEntity.lastName = user.lastName
        userEntity.imageUrl = user.imageUrl

        return await this.userRepository.save(userEntity)
    }

    async setPassword(email: string, password: string) {
        const userEntity = await this.userRepository.findOne({ where: { email } })

        if (!userEntity) {
            throw new NotFoundException(`User with email ${email} not found`)
        }

        userEntity.password = await this.cryptoService.hashPassword(password)

        return await this.userRepository.save(userEntity)
    }
}
