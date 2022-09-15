import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {

  }

  @Get()
  getAll() {
    return []
  }

  @Get(':id')
  getSingle(@Param('id') id: string): User {

  }
}
