import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';

/**
 * M15: implemented module — question bank, interview logs, mock
 * interviews. Does not import ReadinessScoreModule because the
 * interviewScore dimension reads question confident% directly at
 * snapshot time — updating question status is enough to affect
 * the next score calculation without an explicit recalc trigger here.
 */
@Module({
  imports: [PrismaModule],
  controllers: [InterviewsController],
  providers: [InterviewsService],
  exports: [InterviewsService],
})
export class InterviewsModule {}
