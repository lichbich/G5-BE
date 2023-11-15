import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/BaseEntity';
import { ProdcutOrder } from './product_order';
import { User } from './users.entity';

export enum OrderStatus {
  PENDING = 0,
  APPROVE = 4,
  SHIPPING = 1,
  COMPELETE = 2,
  CANCEL = 3,
}

@Entity('orders')
export class Order extends BaseEntity {
  @Column()
  o_address: string;

  @Column()
  o_phone: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    nullable: false,
  })
  o_status: OrderStatus;

  @OneToMany(() => ProdcutOrder, (prodcutOrder) => prodcutOrder.order)
  product_orders: ProdcutOrder[];

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
