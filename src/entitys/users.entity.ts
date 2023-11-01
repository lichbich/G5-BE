import { IPEntity } from './ips.entity';
import { Exclude } from 'class-transformer';
import { Unique } from 'src/config/validation';
import { Entity, Column, Generated, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/entitys/base/BaseEntity';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { ReportsEntity } from './reports.entity';
import { Payment } from './payment.entity';

export enum UserRoles {
  ADMIN = 'admin',
  STAFF = 'staff',
  MEMBER = 'member',
  MEMBER_V1 = 'member_v1',
  MEMBER_V2 = 'member_v2',
  SYSTEM_ADMIN = 'system-admin',
}

export enum UserStatus {
  IN_ACTIVE = 'inactive',
  ACTIVE = 'active',
  DISABLE = 'disable',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ name: 'display_name' })
  @IsString()
  displayName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: "" })
  phone: string;

  @Column()
  address: string;

  @Column({ default: "en" })
  language: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.MEMBER,
    nullable: false,
  })
  role: UserRoles;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.IN_ACTIVE,
  })
  status: UserStatus;

  @Column({ name: 'active_code', default: "" })
  activeToken: string;

  @Column({ name: 'fogot_password_code', default: "" })
  fogotPasswordCode: string;

  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @OneToMany(() => IPEntity, (ip) => ip.user)
  ips: IPEntity[];

  @OneToMany(() => ReportsEntity, (report) => report.user)
  reports: ReportsEntity[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
