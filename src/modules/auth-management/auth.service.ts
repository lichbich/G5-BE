import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entitys/users.entity';
import { LoginDto } from 'src/models/request/LoginDto';
import { SignUpDto } from 'src/models/request/SignUpDto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    validateUser(loginDto: LoginDto) {
        // return this.userService.login(loginDto);
    }

    signUp(signUpDto: SignUpDto) {
        // return this.userService.signUp(signUpDto);
    }

    sendVerifyEmail(email: string) {
        // return this.userService.sendVerifyEmail(email);
    }

    verifyEmail(userId: string, verifyCode: String) {
        // return this.userService.verifyCode(userId, verifyCode);
    }

    sendFogotPasswordCode(email: string) {
        // return this.userService.sendFogotPasswordCode(email);
    }

    verifyFogotPasswordCode(email: string, code: string) {
        // return this.userService.verifyFogotPasswordCode(email, code);
    }

    public getCookieWithJwtAccessToken(user: User) {
        const accessToken = this.jwtService.sign({ ...user }, {
            secret: this.configService.get('JWT_SECRET_KEY'),
            expiresIn: `${this.configService.get('JWT_EXPIRE_TIME')}`
        });

        const cookie = `auth=${accessToken}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRE_TIME')};`;
        return { accessToken, cookie };
    }

    public getCookieWithJwtRefreshToken(user: User) {
        const refreshToken = this.jwtService.sign({ ...user }, {
            secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
            expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRE_TIME')}`
        });

        const cookie = `refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_EXPIRE_TIME')};`;
        return { refreshToken, cookie };
    }

    public getCookieWithLogout() {
        return [
            'auth=; HttpOnly; Path=/; Max-Age=0',
            'refresh=; HttpOnly; Path=/; Max-Age=0'
        ]
    }
}