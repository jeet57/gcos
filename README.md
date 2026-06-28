# GCOS — Germany Career Operating System

Personal full-stack career management platform. This repository is built incrementally across 25 milestones defined in the GCOS Implementation Plan. **This commit delivers Milestone 1 (monorepo scaffold), Milestone 2 (Docker Compose + environment config), and Milestone 3 (Prisma schema — full 34-table definition).**

## What M01 Delivers

- Turborepo + pnpm workspaces monorepo
- TypeScript strict mode shared across every package via `@gcos/config`
- ESLint flat config (v9) shared across every package
- Prettier shared config
- Husky pre-commit hook: blocks commits that fail `type-check` or `lint`
- `apps/web` — Next.js 14 App Router, boots and renders a page that proves both shared packages import correctly
- `apps/api` — NestJS, boots and serves `GET /health`
- `packages/types` — shared enums (`PipelineStage`, `LessonStatus`, `AiTool`, `RejectionReason`) + a generic `ApiResponse<T>` envelope type
- `packages/ui` — empty shell package, ready for shadcn/ui primitives in M06
- `packages/config` — single source of truth for `tsconfig`, `eslint`, and `prettier` config

## What M02 Delivers

- `docker-compose.yml` — PostgreSQL 15 (port 5432) + Redis 7 (port 6379), both with healthchecks
- Persistent named volume for Postgres data (`gcos_postgres_data`) so data survives container restarts
- `apps/api/.env.example` and `apps/api/.env.local` — `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT` documented (JWT variables are placeholders until M08 wires up auth)
- `apps/web/.env.example` and `apps/web/.env.local` — `NEXT_PUBLIC_API_URL` documented
- `.env.local` files are gitignored (confirmed via `git check-ignore`); `.env.example` files are tracked

## What M03 Delivers

- `apps/api/prisma/schema.prisma` — all **34 tables** from PRD v2 / TAD v1, organised into 11 groups (Core/Auth, Study Tracking, Job Pipeline, Portfolio, German Tracker, Networking, Interview Prep, Reviews & Score, Resume & Visa, Academy, AI Tooling)
- 25 native Postgres enums (the DB-level guarantee behind every "CHECK constraint" column TAD calls out — see the schema's top-of-file note for why enums were chosen over raw `@db` CHECK clauses)
- All foreign key relationships with explicit `onDelete: Cascade` where TAD implies it (e.g. deleting a `JobApplication` cascades to its `InterviewLog`/`TakeHomeAssignment` rows)
- All **8 critical indexes** from TAD Section 4.3, with explicit `map:` names matching the TAD exactly (`idx_study_user_date`, `idx_study_domain`, `idx_apps_stage`, `idx_apps_followup`, `idx_lesson_progress`, `idx_german_date`, `idx_score_date`, `idx_connections_type`)
- `apps/api/src/prisma/prisma.service.ts` + `prisma.module.ts` — global injectable wrapper with connection lifecycle management
- `PrismaModule` registered in `AppModule` (feature modules that *use* it are still M07+)
- `packages/types/src/prisma.ts` — re-exports all 34 Prisma-generated model types for use in `apps/web`

**One staff-engineering correction made during this milestone:** PRD v2 §7.2 lists a `project_count` column on `portfolio_projects`, which would be a redundant value duplicated on every row. The real intent — "this table holds a maximum of 2 projects" — is enforced as a seed-time invariant in M04, not as a schema column. See the inline comment above the `PortfolioProject` model.

**Explicitly NOT in M03** (per the Implementation Plan, these are later milestones):
- Database seed data (M04) — the schema exists but every table is empty
- The actual migration SQL file — see "Running Your First Migration" below for why this must be generated on your machine, not handed to you pre-written
- shadcn/ui primitives, Tailwind tokens (M05–M06)
- NestJS global providers, auth, feature modules (M07–M08)
- Any controller/service code that queries these tables — that's M09 onward

## Prerequisites

- Node.js ≥ 20.0.0
- pnpm ≥ 9.0.0 (install via `npm install -g pnpm` if you don't have it)

## Setup

```bash
# 1. Install all workspace dependencies
pnpm install

# 2. Start both apps in dev mode (Next.js on :3000, NestJS on :3001)
pnpm dev
```

Open:
- **http://localhost:3000** — Next.js app. You should see "GCOS — Monorepo Scaffold (M01)" with a confirmation that both `@gcos/types` and `@gcos/ui` resolved correctly.
- **http://localhost:3001/health** — NestJS health check. Should return `{"status":"ok","timestamp":"..."}`.

## Verifying the Build

```bash
# TypeScript strict mode check across every package
pnpm type-check

# ESLint across every package
pnpm lint

# Production build of every app and package
pnpm build
```

All three commands must exit with code 0 and no errors. This is the M01 acceptance bar.

## Verifying the Pre-commit Hook

```bash
git init   # if not already a git repo
git add .
git commit -m "test"
```

The Husky hook runs `pnpm type-check && pnpm lint` before allowing the commit. To verify it actually blocks bad commits, introduce a deliberate TypeScript error (e.g. `const x: string = 123;` anywhere) and try committing — it should fail and refuse the commit.

## Monorepo Structure

```
gcos/
├── apps/
│   ├── web/              ← Next.js 14 App Router (port 3000)
│   └── api/               ← NestJS (port 3001)
│       ├── prisma/
│       │   └── schema.prisma   ← All 34 tables (M03) — migrations/ generated on your machine
│       └── src/prisma/         ← PrismaService + PrismaModule
├── packages/
│   ├── types/             ← Shared TypeScript types — import as @gcos/types
│   ├── ui/                 ← Shared design system — import as @gcos/ui
│   └── config/             ← Shared tsconfig/eslint/prettier — @gcos/config
├── turbo.json              ← Build pipeline (dev/build/lint/test/type-check)
├── pnpm-workspace.yaml      ← Workspace package globs
├── docker-compose.yml        ← PostgreSQL 15 + Redis 7 (local dev only)
└── package.json             ← Root scripts
```

## Local Development

GCOS uses Docker Compose to run PostgreSQL and Redis locally. No other services are required at this milestone.

### 1. Start the database and cache

```bash
docker-compose up -d
```

This starts two containers:
- **gcos-postgres** — PostgreSQL 15, listening on `localhost:5432`, database `gcos_dev`, user `postgres`, password `password`
- **gcos-redis** — Redis 7, listening on `localhost:6379` (not consumed by any app code until V2 per TAD Section 9.2 — included now so the infrastructure exists ahead of need)

Check both containers are healthy:

```bash
docker-compose ps
```

Both should show `healthy` in the `STATUS` column within ~10 seconds of starting.

### 2. Verify PostgreSQL is reachable

```bash
psql -h localhost -U postgres -d gcos_dev
# Password: password
```

If you don't have `psql` installed locally, you can run it from inside the container instead:

```bash
docker exec -it gcos-postgres psql -U postgres -d gcos_dev
```

Either way you should land on a `gcos_dev=#` prompt. Type `\q` to exit.

### 3. Verify Redis is reachable

```bash
docker exec -it gcos-redis redis-cli ping
# Expected response: PONG
```

### 4. Configure environment variables

Both apps already have a working `.env.local` committed to your local checkout from this milestone — **for your own work going forward**, copy the `.env.example` files whenever you need a fresh environment (new machine, CI, etc.):

```bash
cp apps/api/.env.example apps/api/.env.local
cp apps/web/.env.example apps/web/.env.local
```

Then edit `apps/api/.env.local` and replace the two JWT placeholder values with real random strings:

```bash
openssl rand -base64 48
```

Run that twice and paste the two outputs into `JWT_SECRET` and `JWT_REFRESH_SECRET` respectively. (These aren't consumed by any code yet — `apps/api` has no auth module until M08 — but the variables are documented now so the full environment surface is known from M02 onward.)

### 5. Run your first Prisma migration

The schema in `apps/api/prisma/schema.prisma` defines all 34 tables, but **no migration file exists yet in this repository.** This is intentional: Prisma's migration engine generates exact, timestamped SQL by introspecting your real schema against your real running database — that file should be generated on your machine, not handed to you pre-written and potentially out of sync.

```bash
cd apps/api
pnpm prisma:generate          # generates the TypeScript client from schema.prisma
pnpm prisma:migrate           # creates and applies the first migration
```

When prompted for a migration name, use:
```
initial_schema
```

This creates `apps/api/prisma/migrations/<timestamp>_initial_schema/migration.sql` and applies it to your local `gcos_dev` database. **Commit this generated migration folder to git** — from this point forward, the migrations folder is the source of truth for schema history, not just `schema.prisma` alone.

Verify all 34 tables were created:

```bash
pnpm prisma:studio
```

This opens Prisma Studio in your browser at `http://localhost:5555`. You should see all 34 tables listed in the left sidebar, every one empty (seed data is M04).

Alternatively, verify directly via `psql`:

```bash
docker exec -it gcos-postgres psql -U postgres -d gcos_dev -c "\dt"
```

This should list 34 rows (plus Prisma's own `_prisma_migrations` bookkeeping table = 35 total).

### 6. Stopping the database

```bash
docker-compose down       # stops containers, keeps data volume
docker-compose down -v    # stops containers AND deletes the Postgres data volume
```

Use `down -v` only when you want a completely fresh database (e.g. after changing `POSTGRES_PASSWORD` or `POSTGRES_DB` in `docker-compose.yml`, or if a migration gets into a bad state during development and you want to start over).

## Troubleshooting

**`pnpm install` fails resolving `@gcos/*` packages** — confirm `pnpm-workspace.yaml` lists `apps/*` and `packages/*`, and that you're running pnpm ≥ 9 (workspace protocol support).

**Next.js page shows a module-not-found error for `@gcos/types` or `@gcos/ui`** — run `pnpm install` again from the repo root; pnpm needs to symlink the workspace packages into each app's `node_modules`.

**`docker-compose up -d` fails with a port conflict** — something else on your machine is already using port 5432 or 6379. Stop the conflicting service, or change the left-hand side of the port mapping in `docker-compose.yml` (e.g. `"5433:5432"`) and update `DATABASE_URL` in `apps/api/.env.local` to match.

**`psql` connects but says the database doesn't exist** — the `gcos_dev` database is created automatically by the `POSTGRES_DB` environment variable on first container start. If you previously ran Postgres with different settings, run `docker-compose down -v` to wipe the volume and start fresh.

**Containers show `(unhealthy)` in `docker-compose ps`** — wait a few more seconds; Postgres and Redis both take a moment to accept connections after starting. If it persists past 30 seconds, check `docker-compose logs postgres` or `docker-compose logs redis`.

**`pnpm prisma:migrate` fails with "Can't reach database server"** — confirm `docker-compose ps` shows Postgres as `healthy` first, and that `apps/api/.env.local` has the exact `DATABASE_URL` from this README (`postgresql://postgres:password@localhost:5432/gcos_dev`).

**`pnpm prisma:migrate` fails with "relation already exists" or similar schema-drift errors** — your local database has tables from a previous, different attempt. Run `docker-compose down -v` then `docker-compose up -d` to get a completely fresh database, then re-run the migration.

**`import { User } from '@gcos/types'` shows a type error** — the Prisma client hasn't been generated yet. Run `pnpm --filter @gcos/api prisma:generate` first; `packages/types/src/prisma.ts` re-exports types from the generated client, so the client must exist on disk before TypeScript can resolve them.

**NestJS won't start** — confirm `reflect-metadata` is installed (it's a direct dependency of `apps/api`) and that you're on Node ≥ 20.

## Next Milestone

M04 — Database Seed — All Reference Data. See the GCOS Implementation Plan for full scope.
