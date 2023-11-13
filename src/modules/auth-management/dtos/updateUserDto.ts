import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  u_name: string;

  @IsString()
  u_address: string;

  @IsPhoneNumber('VN')
  u_phone: string;

  constructor() {}
}
