/**
 * Plan-calendar date helpers shared between ReadinessScoreService (M09)
 * and DashboardService (M10). Extracted in M10 rather than duplicated —
 * both services need the same "which plan month / week is the user on
 * today" math (TAD §3.4, §6.3 "Today" card).
 */

export const PLAN_MONTH_COUNT = 12;
export const WEEKS_PER_PLAN_MONTH = 4;

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function startOfNextMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

/** Monday-anchored start of the current week (local time, midnight). */
export function startOfWeek(date: Date): Date {
  const day = date.getDay(); // 0 = Sunday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function startOfNextWeek(date: Date): Date {
  const start = startOfWeek(date);
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7);
}

/**
 * Months elapsed since the user's plan start, 1-indexed and clamped to
 * [1, 12] (the 12-month curriculum, TAD §3.4).
 */
export function currentPlanMonthNumber(planStartDate: Date, now: Date): number {
  const months =
    (now.getFullYear() - planStartDate.getFullYear()) * 12 +
    (now.getMonth() - planStartDate.getMonth()) +
    1;
  return Math.max(1, Math.min(PLAN_MONTH_COUNT, months));
}

/**
 * Which of the 4 weeks within the current plan month "today" falls in,
 * 1-indexed and clamped to [1, 4]. Computed from total elapsed weeks
 * since plan start (not from calendar-week-of-month) so it stays
 * consistent across month boundaries regardless of which weekday the
 * plan started on.
 */
export function currentPlanWeekNumber(planStartDate: Date, now: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const elapsedDays = Math.floor((startOfWeek(now).getTime() - startOfWeek(planStartDate).getTime()) / msPerDay);
  const elapsedWeeks = Math.max(0, Math.floor(elapsedDays / 7));
  const weekInMonth = (elapsedWeeks % WEEKS_PER_PLAN_MONTH) + 1;
  return Math.max(1, Math.min(WEEKS_PER_PLAN_MONTH, weekInMonth));
}
