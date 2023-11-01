import { UserService } from 'src/modules/users-management/users.service';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Public } from '../_guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AbilityFactory } from '../ability/ability.factory';
import { CookieService } from 'src/service/cookie/cookie.service';
import { CreateAuthUserDto } from 'src/service/user/dtos/createAuthUser.dto';
import { ChangePasswordDTO } from 'src/service/user/dtos/changePassword.dto';
import { CheckAbility, ReadUserAbility } from '../_decorators/ability.decorator';
import ResponseEntityBuilder from 'src/models/response/common/ResponseEntityBuilder';

export const FIND_ALL_USER = "Find_All_User"
export interface ActiveQuery {
  token: string;
}

@Controller()
export class UserController {
  constructor(
    private abilityFactory: AbilityFactory,
    private readonly userService: UserService,
    private readonly cookieService: CookieService,
  ) { }

  @Get()
  @CheckAbility(new ReadUserAbility(FIND_ALL_USER))
  async getAllUsers() {
    return ResponseEntityBuilder
      .getBuilder()
      .setData(await this.userService.getAllUsers())
      .build();
  }

  @Get('/get-all-members')
  async getAllMembers() {
    return this.userService.getAllMembers();
  }

  @Public()
  @Post()
  async createUser(@Body() user: CreateAuthUserDto) {
    const createUserDto = new CreateAuthUserDto();
    createUserDto.displayName = user.displayName;
    createUserDto.email = user.email;
    createUserDto.password = user.password;
    createUserDto.phone = user.phone;
    createUserDto.address = user.address;
    createUserDto.role = user.role;
    createUserDto.language = user.language;

    return this.userService.createUser(createUserDto);
  }

  @Post('change-password')
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDTO,
  ) {
    const { user } = req;
    return this.userService.changePassword(user, changePasswordDto);
  }
}
