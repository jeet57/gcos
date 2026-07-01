import { Injectable } from '@nestjs/common';
import type { LessonStatus, QuestionStatus } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { currentPlanMonthNumber, startOfMonth, startOfNextMonth } from '../../common/utils/plan-date.util';
import type { ScoreBreakdown } from '@gcos/types';

const WEIGHTS = {
  academy: 0.2,
  application: 0.2,
  study: 0.15,
  portfolio: 0.15,
  german: 0.15,
  interview: 0.1,
  aiTooling: 0.05,
} as const;

const GERMAN_ACADEMY_MODULE_SLUG = 'german-a1-a2';
const GERMAN_BONUS_MAX_POINTS = 10;
const APPLICATION_MONTHLY_TARGET = 80; // 20/week x 4 (PRD 6.3)
const AI_TOOLING_MONTHLY_TARGET_FALLBACK = 4;

function clampScore(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * Calculates the 7-dimension Germany Readiness Score (PRD 1.4, 6.3;
 * TAD 3.4). Pure read-only service - owns no tables of its own, reads
 * across 7 other modules' data via Prisma. All 7 dimension queries run
 * in parallel via Promise.all (TAD 3.6: ~700ms sequential -> ~150ms
 * parallel). A daily snapshot is upserted into readiness_scores after
 * every calculation (TAD 4.4 snapshot pattern).
 *
 * Two formula gaps in PRD 6.3, resolved here (flagged at approval):
 *  - Study dimension: PRD says "sessions logged / planned" but no
 *    "planned session count" exists in the schema - PlanMonth only has
 *    hoursPerWeek. Computed instead as minutes logged this calendar
 *    month vs. target minutes (hoursPerWeek x 4 weeks) for the user's
 *    current plan month.
 *  - German bonus: "Academy German lessons completed bonus" has no
 *    defined magnitude - capped at +10 points, proportional to
 *    completion of the german-a1-a2 Academy module. Whole dimension
 *    still caps at 100.
 */
@Injectable()
export class ReadinessScoreService {
  constructor(private readonly prisma: PrismaService) {}

  async calculate(userId: string): Promise<ScoreBreakdown> {
    const now = new Date();
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const [
      studyScore,
      academyScore,
      applicationScore,
      portfolioScore,
      germanScore,
      interviewScore,
      aiToolingScore,
    ] = await Promise.all([
      this.getStudyScore(userId, user.planStartDate, now),
      this.getAcademyScore(userId),
      this.getApplicationScore(userId, now),
      this.getPortfolioScore(userId),
      this.getGermanScore(userId),
      this.getInterviewScore(userId),
      this.getAiToolingScore(userId, user.weeklyAiSessionsTarget, now),
    ]);

    const overall = clampScore(
      academyScore * WEIGHTS.academy +
        applicationScore * WEIGHTS.application +
        studyScore * WEIGHTS.study +
        portfolioScore * WEIGHTS.portfolio +
        germanScore * WEIGHTS.german +
        interviewScore * WEIGHTS.interview +
        aiToolingScore * WEIGHTS.aiTooling,
    );

    const trend = await this.getTrend(userId, overall, now);

    await this.writeSnapshot(userId, now, {
      overall,
      study: studyScore,
      academy: academyScore,
      application: applicationScore,
      portfolio: portfolioScore,
      german: germanScore,
      interview: interviewScore,
      aiTooling: aiToolingScore,
    });

    return {
      overall,
      study: studyScore,
      academy: academyScore,
      application: applicationScore,
      portfolio: portfolioScore,
      german: germanScore,
      interview: interviewScore,
      aiTooling: aiToolingScore,
      trend,
      recordedDate: now.toISOString().slice(0, 10),
    };
  }

  /** Study Sessions (15%): minutes logged this month vs. target minutes for the current plan month. */
  private async getStudyScore(userId: string, planStartDate: Date, now: Date): Promise<number> {
    const monthNumber = currentPlanMonthNumber(planStartDate, now);

    const [planMonth, sessions] = await Promise.all([
      this.prisma.planMonth.findUnique({ where: { monthNumber } }),
      this.prisma.studySession.findMany({
        where: { userId, date: { gte: startOfMonth(now), lt: startOfNextMonth(now) } },
        select: { durationMinutes: true },
      }),
    ]);

    if (!planMonth) return 0;

    const targetMinutes = Number(planMonth.hoursPerWeek) * 4 * 60;
    if (targetMinutes <= 0) return 0;

    const actualMinutes = sessions.reduce((sum: number, s: { durationMinutes: number }) => sum + s.durationMinutes, 0);
    return clampScore((actualMinutes / targetMinutes) * 100);
  }

  /** Academy Progress (20%): ((completedLessons + quizAvgScorePct/100) / totalLessons) x 100. */
  private async getAcademyScore(userId: string): Promise<number> {
    const completedStatus: LessonStatus = 'completed';

    const [totalLessons, completedLessons, quizAttempts] = await Promise.all([
      this.prisma.academyLesson.count(),
      this.prisma.userLessonProgress.count({ where: { userId, status: completedStatus } }),
      this.prisma.quizAttempt.findMany({ where: { userId }, select: { scorePct: true } }),
    ]);

    if (totalLessons === 0) return 0;

    const quizAvgScorePct =
      quizAttempts.length === 0
        ? 0
        : quizAttempts.reduce((sum: number, q: { scorePct: number }) => sum + q.scorePct, 0) / quizAttempts.length;

    return clampScore(((completedLessons + quizAvgScorePct / 100) / totalLessons) * 100);
  }

  /** Application Volume (20%): apps sent this calendar month / 80, capped at 100. */
  private async getApplicationScore(userId: string, now: Date): Promise<number> {
    const count = await this.prisma.jobApplication.count({
      where: { userId, appliedDate: { gte: startOfMonth(now), lt: startOfNextMonth(now) } },
    });
    return clampScore((count / APPLICATION_MONTHLY_TARGET) * 100);
  }

  /** Portfolio Completion (15%): project 1 (50%) + project 2 (50%) milestone completion %. */
  private async getPortfolioScore(userId: string): Promise<number> {
    const projects = await this.prisma.portfolioProject.findMany({
      where: { userId },
      orderBy: { sortOrder: 'asc' },
      take: 2,
      include: { milestones: { select: { status: true } } },
    });

    if (projects.length === 0) return 0;

    const completionPct = (project: (typeof projects)[number]): number => {
      if (project.milestones.length === 0) return 0;
      const completed = project.milestones.filter((m: { status: string }) => m.status === 'completed').length;
      return (completed / project.milestones.length) * 100;
    };

    const [firstProject, secondProject] = projects;
    const project1Pct = firstProject ? completionPct(firstProject) : 0;
    const project2Pct = secondProject ? completionPct(secondProject) : 0;

    return clampScore(project1Pct * 0.5 + project2Pct * 0.5);
  }

  /** German Language (15%): DW units done / total + Academy German lessons bonus (max +10). */
  private async getGermanScore(userId: string): Promise<number> {
    const completedStatus: LessonStatus = 'completed';

    const [totalUnits, completedUnits, germanModule] = await Promise.all([
      this.prisma.germanUnit.count(),
      this.prisma.germanUnit.count({ where: { status: completedStatus } }),
      this.prisma.academyModule.findUnique({
        where: { slug: GERMAN_ACADEMY_MODULE_SLUG },
        include: { lessons: { select: { id: true } } },
      }),
    ]);

    const baseScore = totalUnits === 0 ? 0 : (completedUnits / totalUnits) * 100;

    let bonus = 0;
    if (germanModule && germanModule.lessons.length > 0) {
      const lessonIds = germanModule.lessons.map((l: { id: number }) => l.id);
      const completedGermanLessons = await this.prisma.userLessonProgress.count({
        where: { userId, status: completedStatus, lessonId: { in: lessonIds } },
      });
      bonus = (completedGermanLessons / germanModule.lessons.length) * GERMAN_BONUS_MAX_POINTS;
    }

    return clampScore(baseScore + bonus);
  }

  /** Interview Readiness (10%): confident questions / total in bank x 100. */
  private async getInterviewScore(userId: string): Promise<number> {
    const confidentStatus: QuestionStatus = 'confident';

    const [total, confident] = await Promise.all([
      this.prisma.interviewQuestion.count({ where: { userId } }),
      this.prisma.interviewQuestion.count({ where: { userId, status: confidentStatus } }),
    ]);

    if (total === 0) return 0;
    return clampScore((confident / total) * 100);
  }

  /** AI Tooling Fluency (5%): sessions logged this month / 4 (or the user's target) x 100. */
  private async getAiToolingScore(
    userId: string,
    monthlyTarget: number,
    now: Date,
  ): Promise<number> {
    const target = monthlyTarget > 0 ? monthlyTarget : AI_TOOLING_MONTHLY_TARGET_FALLBACK;
    const count = await this.prisma.aiToolSession.count({
      where: { userId, sessionDate: { gte: startOfMonth(now), lt: startOfNextMonth(now) } },
    });
    return clampScore((count / target) * 100);
  }

  /** Delta vs. yesterday's snapshot; 0 if none exists. */
  private async getTrend(userId: string, todayOverall: number, now: Date): Promise<number> {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    const previous = await this.prisma.readinessScore.findUnique({
      where: { userId_recordedDate: { userId, recordedDate: yesterdayDate } },
    });

    if (!previous) return 0;
    return todayOverall - previous.overallScore;
  }

  private async writeSnapshot(
    userId: string,
    now: Date,
    scores: Omit<ScoreBreakdown, 'trend' | 'recordedDate'>,
  ): Promise<void> {
    const recordedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    await this.prisma.readinessScore.upsert({
      where: { userId_recordedDate: { userId, recordedDate } },
      update: {
        overallScore: scores.overall,
        studyScore: scores.study,
        applicationScore: scores.application,
        portfolioScore: scores.portfolio,
        germanScore: scores.german,
        domainScore: scores.study,
        interviewScore: scores.interview,
        academyScore: scores.academy,
        aiToolingScore: scores.aiTooling,
      },
      create: {
        userId,
        recordedDate,
        overallScore: scores.overall,
        studyScore: scores.study,
        applicationScore: scores.application,
        portfolioScore: scores.portfolio,
        germanScore: scores.german,
        // domain_score is a required legacy v1 column, not one of the 7
        // v2 dimensions (PRD 7.2) - mirrored from studyScore rather
        // than left as an undocumented magic value.
        domainScore: scores.study,
        interviewScore: scores.interview,
        academyScore: scores.academy,
        aiToolingScore: scores.aiTooling,
      },
    });
  }
}
