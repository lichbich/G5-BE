import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/users-management/users.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh-token'
) {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => request?.cookies?.refresh]),
            secretOrKey: configService.get('JWT_REFRESH_SECRET_KEY'),
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload) {
        const refreshToken = request.cookies?.refresh;
        // return this.userService.getUserIfRefreshTokenMatches(refreshToken, payload.payload.id);
    }
}