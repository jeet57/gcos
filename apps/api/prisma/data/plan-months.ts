/**
 * 12 plan months, transcribed from the original 12-Month Career Plan.
 * Portfolio Project references updated to PRD v2's 2-project model
 * (Project 1 = GCOS, Project 2 = AI Full-Stack SaaS).
 * domainSlug resolves to study_domains.id at seed time (primaryDomainId).
 */
export interface PlanMonthSeed {
  monthNumber: number;
  theme: string;
  phaseName: string;
  domainSlug: string | null;
  hoursPerWeek: number;
  germanTarget: string;
  milestoneDescription: string;
}

export const planMonths: PlanMonthSeed[] = [
  {
    monthNumber: 1,
    theme: 'TypeScript Mastery + Testing Foundation',
    phaseName: 'Foundation',
    domainSlug: 'typescript',
    hoursPerWeek: 16,
    germanTarget: 'A1 Unit 3',
    milestoneDescription:
      "You can write fully typed generic functions without using 'any'. You have a test setup and understand the testing pyramid. German A1 Unit 3 completed.",
  },
  {
    monthNumber: 2,
    theme: 'Advanced React + Component Architecture',
    phaseName: 'Foundation',
    domainSlug: 'react',
    hoursPerWeek: 16,
    germanTarget: 'A1 Unit 6',
    milestoneDescription:
      'You can explain React rendering, reconciliation, and state management choices in a 20-minute technical discussion. First technical article published online.',
  },
  {
    monthNumber: 3,
    theme: 'Node.js Fundamentals + GCOS Backend Begins',
    phaseName: 'Foundation',
    domainSlug: 'nodejs',
    hoursPerWeek: 18,
    germanTarget: 'A1 complete',
    milestoneDescription:
      'You have a working full-stack local dev environment for GCOS (Portfolio Project 1). Node.js event loop is something you can explain confidently. German A1 completed.',
  },
  {
    monthNumber: 4,
    theme: 'NestJS + Docker + GCOS MVP Completion',
    phaseName: 'Foundation',
    domainSlug: 'nestjs',
    hoursPerWeek: 18,
    germanTarget: 'A2 Unit 4',
    milestoneDescription:
      'GCOS (Portfolio Project 1) is live, deployed, tested, and on GitHub. You now have a full-stack project to show in applications. German A2 Unit 4.',
  },
  {
    monthNumber: 5,
    theme: 'System Design + LinkedIn Profile + Start Applying',
    phaseName: 'Market Preparation',
    domainSlug: 'system-design',
    hoursPerWeek: 18.5,
    germanTarget: 'A2 Unit 8',
    milestoneDescription:
      'LinkedIn is Germany-ready. First 10 applications sent. System design basics covered. npm package published (even if tiny — it shows up in your profile).',
  },
  {
    monthNumber: 6,
    theme: 'AWS Certification + AI SaaS Architecture Planning',
    phaseName: 'Market Preparation',
    domainSlug: 'aws',
    hoursPerWeek: 18.5,
    germanTarget: 'A2 nearly complete',
    milestoneDescription:
      'AWS Cloud Practitioner CERTIFIED. AI Full-Stack SaaS (Portfolio Project 2) architecture documented. Application pipeline at 15/week. German A2 nearly complete.',
  },
  {
    monthNumber: 7,
    theme: 'AI Full-Stack SaaS Build + Interview Prep Begins',
    phaseName: 'Active Pipeline',
    domainSlug: 'ai-integration',
    hoursPerWeek: 18.5,
    germanTarget: 'A2 complete',
    milestoneDescription:
      'AI Full-Stack SaaS (Portfolio Project 2 / TechBrief) is live. Interview preparation underway. Applications now at 20/week. German A2 achieved.',
  },
  {
    monthNumber: 8,
    theme: 'AI Integration Depth + System Design Practice',
    phaseName: 'Active Pipeline',
    domainSlug: 'ai-integration',
    hoursPerWeek: 18.5,
    germanTarget: 'A2 maintained',
    milestoneDescription:
      'AI integration skills deepened on Portfolio Project 2. System design practice ongoing. 160+ total applications sent.',
  },
  {
    monthNumber: 9,
    theme: 'Full Interview Prep + Mock Interviews',
    phaseName: 'Active Pipeline',
    domainSlug: 'system-design',
    hoursPerWeek: 18.5,
    germanTarget: 'A2 + work vocab',
    milestoneDescription:
      'Both portfolio projects (GCOS + AI SaaS) live. Full interview prep active. 200+ total applications sent. Expect 3–5 active interview processes.',
  },
  {
    monthNumber: 10,
    theme: 'Interview Execution + Offer Strategy',
    phaseName: 'Interview Execution',
    domainSlug: null,
    hoursPerWeek: 16,
    germanTarget: 'Interview phrases fluent',
    milestoneDescription:
      'Salary strategy prepared. System design fluency at senior level. Active offers or final rounds in progress. Blue Card documentation list ready.',
  },
  {
    monthNumber: 11,
    theme: 'Offer Evaluation + Visa Process Begins',
    phaseName: 'Offer & Relocation',
    domainSlug: null,
    hoursPerWeek: 13.5,
    germanTarget: 'A2 reading — apartment listings',
    milestoneDescription:
      'One signed offer in hand or very close. Visa documentation underway. Relocation research complete.',
  },
  {
    monthNumber: 12,
    theme: 'Relocation Preparation + Onboarding Readiness',
    phaseName: 'Offer & Relocation',
    domainSlug: null,
    hoursPerWeek: 9,
    germanTarget: '3-minute German self-introduction ready',
    milestoneDescription:
      'Visa in process or approved. Relocation date set. You are job-ready for Germany.',
  },
];
