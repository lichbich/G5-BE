import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: "Email address is not valid." })
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}