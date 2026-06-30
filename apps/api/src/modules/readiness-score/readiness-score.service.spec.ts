import { describe, it, expect, beforeEach, vi } from 'vitest';

import { ReadinessScoreService } from './readiness-score.service';

const NOW = new Date('2026-06-15T12:00:00Z');
const PLAN_START = new Date('2026-01-01T00:00:00Z');

function buildPrismaMock() {
  return {
    user: {
      findUniqueOrThrow: vi.fn().mockResolvedValue({
        id: 'user-1',
        planStartDate: PLAN_START,
        weeklyAiSessionsTarget: 4,
      }),
    },
    planMonth: {
      // Month 6 (June), hoursPerWeek 10 → target = 10 * 4 * 60 = 2400 min
      findUnique: vi.fn().mockResolvedValue({ monthNumber: 6, hoursPerWeek: 10 }),
    },
    studySession: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    academyLesson: {
      count: vi.fn().mockResolvedValue(100),
    },
    userLessonProgress: {
      count: vi.fn().mockResolvedValue(0),
    },
    quizAttempt: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    jobApplication: {
      count: vi.fn().mockResolvedValue(0),
    },
    portfolioProject: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    germanUnit: {
      count: vi.fn().mockResolvedValue(0),
    },
    academyModule: {
      findUnique: vi.fn().mockResolvedValue(null),
    },
    interviewQuestion: {
      count: vi.fn().mockResolvedValue(0),
    },
    aiToolSession: {
      count: vi.fn().mockResolvedValue(0),
    },
    readinessScore: {
      findUnique: vi.fn().mockResolvedValue(null),
      upsert: vi.fn().mockResolvedValue({}),
    },
  };
}

describe('ReadinessScoreService', () => {
  let prisma: ReturnType<typeof buildPrismaMock>;
  let service: ReadinessScoreService;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    prisma = buildPrismaMock();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new ReadinessScoreService(prisma as any);
  });

  describe('edge cases', () => {
    it('returns 0 for every dimension for a brand-new user with no data', async () => {
      const result = await service.calculate('user-1');

      expect(result.overall).toBe(0);
      expect(result.study).toBe(0);
      expect(result.academy).toBe(0);
      expect(result.application).toBe(0);
      expect(result.portfolio).toBe(0);
      expect(result.german).toBe(0);
      expect(result.interview).toBe(0);
      expect(result.aiTooling).toBe(0);
    });

    it('caps every dimension and the overall score at 100 even with excessive data', async () => {
      prisma.studySession.findMany.mockResolvedValue([{ durationMinutes: 10000 }]);
      prisma.academyLesson.count.mockResolvedValue(1);
      prisma.userLessonProgress.count.mockResolvedValue(5); // more "completed" than total lessons
      prisma.quizAttempt.findMany.mockResolvedValue([{ scorePct: 100 }]);
      prisma.jobApplication.count.mockResolvedValue(500);
      prisma.germanUnit.count.mockResolvedValue(999);
      prisma.interviewQuestion.count.mockResolvedValue(10);
      prisma.aiToolSession.count.mockResolvedValue(999);

      const result = await service.calculate('user-1');

      expect(result.overall).toBeLessThanOrEqual(100);
      expect(result.study).toBeLessThanOrEqual(100);
      expect(result.academy).toBeLessThanOrEqual(100);
      expect(result.application).toBeLessThanOrEqual(100);
      expect(result.german).toBeLessThanOrEqual(100);
      expect(result.aiTooling).toBeLessThanOrEqual(100);
    });

    it('never returns a score below 0, even with a zero-target edge case', async () => {
      prisma.planMonth.findUnique.mockResolvedValue({ monthNumber: 6, hoursPerWeek: 0 });

      const result = await service.calculate('user-1');

      expect(result.study).toBeGreaterThanOrEqual(0);
      expect(result.overall).toBeGreaterThanOrEqual(0);
    });

    it('produces a perfect 100 overall score when every dimension maxes out', async () => {
      prisma.studySession.findMany.mockResolvedValue([{ durationMinutes: 2400 }]); // == target
      prisma.academyLesson.count.mockResolvedValue(10);
      prisma.userLessonProgress.count.mockResolvedValue(10);
      prisma.quizAttempt.findMany.mockResolvedValue([{ scorePct: 100 }]);
      prisma.jobApplication.count.mockResolvedValue(80);
      prisma.portfolioProject.findMany.mockResolvedValue([
        { sortOrder: 0, milestones: [{ status: 'completed' }] },
        { sortOrder: 1, milestones: [{ status: 'completed' }] },
      ]);
      prisma.germanUnit.count.mockResolvedValue(22);
      prisma.interviewQuestion.count.mockResolvedValue(10);
      prisma.aiToolSession.count.mockResolvedValue(4);

      const result = await service.calculate('user-1');

      expect(result.overall).toBe(100);
    });

    it('reflects a "only German done" scenario: overall equals the german weight contribution', async () => {
      prisma.germanUnit.count.mockImplementation(async ({ where }: { where?: { status?: string } } = {}) =>
        where?.status === 'completed' ? 22 : 22,
      );

      const result = await service.calculate('user-1');

      // german=100, every other dimension=0 → overall = 100 * 0.15 = 15
      expect(result.german).toBe(100);
      expect(result.overall).toBe(15);
    });
  });

  describe('dimension calculations', () => {
    it('study: computes minutes-logged vs. target-minutes for the current plan month', async () => {
      prisma.studySession.findMany.mockResolvedValue([{ durationMinutes: 600 }, { durationMinutes: 600 }]);
      // target = 10 hrs/week * 4 * 60 = 2400 min; actual = 1200 → 50%
      const result = await service.calculate('user-1');
      expect(result.study).toBe(50);
    });

    it('academy: increases when lessons are completed', async () => {
      prisma.academyLesson.count.mockResolvedValue(10);
      prisma.userLessonProgress.count.mockResolvedValue(5);
      const result = await service.calculate('user-1');
      expect(result.academy).toBeGreaterThan(0);
      expect(result.academy).toBe(50); // (5 + 0/100) / 10 * 100
    });

    it('academy: factors in quiz average score alongside completed lessons', async () => {
      prisma.academyLesson.count.mockResolvedValue(10);
      prisma.userLessonProgress.count.mockResolvedValue(5);
      prisma.quizAttempt.findMany.mockResolvedValue([{ scorePct: 80 }, { scorePct: 100 }]);
      // (5 + 0.9) / 10 * 100 = 59
      const result = await service.calculate('user-1');
      expect(result.academy).toBe(59);
    });

    it('application: returns correct % when 3 of 8 planned sessions worth of apps are logged', async () => {
      prisma.jobApplication.count.mockResolvedValue(8);
      // 8 / 80 * 100 = 10
      const result = await service.calculate('user-1');
      expect(result.application).toBe(10);
    });

    it('portfolio: weights project 1 and project 2 equally at 50% each', async () => {
      prisma.portfolioProject.findMany.mockResolvedValue([
        { sortOrder: 0, milestones: [{ status: 'completed' }, { status: 'not_started' }] }, // 50%
        { sortOrder: 1, milestones: [{ status: 'completed' }] }, // 100%
      ]);
      // 50*0.5 + 100*0.5 = 75
      const result = await service.calculate('user-1');
      expect(result.portfolio).toBe(75);
    });

    it('german: applies the academy lessons bonus on top of the DW-unit base score', async () => {
      prisma.germanUnit.count
        .mockResolvedValueOnce(22) // total
        .mockResolvedValueOnce(11); // completed → base = 50
      prisma.academyModule.findUnique.mockResolvedValue({
        id: 1,
        slug: 'german-a1-a2',
        lessons: [{ id: 1 }, { id: 2 }],
      });
      prisma.userLessonProgress.count.mockResolvedValue(2); // both german lessons completed → bonus = 10

      const result = await service.calculate('user-1');
      expect(result.german).toBe(60); // 50 + 10
    });

    it('interview: returns correct % of confident questions', async () => {
      prisma.interviewQuestion.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(3); // confident
      const result = await service.calculate('user-1');
      expect(result.interview).toBe(30);
    });

    it('aiTooling: uses the user-configured monthly target', async () => {
      prisma.user.findUniqueOrThrow.mockResolvedValue({
        id: 'user-1',
        planStartDate: PLAN_START,
        weeklyAiSessionsTarget: 2,
      });
      prisma.aiToolSession.count.mockResolvedValue(1);
      // 1 / 2 * 100 = 50
      const result = await service.calculate('user-1');
      expect(result.aiTooling).toBe(50);
    });
  });

  describe('weighted overall score', () => {
    it('computes the correct weighted sum of all 7 dimensions', async () => {
      // Force each dimension to a known round value via direct method spies,
      // so this test isolates the weighting arithmetic from each dimension's
      // own calculation logic.
      const spies = {
        study: vi.spyOn(service as never, 'getStudyScore' as never).mockResolvedValue(80 as never),
        academy: vi.spyOn(service as never, 'getAcademyScore' as never).mockResolvedValue(60 as never),
        application: vi.spyOn(service as never, 'getApplicationScore' as never).mockResolvedValue(40 as never),
        portfolio: vi.spyOn(service as never, 'getPortfolioScore' as never).mockResolvedValue(20 as never),
        german: vi.spyOn(service as never, 'getGermanScore' as never).mockResolvedValue(100 as never),
        interview: vi.spyOn(service as never, 'getInterviewScore' as never).mockResolvedValue(0 as never),
        aiTooling: vi.spyOn(service as never, 'getAiToolingScore' as never).mockResolvedValue(50 as never),
      };

      const result = await service.calculate('user-1');

      // 80*.15 + 60*.2 + 40*.2 + 20*.15 + 100*.15 + 0*.1 + 50*.05
      // = 12 + 12 + 8 + 3 + 15 + 0 + 2.5 = 52.5 → rounds to 53
      expect(result.overall).toBe(53);
      Object.values(spies).forEach((s) => s.mockRestore());
    });
  });

  describe('parallel execution', () => {
    it('runs all 7 dimension queries concurrently via Promise.all, not sequentially', async () => {
      const DELAY_MS = 30;
      const delay = <T>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), DELAY_MS));

      const spies = [
        vi.spyOn(service as never, 'getStudyScore' as never).mockImplementation(() => delay(0) as never),
        vi.spyOn(service as never, 'getAcademyScore' as never).mockImplementation(() => delay(0) as never),
        vi.spyOn(service as never, 'getApplicationScore' as never).mockImplementation(() => delay(0) as never),
        vi.spyOn(service as never, 'getPortfolioScore' as never).mockImplementation(() => delay(0) as never),
        vi.spyOn(service as never, 'getGermanScore' as never).mockImplementation(() => delay(0) as never),
        vi.spyOn(service as never, 'getInterviewScore' as never).mockImplementation(() => delay(0) as never),
        vi.spyOn(service as never, 'getAiToolingScore' as never).mockImplementation(() => delay(0) as never),
      ];

      vi.useRealTimers();
      const start = Date.now();
      await service.calculate('user-1');
      const elapsed = Date.now() - start;
      vi.useFakeTimers();
      vi.setSystemTime(NOW);

      // If sequential, 7 * 30ms = 210ms+. If parallel (Promise.all), ~30-60ms.
      expect(elapsed).toBeLessThan(7 * DELAY_MS);

      spies.forEach((s) => s.mockRestore());
    });
  });

  describe('snapshot + trend', () => {
    it('upserts a readiness_scores row after calculation', async () => {
      await service.calculate('user-1');
      expect(prisma.readinessScore.upsert).toHaveBeenCalledOnce();
      const callArg = prisma.readinessScore.upsert.mock.calls[0]?.[0];
      expect(callArg).toBeDefined();
      expect(callArg.create.userId).toBe('user-1');
      expect(callArg.create).toHaveProperty('overallScore');
      expect(callArg.create).toHaveProperty('domainScore');
    });

    it('returns trend 0 when no previous snapshot exists', async () => {
      prisma.readinessScore.findUnique.mockResolvedValue(null);
      const result = await service.calculate('user-1');
      expect(result.trend).toBe(0);
    });

    it('returns the correct positive/negative delta vs. yesterday', async () => {
      prisma.readinessScore.findUnique.mockResolvedValue({ overallScore: 10 });
      prisma.germanUnit.count.mockResolvedValue(22); // pushes german dimension up, raising overall
      const result = await service.calculate('user-1');
      expect(result.trend).toBe(result.overall - 10);
    });
  });
});
