import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Opts a route out of the globally-applied JwtAuthGuard (TAD §3.5).
 * Usage: `@Public() @Get('health') getHealth() { ... }`
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
