import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'
import { ConfigService } from '@nestjs/config'

@Module({
    imports: [UserModule,
        PassportModule,
        JwtModule.registerAsync(
            {
                useFactory: (configService: ConfigService) => {
                    return {
                        secret: configService.get<string>('JWT_SECRET'),
                        signOptions: { expiresIn: '60s' },
                    }
                },
                inject: [ConfigService]
            }
        )],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule { }
