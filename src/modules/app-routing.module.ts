import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ADMIN_ROUTES } from 'src/routes/routes';

const ROUTES = [...ADMIN_ROUTES];

@Module({
  imports: [RouterModule.register(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
