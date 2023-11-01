import { Routes } from '@nestjs/core';
import { AuthModule } from 'src/modules/auth-management/auth.module';

export const ADMIN_ROUTES: Routes = [
  { path: 'auth', module: AuthModule },
];
