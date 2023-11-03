import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./base/BaseEntity";
import { Product } from "./products.entity";
import { Order } from "./order";

@Entity('product_order')
export class ProdcutOrder extends BaseEntity {
    @Column()
    quantity: number;

    @Column()
    price: number;

    @Column()
    total: number;

    @ManyToOne(() => Product, (p) => p.productOrders)
    product: Product;

    @ManyToOne(() => Order, (o) => o.product_orders)
    order: Order;
}