import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { ReadinessScoreModule } from '../readiness-score/readiness-score.module';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';

/**
 * M14: implemented module — project fields + milestone status
 * tracking. Imports ReadinessScoreModule so milestone completion
 * triggers a score recalculation (TAD §3.4 portfolio dimension).
 */
@Module({
  imports: [PrismaModule, ReadinessScoreModule],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
