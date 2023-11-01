import { UserRoles } from 'src/entitys/users.entity';

export class UserDto {
  id = '';
  reports: any = '';
  email = '';
  address = '';
  language = '';
  filePath = '';
  status = true;
  secretKey = '';
  createdAt = new Date();
  updatedAt = new Date();
  displayName = '';
  role: UserRoles = UserRoles.MEMBER;
}
