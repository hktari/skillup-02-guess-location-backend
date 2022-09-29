import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'
import { ConfigService } from '@nestjs/config'
import { CryptoService } from './crypto.service';
import { LoggingModule } from '../logging/logging.module';
import { AwsModule } from '../aws/aws.module';

@Module({
    imports: [AwsModule, LoggingModule, UserModule,
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
    providers: [AuthService, JwtStrategy, CryptoService],
    controllers: [AuthController],
    exports: [AuthService, CryptoService]
})
export class AuthModule { }
