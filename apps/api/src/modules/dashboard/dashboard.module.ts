import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { ReadinessScoreModule } from '../readiness-score/readiness-score.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

/**
 * M10: imports ReadinessScoreModule (M09) rather than duplicating score
 * calculation. CacheModule.register (not forRoot — this is the only
 * module using it so far) gives DashboardController its 30s in-memory
 * TTL cache.
 */
@Module({
  imports: [PrismaModule, ReadinessScoreModule, CacheModule.register()],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
