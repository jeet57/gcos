import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { ReadinessScoreModule } from '../readiness-score/readiness-score.module';
import { GermanController } from './german.controller';
import { GermanService } from './german.service';

/**
 * M15: implemented module — sessions, DW units, vocabulary, stats.
 * Imports ReadinessScoreModule so session creation triggers a score
 * recalculation (TAD §3.4 german dimension).
 */
@Module({
  imports: [PrismaModule, ReadinessScoreModule],
  controllers: [GermanController],
  providers: [GermanService],
  exports: [GermanService],
})
export class GermanModule {}
