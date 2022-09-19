import { Request, Body, ClassSerializerInterceptor, Controller, Get, Param, Post, UseInterceptors, UseGuards, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserProfileDto } from './dto/UpdateUserProfileDto';
import { User } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get('my-profile')
    getMyProfile(@Request() req) {
        return this.userService.getOne(req.email)
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
}