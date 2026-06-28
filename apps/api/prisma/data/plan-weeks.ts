/**
 * 48 plan weeks (4 per month × 12 months), transcribed from the original
 * 12-Month Career Plan's weekly task tables. domainSlugs map to
 * study_domains.id array (PlanWeek.domainIds) at seed time. Portfolio
 * Project references updated to PRD v2's 2-project model.
 */
export interface PlanWeekSeed {
  monthNumber: number;
  weekNumber: number;
  tasksSummary: string;
  deliverable: string;
  domainSlugs: string[];
  germanFocus: string;
}

export const planWeeks: PlanWeekSeed[] = [
  // ───────────────────────────── MONTH 1 ─────────────────────────────
  {
    monthNumber: 1,
    weekNumber: 1,
    tasksSummary:
      'Advanced TS: Generics (constrained, infer keyword, conditional types). Read totaltypescript.com exercises — complete Generics module.',
    deliverable: 'TS Generics exercises on GitHub',
    domainSlugs: ['typescript'],
    germanFocus: 'Duolingo day 1, DW A1 Unit 1',
  },
  {
    monthNumber: 1,
    weekNumber: 2,
    tasksSummary:
      'Advanced TS: Mapped types, template literal types, utility types deep dive (ReturnType, Parameters, Awaited, Readonly).',
    deliverable: "Typed utility function library — 10 functions, zero 'any'",
    domainSlugs: ['typescript'],
    germanFocus: 'DW A1 Unit 2',
  },
  {
    monthNumber: 1,
    weekNumber: 3,
    tasksSummary:
      'Advanced TS: Discriminated unions, exhaustive switches, type narrowing patterns. Refactor one existing personal project to strict TypeScript.',
    deliverable: 'Existing project: strict mode, zero TS errors',
    domainSlugs: ['typescript'],
    germanFocus: 'DW A1 Unit 3',
  },
  {
    monthNumber: 1,
    weekNumber: 4,
    tasksSummary:
      'Testing: Vitest setup + unit testing philosophy. React Testing Library: testing behavior over implementation. Set up Vitest in a new Next.js project.',
    deliverable: 'New Next.js project with Vitest + RTL configured, 5 tests written',
    domainSlugs: ['typescript'],
    germanFocus: 'A1 self-introduction scripted',
  },

  // ───────────────────────────── MONTH 2 ─────────────────────────────
  {
    monthNumber: 2,
    weekNumber: 1,
    tasksSummary:
      'React internals: reconciliation, fiber architecture (conceptual). React rendering behaviour: when re-renders happen, StrictMode double-render. React Server Components vs Client Components in Next.js App Router.',
    deliverable: "Write a blog post or README: 'When NOT to use useCallback' — publish to dev.to",
    domainSlugs: ['react'],
    germanFocus: 'DW A1 Unit 4',
  },
  {
    monthNumber: 2,
    weekNumber: 2,
    tasksSummary:
      "Advanced patterns: compound components, render props vs hooks, controlled vs uncontrolled at scale. Read React docs 'Escape Hatches' fully.",
    deliverable: 'Compound component: build a fully accessible Tabs component',
    domainSlugs: ['react'],
    germanFocus: 'DW A1 Unit 5',
  },
  {
    monthNumber: 2,
    weekNumber: 3,
    tasksSummary:
      'Performance: Profiler tool deep dive, virtualization with TanStack Virtual, lazy loading images + components, bundle analysis with next-bundle-analyzer.',
    deliverable: 'Performance audit of existing codebase — Lighthouse 90+ score',
    domainSlugs: ['react'],
    germanFocus: 'DW A1 Unit 6',
  },
  {
    monthNumber: 2,
    weekNumber: 4,
    tasksSummary:
      'State management decision matrix: Zustand vs Redux Toolkit vs React Query vs Context. Build 3 identical features with different state approaches.',
    deliverable: '3-approach comparison repo on GitHub with README explaining trade-offs',
    domainSlugs: ['react'],
    germanFocus: 'A1 alphabet + numbers fluent',
  },

  // ───────────────────────────── MONTH 3 ─────────────────────────────
  {
    monthNumber: 3,
    weekNumber: 1,
    tasksSummary:
      'Node.js internals: event loop phases, call stack, microtask queue, libuv. Must be able to explain this in an interview. Node.js streams (conceptual).',
    deliverable: 'Predict output of 10 async JS puzzles — write explanations',
    domainSlugs: ['nodejs'],
    germanFocus: 'DW A1 Unit 7',
  },
  {
    monthNumber: 3,
    weekNumber: 2,
    tasksSummary:
      'Express.js: routing, middleware chain, error handling middleware, request validation. Build a simple CRUD REST API with in-memory data.',
    deliverable: 'Express REST API: 5 endpoints, proper error handling, Postman collection',
    domainSlugs: ['nodejs'],
    germanFocus: 'DW A1 Unit 8',
  },
  {
    monthNumber: 3,
    weekNumber: 3,
    tasksSummary:
      'PostgreSQL setup + psql CLI basics. Schema design for GCOS (Portfolio Project 1). Joins, subqueries, EXPLAIN basics.',
    deliverable: 'Database schema for GCOS — ERD diagram',
    domainSlugs: ['nodejs', 'postgresql'],
    germanFocus: 'DW A1 complete — A1 Certificate if taking Goethe exam',
  },
  {
    monthNumber: 3,
    weekNumber: 4,
    tasksSummary:
      'Start GCOS (Portfolio Project 1): see GCOS Implementation Plan M01-M04. Set up Next.js frontend + NestJS backend + PostgreSQL. Docker Compose for local dev.',
    deliverable: 'GCOS repo live on GitHub with README, dev environment running',
    domainSlugs: ['nodejs', 'postgresql'],
    germanFocus: 'DW A2 Unit 1 begins',
  },

  // ───────────────────────────── MONTH 4 ─────────────────────────────
  {
    monthNumber: 4,
    weekNumber: 1,
    tasksSummary:
      'NestJS fundamentals: modules, controllers, providers, dependency injection. Migrate Express API to NestJS. Add Swagger/OpenAPI documentation.',
    deliverable: 'NestJS rewrite of Month 3 API — Swagger docs accessible at /api',
    domainSlugs: ['nestjs'],
    germanFocus: 'DW A2 Unit 2',
  },
  {
    monthNumber: 4,
    weekNumber: 2,
    tasksSummary:
      'NestJS: Guards (JWT auth), Pipes (validation with class-validator), Interceptors (logging, transform). Add authentication to GCOS backend.',
    deliverable: 'JWT auth working in GCOS — login, refresh token, protected routes',
    domainSlugs: ['nestjs'],
    germanFocus: 'DW A2 Unit 3',
  },
  {
    monthNumber: 4,
    weekNumber: 3,
    tasksSummary:
      'Docker: Dockerfile (multi-stage for Node), docker-compose for app+db+redis stack, environment variables, volumes. Containerize GCOS.',
    deliverable: 'GCOS runs with single: docker-compose up',
    domainSlugs: ['docker'],
    germanFocus: 'DW A2 Unit 4',
  },
  {
    monthNumber: 4,
    weekNumber: 4,
    tasksSummary:
      'GCOS finishing: add Vitest tests (80% coverage), Playwright E2E for 2 critical flows, deploy to AWS. Write detailed README.',
    deliverable: 'GCOS LIVE — deployed URL, GitHub repo, README with screenshots',
    domainSlugs: ['docker', 'nestjs'],
    germanFocus: 'A2 Unit 5',
  },

  // ───────────────────────────── MONTH 5 ─────────────────────────────
  {
    monthNumber: 5,
    weekNumber: 1,
    tasksSummary:
      'Frontend system design: component API design principles, design token architecture, Storybook setup. Read the Frontend System Design course (greatfrontend.com).',
    deliverable: 'Design system starter: button, input, modal — published to npm (even as 0.0.1)',
    domainSlugs: ['system-design'],
    germanFocus: 'DW A2 Unit 6',
  },
  {
    monthNumber: 5,
    weekNumber: 2,
    tasksSummary:
      'Distributed system design basics: scalability, load balancers, CDN, caching strategies, database scaling. Read 5 system design examples on system-design-primer.',
    deliverable: "Sketch system design for 'Design Twitter frontend' — written doc",
    domainSlugs: ['system-design'],
    germanFocus: 'DW A2 Unit 7',
  },
  {
    monthNumber: 5,
    weekNumber: 3,
    tasksSummary:
      'LinkedIn profile rewrite. Customise LinkedIn URL. Write German-market-targeted About section. Connect with 20 German engineers/recruiters.',
    deliverable: 'LinkedIn fully updated, 20 connections made in Germany',
    domainSlugs: ['system-design'],
    germanFocus: 'DW A2 Unit 8',
  },
  {
    monthNumber: 5,
    weekNumber: 4,
    tasksSummary:
      "First job applications: identify 15 German companies that actively hire visa-sponsored engineers (check LinkedIn — filter 'employees from India in Germany'). Apply to 10.",
    deliverable: '10 applications sent, tracking spreadsheet created',
    domainSlugs: ['system-design'],
    germanFocus: 'A2 conversational phrases',
  },

  // ───────────────────────────── MONTH 6 ─────────────────────────────
  {
    monthNumber: 6,
    weekNumber: 1,
    tasksSummary: 'AWS CP study: IAM, EC2, S3, pricing model — Stephane Maarek course Sections 1–8.',
    deliverable: 'AWS study notes: one-page summary of each service',
    domainSlugs: ['aws'],
    germanFocus: 'DW A2 Unit 9',
  },
  {
    monthNumber: 6,
    weekNumber: 2,
    tasksSummary:
      'AWS CP study: RDS, Lambda, CloudFront, VPC basics, security groups — Sections 9–15. Practice exam #1 (target 70%+).',
    deliverable: 'Practice exam score documented, weak areas identified',
    domainSlugs: ['aws'],
    germanFocus: 'DW A2 Unit 10',
  },
  {
    monthNumber: 6,
    weekNumber: 3,
    tasksSummary:
      'AWS CP: revision + practice exams 2 and 3. Book actual exam. Start AI Full-Stack SaaS (Portfolio Project 2) architecture doc.',
    deliverable: 'AWS exam booked. AI SaaS README + schema written.',
    domainSlugs: ['aws'],
    germanFocus: 'A2 Unit 11',
  },
  {
    monthNumber: 6,
    weekNumber: 4,
    tasksSummary:
      'Take AWS Cloud Practitioner exam. Begin AI Full-Stack SaaS backend (NestJS + PostgreSQL setup). Applications: 15 this week.',
    deliverable: 'AWS CP certificate earned. AI SaaS repo initialised.',
    domainSlugs: ['aws'],
    germanFocus: 'A2 conversations',
  },

  // ───────────────────────────── MONTH 7 ─────────────────────────────
  {
    monthNumber: 7,
    weekNumber: 1,
    tasksSummary:
      'AI Full-Stack SaaS frontend: Next.js App Router, React Server Components, Tailwind. Focus on performance (LCP < 2s).',
    deliverable: 'AI SaaS: homepage + core feature UI complete',
    domainSlugs: ['ai-integration', 'react'],
    germanFocus: 'A2 revision — work vocabulary',
  },
  {
    monthNumber: 7,
    weekNumber: 2,
    tasksSummary:
      'AI Full-Stack SaaS backend: NestJS API complete, Postgres schema, Prisma. Add CI/CD with GitHub Actions.',
    deliverable: 'AI SaaS: full API working locally',
    domainSlugs: ['ai-integration', 'nestjs'],
    germanFocus: 'A2 work email writing',
  },
  {
    monthNumber: 7,
    weekNumber: 3,
    tasksSummary:
      'Interview prep: LeetCode — Arrays, Strings, HashMaps (Easy/Medium only). German companies do not do heavy LeetCode but some do timed assessments. 30 min/day.',
    deliverable: '10 LeetCode problems solved, documented with explanations',
    domainSlugs: ['ai-integration'],
    germanFocus: 'A2 phone vocabulary',
  },
  {
    monthNumber: 7,
    weekNumber: 4,
    tasksSummary:
      'AI Full-Stack SaaS: Vitest tests, Playwright E2E, deploy, write detailed case study README (problem → solution → tech decisions).',
    deliverable: 'AI SaaS LIVE with case study README',
    domainSlugs: ['ai-integration'],
    germanFocus: 'A2 practice with italki tutor',
  },

  // ───────────────────────────── MONTH 8 ─────────────────────────────
  {
    monthNumber: 8,
    weekNumber: 1,
    tasksSummary:
      'AI integration: OpenAI API — chat completions, streaming, function calling. Vercel AI SDK with Next.js. Build a small AI proof of concept.',
    deliverable: 'Working AI chat integration — streamed responses in Next.js',
    domainSlugs: ['ai-integration'],
    germanFocus: "Maintain A2, study 'Arbeit' (work) vocabulary",
  },
  {
    monthNumber: 8,
    weekNumber: 2,
    tasksSummary:
      'AI integration deepening on AI Full-Stack SaaS: RAG basics, embeddings, refine prompt engineering for structured output.',
    deliverable: 'AI SaaS: AI feature spec refined with RAG approach documented',
    domainSlugs: ['ai-integration'],
    germanFocus: 'continue maintenance',
  },
  {
    monthNumber: 8,
    weekNumber: 3,
    tasksSummary:
      'System design deep dive: micro-frontend architecture with Module Federation. This is asked in senior German frontend interviews.',
    deliverable: 'Module Federation spike: two MFEs communicating',
    domainSlugs: ['system-design'],
    germanFocus: 'continue',
  },
  {
    monthNumber: 8,
    weekNumber: 4,
    tasksSummary:
      'Interview prep: system design practice — do 2 full mock designs (whiteboard-style, 45 min each). Frontend: design a typeahead search. Distributed: design a URL shortener.',
    deliverable: '2 system design write-ups documented on GitHub',
    domainSlugs: ['system-design'],
    germanFocus: 'A2 maintained',
  },

  // ───────────────────────────── MONTH 9 ─────────────────────────────
  {
    monthNumber: 9,
    weekNumber: 1,
    tasksSummary:
      'AI Full-Stack SaaS: backend complete, frontend complete, AI feature integrated. Start writing case study.',
    deliverable: 'AI SaaS: feature complete',
    domainSlugs: ['ai-integration'],
    germanFocus: 'begin learning numbers/dates in professional context',
  },
  {
    monthNumber: 9,
    weekNumber: 2,
    tasksSummary:
      'AI Full-Stack SaaS: tests, deployment, case study README. This should be your best and most detailed write-up.',
    deliverable: 'AI SaaS LIVE — both portfolio projects (GCOS + AI SaaS) linked from GitHub profile',
    domainSlugs: ['ai-integration'],
    germanFocus: 'continue',
  },
  {
    monthNumber: 9,
    weekNumber: 3,
    tasksSummary:
      'Frontend interview prep: JavaScript internals questions (event loop, closures, prototype chain, hoisting, this binding). These are still tested. 20 questions answered in writing.',
    deliverable: 'Frontend interview Q&A document — 20 questions',
    domainSlugs: ['ai-integration'],
    germanFocus: 'continue',
  },
  {
    monthNumber: 9,
    weekNumber: 4,
    tasksSummary:
      'Full-stack interview prep: REST API design questions, database query questions, authentication flows. Mock interview with a peer or on Pramp.com.',
    deliverable: 'Completed 1 mock full-stack interview — recorded feedback',
    domainSlugs: ['system-design'],
    germanFocus: 'maintain A2 + start 5 sentences/day in German',
  },

  // ───────────────────────────── MONTH 10 ─────────────────────────────
  {
    monthNumber: 10,
    weekNumber: 1,
    tasksSummary:
      'Salary negotiation research: glassdoor.de, levels.fyi (Germany filter), LinkedIn Salary for your target roles. Prepare your number and your justification.',
    deliverable: 'Salary research doc: target range by city, justification points',
    domainSlugs: [],
    germanFocus: 'practice job interview phrases',
  },
  {
    monthNumber: 10,
    weekNumber: 2,
    tasksSummary:
      "Mock system design: design a 'real-time financial dashboard' — this is a realistic senior German frontend interview question. Time yourself: 45 minutes.",
    deliverable: 'System design write-up: real-time dashboard architecture',
    domainSlugs: ['system-design'],
    germanFocus: 'continue',
  },
  {
    monthNumber: 10,
    weekNumber: 3,
    tasksSummary:
      'Interview debrief ritual: after every technical screen, write down every question asked. Build your personal question bank.',
    deliverable: 'Personal question bank: 30+ questions documented',
    domainSlugs: [],
    germanFocus: 'continue',
  },
  {
    monthNumber: 10,
    weekNumber: 4,
    tasksSummary:
      'Counter-offer practice: role-play declining first offers, asking for time, countering with data. Review EU Blue Card requirements.',
    deliverable: 'Written counter-offer script prepared',
    domainSlugs: [],
    germanFocus: 'practice email writing',
  },

  // ───────────────────────────── MONTH 11 ─────────────────────────────
  {
    monthNumber: 11,
    weekNumber: 1,
    tasksSummary:
      'Offer evaluation: gross vs net salary calculator (brutto-netto-rechner.de). Health insurance options (public vs private). Understand relocation package norms.',
    deliverable: 'Offer evaluation scorecard created',
    domainSlugs: [],
    germanFocus: 'maintain A2',
  },
  {
    monthNumber: 11,
    weekNumber: 2,
    tasksSummary:
      'EU Blue Card: prepare documents — degree certificate (apostille), employment contract, credential recognition (anabin.kmk.org database).',
    deliverable: 'Blue Card document checklist — 90% complete',
    domainSlugs: [],
    germanFocus: 'formal letter writing practice',
  },
  {
    monthNumber: 11,
    weekNumber: 3,
    tasksSummary:
      'Negotiate: counter at least once on every offer. Use competing offers as leverage if you have them. Do not accept verbal offers — get it in writing.',
    deliverable: 'Negotiation completed on active offers',
    domainSlugs: [],
    germanFocus: 'continue',
  },
  {
    monthNumber: 11,
    weekNumber: 4,
    tasksSummary:
      'Apartment research: wg-gesucht.de, immobilienscout24.de. Neighbourhoods in target city. Cost of living calculator.',
    deliverable: 'City/neighbourhood shortlist with cost analysis',
    domainSlugs: [],
    germanFocus: 'A2 reading — apartment listings',
  },

  // ───────────────────────────── MONTH 12 ─────────────────────────────
  {
    monthNumber: 12,
    weekNumber: 1,
    tasksSummary:
      'Visa appointment (Ausländerbehörde or German consulate in India). Bring all documents. Book an appointment early — wait times are 4–8 weeks.',
    deliverable: 'Visa appointment booked',
    domainSlugs: [],
    germanFocus: 'practice appointment vocabulary',
  },
  {
    monthNumber: 12,
    weekNumber: 2,
    tasksSummary:
      "Onboarding preparation: read about German work culture (directness, punctuality, work-life separation, feedback culture). Read 'The Culture Map' chapter on Germany.",
    deliverable: 'Notes on German work culture written',
    domainSlugs: [],
    germanFocus: 'workplace phrases',
  },
  {
    monthNumber: 12,
    weekNumber: 3,
    tasksSummary:
      'Technical refresh: review your portfolio projects, re-read your own README files. Prepare for onboarding technical discussions.',
    deliverable: '3-minute German self-introduction scripted + rehearsed',
    domainSlugs: [],
    germanFocus: 'A2 — can hold a 3-minute professional self-introduction',
  },
  {
    monthNumber: 12,
    weekNumber: 4,
    tasksSummary:
      'Final prep: bank account (N26 or Wise for initial weeks), health insurance registration, tax ID (Steuer-ID) process.',
    deliverable: 'Financial setup checklist complete',
    domainSlugs: [],
    germanFocus: 'final A2 practice',
  },
];
