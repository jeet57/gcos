import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

/**
 * M07 scope: module stub only — registered in AppModule, no business
 * logic yet. JWT auth: login, register, refresh (implemented in M08)
 */
@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
