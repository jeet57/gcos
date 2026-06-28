/**
 * 9 Academy modules (PRD v2 §3.1 Academy Structure table).
 * Must be seeded BEFORE study-domains.ts, since StudyDomain.academyModuleId
 * is a FK into this table (PRD v2 §7.2 addition).
 */
export interface AcademyModuleSeed {
  slug: string;
  title: string;
  description: string;
  icon: string;
  colorHex: string;
  sortOrder: number;
  estimatedHours: number;
}

export const academyModules: AcademyModuleSeed[] = [
  {
    slug: 'javascript-internals',
    title: 'JavaScript Internals',
    description:
      'Event loop, closures, prototype chain, this binding, hoisting, async/await — the questions that eliminate framework-only candidates in German senior interviews.',
    icon: 'javascript',
    colorHex: '#F7DF1E',
    sortOrder: 1,
    estimatedHours: 3.0,
  },
  {
    slug: 'advanced-typescript',
    title: 'Advanced TypeScript',
    description:
      'Generics, conditional types, mapped types, utility types, discriminated unions — type-level programming depth beyond basic application TypeScript.',
    icon: 'typescript',
    colorHex: '#3178C6',
    sortOrder: 2,
    estimatedHours: 3.5,
  },
  {
    slug: 'advanced-react',
    title: 'Advanced React',
    description:
      'React rendering internals, RSC vs Client Components, performance patterns, state management architecture, and accessibility.',
    icon: 'react',
    colorHex: '#61DAFB',
    sortOrder: 3,
    estimatedHours: 4.0,
  },
  {
    slug: 'nodejs-nestjs',
    title: 'Node.js + NestJS',
    description:
      'Node.js event loop and streams, plus production-grade NestJS: modules, guards, pipes, JWT auth, Prisma integration, testing.',
    icon: 'nodejs',
    colorHex: '#339933',
    sortOrder: 4,
    estimatedHours: 4.5,
  },
  {
    slug: 'postgresql',
    title: 'PostgreSQL',
    description:
      'Schema design, joins, window functions, indexes, EXPLAIN ANALYZE, transactions, and Prisma ORM workflow.',
    icon: 'postgresql',
    colorHex: '#336791',
    sortOrder: 5,
    estimatedHours: 2.5,
  },
  {
    slug: 'docker',
    title: 'Docker',
    description:
      'Images and containers, Dockerfiles, docker-compose, environment configuration, and Docker in CI/CD pipelines.',
    icon: 'docker',
    colorHex: '#2496ED',
    sortOrder: 6,
    estimatedHours: 2.0,
  },
  {
    slug: 'system-design',
    title: 'System Design',
    description:
      'Frontend system design (component APIs, design systems, micro-frontends) and distributed system fundamentals, framed for interview delivery.',
    icon: 'system-design',
    colorHex: '#6366F1',
    sortOrder: 7,
    estimatedHours: 3.5,
  },
  {
    slug: 'ai-assisted-dev',
    title: 'AI-Assisted Development',
    description:
      'Claude Code, Cursor, MCP, prompt engineering for code generation, and practical OpenAI/Vercel AI SDK integration.',
    icon: 'claude',
    colorHex: '#D97757',
    sortOrder: 8,
    estimatedHours: 2.5,
  },
  {
    slug: 'german-a1-a2',
    title: 'German A1/A2',
    description:
      'Structured Goethe-aligned A1 and A2 curriculum: grammar, vocabulary, tech vocabulary, and interview phrases.',
    icon: 'german',
    colorHex: '#000000',
    sortOrder: 9,
    estimatedHours: 6.0,
  },
];
