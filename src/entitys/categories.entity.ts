import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base/BaseEntity';
import { Product } from './products.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column()
  catName: string;

  @Column()
  catDescription: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'del_yn', default: false })
  delYn: boolean;

  @OneToMany(() => Product, (p) => p.category)
  products: Product[];
}
