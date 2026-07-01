/**
 * Study module API shapes.
 * Mirrors study_domains / skill_topics / study_sessions / plan_months /
 * plan_weeks / week_task_completions tables (PRD v2 §7.1, TAD §7).
 */
import type { WeekTaskStatus } from '../enums/index.js';

export interface StudySessionDto {
  id: string;
  domainId: number;
  topicId: number | null;
  date: string;
  durationMinutes: number;
  resourceType: string | null;
  resourceName: string | null;
  notes: string | null;
}

/** A single study domain joined with the current user's progress. */
export interface DomainProgressDto {
  id: number;
  slug: string;
  name: string;
  colorHex: string;
  priority: number;
  /** Minutes logged against this domain in the current calendar week. */
  weeklyMinutesActual: number;
  /** Average completion_pct across the domain's skill topics. */
  completionPct: number;
}

export interface PlanWeekDto {
  id: number;
  weekNumber: number;
  tasksSummary: string;
  deliverable: string;
  germanFocus: string;
  domainIds: number[];
  status: WeekTaskStatus;
  deliverableUrl: string | null;
}

export interface PlanMonthDto {
  id: number;
  monthNumber: number;
  theme: string;
  phaseName: string;
  hoursPerWeek: number;
  germanTarget: string;
  milestoneDescription: string;
  weeks: PlanWeekDto[];
}
