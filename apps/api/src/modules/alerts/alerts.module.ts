import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { AlertsService } from './alerts.service';

/**
 * M16 scope: extracted from DashboardModule/DashboardService's inline
 * alert computation (flagged in M10). Standalone module, owns no
 * tables — exported so DashboardModule and ScheduledTasksModule can
 * both inject AlertsService directly.
 */
@Module({
  imports: [PrismaModule],
  providers: [AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}
