import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { Public } from '../_guards/jwt-auth.guard';
import { CreateOrderDto } from '../auth-management/dtos/createOrder.dto';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Public()
  @Post()
  async createOrder(@Body() order: CreateOrderDto) {
    // const categoryDto = new CreateCategoryDto();
    // categoryDto.catName = category.catName;
    // categoryDto.catDescription = category.catDescription;
    // categoryDto.isActive = category.isActive;
    //
    return this.orderService.createOrder(order);
  }
}
