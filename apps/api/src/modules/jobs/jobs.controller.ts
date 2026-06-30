import { Controller, Get } from '@nestjs/common';

import { JobsService } from './jobs.service';

/**
 * M07 scope: stub controller, registered globally behind JwtAuthGuard
 * (no @Public() here — every route in this module 401s until M08
 * provides real JWTs, per the M07 acceptance criteria). Real routes
 * are added when this module is implemented. Applications, companies, pipeline (implemented in M09-M10)
 */
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  stub(): { module: string; status: string } {
    return this.jobsService.stub();
  }
}
