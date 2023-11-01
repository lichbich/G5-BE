import { User } from './users.entity';
import { BaseEntity } from 'src/entitys/base/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('payment')
export class Payment extends BaseEntity {
  @Column({ name: 'package_id' })
  packageId: string;

  @Column({ name: 'status' })
  status: string;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
