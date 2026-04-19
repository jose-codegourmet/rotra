# ROTRA landing (`@rotra/landing`)

Standalone Next.js app for the **public coming soon / waitlist** site. Kept separate from [`apps/client`](../client) so marketing can ship and iterate on its own deploy target.

## Run locally

From the monorepo root:

```bash
pnpm dev:landing
# or
make dev-landing
# or
pnpm --filter @rotra/landing dev
```

Open [http://localhost:3003](http://localhost:3003).

## Database / waitlist

Waitlist submissions are persisted via **`POST /api/waitlist`** ([`src/app/api/waitlist/route.ts`](src/app/api/waitlist/route.ts)) using Prisma (`@rotra/db`) into `waitlist_signups`. See [`docs/database/11_waitlist_signups.md`](../../docs/database/11_waitlist_signups.md).

Configure the same Postgres connection vars as other Prisma-backed apps — at minimum **`DATABASE_URL`** (and **`DIRECT_URL`** where Prisma migrations run) — in this app’s environment for deploy and local `.env.local`. Details: [`docs/database/10_prisma_supabase_migrations.md`](../../docs/database/10_prisma_supabase_migrations.md) (“Apps vs `packages/db/.env`”).

## Spec and assets

- Story spec: [`docs/marketing/coming_soon_landing_page.md`](../../docs/marketing/coming_soon_landing_page.md)
- Hero graphic (replaceable): [`public/images/coming-soon-hero.svg`](public/images/coming-soon-hero.svg)
