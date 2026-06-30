import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { studyDomains } from './data/study-domains';
import { academyModules } from './data/academy-modules';
import { academyLessonSeeds } from './data/academy-lessons';
import { quizQuestionSeeds } from './data/quiz-questions';
import { planMonths } from './data/plan-months';
import { planWeeks } from './data/plan-weeks';
import { germanUnits } from './data/german-units';
import { visaDocuments } from './data/visa-documents';
import { portfolioProjects } from './data/portfolio-projects';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 GCOS seed starting...\n');

  // 1. Bootstrap User — required because VisaDocument and
  // PortfolioProject both have a required, non-nullable userId FK.
  // Password comes from DEV_SEED_PASSWORD (.env.local) — see M08
  // integration notes; falls back to a dev-only default so the seed
  // never silently fails, but you should still set it locally.
  const seedPassword = process.env.DEV_SEED_PASSWORD ?? 'change-me-dev-only';
  const passwordHash = await bcrypt.hash(seedPassword, 12);

  const user = await prisma.user.upsert({
    where: { email: 'jitendra@gcos.app' },
    update: { passwordHash },
    create: {
      email: 'jitendra@gcos.app',
      passwordHash,
      name: 'Jitendra Mishra',
      targetCountry: 'Germany',
      targetRole: 'Senior Full-Stack Engineer',
      planStartDate: new Date('2026-01-01'),
      targetEndDate: new Date('2026-12-31'),
    },
  });
  console.log(`✅ User bootstrapped: ${user.email}`);

  // 2. Academy Modules — must precede StudyDomain (FK target).
  const moduleBySlug = new Map<string, number>();
  for (const m of academyModules) {
    const row = await prisma.academyModule.upsert({
      where: { slug: m.slug },
      update: { title: m.title, description: m.description, icon: m.icon, colorHex: m.colorHex, sortOrder: m.sortOrder, estimatedHours: m.estimatedHours },
      create: { slug: m.slug, title: m.title, description: m.description, icon: m.icon, colorHex: m.colorHex, sortOrder: m.sortOrder, estimatedHours: m.estimatedHours },
    });
    moduleBySlug.set(m.slug, row.id);
  }
  console.log(`✅ ${academyModules.length} academy modules upserted`);

  // 3. Study Domains — depends on AcademyModule for academyModuleId.
  const domainBySlug = new Map<string, number>();
  for (const d of studyDomains) {
    const academyModuleId = d.academyModuleSlug ? moduleBySlug.get(d.academyModuleSlug) ?? null : null;
    const row = await prisma.studyDomain.upsert({
      where: { slug: d.slug },
      update: { name: d.name, description: d.description, priority: d.priority, primaryMonth: d.primaryMonth, colorHex: d.colorHex, icon: d.icon, academyModuleId },
      create: { slug: d.slug, name: d.name, description: d.description, priority: d.priority, primaryMonth: d.primaryMonth, colorHex: d.colorHex, icon: d.icon, academyModuleId },
    });
    domainBySlug.set(d.slug, row.id);
  }
  console.log(`✅ ${studyDomains.length} study domains upserted`);

  // 4. Academy Lessons (126) — depends on AcademyModule.
  const lessonByCode = new Map<string, number>();
  for (const l of academyLessonSeeds) {
    const moduleId = moduleBySlug.get(l.moduleSlug);
    if (!moduleId) throw new Error(`Seed error: lesson ${l.lessonCode} references unknown module '${l.moduleSlug}'`);
    const row = await prisma.academyLesson.upsert({
      where: { lessonCode: l.lessonCode },
      update: { moduleId, title: l.title, contentType: 'lesson', contentMd: l.contentMd, durationMinutes: l.durationMinutes, tier: l.tier, sortOrder: l.sortOrder },
      create: { moduleId, lessonCode: l.lessonCode, title: l.title, contentType: 'lesson', contentMd: l.contentMd, durationMinutes: l.durationMinutes, tier: l.tier, sortOrder: l.sortOrder },
    });
    lessonByCode.set(l.lessonCode, row.id);
  }
  console.log(`✅ ${academyLessonSeeds.length} academy lessons upserted`);

  for (const [slug, moduleId] of moduleBySlug) {
    const count = academyLessonSeeds.filter((l) => l.moduleSlug === slug).length;
    await prisma.academyModule.update({ where: { id: moduleId }, data: { totalLessons: count } });
  }

  // 4b. Quiz-type AcademyLesson rows (content_type=quiz) for QuizQuestion's FK.
  const quizLessonCodes = [...new Set(quizQuestionSeeds.map((q) => q.lessonCode))];
  const prefixToModule: Record<string, string> = {
    JS: 'javascript-internals', TS: 'advanced-typescript', RE: 'advanced-react',
    NO: 'nodejs-nestjs', PG: 'postgresql', DO: 'docker',
    SD: 'system-design', AI: 'ai-assisted-dev', DE: 'german-a1-a2',
  };
  for (const code of quizLessonCodes) {
    if (lessonByCode.has(code)) continue;
    const prefix = code.match(/^[A-Z]+/)?.[0] ?? '';
    const moduleSlug = prefixToModule[prefix];
    const moduleId = moduleSlug ? moduleBySlug.get(moduleSlug) : undefined;
    if (!moduleId) throw new Error(`Seed error: quiz lesson ${code} has no resolvable module`);
    const row = await prisma.academyLesson.upsert({
      where: { lessonCode: code },
      update: {},
      create: { moduleId, lessonCode: code, title: `Quiz: ${code}`, contentType: 'quiz', contentMd: `# Quiz: ${code}\n\nReal content written in M23.`, durationMinutes: 15, tier: 'MVP', sortOrder: 999 },
    });
    lessonByCode.set(code, row.id);
  }
  console.log(`✅ ${quizLessonCodes.length} quiz-type lesson rows ensured`);

  // 5. Quiz Questions (140) — delete-and-recreate per lesson for idempotency.
  for (const code of quizLessonCodes) {
    const lessonId = lessonByCode.get(code);
    if (!lessonId) continue;
    await prisma.quizQuestion.deleteMany({ where: { lessonId } });
  }
  await prisma.quizQuestion.createMany({
    data: quizQuestionSeeds.map((q) => ({
      lessonId: lessonByCode.get(q.lessonCode)!,
      question: q.question, optionA: q.optionA, optionB: q.optionB, optionC: q.optionC, optionD: q.optionD,
      correctOption: q.correctOption, explanation: q.explanation, sortOrder: q.sortOrder,
    })),
  });
  console.log(`✅ ${quizQuestionSeeds.length} quiz questions upserted`);

  // 6. Plan Months — depends on StudyDomain for primaryDomainId.
  const monthByNumber = new Map<number, number>();
  for (const m of planMonths) {
    const primaryDomainId = m.domainSlug ? domainBySlug.get(m.domainSlug) ?? null : null;
    const row = await prisma.planMonth.upsert({
      where: { monthNumber: m.monthNumber },
      update: { theme: m.theme, phaseName: m.phaseName, primaryDomainId, hoursPerWeek: m.hoursPerWeek, germanTarget: m.germanTarget, milestoneDescription: m.milestoneDescription },
      create: { monthNumber: m.monthNumber, theme: m.theme, phaseName: m.phaseName, primaryDomainId, hoursPerWeek: m.hoursPerWeek, germanTarget: m.germanTarget, milestoneDescription: m.milestoneDescription },
    });
    monthByNumber.set(m.monthNumber, row.id);
  }
  console.log(`✅ ${planMonths.length} plan months upserted`);

  // 7. Plan Weeks — depends on PlanMonth.
  for (const w of planWeeks) {
    const monthId = monthByNumber.get(w.monthNumber);
    if (!monthId) throw new Error(`Seed error: week ${w.weekNumber} references unknown month ${w.monthNumber}`);
    const domainIds = w.domainSlugs.map((slug) => domainBySlug.get(slug)).filter((id): id is number => id !== undefined);
    await prisma.planWeek.upsert({
      where: { monthId_weekNumber: { monthId, weekNumber: w.weekNumber } },
      update: { tasksSummary: w.tasksSummary, deliverable: w.deliverable, domainIds, germanFocus: w.germanFocus },
      create: { monthId, weekNumber: w.weekNumber, tasksSummary: w.tasksSummary, deliverable: w.deliverable, domainIds, germanFocus: w.germanFocus },
    });
  }
  console.log(`✅ ${planWeeks.length} plan weeks upserted`);

  // 8. German Units — standalone reference data.
  for (const g of germanUnits) {
    await prisma.germanUnit.upsert({
      where: { level_unitNumber: { level: g.level, unitNumber: g.unitNumber } },
      update: { title: g.title, targetMonth: g.targetMonth },
      create: { level: g.level, unitNumber: g.unitNumber, title: g.title, targetMonth: g.targetMonth },
    });
  }
  console.log(`✅ ${germanUnits.length} German units upserted`);

  // 9. Visa Documents — depends on User; no natural unique key, so findFirst.
  for (const v of visaDocuments) {
    const existing = await prisma.visaDocument.findFirst({ where: { userId: user.id, documentName: v.documentName } });
    if (existing) {
      await prisma.visaDocument.update({ where: { id: existing.id }, data: { description: v.description, category: v.category, isRequiredForBlueCard: v.isRequiredForBlueCard, sortOrder: v.sortOrder } });
    } else {
      await prisma.visaDocument.create({ data: { userId: user.id, documentName: v.documentName, description: v.description, category: v.category, isRequiredForBlueCard: v.isRequiredForBlueCard, sortOrder: v.sortOrder } });
    }
  }
  console.log(`✅ ${visaDocuments.length} visa documents upserted`);

  // 10. Portfolio Projects + Milestones — depends on User.
  let totalMilestones = 0;
  for (const p of portfolioProjects) {
    const project = await prisma.portfolioProject.upsert({
      where: { slug: p.slug },
      update: { name: p.name, description: p.description, techStack: p.techStack, sortOrder: p.sortOrder },
      create: { userId: user.id, slug: p.slug, name: p.name, description: p.description, techStack: p.techStack, sortOrder: p.sortOrder },
    });
    for (const m of p.milestones) {
      const existing = await prisma.projectMilestone.findFirst({ where: { projectId: project.id, name: m.name } });
      if (existing) {
        await prisma.projectMilestone.update({ where: { id: existing.id }, data: { category: m.category, sortOrder: m.sortOrder } });
      } else {
        await prisma.projectMilestone.create({ data: { projectId: project.id, name: m.name, category: m.category, sortOrder: m.sortOrder } });
      }
      totalMilestones += 1;
    }
  }
  console.log(`✅ ${portfolioProjects.length} portfolio projects upserted`);
  console.log(`✅ ${totalMilestones} project milestones upserted`);

  console.log('\n🎉 Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
