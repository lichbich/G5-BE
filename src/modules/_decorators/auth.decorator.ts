import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/entitys/users.entity';

export const ROLES_KEY = 'role';
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
