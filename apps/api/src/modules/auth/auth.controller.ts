import { Controller, Get } from '@nestjs/common';

import { AuthService } from './auth.service';

/**
 * M07 scope: stub controller, registered globally behind JwtAuthGuard
 * (no @Public() here — every route in this module 401s until M08
 * provides real JWTs, per the M07 acceptance criteria). Real routes
 * are added when this module is implemented. JWT auth: login, register, refresh (implemented in M08)
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  stub(): { module: string; status: string } {
    return this.authService.stub();
  }
}
