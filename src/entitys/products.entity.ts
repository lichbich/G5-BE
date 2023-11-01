import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base/BaseEntity";
import { ProdcutOrder } from "./product_order";
import { Category } from "./categories.entity";

@Entity('products')
export class Product extends BaseEntity {
    @Column()
    p_name: string;

    @Column()
    p_description: string;

    @Column()
    p_price: string;

    @Column()
    p_img_link: string;

    @Column()
    is_active: string;

    @OneToMany(() => ProdcutOrder, prodcutOrder => prodcutOrder.product)
    product_orders: ProdcutOrder[];

    @ManyToOne(() => Category, c => c.products)
    category: Category;
}