import { User } from './users.entity';
import { BaseEntity } from 'src/entitys/base/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('reports')
export class ReportsEntity extends BaseEntity {
  @Column({ name: 'total_success' })
  totalSuccess: number;

  @Column({ name: 'total_fail' })
  totalFail: number;

  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
