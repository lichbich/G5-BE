import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    u_name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Email address is not valid.' })
    u_email: string;

    @IsNotEmpty()
    u_password: string;

    constructor() { }
}
