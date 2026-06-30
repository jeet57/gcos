import { Controller, Get } from '@nestjs/common';

import { Public } from './common/decorators/public.decorator';

/**
 * Health check endpoint, available from M01 onward so CI and
 * deployment platforms (Railway, M24) have something to poll
 * immediately. @Public() opts it out of the globally-applied
 * JwtAuthGuard (M07) — every other route 401s by default.
 * Response shape is plain here; ResponseTransformInterceptor (M07)
 * wraps it in {data} automatically.
 */
@Controller('health')
export class AppController {
  @Public()
  @Get()
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
