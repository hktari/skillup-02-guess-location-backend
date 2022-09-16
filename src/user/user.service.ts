import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/common/constants';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { User } from './user.interface';

@Injectable()
export class UserService {
    constructor(@Inject(UserRepository) private userRepository: Repository<UserEntity>) {

    }

    create(user: User) {
        const userEntity = this.userRepository.create(user)
        return this.userRepository.save(userEntity)
    }

    getAll() {
        return this.userRepository.findAndCount()
    }

    getOne(id: string) {
        return this.userRepository.findOne({ where: { id } })
    }
}
