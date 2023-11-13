import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './_guards/jwt-auth.guard';
import { AppRoutingModule } from './app-routing.module';
import { MySqlProviders } from 'src/config/databaseConfig';
import { AbilitiesGuard } from './_guards/abilitys.guard';
import { AbilityModule } from './ability/ability.module';
import { AuthModule } from './auth-management/auth.module';
import { ValidationFilter } from 'src/config/exceptionHandler/ValidationFilter';
import { GlobalHttpExceptionFilter } from 'src/config/exceptionHandler/GlobalHttpExceptionFilter';
import { CategoryModule } from './categories-management/category.module';
import { ProductModule } from './products-management/product.module';
import { OrderModule } from './order-management/order.module';
import { UserModule } from './user-mgmt/user.module';

@Module({
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: AbilitiesGuard },
    { provide: APP_FILTER, useClass: ValidationFilter },
    { provide: APP_FILTER, useClass: GlobalHttpExceptionFilter },
  ],
  imports: [
    ...MySqlProviders,
    // Route Config
    AppRoutingModule,
    // For author - For Authen
    AuthModule,
    AbilityModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    UserModule,
    // Modules

    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
