/**
 * Plan-week task completion status.
 * Mirrors week_task_completions.status CHECK constraint (M03).
 */
export enum WeekTaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
}
