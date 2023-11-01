import { User } from 'src/entitys/users.entity';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Email address is not valid.' })
  email: string;

  @IsNotEmpty()
  password: string;

  @IsPhoneNumber('VN', { message: 'Phone number is not valid.' })
  phone: string;

  address: string;

  language: string;

  constructor() {}
}
