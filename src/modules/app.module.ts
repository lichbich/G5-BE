import { Module } from '@nestjs/common';
import { JobModule } from './job/job.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './_guards/jwt-auth.guard';
import { AppRoutingModule } from './app-routing.module';
import { MySqlProviders } from 'src/config/databaseConfig';
import { AbilitiesGuard } from './_guards/abilitys.guard';
import { AuthModule } from './auth-management/auth.module';
import { UserModule } from './users-management/user.module';
import { AdinfoModule } from './adinfo-management/adinfo.module';
import { MemberModule } from './members-management/member.module';
import { CookieModule } from './cookies-management/cookies.module';
import { ValidationFilter } from 'src/config/exceptionHandler/ValidationFilter';
import { GlobalHttpExceptionFilter } from 'src/config/exceptionHandler/GlobalHttpExceptionFilter';
import { AbilityModule } from './ability/ability.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: AbilitiesGuard },
    { provide: APP_FILTER, useClass: ValidationFilter },
    { provide: APP_FILTER, useClass: GlobalHttpExceptionFilter },
  ],
  imports: [
    ...MySqlProviders,
    JobModule,
    UserModule,
    AuthModule,
    AdinfoModule,
    CookieModule,
    MemberModule,
    AbilityModule,
    PaymentModule,
    AppRoutingModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true
    }),
  ],
})
export class AppModule { }
