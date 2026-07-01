/**
 * Interview prep and logging API shapes.
 * Mirrors interview_questions / interview_logs / mock_interview_logs
 * tables (PRD v2 §7.4, TAD §7).
 */

export interface InterviewQuestionDto {
  id: string;
  question: string;
  category: string;
  difficulty: string | null;
  status: string;
  myAnswer: string | null;
  source: string | null;
  sourceLessonId: number | null;
  lastPracticed: string | null;
  createdAt: string;
}

export interface InterviewLogDto {
  id: string;
  applicationId: string;
  interviewDate: string;
  roundNumber: number;
  format: string | null;
  interviewerName: string | null;
  interviewerRole: string | null;
  durationMinutes: number | null;
  questionsAsked: string[];
  myAnswersNotes: string | null;
  outcome: string | null;
  feedbackReceived: string | null;
  myRating: number | null;
}

export interface MockInterviewLogDto {
  id: string;
  mockDate: string;
  format: string | null;
  partnerName: string | null;
  questionsAsked: string[];
  feedback: string | null;
  selfRating: number | null;
}

export interface InterviewStatsDto {
  totalQuestions: number;
  confidentCount: number;
  practicedCount: number;
  notTriedCount: number;
  byCategory: Record<string, number>;
}
