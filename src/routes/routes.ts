import { Routes } from '@nestjs/core';
import { AuthModule } from 'src/modules/auth-management/auth.module';
import { CategoryModule } from '../modules/categories-management/category.module';
import { ProductModule } from '../modules/products-management/product.module';
import { OrderModule } from '../modules/order-management/order.module';

export const ADMIN_ROUTES: Routes = [
  { path: 'auth', module: AuthModule },
  { path: 'category', module: CategoryModule },
  { path: 'product', module: ProductModule },
  { path: 'order', module: OrderModule },
];
