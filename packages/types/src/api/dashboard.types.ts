/**
 * Dashboard composite response shapes.
 * Added in M05 (Shared Packages) — populated by DashboardService in M13.
 *
 * Mirrors:
 *  - readiness_scores table (Prisma model `ReadinessScore`)
 *  - PRD v2 §1.4 "Updated Readiness Score — 7 Dimensions"
 *  - PRD v2 §6.3 "Updated Readiness Score Calculation"
 *  - PRD v2 §8.5 "Morning Check-In" flow (Today Card)
 *  - TAD §9 (ReadinessScoreService) and TAD §6.3.x dashboard architecture notes
 */

/**
 * The 7 weighted dimensions that compose the overall Readiness Score.
 * Weights (PRD v2 §1.4): study 15%, academy 20%, application 20%,
 * portfolio 15%, german 15%, interview 10%, aiTooling 5%.
 * Each dimension score is an integer 0-100; `overall` is the weighted sum.
 */
export interface ScoreBreakdown {
  overall: number;
  study: number;
  academy: number;
  application: number;
  portfolio: number;
  german: number;
  interview: number;
  aiTooling: number;
  /** Delta vs the previous recorded date's overall score (can be negative). */
  trend: number;
  recordedDate: string;
}

/**
 * "Today" task card — one item per active track, surfaced on the dashboard
 * per the Morning Check-In flow (PRD v2 §8.5).
 */
export interface TodayCard {
  academyLesson: {
    lessonCode: string;
    title: string;
    moduleSlug: string;
    estimatedMinutes: number;
  } | null;
  studyTask: {
    domainName: string;
    targetMinutes: number;
  } | null;
  applicationTarget: {
    count: number;
  } | null;
}

export interface WeeklyProgress {
  studyHours: { actual: number; target: number };
  applicationsSent: { actual: number; target: number };
  germanMinutes: { actual: number; target: number };
}

export interface StreakSummary {
  studyDays: number;
  germanDays: number;
  applicationDays: number;
}

/**
 * Composite payload for GET /api/v1/dashboard (built in M13).
 * Assembled server-side from 7 dimension queries run in parallel
 * (TAD §6, "Promise.all" performance note) and cached for 30s.
 */
export interface DashboardResponse {
  score: ScoreBreakdown;
  todayCard: TodayCard;
  weeklyProgress: WeeklyProgress;
  streaks: StreakSummary;
}
