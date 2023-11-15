import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { Public } from '../_guards/jwt-auth.guard';
import { CreateOrderDto } from '../auth-management/dtos/createOrder.dto';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Public()
  @Get()
  async getOrder(@Query() query) {
    return this.orderService.getOrder(
      Number(query.page || 0) * Number(query.size || 0),
      Number(query.size || 10),
    );
  }

  @Public()
  @Post()
  async createOrder(@Body() order: CreateOrderDto) {
    return this.orderService.createOrder(order);
  }

  @Public()
  @Get('/approve/:id')
  async approveOrder(@Param('id') id) {
    return this.orderService.approveOrder(id);
  }

  @Public()
  @Get('/cancel/:id')
  async cancelOrder(@Param('id') id) {
    return this.orderService.cancelOrder(id);
  }

  @Public()
  @Get('/shipping/:id')
  async shippingOrder(@Param('id') id) {
    return this.orderService.shippingOrder(id);
  }

  @Public()
  @Get('/complete/:id')
  async completeOrder(@Param('id') id) {
    return this.orderService.completeOrder(id);
  }
}
