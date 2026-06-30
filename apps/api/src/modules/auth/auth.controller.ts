import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

import type { AuthUserDto } from '@gcos/types';

import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, type CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { AuthService, REFRESH_COOKIE_MAX_AGE_MS, REFRESH_COOKIE_NAME, type AuthResult } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

/**
 * M08 scope: all 5 auth routes from the Implementation Plan.
 *
 * register/login/refresh are @Public() — refresh in particular must be,
 * since by the time a client needs to refresh, its access token has
 * likely already expired, so it can never carry a valid Bearer header.
 * logout/me rely on the globally-applied JwtAuthGuard (M07) and use
 * @CurrentUser() to identify the caller.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.register(dto);
    this.setRefreshCookie(res, result.refreshToken);
    return { accessToken: result.accessToken, user: result.user };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.login(dto);
    this.setRefreshCookie(res, result.refreshToken);
    return { accessToken: result.accessToken, user: result.user };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<{ accessToken: string }> {
    const cookie = req.cookies?.[REFRESH_COOKIE_NAME];
    const result: AuthResult = await this.authService.refresh(cookie);
    this.setRefreshCookie(res, result.refreshToken);
    return { accessToken: result.accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrentUser() user: CurrentUserPayload,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    await this.authService.logout(user.userId);
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/' });
  }

  @Get('me')
  async me(@CurrentUser() user: CurrentUserPayload): Promise<AuthUserDto> {
    return this.authService.me(user.userId);
  }

  private setRefreshCookie(res: FastifyReply, refreshToken: string): void {
    res.setCookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: REFRESH_COOKIE_MAX_AGE_MS / 1000,
    });
  }
}
