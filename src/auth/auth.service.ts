import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt'
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
    constructor(private usersService: UserService, private jwtService: JwtService) {

    }

    async validateUser(email: string, pass: string): Promise<any> {
        return null;
    }

    async login(email: string, password: string) {
        const user = await this.usersService.getOne(email);

        // TODO: validate password using bcrypt
        if (user && user.password === password) {
            const payload = { email, sub: user.id };
            return {
                access_token: this.jwtService.sign(payload),
            };
        }

        throw new BadRequestException('Invalid credentials')
    }

    async signup(signupDto: SignupDto) {
        const existingUser = await this.usersService.getOne(signupDto.email)

        if (existingUser) {
            throw new BadRequestException('User with that email already exists.')
        }
        // TODO: has pwd using bcrypt
        const hashedPwd = signupDto.password

        return this.usersService.create({
            email: signupDto.email,
            password: hashedPwd,
            firstName: signupDto.firstName,
            lastName: signupDto.lastName,
            imageUrl: 'TODO'
        })
    }
}
