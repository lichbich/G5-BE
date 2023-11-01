import { Controller, Get } from '@nestjs/common';
import { CookieManagementJobService } from '../../service/jobs/CookieManagementJob.service';

@Controller()
export class jobController {
  constructor(
    private readonly cookieManagementJobService: CookieManagementJobService,
  ) {}

  @Get()
  async runJob() {
    return this.cookieManagementJobService.CheckActiveAccount();
  }
}
