import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class FogotPasswordDto {
    @IsEmail({}, { message: "Email address is not valid." })
    @IsString()
    @IsNotEmpty()
    email: string;
}