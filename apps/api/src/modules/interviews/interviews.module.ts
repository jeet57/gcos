import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';

/**
 * M07 scope: module stub only — registered in AppModule, no business
 * logic yet. Question bank (implemented in M15)
 */
@Module({
  imports: [PrismaModule],
  controllers: [InterviewsController],
  providers: [InterviewsService],
  exports: [InterviewsService],
})
export class InterviewsModule {}
