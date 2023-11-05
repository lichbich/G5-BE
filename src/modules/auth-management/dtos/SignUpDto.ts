import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    u_name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Email address is not valid.' })
    u_email: string;

    @IsNotEmpty()
    u_password: string;

    @IsOptional()
    u_address: string;

    @IsOptional()
    @IsPhoneNumber('VN')
    u_phone: string;

    constructor() { }
}