import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../auth-management/dtos/createOrder.dto';
import { Order } from '../../entitys/order';
import { User } from '../../entitys/users.entity';
import { ProdcutOrder } from '../../entitys/product_order';
import { Product } from '../../entitys/products.entity';
import { handleSuccessRequest } from '../../models/common';

@Injectable()
export class OrderService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) { }

  async createOrder(orderDto: CreateOrderDto) {
    if (orderDto.product.length === 0) {
      throw new BadRequestException('No product!!!');
    }
    await this.entityManager.transaction(
      async (transactionManager: EntityManager) => {
        const user = await this.usersRepo.findOneBy({
          id: orderDto.userId,
        });
        if (!user) {
          throw new BadRequestException('User not exist!!!');
        }
        user.id = orderDto.userId;
        const order = new Order();
        order.o_phone = orderDto.phone;
        order.o_address = orderDto.address;
        order.user = user;

        const orderInsert = await transactionManager.save(order);

        const arrayProductOrder: ProdcutOrder[] = [];

        for (const item of orderDto.product) {
          const product = await this.productRepo.findOneBy({
            id: item.id,
          });
          if (!product) {
            throw new BadRequestException('Product not exist!!!');
          }
          if (product.pQuantity < item.quantity) {
            throw new BadRequestException(
              `item ${product.pName} is not enough`,
            );
          } else {
            await this.productRepo.update(
              { id: product.id },
              {
                pQuantity: product.pQuantity - item.quantity,
              },
            );
          }
          const productOrder = new ProdcutOrder();
          productOrder.price = item.price;
          productOrder.quantity = item.quantity;
          productOrder.total = Number(item.price) * Number(item.quantity);
          productOrder.order = orderInsert;
          productOrder.product = product;

          arrayProductOrder.push(productOrder);
        }

        await transactionManager.insert(ProdcutOrder, arrayProductOrder);
      },
    );

    return handleSuccessRequest({});
  }

  async getOrder(skip = 0, take = 10) {
    const [result, total] = await this.orderRepo.findAndCount({
      take: take,
      skip: skip,
      relations: ['product_orders', 'user', 'product_orders.product'],
      order: { createdAt: 'DESC' }
    });
    return { data: result, total: total };
  }
}
