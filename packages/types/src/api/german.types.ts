/**
 * German language tracker API shapes.
 * Mirrors german_sessions / german_units / vocabulary_entries tables
 * (PRD v2 §7.3, TAD §7). Sessions feed the germanScore dimension in
 * ReadinessScoreService.
 */

export interface GermanSessionDto {
  id: string;
  sessionType: string;
  durationMinutes: number;
  sessionDate: string;
  dwUnitId: number | null;
  resourceName: string | null;
  vocabularyCount: number | null;
  notes: string | null;
}

export interface GermanUnitDto {
  id: number;
  level: string;
  unitNumber: number;
  title: string;
  targetMonth: number;
  status: string;
  completedDate: string | null;
}

export interface VocabularyEntryDto {
  id: string;
  germanWord: string;
  englishMeaning: string;
  exampleSentence: string | null;
  germanSessionId: string | null;
  createdAt: string;
}

export interface GermanStatsDto {
  /** Total minutes logged in the current calendar week. */
  weeklyMinutes: number;
  /** Total minutes logged in the current calendar month. */
  monthlyMinutes: number;
  /** Consecutive-day streak of sessions (today or yesterday must have a session). */
  currentStreakDays: number;
  totalVocabularyLearned: number;
  unitsCompleted: number;
}
