import { Request, Body, ClassSerializerInterceptor, Controller, Get, Param, Post, UseInterceptors, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/CreateUserDto';
import { User } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {

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
