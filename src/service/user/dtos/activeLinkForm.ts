import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ActiveLinkForm {
    @IsEmail({}, { message: "Email address is not valid." })
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}