import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

/**
 * M08 scope: JWT auth fully implemented — register, login, refresh
 * (with rotation), logout, me. JwtService is available here via the
 * globally-registered JwtModule (app.module.ts, M07); no local
 * JwtModule.register() needed.
 */
@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
