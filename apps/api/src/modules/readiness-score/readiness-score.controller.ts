import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { ReadinessScoreService } from './readiness-score.service';
import { ScoreBreakdownDto } from './dto/score-breakdown.dto';

/**
 * M09 scope: a single GET endpoint useful for manual verification of
 * the service in isolation. The composite /dashboard endpoint that
 * actually surfaces this in the UI is built in M10 (DashboardModule
 * imports ReadinessScoreModule, per TAD 3.4 — this module owns no
 * controller logic beyond this debug-friendly route).
 */
@ApiTags('readiness-score')
@Controller('readiness-score')
export class ReadinessScoreController {
  constructor(private readonly readinessScoreService: ReadinessScoreService) {}

  @Get()
  @ApiOkResponse({ type: ScoreBreakdownDto })
  async getScore(@CurrentUser() user: CurrentUserPayload): Promise<ScoreBreakdownDto> {
    return this.readinessScoreService.calculate(user.userId);
  }
}
