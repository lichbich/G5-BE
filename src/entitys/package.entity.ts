import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('package')
export class Package {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  @Column()
  type: string;

  @Column("decimal", { precision: 5, scale: 2 })
  price: number;
}
