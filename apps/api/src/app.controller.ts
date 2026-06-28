import { Controller, Get } from '@nestjs/common';

/**
 * Health check endpoint, available from M01 onward so CI and
 * deployment platforms (Railway, M24) have something to poll
 * immediately. Response shape is plain here — the {data, meta, error}
 * envelope from ResponseTransformInterceptor is introduced in M07.
 */
@Controller('health')
export class AppController {
  @Get()
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
