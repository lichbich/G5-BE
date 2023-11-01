import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entitys/users.entity';
import { IPEntity } from 'src/entitys/ips.entity';
import { UserController } from './user.controller';
import { AbilityModule } from '../ability/ability.module';
import { CookieService } from 'src/service/cookie/cookie.service';
import { UserService } from 'src/modules/users-management/users.service';
import { MailModule } from '../_mailer/mail.module';

@Module({
  imports: [
    MailModule,
    AbilityModule,
    TypeOrmModule.forFeature([IPEntity, User])
  ],
  controllers: [UserController],
  providers: [UserService, CookieService],
  exports: [UserService],
})
export class UserModule { }
