import { Controller, Get } from '@nestjs/common';

import { AcademyService } from './academy.service';

/**
 * M07 scope: stub controller, registered globally behind JwtAuthGuard
 * (no @Public() here — every route in this module 401s until M08
 * provides real JWTs, per the M07 acceptance criteria). Real routes
 * are added when this module is implemented. Lessons, quiz, progress (implemented in M11)
 */
@Controller('academy')
export class AcademyController {
  constructor(private readonly academyService: AcademyService) {}

  @Get()
  stub(): { module: string; status: string } {
    return this.academyService.stub();
  }
}
