import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Package } from '../../entitys/package.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../../entitys/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Package, Payment])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
