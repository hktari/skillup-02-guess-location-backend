import { Request, Body, ClassSerializerInterceptor, Controller, Get, Param, Post, UseInterceptors, UseGuards, DefaultValuePipe, ParseIntPipe, Query } from '@nestjs/common';
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
  getAll(
    @Query('startIdx', new DefaultValuePipe(0), new ParseIntPipe()) startIdx: number,
    @Query('pageSize', new DefaultValuePipe(10), new ParseIntPipe()) pageSize: number) {
      return this.userService.getAll(startIdx, pageSize)
  }

  @Get(':id')
  getSingle(@Param('id') id: string) {
    return this.userService.getOne(id)
  }

}
