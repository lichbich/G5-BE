import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/entitys/base/BaseEntity';

export enum UserRoles {
  ADMIN = 'admin',
  STAFF = 'staff',
  MEMBER = 'member',
  MEMBER_V1 = 'member_v1',
  MEMBER_V2 = 'member_v2',
  SYSTEM_ADMIN = 'system-admin',
}

@Entity('users')
export class User extends BaseEntity {
  @Column()
  u_name: string;

  @Column({ unique: true })
  u_email: string;

  @Column()
  u_password: string;

  @Column({ nullable: true })
  u_address: string;

  @Column({ nullable: true })
  u_phone: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.MEMBER,
    nullable: false,
  })
  role: UserRoles;
}
