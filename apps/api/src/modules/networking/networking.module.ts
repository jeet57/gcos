import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { NetworkingController } from './networking.controller';
import { NetworkingService } from './networking.service';

/**
 * M15: implemented module — connections, coffee chats, LinkedIn posts,
 * stats. No ReadinessScoreModule import — networking data is not one
 * of the 7 scored dimensions (PRD v2 §1.4); it surfaces only in the
 * dashboard weekly-progress view.
 */
@Module({
  imports: [PrismaModule],
  controllers: [NetworkingController],
  providers: [NetworkingService],
  exports: [NetworkingService],
})
export class NetworkingModule {}
