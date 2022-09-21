import { Request, Response, Body, ClassSerializerInterceptor, Controller, Get, Param, Post, UseInterceptors, UseGuards, DefaultValuePipe, ParseIntPipe, Query, NotFoundException, Put, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserProfileDto } from './dto/UpdateUserProfileDto';
import { User } from './user.interface';
import { UserService } from './user.service';
import { Response as ExpressResponse, Request as ExRequest } from 'express';


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


  @Get('my-profile')
  getMyProfile(@Request() req) {
    return this.userService.getByEmail(req.email)
  }

  @Put('my-profile')
  updateMyProfile(@Request() req, @Body() { firstName, lastName, imageBase64 }: UpdateUserProfileDto) {
    // todo: if imageBase64 get imageUrl

    return this.userService.update({
      email: req.email,
      firstName: firstName ?? req.firstName,
      lastName: lastName ?? req.lastName,
      imageUrl: req.imageUrl
    })
  }

  @Put('my-profile/password')
  async updateMyPassword(@Request() req, @Response() res: ExpressResponse, @Body('password', new ValidationPipe()) password: string) {
    await this.userService.setPassword(req.email, password)
    return res.sendStatus(200)
  }

  @Get(':id')
  async getSingle(@Param('id') id: string) {
    const user = await this.userService.getOne(id)

    if (!user) {
      throw new NotFoundException(`Failed to find user with id ${id}`)
    }

    return user
  }

}
