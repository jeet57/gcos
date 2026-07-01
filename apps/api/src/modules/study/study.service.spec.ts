import { describe, it, expect, vi, beforeEach } from 'vitest';

import { StudyService } from './study.service';

function buildPrismaMock() {
  return {
    studySession: {
      create: vi.fn().mockResolvedValue({
        id: 'session-1',
        domainId: 1,
        topicId: null,
        date: new Date('2026-06-15'),
        durationMinutes: 60,
        resourceType: 'video',
        resourceName: null,
        notes: null,
      }),
      findMany: vi.fn().mockResolvedValue([]),
      groupBy: vi.fn().mockResolvedValue([{ domainId: 1, _sum: { durationMinutes: 90 } }]),
    },
    studyDomain: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 1,
          slug: 'typescript',
          name: 'TypeScript',
          colorHex: '#000',
          priority: 1,
          skillTopics: [{ topicCompletions: [{ completionPct: 50 }] }, { topicCompletions: [] }],
        },
      ]),
    },
    planWeek: {
      findUnique: vi.fn().mockResolvedValue({ id: 5 }),
    },
    weekTaskCompletion: {
      upsert: vi.fn().mockResolvedValue({ status: 'completed' }),
    },
    skillTopic: {
      findUnique: vi.fn().mockResolvedValue({ id: 1 }),
    },
    topicCompletion: {
      upsert: vi.fn().mockResolvedValue({ completionPct: 75 }),
    },
  };
}

describe('StudyService', () => {
  let prisma: ReturnType<typeof buildPrismaMock>;
  let readinessScoreService: { calculate: ReturnType<typeof vi.fn> };
  let service: StudyService;

  beforeEach(() => {
    prisma = buildPrismaMock();
    readinessScoreService = { calculate: vi.fn().mockResolvedValue(undefined) };
    service = new StudyService(prisma as never, readinessScoreService as never);
  });

  it('creates a study session and triggers a score recalculation', async () => {
    const result = await service.createSession('user-1', {
      domainId: 1,
      durationMinutes: 60,
      resourceType: 'video',
    });

    expect(prisma.studySession.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ userId: 'user-1', domainId: 1, durationMinutes: 60 }) }),
    );
    expect(readinessScoreService.calculate).toHaveBeenCalledWith('user-1');
    expect(result.durationMinutes).toBe(60);
  });

  it('computes domain progress as the average of topic completion percentages', async () => {
    const result = await service.getDomainProgress('user-1');

    expect(result).toHaveLength(1);
    const [domain] = result;
    // topics: [50, 0] -> average 25
    expect(domain?.completionPct).toBe(25);
    expect(domain?.weeklyMinutesActual).toBe(90);
  });

  it('marks a week complete and triggers a score recalculation', async () => {
    const result = await service.updateWeek('user-1', 5, { status: 'completed' as never });

    expect(prisma.weekTaskCompletion.upsert).toHaveBeenCalled();
    expect(readinessScoreService.calculate).toHaveBeenCalledWith('user-1');
    expect(result.status).toBe('completed');
  });

  it('updates topic completion percentage without recalculating score', async () => {
    const result = await service.updateTopic('user-1', 1, { completionPct: 75 });

    expect(prisma.topicCompletion.upsert).toHaveBeenCalled();
    expect(readinessScoreService.calculate).not.toHaveBeenCalled();
    expect(result.completionPct).toBe(75);
  });
});
