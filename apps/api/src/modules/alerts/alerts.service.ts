import { Injectable } from '@nestjs/common';
import type { PipelineStage } from '@prisma/client';
import type { Alert } from '@gcos/types';

import { PrismaService } from '../../prisma/prisma.service';

/** Stages a follow-up overdue check should consider "still active". */
const ACTIVE_FOLLOWUP_STAGES: PipelineStage[] = [
  'applied',
  'screening',
  'tech_interview',
  'take_home',
  'final_interview',
];

/**
 * Owns overdue-follow-up alert detection (PRD v2 §8.5, TAD §9.2).
 *
 * M10 computed this inline inside DashboardService on every request.
 * M16 moves it here unchanged so it has a single owner: DashboardService
 * calls `getOverdueAlerts` on every GET /dashboard (live, per-request —
 * the query is a single indexed lookup on `idx_apps_followup`, so no
 * caching is needed for correctness), and the M16 daily @Cron job also
 * calls it per-user purely for logging/observability, independent of
 * whether the user opens the dashboard that day.
 */
@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverdueAlerts(userId: string, now: Date = new Date()): Promise<Alert[]> {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const overdue = await this.prisma.jobApplication.findMany({
      where: {
        userId,
        stage: { in: ACTIVE_FOLLOWUP_STAGES },
        followUpDate: { lt: today, not: null },
      },
      include: { company: { select: { name: true } } },
    });

    const msPerDay = 24 * 60 * 60 * 1000;

    return overdue.map((app: { id: string; followUpDate: Date | null; company: { name: string } }) => ({
      type: 'follow_up_overdue' as const,
      applicationId: app.id,
      company: app.company.name,
      daysOverdue: app.followUpDate
        ? Math.floor((today.getTime() - new Date(app.followUpDate).getTime()) / msPerDay)
        : 0,
    }));
  }
}
