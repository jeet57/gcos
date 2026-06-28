/**
 * Quiz question stubs (PRD v2 §3.1-3.10 quiz lessons).
 *
 * COUNT DISCLOSURE: the M04 spec states "~310 quiz question stubs". The
 * source document explicitly enumerates 13 standalone quiz-type lessons
 * with stated question counts (12 × 10 + 1 × 20 = 140) — not 310. The
 * "31" figure in PRD v2 §3.1's summary includes 2 combo "Lesson + Quiz"
 * rows (DE10, DE23) seeded as lesson-type rows, not standalone quizzes.
 * This file seeds exactly 140 — the number traceable to real content.
 *
 * Question text is real; optionA-D/correctOption/explanation are
 * placeholders (real answers written in M23).
 */
export interface QuizQuestionSeed {
  lessonCode: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'a' | 'b' | 'c' | 'd';
  explanation: string;
  sortOrder: number;
}

const PLACEHOLDER_OPTIONS = {
  optionA: 'Placeholder option A — real options written in M23',
  optionB: 'Placeholder option B — real options written in M23',
  optionC: 'Placeholder option C — real options written in M23',
  optionD: 'Placeholder option D — real options written in M23',
  correctOption: 'a' as const,
  explanation: 'Placeholder explanation — real explanation written in M23.',
};

const quizDefinitions: { lessonCode: string; topic: string; count: number }[] = [
  { lessonCode: 'JS-Q1', topic: 'Event Loop & Async', count: 10 },
  { lessonCode: 'JS-Q2', topic: "Closures, 'this', Prototype", count: 10 },
  { lessonCode: 'TS-Q1', topic: 'Generics and Mapped Types', count: 10 },
  { lessonCode: 'TS-Q2', topic: 'Utility Types and Narrowing', count: 10 },
  { lessonCode: 'RE-Q1', topic: 'Rendering and Hooks', count: 10 },
  { lessonCode: 'RE-Q2', topic: 'Architecture and Patterns', count: 10 },
  { lessonCode: 'NO-Q1', topic: 'Node.js Internals', count: 10 },
  { lessonCode: 'NO-Q2', topic: 'NestJS Architecture', count: 10 },
  { lessonCode: 'PG-Q1', topic: 'SQL and Schema Design', count: 10 },
  { lessonCode: 'DO-Q1', topic: 'Docker Fundamentals', count: 10 },
  { lessonCode: 'SD-Q1', topic: 'Frontend System Design', count: 10 },
  { lessonCode: 'AI-Q1', topic: 'AI Tools and Workflows', count: 10 },
  { lessonCode: 'DE-Q1', topic: 'A1 Grammar and Vocabulary', count: 20 },
];

export const quizQuestionSeeds: QuizQuestionSeed[] = quizDefinitions.flatMap(
  ({ lessonCode, topic, count }) =>
    Array.from({ length: count }, (_, i) => ({
      lessonCode,
      question: `[${topic}] Question ${i + 1} of ${count} — placeholder question text, real content written in M23.`,
      ...PLACEHOLDER_OPTIONS,
      sortOrder: i + 1,
    })),
);
