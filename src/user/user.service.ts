import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../common/constants';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { User } from './user.interface';

@Injectable()
export class UserService {
    constructor(@Inject(UserRepository) private userRepository: Repository<UserEntity>) {

    }

    create(user: User) {
        // todo: hash password

        const userEntity = this.userRepository.create(user)
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

        // todo: hash password
        userEntity.password = password

        return await this.userRepository.save(userEntity)
    }
}
