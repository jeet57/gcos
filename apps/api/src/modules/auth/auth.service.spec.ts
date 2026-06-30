import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { AuthService } from './auth.service';

process.env.JWT_SECRET = 'test-access-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

function buildPrismaMock() {
  return {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  };
}

function buildJwtServiceMock() {
  return {
    signAsync: vi.fn(),
    verifyAsync: vi.fn(),
  };
}

describe('AuthService', () => {
  let prisma: ReturnType<typeof buildPrismaMock>;
  let jwt: ReturnType<typeof buildJwtServiceMock>;
  let service: AuthService;

  beforeEach(() => {
    prisma = buildPrismaMock();
    jwt = buildJwtServiceMock();
    jwt.signAsync.mockImplementation(async (payload: Record<string, unknown>) =>
      `signed.${JSON.stringify(payload)}`,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new AuthService(prisma as any, jwt as any);
  });

  describe('register', () => {
    it('creates a new user and returns tokens when the email is free', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'new@gcos.app',
        name: 'New User',
      });
      prisma.user.update.mockResolvedValue({});

      const result = await service.register({ email: 'new@gcos.app', password: 'password123' });

      expect(prisma.user.create).toHaveBeenCalledOnce();
      expect(result.user).toEqual({ id: 'user-1', email: 'new@gcos.app', name: 'New User' });
      expect(result.accessToken).toContain('signed.');
      expect(result.refreshToken).toContain('signed.');
      // refreshTokenHash gets stored
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { refreshTokenHash: expect.any(String) },
      });
    });

    it('throws ConflictException when the email is already registered', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(
        service.register({ email: 'taken@gcos.app', password: 'password123' }),
      ).rejects.toThrow(ConflictException);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('returns tokens when credentials are valid', async () => {
      const passwordHash = await bcrypt.hash('correct-password', 4);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'jitendra@gcos.app',
        name: 'Jitendra',
        passwordHash,
      });
      prisma.user.update.mockResolvedValue({});

      const result = await service.login({ email: 'jitendra@gcos.app', password: 'correct-password' });

      expect(result.accessToken).toContain('signed.');
      expect(result.user.email).toBe('jitendra@gcos.app');
    });

    it('throws UnauthorizedException for an unknown email', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'ghost@gcos.app', password: 'whatever123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for a wrong password', async () => {
      const passwordHash = await bcrypt.hash('correct-password', 4);
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'jitendra@gcos.app',
        name: 'Jitendra',
        passwordHash,
      });

      await expect(
        service.login({ email: 'jitendra@gcos.app', password: 'wrong-password' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('rotates the token when the cookie is valid and matches the stored hash', async () => {
      const tokenId = 'token-abc';
      const tokenHash = await bcrypt.hash(tokenId, 4);
      jwt.verifyAsync.mockResolvedValue({ tokenId, userId: 'user-1' });
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'jitendra@gcos.app',
        name: 'Jitendra',
        refreshTokenHash: tokenHash,
      });
      prisma.user.update.mockResolvedValue({});

      const result = await service.refresh('some.refresh.jwt');

      expect(result.accessToken).toContain('signed.');
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('throws UnauthorizedException when no cookie is present', async () => {
      await expect(service.refresh(undefined)).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when the stored hash has been cleared (revoked/logged out)', async () => {
      jwt.verifyAsync.mockResolvedValue({ tokenId: 'token-abc', userId: 'user-1' });
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'jitendra@gcos.app',
        name: 'Jitendra',
        refreshTokenHash: null,
      });

      await expect(service.refresh('some.refresh.jwt')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when JWT verification fails', async () => {
      jwt.verifyAsync.mockRejectedValue(new Error('bad signature'));

      await expect(service.refresh('tampered.jwt')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('clears the stored refresh token hash', async () => {
      prisma.user.update.mockResolvedValue({});

      await service.logout('user-1');

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { refreshTokenHash: null },
      });
    });
  });
});
