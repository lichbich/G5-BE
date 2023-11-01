import { Response } from 'express';
import { AuthService } from './auth.service';
import { ResultResponse } from 'src/models/common';
import { LoginDto } from 'src/models/request/LoginDto';
import { SignUpDto } from 'src/models/request/SignUpDto';
import { Public } from 'src/modules/_guards/jwt-auth.guard';
import ResponseEntityBuilder from 'src/models/response/common/ResponseEntityBuilder';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';

@Controller()
export class AuthController {
    constructor(
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
        console.log('in');
        
        // const userDto = await this.authService.signUp(signUpDto);
        // return ResponseEntityBuilder
        //     .getBuilder()
        //     .setCode(HttpStatus.OK)
        //     .setData(userDto)
        //     .build()
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

    @Get("fogot-password")
    forgotPassword(@Req() request, @Res({ passthrough: true }) response: Response): ResultResponse {
        const { user } = request;
        return ResponseEntityBuilder
            .getBuilder()
            .setCode(HttpStatus.OK)
            .setData(user)
            .build()
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
