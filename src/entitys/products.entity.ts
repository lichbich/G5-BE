import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/BaseEntity';
import { ProdcutOrder } from './product_order';
import { Category } from './categories.entity';

export enum ProductTags {
  BestSeller = 'best-seller',
  NoneBestSeller = 'none-best-seller',
}

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  pName: string;

  @Column({ length: 2000 })
  pDescription: string;

  @Column()
  pPrice: number;

  @Column()
  pQuantity: number;

  @Column()
  pImgLink: string;

  @Column({
    type: 'enum',
    nullable: true,
    enum: ProductTags,
    default: ProductTags.NoneBestSeller,
  })
  pTag: ProductTags;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'del_yn', default: false })
  delYn: boolean;

  @OneToMany(() => ProdcutOrder, (prodcutOrder) => prodcutOrder.product)
  productOrders: ProdcutOrder[];

  @ManyToOne(() => Category, (c) => c.products)
  category: Category;
}
