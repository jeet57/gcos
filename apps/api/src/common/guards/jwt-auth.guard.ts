import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import type { CurrentUserPayload } from '../decorators/current-user.decorator';

/**
 * Protects all routes by default (TAD §3.5). @Public() opts a route out.
 *
 * M07 scope: the guard verifies tokens directly via JwtService against
 * JWT_SECRET, rather than going through a registered Passport strategy —
 * JwtStrategy/RefreshStrategy are introduced in M08 alongside AuthService,
 * which is what will actually issue tokens. Until then, every non-public
 * route legitimately 401s (no tokens exist yet), and this guard needs no
 * changes once M08 lands — same JwtService, same secret, same payload
 * shape (userId, email).
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException('JWT_SECRET is not configured');
    }

    try {
      const payload = await this.jwtService.verifyAsync<CurrentUserPayload>(token, { secret });
      request.user = { userId: payload.userId, email: payload.email };
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    return true;
  }

  private extractTokenFromHeader(request: { headers: Record<string, string | string[] | undefined> }): string | undefined {
    const authHeader = request.headers['authorization'];
    const value = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    const [type, token] = value?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
