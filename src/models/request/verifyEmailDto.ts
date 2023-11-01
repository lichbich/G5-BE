import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    verifyCode: string;

    constructor() { }
}
