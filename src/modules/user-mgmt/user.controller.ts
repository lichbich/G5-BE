import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../auth-management/dtos/updateUserDto';
import { ChangePasswordDTO } from '../auth-management/dtos/ChangePassworDto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('update')
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }

  @Post('change-password')
  async changePassword(@Body() changePasswordDTO: ChangePasswordDTO) {
    return this.userService.changePassword(changePasswordDTO);
  }
}
