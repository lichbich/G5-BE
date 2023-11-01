import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entitys/users.entity';
import { IPEntity } from 'src/entitys/ips.entity';
import { AdInfoEntity } from 'src/entitys/adInfo.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReportsEntity } from '../../entitys/reports.entity';
import { FbAccountEntity } from 'src/entitys/fbAccount.entity';

export const MySqlProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      type: 'mysql',
      // logging: true,
      entities: [
        User,
        IPEntity,
        AdInfoEntity,
        ReportsEntity,
        FbAccountEntity
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
