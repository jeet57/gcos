import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { ReadinessScoreController } from './readiness-score.controller';
import { ReadinessScoreService } from './readiness-score.service';

/**
 * M09 scope: real 7-dimension calculation implemented. Standalone
 * module per TAD 3.4 — owns no database tables, exported so
 * DashboardModule (M10) can inject ReadinessScoreService directly.
 */
@Module({
  imports: [PrismaModule],
  controllers: [ReadinessScoreController],
  providers: [ReadinessScoreService],
  exports: [ReadinessScoreService],
})
export class ReadinessScoreModule {}
