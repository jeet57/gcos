import { Controller, Get } from '@nestjs/common';

import { NetworkingService } from './networking.service';

/**
 * M07 scope: stub controller, registered globally behind JwtAuthGuard
 * (no @Public() here — every route in this module 401s until M08
 * provides real JWTs, per the M07 acceptance criteria). Real routes
 * are added when this module is implemented. Connections, coffee chats (implemented in M15)
 */
@Controller('networking')
export class NetworkingController {
  constructor(private readonly networkingService: NetworkingService) {}

  @Get()
  stub(): { module: string; status: string } {
    return this.networkingService.stub();
  }
}
