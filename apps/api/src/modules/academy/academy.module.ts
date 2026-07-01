import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { ReadinessScoreModule } from '../readiness-score/readiness-score.module';
import { AcademyController } from './academy.controller';
import { AcademyService } from './academy.service';

/**
 * M12: implemented module — lessons, quiz engine, progress tracking.
 * Imports ReadinessScoreModule so lesson completion and quiz
 * submission can trigger score recalculation (TAD §3.4).
 */
@Module({
  imports: [PrismaModule, ReadinessScoreModule],
  controllers: [AcademyController],
  providers: [AcademyService],
  exports: [AcademyService],
})
export class AcademyModule {}
