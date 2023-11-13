import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../auth-management/dtos/updateUserDto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entitys/users.entity';
import { handleSuccessRequest } from '../../models/common';
import { ChangePasswordDTO } from '../auth-management/dtos/ChangePassworDto';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}
  updateUser(updateUserDto: UpdateUserDto) {
    return this.userRepo
      .update(
        { id: updateUserDto.id },
        {
          u_name: updateUserDto.u_name,
          u_address: updateUserDto.u_address,
          u_phone: updateUserDto.u_phone,
        },
      )
      .then(() => handleSuccessRequest({}))
      .catch(() => {
        throw new HttpException('ERROR', HttpStatus.BAD_REQUEST);
      });
  }

  changePassword(changePasswordDTO: ChangePasswordDTO) {
    return this.userRepo
      .update(
        { id: changePasswordDTO.id },
        {
          u_password: changePasswordDTO.password,
        },
      )
      .then(() => handleSuccessRequest({}))
      .catch(() => {
        throw new HttpException('ERROR', HttpStatus.BAD_REQUEST);
      });
  }
}
