import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
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

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  getSingle(@Param('id') id: string) {
    return this.userService.getOne(id)
  }
}
