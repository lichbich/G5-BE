import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../entitys/categories.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}
}
