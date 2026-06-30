import { Controller, Get } from '@nestjs/common';

import { GermanService } from './german.service';

/**
 * M07 scope: stub controller, registered globally behind JwtAuthGuard
 * (no @Public() here — every route in this module 401s until M08
 * provides real JWTs, per the M07 acceptance criteria). Real routes
 * are added when this module is implemented. Sessions, units, streak (implemented in M14)
 */
@Controller('german')
export class GermanController {
  constructor(private readonly germanService: GermanService) {}

  @Get()
  stub(): { module: string; status: string } {
    return this.germanService.stub();
  }
}
