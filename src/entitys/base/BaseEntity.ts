import {
  BaseEntity as Base,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity extends Base {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

export default abstract class MysqlGateway<T, X> {
  abstract getAll(): T;
  abstract getById(id?: string): T;
  abstract getBy(param: X): T;
  abstract create(param: T): T;
  abstract delete(param: T): T;
}
