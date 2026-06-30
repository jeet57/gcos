import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { ReadinessScoreController } from './readiness-score.controller';
import { ReadinessScoreService } from './readiness-score.service';

/**
 * M07 scope: module stub only — registered in AppModule, no business
 * logic yet. Score calculation service — core logic (implemented in M12)
 */
@Module({
  imports: [PrismaModule],
  controllers: [ReadinessScoreController],
  providers: [ReadinessScoreService],
  exports: [ReadinessScoreService],
})
export class ReadinessScoreModule {}
