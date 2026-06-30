import { Controller, Get } from '@nestjs/common';

import { AiToolsService } from './ai-tools.service';

/**
 * M07 scope: stub controller, registered globally behind JwtAuthGuard
 * (no @Public() here — every route in this module 401s until M08
 * provides real JWTs, per the M07 acceptance criteria). Real routes
 * are added when this module is implemented. Tool sessions log (implemented in M15)
 */
@Controller('ai-tools')
export class AiToolsController {
  constructor(private readonly aiToolsService: AiToolsService) {}

  @Get()
  stub(): { module: string; status: string } {
    return this.aiToolsService.stub();
  }
}
