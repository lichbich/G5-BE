import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../entitys/order';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { User } from '../../entitys/users.entity';
import { Product } from '../../entitys/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Product])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
