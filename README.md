# ROTRA

The badminton session platform. Turborepo monorepo with three Next.js 15 apps and three shared packages.

---

## Prerequisites

- **Node.js** ≥ 20 — managed via [nvm](https://github.com/nvm-sh/nvm) (`.nvmrc` is included)
- **pnpm** ≥ 10 — `npm install -g pnpm`

---

## Setup

```bash
nvm use           # picks Node version from .nvmrc
pnpm install      # install all workspace dependencies
```

On first install, approve Prisma build scripts when prompted:

```bash
pnpm approve-builds   # select: @prisma/client, @prisma/engines, prisma, esbuild, sharp
pnpm install          # re-run to execute the approved scripts
```

---

## Running Apps

### All apps in parallel

```bash
make dev
```

This handles `nvm use` automatically. Alternatively, if you already have the right Node version active:

```bash
pnpm dev
```

| App | URL | Description |
|-----|-----|-------------|
| `apps/client` | http://localhost:3000 | Player-facing app |
| `apps/admin` | http://localhost:3001 | Internal dashboard |
| `apps/umpire` | http://localhost:3002 | Live scoring PWA |

### Single app

```bash
pnpm --filter @rotra/client dev
pnpm --filter @rotra/admin  dev
pnpm --filter @rotra/umpire dev
```

---

## Other Commands

```bash
pnpm build        # build all apps
pnpm lint         # lint all apps and packages
pnpm type-check   # TypeScript check across the monorepo
pnpm format       # Prettier format all files
```

### Prisma (run from repo root)

```bash
pnpm --filter @rotra/db db:generate   # regenerate Prisma client after schema changes
pnpm --filter @rotra/db db:push       # push schema to DB without a migration (dev only)
pnpm --filter @rotra/db db:migrate    # create and apply a named migration
pnpm --filter @rotra/db db:studio     # open Prisma Studio
```

### Storybook

```bash
pnpm --filter @rotra/ui     storybook   # design system catalog   → http://localhost:6006
pnpm --filter @rotra/client storybook   # client-specific stories  → http://localhost:6007
pnpm --filter @rotra/admin  storybook   # admin-specific stories   → http://localhost:6008
```

---

## Monorepo Structure

```
rotra/
├── apps/
│   ├── client/     # Player-facing app (Next.js 15, SSR-first, Facebook OAuth)
│   ├── admin/      # Internal dashboard (Next.js 15, SSR-first, email + MFA)
│   └── umpire/     # Live scoring PWA  (Next.js 15, CSR, one-time token auth)
├── packages/
│   ├── ui/         # @rotra/ui     — shared component library (shadcn + ROTRA design system)
│   ├── db/         # @rotra/db     — Prisma schema, client singleton, generated types
│   └── config/     # @rotra/config — shared tsconfig, ESLint rules, Tailwind tokens
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── .nvmrc
```

---

## Environment Variables

Create `packages/db/.env` for database credentials:

```env
DATABASE_URL="postgresql://..."   # Supabase connection pooler URL (for queries)
DIRECT_URL="postgresql://..."     # Supabase direct URL (for migrations)
```

Each app can have its own `.env.local` for Supabase public keys and feature config:

```env
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
```

---

## Tech Stack

| Concern | Technology |
|---------|------------|
| Monorepo | Turborepo + pnpm workspaces |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Component library | `@rotra/ui` |
| Server state | TanStack Query v5 |
| Client state | Redux Toolkit |
| ORM | Prisma 6 |
| Database | Supabase (Postgres + Realtime + Auth) |
| Deployment | Vercel (one project per app) |

Full details in [`docs/techstack/01_tech_stack.md`](docs/techstack/01_tech_stack.md).
