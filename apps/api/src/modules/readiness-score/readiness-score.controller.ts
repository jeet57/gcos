import { Controller, Get } from '@nestjs/common';

import { ReadinessScoreService } from './readiness-score.service';

/**
 * M07 scope: stub controller, registered globally behind JwtAuthGuard
 * (no @Public() here — every route in this module 401s until M08
 * provides real JWTs, per the M07 acceptance criteria). Real routes
 * are added when this module is implemented. Score calculation service — core logic (implemented in M12)
 */
@Controller('readiness-score')
export class ReadinessScoreController {
  constructor(private readonly readinessScoreService: ReadinessScoreService) {}

  @Get()
  stub(): { module: string; status: string } {
    return this.readinessScoreService.stub();
  }
}
