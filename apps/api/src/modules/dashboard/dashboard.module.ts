import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

/**
 * M07 scope: module stub only — registered in AppModule, no business
 * logic yet. Composite dashboard query (implemented in M13)
 */
@Module({
  imports: [PrismaModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
