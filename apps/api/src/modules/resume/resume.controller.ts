import { Controller, Get } from '@nestjs/common';

import { ResumeService } from './resume.service';

/**
 * M07 scope: stub controller, registered globally behind JwtAuthGuard
 * (no @Public() here — every route in this module 401s until M08
 * provides real JWTs, per the M07 acceptance criteria). Real routes
 * are added when this module is implemented. Versions, certifications (implemented in M15)
 */
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get()
  stub(): { module: string; status: string } {
    return this.resumeService.stub();
  }
}
