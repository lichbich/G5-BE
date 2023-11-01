import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entitys/users.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Product } from 'src/entitys/products.entity';
import { Category } from 'src/entitys/categories.entity';
import { Order } from 'src/entitys/order';
import { ProdcutOrder } from 'src/entitys/product_order';

export const MySqlProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      type: 'mysql',
      // logging: true,
      entities: [
        User,
        Order,
        Product,
        Category,
        ProdcutOrder
      ],
      // dropSchema: true,
      synchronize: true,
      autoLoadEntities: true,
      host: configService.get<string>('DATABASE_HOST'),
      port: configService.get<number>('DATABASE_PORT'),
      username: configService.get<string>('DATABASE_USER_NAME'),
      password: configService.get<string>('DATABASE_PASSWORD'),
      database: configService.get<string>('DATABASE_NAME'),
    }),
    inject: [ConfigService],
  }),
];
