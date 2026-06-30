import { Controller, Get } from '@nestjs/common';

import { InterviewsService } from './interviews.service';

/**
 * M07 scope: stub controller, registered globally behind JwtAuthGuard
 * (no @Public() here — every route in this module 401s until M08
 * provides real JWTs, per the M07 acceptance criteria). Real routes
 * are added when this module is implemented. Question bank (implemented in M15)
 */
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Get()
  stub(): { module: string; status: string } {
    return this.interviewsService.stub();
  }
}
