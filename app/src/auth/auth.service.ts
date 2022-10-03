import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { CryptoService } from './crypto.service';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
  ) {}

  async validateUser(email: string): Promise<UserEntity> {
    return await this.usersService.getByEmail(email, false);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.getByEmail(email);

    if (
      user &&
      (await this.cryptoService.validatePassword(password, user.password))
    ) {
      const payload = { email, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload, { expiresIn: '365d' }),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      };
    }

    throw new BadRequestException('Invalid credentials');
  }

  async signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    imageUrl: string,
  ) {
    const existingUser = await this.usersService.getByEmail(email);
    const pwdHash = await this.cryptoService.hashPassword(password);

    if (existingUser) {
      throw new BadRequestException('User with that email already exists.');
    }

    return this.usersService.create({
      email,
      password: pwdHash,
      firstName,
      lastName,
      imageUrl,
    });
  }
}
