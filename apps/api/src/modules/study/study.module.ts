import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { ReadinessScoreModule } from '../readiness-score/readiness-score.module';
import { StudyController } from './study.controller';
import { StudyService } from './study.service';

/**
 * M11: implemented module — session logging, domain progress, plan
 * view. Imports ReadinessScoreModule so session/week mutations can
 * trigger a score recalculation (TAD §3.4).
 */
@Module({
  imports: [PrismaModule, ReadinessScoreModule],
  controllers: [StudyController],
  providers: [StudyService],
  exports: [StudyService],
})
export class StudyModule {}
