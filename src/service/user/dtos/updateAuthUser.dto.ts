import { Unique } from 'src/config/validation';
import { User, UserRoles, UserStatus } from 'src/entitys/users.entity';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateAuthUserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsPhoneNumber('VN', { message: 'Phone number is not valid.' })
  phone: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(UserRoles, { message: 'User role must be [Admin, Staff, Member]' })
  role: UserRoles;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(UserStatus, {
    message: 'User status must be [inactive, active, disable]',
  })
  status: UserStatus;

  constructor() {}
}
