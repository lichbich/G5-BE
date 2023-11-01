import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from 'src/entitys/package.entity';
import { Payment } from 'src/entitys/payment.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Package) private packageRepo: Repository<Package>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_TOKEN'), { apiVersion: '2023-10-16' });
  }

  async payment(user, { payment, packageId }) {
    const paymentPackage = await this.packageRepo.findOneBy({ id: packageId });
    const customer = await this.stripe.customers.create({ email: payment.email, source: payment.id });

    const result = await this.stripe.charges.create({
      currency: 'usd',
      description: 'test',
      customer: customer.id,
      amount: paymentPackage.price * 100,
      receipt_email: payment.email,
    });

    const newPayment = new Payment();
    newPayment.user = user;
    newPayment.packageId = packageId;
    newPayment.status = result.status;
    return this.paymentRepo.save(newPayment);
  }

  async getPackages() {
    return this.packageRepo.find({ order: { price: "ASC" } });
  }

  async addPackges(packages: Package) {
    return this.packageRepo.save(packages);
  }
}
