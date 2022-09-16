import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto';
import { User } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {

  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const user: User = {
      email: createUserDto.email,
      password: createUserDto.password,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      imageUrl: 'TODO'
    }

    return this.userService.create(user)
  }

  @Get()
  getAll() {
    return this.userService.getAll()
  }

  @Get(':id')
  getSingle(@Param('id') id: string) {
    return this.userService.getOne(id)
  }
}
