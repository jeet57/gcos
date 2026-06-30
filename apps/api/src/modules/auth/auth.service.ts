import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

import type { AuthUserDto } from '@gcos/types';

import { PrismaService } from '../../prisma/prisma.service';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';

const BCRYPT_SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
export const REFRESH_COOKIE_NAME = 'refreshToken';
export const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

interface RefreshTokenPayload {
  tokenId: string;
  userId: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUserDto;
}

/**
 * JWT + refresh token rotation (TAD §6.1-6.2).
 *
 * Access JWT: 15min, {userId, email}, verified by JwtAuthGuard (M07) -
 * same JwtService/secret, no changes needed there.
 *
 * Refresh token: itself a signed JWT (7d, {tokenId, userId}) using
 * JWT_REFRESH_SECRET, carried only as an HttpOnly cookie. The DB stores
 * a bcrypt hash of `tokenId` only (not the whole JWT) - the JWT
 * signature proves authenticity/expiry/userId binding, while the DB
 * hash gives server-side revocation (logout) and rotation (the old
 * tokenId stops matching the moment a new one is issued, so a stolen-
 * and-reused refresh token is caught on its next use).
 *
 * No Passport - this mirrors the manual-verification pattern already
 * used by JwtAuthGuard (M07) instead of introducing strategies for a
 * single route.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);
    const now = new Date();
    const oneYearOut = new Date(now);
    oneYearOut.setFullYear(oneYearOut.getFullYear() + 1);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        planStartDate: now,
        targetEndDate: oneYearOut,
      },
    });

    return this.issueTokens(user.id, user.email, user.name);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.issueTokens(user.id, user.email, user.name);
  }

  async refresh(refreshCookie: string | undefined): Promise<AuthResult> {
    if (!refreshCookie) {
      throw new UnauthorizedException('Missing refresh token.');
    }

    const refreshSecret = this.requireSecret('JWT_REFRESH_SECRET');

    let payload: RefreshTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshCookie, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token has been revoked.');
    }

    const tokenMatches = await bcrypt.compare(payload.tokenId, user.refreshTokenHash);
    if (!tokenMatches) {
      throw new UnauthorizedException('Refresh token has been revoked.');
    }

    // Rotation: issuing a fresh tokenId immediately invalidates this one.
    return this.issueTokens(user.id, user.email, user.name);
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }

  async me(userId: string): Promise<AuthUserDto> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return { id: user.id, email: user.email, name: user.name };
  }

  private async issueTokens(userId: string, email: string, name: string): Promise<AuthResult> {
    const accessSecret = this.requireSecret('JWT_SECRET');
    const refreshSecret = this.requireSecret('JWT_REFRESH_SECRET');

    const accessToken = await this.jwtService.signAsync(
      { userId, email },
      { secret: accessSecret, expiresIn: ACCESS_TOKEN_EXPIRY },
    );

    const tokenId = randomUUID();
    const refreshToken = await this.jwtService.signAsync(
      { tokenId, userId },
      { secret: refreshSecret, expiresIn: REFRESH_TOKEN_EXPIRY },
    );

    const refreshTokenHash = await bcrypt.hash(tokenId, BCRYPT_SALT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });

    return { accessToken, refreshToken, user: { id: userId, email, name } };
  }

  private requireSecret(envVar: 'JWT_SECRET' | 'JWT_REFRESH_SECRET'): string {
    const value = process.env[envVar];
    if (!value) {
      throw new Error(`${envVar} is not configured.`);
    }
    return value;
  }
}
