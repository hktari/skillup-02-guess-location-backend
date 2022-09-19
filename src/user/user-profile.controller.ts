import { Response, Request, Body, ClassSerializerInterceptor, Controller, Get, Param, Post, UseInterceptors, UseGuards, Put, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response as ExResponse, Request as ExRequest } from 'express';
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

    @Put('my-profile/password')
    async updateMyPassword(@Request() req, @Response() res: ExResponse, @Body('password', new ValidationPipe()) password: string) {
        await this.userService.setPassword(req.email, password)
        return res.sendStatus(200)
    }
}