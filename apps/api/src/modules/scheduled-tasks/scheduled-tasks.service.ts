import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '../../prisma/prisma.service';
import { ReadinessScoreService } from '../readiness-score/readiness-score.service';
import { AlertsService } from '../alerts/alerts.service';

/**
 * M16 scope (TAD §9.3, plan M16 "Scheduled Tasks"): daily background
 * job that keeps `readiness_scores` populated even for users who don't
 * open the dashboard that day, and logs overdue-follow-up counts for
 * observability.
 *
 * Runs at midnight server time (CronExpression.EVERY_DAY_AT_MIDNIGHT).
 * GCOS is currently single/few-user (per PRD scope), so a sequential
 * for-loop over all users is intentional — revisit with Promise.all
 * batching or a queue only if the user count grows enough to matter.
 *
 * `runScoreSnapshot` is also called directly by the internal trigger
 * endpoint (ScheduledTasksController) for manual verification, so the
 * cron handler and the manual trigger always run identical logic.
 */
@Injectable()
export class ScheduledTasksService {
  private readonly logger = new Logger(ScheduledTasksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly readinessScoreService: ReadinessScoreService,
    private readonly alertsService: AlertsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailySnapshot(): Promise<void> {
    await this.runScoreSnapshot();
  }

  /**
   * For every user: recompute + upsert today's readiness score
   * (ReadinessScoreService.calculate already upserts internally — see
   * writeSnapshot — so this is idempotent and safe to rerun same-day),
   * then log the overdue-follow-up alert count.
   */
  async runScoreSnapshot(): Promise<{ usersProcessed: number }> {
    const users = await this.prisma.user.findMany({ select: { id: true } });

    let usersProcessed = 0;
    for (const { id: userId } of users) {
      try {
        await this.readinessScoreService.calculate(userId);
        const alerts = await this.alertsService.getOverdueAlerts(userId);
        this.logger.log(
          `Snapshot complete for user ${userId} — ${alerts.length} overdue follow-up alert(s)`,
        );
        usersProcessed += 1;
      } catch (error) {
        // One user's failure (e.g. missing plan data) shouldn't stop the
        // rest of the batch from getting their snapshot.
        this.logger.error(`Snapshot failed for user ${userId}`, error instanceof Error ? error.stack : error);
      }
    }

    this.logger.log(`Daily score snapshot finished — ${usersProcessed}/${users.length} users processed`);
    return { usersProcessed };
  }
}
