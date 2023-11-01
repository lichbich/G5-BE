import { UserRoles } from 'src/entitys/users.entity';

export class UserResponse {
    id = "";
    reports: any = '';
    email: string = '';
    phone: string = '';
    address: string = '';
    filePath: string = '';
    status: boolean = true;
    secretKey: string = '';
    createdAt = new Date();
    updatedAt = new Date();
    displayName: string = '';
    role: UserRoles = UserRoles.MEMBER;
}
