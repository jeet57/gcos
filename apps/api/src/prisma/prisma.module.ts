import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * @Global() — available everywhere without explicit import (TAD 5.2).
 * Registered in AppModule starting M07, once feature modules exist that
 * actually need to inject PrismaService.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
