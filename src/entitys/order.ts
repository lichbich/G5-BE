import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./base/BaseEntity";
import { ProdcutOrder } from "./product_order";

export enum OrderStatus {
    PENDING = 0,
    SHIPPING = 0,
    COMPELETE = 0,
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
        nullable: false
    })
    o_status: OrderStatus;

    @OneToMany(() => ProdcutOrder, prodcutOrder => prodcutOrder.order)
    product_orders: ProdcutOrder[];
}