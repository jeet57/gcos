/**
 * 11 study domains (PRD v2 §2 Master Resource Guide + TAD §4.2 Group 2).
 * `academyModuleSlug` is resolved to a real academyModuleId at seed time in
 * seed.ts, after academy-modules.ts has been upserted — AcademyModule must
 * be seeded before StudyDomain for that FK to resolve (PRD v2 §7.2 addition:
 * study_domains.academy_module_id).
 */
export interface StudyDomainSeed {
  slug: string;
  name: string;
  description: string;
  priority: number;
  primaryMonth: number;
  colorHex: string;
  icon: string;
  academyModuleSlug: string | null;
}

export const studyDomains: StudyDomainSeed[] = [
  {
    slug: 'typescript',
    name: 'Advanced TypeScript',
    description:
      'Generics, conditional types, mapped types, utility types, discriminated unions — the depth German interviewers test beyond basic TS usage.',
    priority: 1,
    primaryMonth: 1,
    colorHex: '#3178C6',
    icon: 'typescript',
    academyModuleSlug: 'advanced-typescript',
  },
  {
    slug: 'react',
    name: 'Advanced React',
    description:
      'React internals, rendering behaviour, RSC vs Client Components, performance patterns, and architectural decision-making for senior interviews.',
    priority: 2,
    primaryMonth: 2,
    colorHex: '#61DAFB',
    icon: 'react',
    academyModuleSlug: 'advanced-react',
  },
  {
    slug: 'nodejs',
    name: 'Node.js + NestJS',
    description:
      'Node.js event loop, Express foundations, and NestJS architecture (modules, guards, pipes, DI) — the career-unlocking module per PRD v2 §2.3.',
    priority: 3,
    primaryMonth: 3,
    colorHex: '#339933',
    icon: 'nodejs',
    academyModuleSlug: 'nodejs-nestjs',
  },
  {
    slug: 'nestjs',
    name: 'NestJS Deep Dive',
    description:
      'Production-grade NestJS: guards, interceptors, exception filters, JWT auth, Prisma integration, testing. Shares its Academy module with Node.js.',
    priority: 4,
    primaryMonth: 4,
    colorHex: '#E0234E',
    icon: 'nestjs',
    academyModuleSlug: 'nodejs-nestjs',
  },
  {
    slug: 'postgresql',
    name: 'PostgreSQL',
    description:
      'Schema design, joins, window functions, indexes, EXPLAIN ANALYZE, transactions — SQL depth beyond ORM usage that German take-homes test.',
    priority: 5,
    primaryMonth: 3,
    colorHex: '#336791',
    icon: 'postgresql',
    academyModuleSlug: 'postgresql',
  },
  {
    slug: 'docker',
    name: 'Docker',
    description:
      'Dockerfiles, docker-compose, multi-stage builds, CI/CD integration — the senior-engineer signal that takes 2-3 weeks to build credibly.',
    priority: 6,
    primaryMonth: 4,
    colorHex: '#2496ED',
    icon: 'docker',
    academyModuleSlug: 'docker',
  },
  {
    slug: 'aws',
    name: 'AWS',
    description:
      'Cloud Practitioner certification scope: IAM, EC2, S3, RDS, Lambda, CloudFront — practical deployment skills plus the credential itself.',
    priority: 7,
    primaryMonth: 6,
    colorHex: '#FF9900',
    icon: 'aws',
    academyModuleSlug: null,
  },
  {
    slug: 'system-design',
    name: 'System Design',
    description:
      'Frontend system design (component APIs, design systems, micro-frontends) plus distributed system basics — both tested in German senior interviews.',
    priority: 8,
    primaryMonth: 5,
    colorHex: '#6366F1',
    icon: 'system-design',
    academyModuleSlug: 'system-design',
  },
  {
    slug: 'ai-integration',
    name: 'AI Integration for Developers',
    description:
      'OpenAI API, Vercel AI SDK, prompt engineering, RAG fundamentals — practical AI feature-building, not ML theory.',
    priority: 9,
    primaryMonth: 8,
    colorHex: '#10A37F',
    icon: 'ai',
    academyModuleSlug: 'ai-assisted-dev',
  },
  {
    slug: 'german',
    name: 'German Language A1–A2',
    description:
      'Structured grammar and vocabulary from Deutsche Welle A1/A2 curriculum, plus tech and interview-specific vocabulary.',
    priority: 10,
    primaryMonth: 1,
    colorHex: '#000000',
    icon: 'german',
    academyModuleSlug: 'german-a1-a2',
  },
  {
    slug: 'ai-tooling',
    name: 'AI-Assisted Development',
    description:
      'Claude Code, Cursor, MCP, and AI-assisted workflows — the meta-skill of building software faster with AI tools (PRD v2 §04).',
    priority: 11,
    primaryMonth: 1,
    colorHex: '#D97757',
    icon: 'claude',
    academyModuleSlug: 'ai-assisted-dev',
  },
];
