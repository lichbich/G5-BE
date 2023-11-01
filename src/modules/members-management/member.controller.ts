import { RolesGuard } from '../_guards/roles.guard';
import { UserRoles } from 'src/entitys/users.entity';
import { Roles } from '../_decorators/auth.decorator';
import { UserService } from 'src/modules/users-management/users.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ChangeMemberPassword } from 'src/service/user/dtos/changeMemberPassword.dto';

@Controller()
export class MemberController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRoles.ADMIN)
  async getAllMember() {
    return this.userService.getAllMembers();
  }

  @Post('change-password')
  @Roles(UserRoles.ADMIN)
  async changeMemberPass(@Body() body: ChangeMemberPassword) {
    return this.userService.changeMemberPassword(body.userId, body.newPassword);
  }
}
