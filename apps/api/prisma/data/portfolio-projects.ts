export interface PortfolioProjectSeed {
  slug: string;
  name: string;
  description: string;
  techStack: string[];
  sortOrder: number;
  milestones: {
    name: string;
    category: 'backend' | 'frontend' | 'testing' | 'deployment' | 'documentation' | 'performance';
    sortOrder: number;
  }[];
}

export const portfolioProjects: PortfolioProjectSeed[] = [
  {
    slug: 'gcos',
    name: 'GCOS — Germany Career Operating System',
    description:
      'Full-stack career management platform built using Next.js 14, NestJS, PostgreSQL, and Prisma.',
    techStack: ['Next.js 14', 'TypeScript', 'NestJS', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'shadcn/ui', 'TanStack Query', 'Zustand', 'Docker', 'Turborepo'],
    sortOrder: 1,
    milestones: [
      { name: 'Monorepo scaffold & tooling (M01)', category: 'backend', sortOrder: 1 },
      { name: 'Docker Compose + environment config (M02)', category: 'deployment', sortOrder: 2 },
      { name: 'Prisma schema — full 34-table definition (M03)', category: 'backend', sortOrder: 3 },
      { name: 'Database seed — all reference data (M04)', category: 'backend', sortOrder: 4 },
      { name: 'Shared design system package (M05)', category: 'frontend', sortOrder: 5 },
      { name: 'NestJS bootstrap — global providers (M07)', category: 'backend', sortOrder: 6 },
      { name: 'JWT authentication + refresh rotation (M08)', category: 'backend', sortOrder: 7 },
      { name: 'Readiness score engine + dashboard API (M09-M10)', category: 'backend', sortOrder: 8 },
      { name: 'Academy module — lessons, quizzes, progress (M12)', category: 'backend', sortOrder: 9 },
      { name: 'Dashboard + Academy frontend pages (M18-M19)', category: 'frontend', sortOrder: 10 },
      { name: '80%+ test coverage on core services (M09, M25)', category: 'testing', sortOrder: 11 },
      { name: 'CI/CD pipeline + production deploy (M24)', category: 'deployment', sortOrder: 12 },
    ],
  },
  {
    slug: 'techbrief-ai-saas',
    name: 'TechBrief — AI Full-Stack SaaS',
    description:
      'AI-powered daily engineering newsletter personalised to the user\u2019s tech stack, with freemium Stripe billing.',
    techStack: ['Next.js 14', 'TypeScript', 'NestJS', 'PostgreSQL', 'Prisma', 'pgvector', 'Anthropic Claude API', 'OpenAI API', 'Vercel AI SDK', 'Stripe', 'Redis'],
    sortOrder: 2,
    milestones: [
      { name: 'Product spec + architecture document', category: 'documentation', sortOrder: 1 },
      { name: 'NestJS backend — multi-user schema + auth', category: 'backend', sortOrder: 2 },
      { name: 'AI integration — streaming chat completions', category: 'backend', sortOrder: 3 },
      { name: 'Web search tool + daily briefing generation cron', category: 'backend', sortOrder: 4 },
      { name: 'Stripe subscription + freemium usage limits', category: 'backend', sortOrder: 5 },
      { name: 'Next.js dashboard — streaming UI', category: 'frontend', sortOrder: 6 },
      { name: 'Deployment — Railway/Fly.io + Vercel + Supabase', category: 'deployment', sortOrder: 7 },
      { name: 'Case study README — problem, architecture, decisions', category: 'documentation', sortOrder: 8 },
    ],
  },
];
