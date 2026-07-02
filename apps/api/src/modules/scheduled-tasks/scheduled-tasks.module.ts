import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { ReadinessScoreModule } from '../readiness-score/readiness-score.module';
import { AlertsModule } from '../alerts/alerts.module';
import { ScheduledTasksController } from './scheduled-tasks.controller';
import { ScheduledTasksService } from './scheduled-tasks.service';

/**
 * M16 scope. Depends on ReadinessScoreModule (M09) and AlertsModule
 * (M16) rather than duplicating either's logic. ScheduleModule.forRoot()
 * itself is registered once, globally, in AppModule — not here — since
 * it's a cross-cutting Nest feature, not owned by this module.
 */
@Module({
  imports: [PrismaModule, ReadinessScoreModule, AlertsModule],
  controllers: [ScheduledTasksController],
  providers: [ScheduledTasksService],
})
export class ScheduledTasksModule {}
