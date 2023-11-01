import { Routes } from '@nestjs/core';
import { JobModule } from 'src/modules/job/job.module';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { AuthModule } from 'src/modules/auth-management/auth.module';
import { UserModule } from 'src/modules/users-management/user.module';
import { AdinfoModule } from 'src/modules/adinfo-management/adinfo.module';
import { MemberModule } from 'src/modules/members-management/member.module';
import { CookieModule } from 'src/modules/cookies-management/cookies.module';

export const ADMIN_ROUTES: Routes = [
  { path: 'job', module: JobModule },
  { path: 'auth', module: AuthModule },
  { path: 'user', module: UserModule },
  { path: 'adinfo', module: AdinfoModule },
  { path: 'member', module: MemberModule },
  { path: 'cookie', module: CookieModule },
  { path: 'payment', module: PaymentModule },
];
