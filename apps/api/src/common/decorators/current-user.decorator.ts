import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * The shape JwtAuthGuard attaches to `request.user` after verifying the
 * access token (TAD §6.2: access JWT contains userId + email).
 */
export interface CurrentUserPayload {
  userId: string;
  email: string;
}

/**
 * Extracts the authenticated user from the request, populated by
 * JwtAuthGuard. Usage: `getDashboard(@CurrentUser() user: CurrentUserPayload)`.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
