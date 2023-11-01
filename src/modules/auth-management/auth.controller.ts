import { Response } from 'express';
import { AuthService } from './auth.service';
import { ResultResponse } from 'src/models/common';
import { LoginDto } from 'src/models/request/LoginDto';
import { SignUpDto } from 'src/models/request/SignUpDto';
import { FogotPasswordDto } from './dtos/FogotPasswordDto';
import { Public } from 'src/modules/_guards/jwt-auth.guard';
import { VerifyEmailDto } from 'src/models/request/verifyEmailDto';
import { VerifyFogotPasswordDto } from './dtos/VerifyFogotPasswordDto';
import { UserService } from 'src/modules/users-management/users.service';
import { SendVerifyEmailDto } from 'src/models/request/sendVerifyEmailDto';
import ResponseEntityBuilder from 'src/models/response/common/ResponseEntityBuilder';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';

@Controller()
export class AuthController {
    constructor(
        private userService: UserService,
        private readonly authService: AuthService
    ) { }

    @Public()
    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
        const user: any = await this.authService.validateUser(loginDto);
        const { accessToken } = this.authService.getCookieWithJwtAccessToken(user);
        const { refreshToken } = this.authService.getCookieWithJwtRefreshToken(user);
        // await this.userService.setCurrentRefreshToken(refreshTokenCookie.token, user.id);
        // response.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie.cookie]);
        user.accessToken = accessToken;
        return ResponseEntityBuilder
            .getBuilder()
            .setCode(HttpStatus.OK)
            .setData(user)
            .build()
    }

    @Public()
    @Post('sign-up')
    async signUp(@Body() signUpDto: SignUpDto) {
        const userDto = await this.authService.signUp(signUpDto);
        return ResponseEntityBuilder
            .getBuilder()
            .setCode(HttpStatus.OK)
            .setData(userDto)
            .build()
    }

    @Public()
    @Post('send-verify-email')
    async sendVerifyEmail(@Body() { email }: SendVerifyEmailDto) {
        await this.authService.sendVerifyEmail(email);
        return ResponseEntityBuilder
            .getBuilder()
            .setCode(HttpStatus.OK)
            .build()
    }

    @Public()
    @Post('verify-email')
    async verifyEmail(@Body() { userId, verifyCode }: VerifyEmailDto) {
        await this.authService.verifyEmail(userId, verifyCode);
        return ResponseEntityBuilder
            .getBuilder()
            .setCode(HttpStatus.OK)
            .build()
    }

    @Public()
    @Post('send-fogot-password-code')
    async sendFogotPasswordCode(@Body() { email }: FogotPasswordDto) {
        await this.authService.sendFogotPasswordCode(email);
        return ResponseEntityBuilder
            .getBuilder()
            .setCode(HttpStatus.OK)
            .build()
    }

    @Public()
    @Post('verify-fogot-password-code')
    async verifyFogotPasswordCode(@Body() { email, code }: VerifyFogotPasswordDto) {
        await this.authService.verifyFogotPasswordCode(email, code);
        return ResponseEntityBuilder
            .getBuilder()
            .setCode(HttpStatus.OK)
            .build()
    }

    @Get('logout')
    async logout(@Req() req, @Res({ passthrough: true }) response: Response) {
        // const cookies = this.authenticationService.getCookieWithLogout();
        // await this.userService.removeRefreshToken(user.id);
        // response.setHeader('Set-Cookie', cookies);

        return ResponseEntityBuilder
            .getBuilder()
            .setCode(HttpStatus.OK)
            .build()
    }

    @Get('refresh')
    refresh(@Req() request) {
        const { user } = request;
        // const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user);

        // request.res.setHeader('Set-Cookie', accessTokenCookie);
        return request.user;
    }

    @Get("check-authentication")
    checkAuth(@Req() request, @Res({ passthrough: true }) response: Response): ResultResponse {
        const { user } = request;
        return ResponseEntityBuilder
            .getBuilder()
            .setCode(HttpStatus.OK)
            .setData(user)
            .build()
    }
}
