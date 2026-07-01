import { Injectable } from '@nestjs/common';
import type { ContentTier, LessonStatus, PipelineStage } from '@prisma/client';
import type { Alert, DashboardResponse, StreakSummary, TodayCard, WeeklyProgress } from '@gcos/types';

import { PrismaService } from '../../prisma/prisma.service';
import { ReadinessScoreService } from '../readiness-score/readiness-score.service';
import {
  currentPlanMonthNumber,
  currentPlanWeekNumber,
  startOfWeek,
  startOfNextWeek,
} from '../../common/utils/plan-date.util';

/** Stages a follow-up overdue check should consider "still active". */
const ACTIVE_FOLLOWUP_STAGES: PipelineStage[] = [
  'applied',
  'screening',
  'tech_interview',
  'take_home',
  'final_interview',
];

/**
 * Orchestrates the composite GET /api/v1/dashboard response (TAD §6,
 * PRD v2 §8.5 Morning Check-In). Sections are queried in parallel via
 * Promise.all so the slowest section — not the sum of all sections —
 * determines response time, per the M10 <200ms target.
 *
 * Alerts (overdue follow-ups) are computed inline here for now. M16
 * introduces a dedicated AlertsService + @Cron job that runs this same
 * check on a schedule and caches it; when that lands, this method
 * should be replaced with a read from that service rather than
 * recomputing on every request. Flagged here rather than blocking M10
 * on M16.
 */
@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly readinessScoreService: ReadinessScoreService,
  ) {}

  async getDashboard(userId: string): Promise<DashboardResponse> {
    const now = new Date();
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const [score, todayCard, weeklyProgress, streaks, alerts] = await Promise.all([
      this.readinessScoreService.calculate(userId),
      this.getTodayCard(userId, user.planStartDate, user.weeklyApplicationTarget, now),
      this.getWeeklyProgress(
        userId,
        now,
        Number(user.weeklyStudyTargetHours),
        user.weeklyApplicationTarget,
        user.weeklyGermanMinutesTarget,
      ),
      this.getStreaks(userId, now),
      this.getAlerts(userId, now),
    ]);

    return { score, todayCard, weeklyProgress, streaks, alerts };
  }

  // ---------------------------------------------------------------------
  // Today Card
  // ---------------------------------------------------------------------

  private async getTodayCard(
    userId: string,
    planStartDate: Date,
    weeklyApplicationTarget: number,
    now: Date,
  ): Promise<TodayCard> {
    const monthNumber = currentPlanMonthNumber(planStartDate, now);
    const weekNumber = currentPlanWeekNumber(planStartDate, now);

    const [planMonth, nextLesson] = await Promise.all([
      this.prisma.planMonth.findUnique({ where: { monthNumber } }),
      this.getNextLesson(userId),
    ]);

    // PlanWeek is keyed by (monthId, weekNumber), not monthNumber directly.
    const planWeek = planMonth
      ? await this.prisma.planWeek.findUnique({
          where: { monthId_weekNumber: { monthId: planMonth.id, weekNumber } },
        })
      : null;

    let studyTask: TodayCard['studyTask'] = null;
    const [firstDomainId] = planWeek?.domainIds ?? [];
    if (planMonth && planWeek && firstDomainId !== undefined) {
      const domain = await this.prisma.studyDomain.findUnique({ where: { id: firstDomainId } });
      if (domain) {
        const dailyTargetMinutes = Math.round((Number(planMonth.hoursPerWeek) * 60) / 7);
        studyTask = { domainName: domain.name, targetMinutes: dailyTargetMinutes };
      }
    }

    const academyLesson: TodayCard['academyLesson'] = nextLesson
      ? {
          lessonCode: nextLesson.lessonCode,
          title: nextLesson.title,
          moduleSlug: nextLesson.module.slug,
          estimatedMinutes: nextLesson.durationMinutes,
        }
      : null;

    const applicationTarget: TodayCard['applicationTarget'] = {
      count: Math.max(1, Math.ceil(weeklyApplicationTarget / 7)),
    };

    return { academyLesson, studyTask, applicationTarget };
  }

  private getNextLesson(userId: string) {
    const mvpTier: ContentTier = 'MVP' as ContentTier;
    const completedStatus: LessonStatus = 'completed' as LessonStatus;

    return this.prisma.userLessonProgress
      .findMany({ where: { userId, status: completedStatus }, select: { lessonId: true } })
      .then((completed: { lessonId: number }[]) => {
        const excludeIds = completed.map((p) => p.lessonId);
        return this.prisma.academyLesson.findFirst({
          where: {
            tier: mvpTier,
            ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}),
          },
          orderBy: [{ module: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
          include: { module: { select: { slug: true } } },
        });
      });
  }

  // ---------------------------------------------------------------------
  // Weekly Progress
  // ---------------------------------------------------------------------

  private async getWeeklyProgress(
    userId: string,
    now: Date,
    studyHoursTarget: number,
    applicationTarget: number,
    germanMinutesTarget: number,
  ): Promise<WeeklyProgress> {
    const weekStart = startOfWeek(now);
    const weekEnd = startOfNextWeek(now);

    const [sessions, applicationsSent, germanSessions] = await Promise.all([
      this.prisma.studySession.findMany({
        where: { userId, date: { gte: weekStart, lt: weekEnd } },
        select: { durationMinutes: true },
      }),
      this.prisma.jobApplication.count({
        where: { userId, appliedDate: { gte: weekStart, lt: weekEnd } },
      }),
      this.prisma.germanSession.findMany({
        where: { userId, sessionDate: { gte: weekStart, lt: weekEnd } },
        select: { durationMinutes: true },
      }),
    ]);

    const studyMinutes = sessions.reduce((sum: number, s: { durationMinutes: number }) => sum + s.durationMinutes, 0);
    const germanMinutes = germanSessions.reduce(
      (sum: number, s: { durationMinutes: number }) => sum + s.durationMinutes,
      0,
    );

    return {
      studyHours: { actual: Math.round((studyMinutes / 60) * 10) / 10, target: studyHoursTarget },
      applicationsSent: { actual: applicationsSent, target: applicationTarget },
      germanMinutes: { actual: germanMinutes, target: germanMinutesTarget },
    };
  }

  // ---------------------------------------------------------------------
  // Streaks
  // ---------------------------------------------------------------------

  private async getStreaks(userId: string, now: Date): Promise<StreakSummary> {
    const [studyDates, germanDates, applicationDates] = await Promise.all([
      this.prisma.studySession.findMany({ where: { userId }, select: { date: true }, distinct: ['date'] }),
      this.prisma.germanSession.findMany({
        where: { userId },
        select: { sessionDate: true },
        distinct: ['sessionDate'],
      }),
      this.prisma.jobApplication.findMany({
        where: { userId },
        select: { appliedDate: true },
        distinct: ['appliedDate'],
      }),
    ]);

    return {
      studyDays: this.consecutiveDayStreak(studyDates.map((d: { date: Date }) => d.date), now),
      germanDays: this.consecutiveDayStreak(germanDates.map((d: { sessionDate: Date }) => d.sessionDate), now),
      applicationDays: this.consecutiveDayStreak(
        applicationDates.map((d: { appliedDate: Date }) => d.appliedDate),
        now,
      ),
    };
  }

  /** Counts consecutive calendar days (ending today or yesterday) present in `dates`. */
  private consecutiveDayStreak(dates: Date[], now: Date): number {
    const dateKeys = new Set(dates.map((d) => this.dateKey(d)));
    let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // A streak only "counts" if today or yesterday has an entry —
    // otherwise it's broken and the streak is 0.
    if (!dateKeys.has(this.dateKey(cursor))) {
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1);
      if (!dateKeys.has(this.dateKey(cursor))) return 0;
    }

    let streak = 0;
    while (dateKeys.has(this.dateKey(cursor))) {
      streak += 1;
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1);
    }
    return streak;
  }

  private dateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  // ---------------------------------------------------------------------
  // Alerts
  // ---------------------------------------------------------------------

  private async getAlerts(userId: string, now: Date): Promise<Alert[]> {
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
