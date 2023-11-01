import { PaymentService } from './payment.service';
import { Package } from 'src/entitys/package.entity';
import { Body, Controller, Get, HttpStatus, Post, Req } from '@nestjs/common';
import ResponseEntityBuilder from 'src/models/response/common/ResponseEntityBuilder';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Get("/get-package")
  async getPackges() {
    const packages = await this.paymentService.getPackages();

    return ResponseEntityBuilder
      .getBuilder()
      .setCode(HttpStatus.OK)
      .setData(packages)
      .build()
  }

  @Post("/create-pakage")
  addPackges(@Body() packages) {
    const newPakage = this.paymentService.addPackges(packages);
    return ResponseEntityBuilder
      .getBuilder()
      .setCode(HttpStatus.OK)
      .setData(newPakage)
      .build()
  }

  @Post('/make-payment')
  async payment(@Req() request, @Body() pakage) {
    const { user } = request;
    const newPayment = await this.paymentService.payment(user, pakage);
    return ResponseEntityBuilder
      .getBuilder()
      .setCode(HttpStatus.OK)
      .setData(newPayment)
      .build()
  }
}
