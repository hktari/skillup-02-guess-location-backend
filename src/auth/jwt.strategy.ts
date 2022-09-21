import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService, private authService: AuthService, private logger: LoggingService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')
        });
    }

    async validate(payload: any) {
        this.logger.debug('validating JWT: ' + JSON.stringify(payload), 'JwtStrategy')
        return await this.authService.validateUser(payload.email)
    }
}
