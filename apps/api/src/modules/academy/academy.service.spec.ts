import { describe, it, expect, vi, beforeEach } from 'vitest';

import { AcademyService } from './academy.service';

function buildPrismaMock() {
  return {
    academyModule: {
      findMany: vi.fn().mockResolvedValue([
        { id: 1, slug: 'js', title: 'JavaScript', description: '', icon: '', colorHex: '#000', sortOrder: 1, totalLessons: 2, estimatedHours: null, lessons: [{ id: 1 }, { id: 2 }] },
      ]),
      count: vi.fn().mockResolvedValue(9),
      findUnique: vi.fn(),
    },
    academyLesson: {
      findUnique: vi.fn().mockResolvedValue({
        id: 10,
        lessonCode: 'JS-Q1',
        moduleId: 1,
        title: 'Quiz',
        contentType: 'quiz',
        durationMinutes: 10,
        tier: 'MVP',
        sortOrder: 1,
        prerequisites: [],
        tags: [],
        contentMd: '',
      }),
      count: vi.fn().mockResolvedValue(126),
      findFirst: vi.fn(),
    },
    userLessonProgress: {
      findMany: vi.fn().mockResolvedValue([{ lessonId: 1 }, { lessonId: 2 }]),
      findUnique: vi.fn().mockResolvedValue(null),
      upsert: vi.fn().mockResolvedValue({ status: 'completed', completedAt: new Date(), personalNotes: 'note' }),
      count: vi.fn().mockResolvedValue(1),
    },
    quizQuestion: {
      findMany: vi.fn().mockResolvedValue([
        { id: 1, lessonId: 10, question: 'Q1', optionA: 'a', optionB: 'b', optionC: 'c', optionD: 'd', correctOption: 'A', explanation: 'because' },
        { id: 2, lessonId: 10, question: 'Q2', optionA: 'a', optionB: 'b', optionC: 'c', optionD: 'd', correctOption: 'B', explanation: 'because' },
      ]),
    },
    quizAttempt: {
      create: vi.fn().mockResolvedValue({}),
      findMany: vi.fn().mockResolvedValue([]),
    },
    interviewQuestion: {
      create: vi.fn().mockResolvedValue({ id: 'iq-1' }),
    },
  };
}

describe('AcademyService', () => {
  let prisma: ReturnType<typeof buildPrismaMock>;
  let readinessScoreService: { calculate: ReturnType<typeof vi.fn> };
  let service: AcademyService;

  beforeEach(() => {
    prisma = buildPrismaMock();
    readinessScoreService = { calculate: vi.fn().mockResolvedValue(undefined) };
    service = new AcademyService(prisma as never, readinessScoreService as never);
  });

  it('computes module progress as completed lessons within that module', async () => {
    const result = await service.listModules('user-1');
    expect(result).toHaveLength(1);
    const rslt = result[0]!;
    expect(rslt.completedLessons).toBe(2);
    expect(rslt.totalLessons).toBe(2);
  });

  it('scores a quiz submission: correct_count / total x 100, all correct', async () => {
    const result = await service.submitQuiz('user-1', 'JS-Q1', {
      answers: [
        { questionId: 1, selectedOption: 'A' },
        { questionId: 2, selectedOption: 'B' },
      ],
    });

    expect(result.scorePct).toBe(100);
    expect(result.correctCount).toBe(2);
    expect(result.totalQuestions).toBe(2);
    expect(readinessScoreService.calculate).toHaveBeenCalledWith('user-1');
  });

  it('scores a quiz submission with wrong answers and includes explanations', async () => {
    const result = await service.submitQuiz('user-1', 'JS-Q1', {
      answers: [
        { questionId: 1, selectedOption: 'C' },
        { questionId: 2, selectedOption: 'B' },
      ],
    });

    expect(result.scorePct).toBe(50);
    expect(result.correctCount).toBe(1);
    expect(result.results[0]!.correct).toBe(false);
    expect(result.results[0]!.explanation).toBe('because');
  });

  it('strips correct_option from the GET quiz response', async () => {
    const questions = await service.getQuiz('JS-Q1');
    expect(questions[0]).not.toHaveProperty('correctOption');
    expect(questions[0]).not.toHaveProperty('explanation');
  });

  it('marks a lesson complete and triggers a score recalculation', async () => {
    const result = await service.completeLesson('user-1', 'JS-Q1');
    expect(result.status).toBe('completed');
    expect(readinessScoreService.calculate).toHaveBeenCalledWith('user-1');
  });
});
