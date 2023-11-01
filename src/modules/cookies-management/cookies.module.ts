import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IPEntity } from 'src/entitys/ips.entity';
import { User } from 'src/entitys/users.entity';
import { CookieController } from './cookies.controller';
import { CookieService } from 'src/service/cookie/cookie.service';

@Module({
  imports: [TypeOrmModule.forFeature([IPEntity, User])],
  controllers: [CookieController],
  providers: [CookieService],
})
export class CookieModule {}
