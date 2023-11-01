import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { jobController } from './job.controller';
import { CookieManagementJobService } from '../../service/jobs/CookieManagementJob.service';
import { IPEntity } from '../../entitys/ips.entity';
import { User } from '../../entitys/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsEntity } from 'src/entitys/reports.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([IPEntity, User, ReportsEntity]),
    ScheduleModule.forRoot(),
  ],
  controllers: [jobController],
  providers: [CookieManagementJobService],
})
export class JobModule {}
