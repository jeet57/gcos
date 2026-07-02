import { Controller, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator';
import { ScheduledTasksService } from './scheduled-tasks.service';

/**
 * Dev-only manual trigger for the M16 cron logic (plan M16 acceptance
 * criteria — verify snapshot behavior without waiting for midnight).
 *
 * ⚠ RISK (flagged in plan M16 notes, carried into INSTRUCTIONS.md):
 * this route is @Public() — no auth — so it MUST be removed or placed
 * behind an internal-only guard (e.g. a shared-secret header check, or
 * simply excluded from the production build) before deploying past
 * local dev. Left open here only for local manual verification.
 */
@ApiExcludeController()
@Controller('internal')
export class ScheduledTasksController {
  constructor(private readonly scheduledTasksService: ScheduledTasksService) {}

  @Public()
  @Post('trigger-score-snapshot')
  async triggerScoreSnapshot(): Promise<{ usersProcessed: number }> {
    return this.scheduledTasksService.runScoreSnapshot();
  }
}
