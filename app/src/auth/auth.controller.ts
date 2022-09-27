import { Controller, Request, Post, UseGuards, Body, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AwsService } from '../aws/aws.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

const { v4: uuidv4 } = require('uuid');


@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(private authService: AuthService, private awsService: AwsService) {
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {

        let imageUrl = null
        if (signupDto.imageBase64) {
            const imageId = uuidv4()
            imageUrl = await this.awsService.uploadImage(imageId, signupDto.imageBase64)
        }

        return this.authService.signup(signupDto.email, signupDto.password, signupDto.firstName, signupDto.lastName, imageUrl)
    }

    // todo: forgot-password
}
