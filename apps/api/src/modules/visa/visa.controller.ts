import { Controller, Get } from '@nestjs/common';

import { VisaService } from './visa.service';

/**
 * M07 scope: stub controller, registered globally behind JwtAuthGuard
 * (no @Public() here — every route in this module 401s until M08
 * provides real JWTs, per the M07 acceptance criteria). Real routes
 * are added when this module is implemented. Document checklist (implemented in M15)
 */
@Controller('visa')
export class VisaController {
  constructor(private readonly visaService: VisaService) {}

  @Get()
  stub(): { module: string; status: string } {
    return this.visaService.stub();
  }
}
