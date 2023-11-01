import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class VerifyFogotPasswordDto {
    @IsEmail({}, { message: "Email address is not valid." })
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    code: string;
}