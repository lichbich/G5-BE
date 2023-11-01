import { User } from 'src/entitys/users.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendVerifyEmailDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Email address is not valid.' })
    email: string;

    constructor() { }
}
