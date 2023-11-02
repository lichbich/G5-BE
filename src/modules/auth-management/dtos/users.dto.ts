import { UserRoles } from 'src/entitys/users.entity';

export class UserDto {
  id = '';
  u_name = '';
  u_email = '';
  u_phone = '';
  u_address = '';
  createdAt = new Date();
  updatedAt = new Date();
  role: UserRoles = UserRoles.MEMBER;
}
