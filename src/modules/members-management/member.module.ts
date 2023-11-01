import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entitys/users.entity';
import { UserService } from 'src/modules/users-management/users.service';
import { MemberController } from './member.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [MemberController],
  providers: [UserService],
  exports: [UserService],
})
export class MemberModule {}
