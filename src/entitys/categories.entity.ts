import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./base/BaseEntity";
import { Product } from "./products.entity";

@Entity('categories')
export class Category extends BaseEntity {
  @Column()
  cat_name: string;

  @Column()
  cat_description: string;

  @Column()
  is_active: string;

  @OneToMany(() => Product, p => p.category)
  products: Product[];
}