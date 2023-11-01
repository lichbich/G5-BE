import { User, UserRoles } from 'src/entitys/users.entity';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateAuthUserDto {
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

  @IsNotEmpty()
  @IsEnum(UserRoles, { message: 'User role must be [Admin, Staff, Member]' })
  role: UserRoles;

  constructor() {}
}
