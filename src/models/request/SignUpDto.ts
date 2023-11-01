import { User } from 'src/entitys/users.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {Unique} from "../../config/validation";

export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    displayName: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Email address is not valid.' })
    email: string;

    @IsNotEmpty()
    password: string;

    address: string;

    constructor() { }
}
