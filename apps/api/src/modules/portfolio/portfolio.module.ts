import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';

/**
 * M07 scope: module stub only — registered in AppModule, no business
 * logic yet. Projects, milestones (implemented in M15)
 */
@Module({
  imports: [PrismaModule],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
