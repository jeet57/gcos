import { Controller, Get } from '@nestjs/common';

import { DashboardService } from './dashboard.service';

/**
 * M07 scope: stub controller, registered globally behind JwtAuthGuard
 * (no @Public() here — every route in this module 401s until M08
 * provides real JWTs, per the M07 acceptance criteria). Real routes
 * are added when this module is implemented. Composite dashboard query (implemented in M13)
 */
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  stub(): { module: string; status: string } {
    return this.dashboardService.stub();
  }
}
