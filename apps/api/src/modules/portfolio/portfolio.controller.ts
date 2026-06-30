import { Controller, Get } from '@nestjs/common';

import { PortfolioService } from './portfolio.service';

/**
 * M07 scope: stub controller, registered globally behind JwtAuthGuard
 * (no @Public() here — every route in this module 401s until M08
 * provides real JWTs, per the M07 acceptance criteria). Real routes
 * are added when this module is implemented. Projects, milestones (implemented in M15)
 */
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  stub(): { module: string; status: string } {
    return this.portfolioService.stub();
  }
}
