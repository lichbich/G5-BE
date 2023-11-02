import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dtos/users.dto';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entitys/users.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/models/request/LoginDto';
import { convertEntityToDto } from 'src/utils/converts';
import { SignUpDto } from 'src/models/request/SignUpDto';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private readonly dataSource: DataSource,
        @InjectRepository(User) private usersRepo: Repository<User>
    ) { }

    async login(loginDto: LoginDto) {
        const user = await this.usersRepo.find({
            where: {
                u_email: loginDto.email,
                u_password: loginDto.password
            }
        });

        if (user) return convertEntityToDto(user, new UserDto());
        else throw new BadRequestException('Incorrect email or password!');
    }

    async signUp(signUpDto: SignUpDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = new User();
            user.u_name = signUpDto.u_name;
            user.u_email = signUpDto.u_email;
            user.u_password = signUpDto.u_password;
            const isExistEmail = await queryRunner.manager.exists(User, { where: { u_email: user.u_email } });
            if (isExistEmail) throw new Error('Email already registered!');
            const newUser = await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();
            return convertEntityToDto(newUser, new UserDto());
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException(error.message);
        } finally {
            await queryRunner.release();
        }
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