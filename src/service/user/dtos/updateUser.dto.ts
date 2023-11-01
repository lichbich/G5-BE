import { User } from 'src/entitys/users.entity';
import { Unique } from 'src/config/validation';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
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

  constructor() {}
}
