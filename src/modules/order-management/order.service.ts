import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../auth-management/dtos/createOrder.dto';
import { Order } from '../../entitys/order';
import { User } from '../../entitys/users.entity';
import { ProdcutOrder } from '../../entitys/product_order';
import { Product } from '../../entitys/products.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  createOrder(orderDto: CreateOrderDto) {
    return this.entityManager.transaction(
      async (transactionManager: EntityManager) => {
        const user = new User();
        user.id = orderDto.userId;
        const order = new Order();
        order.o_phone = orderDto.phone;
        order.o_address = orderDto.address;
        order.user = user;

        const orderInsert = await transactionManager.save(order);

        const arrayProductOrder: ProdcutOrder[] = [];

        orderDto.product.forEach((item) => {
          const product = new Product();
          product.id = item.id;
          const productOrder = new ProdcutOrder();
          productOrder.price = item.price;
          productOrder.quantity = item.quantity;
          productOrder.total = Number(item.price) * Number(item.quantity);
          productOrder.order = orderInsert;
          productOrder.product = product;

          arrayProductOrder.push(productOrder);
        });

        await transactionManager.insert(ProdcutOrder, arrayProductOrder);
      },
    );
  }
}
