import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/common/constants';
import { UserEntity } from 'src/user/entities/UserEntity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@Inject(UserRepository) private userRepository: Repository<UserEntity>) {

    }

    getAll() {
        return this.userRepository.findAndCount()
    }
}
