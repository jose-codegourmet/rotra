# Data layer

> **Last verified:** 2026-08-26 · Loaded for API routes, Prisma, `@rotra/db` services.

## Canonical write path

```
Client Component
  → useMutation (TanStack Query)
  → hooks/<useFeature>/server.ts   # typed fetch (admin often uses api.ts)
  → app/api/<feature>/route.ts     # auth check, then call service or db
  → packages/db/src/<feature>-service.ts  # when a service exists
  → Prisma → Supabase Postgres (DATABASE_URL)
```

**Not** the client fetch layer: `apps/client/src/lib/api/` — those files are **server-side**
Prisma helpers (e.g. `session-live.ts`) used by routes/SSR. Admin has **no** `lib/api/`.

Query keys live in colocated `hooks/<useFeature>/queryKey.ts` (17 files). Client `lib/api/keys.ts`
only defines `placesSearch`.

## Package entrypoints

`packages/db/package.json`:

- `@rotra/db` → `src/index.ts` (sanctioned barrel: `db`, services, Prisma types)
- `@rotra/db/client` → `src/client.ts` (client-safe: slugify, types — no Prisma)

## Domain services (10)

| File | Covers |
|------|--------|
| `admin-notification-service.ts` | Admin inbox |
| `admin-user-service.ts` | Admin user CRUD / invite / role |
| `club-application-service.ts` | Club applications lifecycle |
| `customer-profile-service.ts` | Admin customer directory |
| `notification-broadcast-service.ts` | Platform broadcasts |
| `notification-service.ts` | Client notification inbox |
| `player-profile-service.ts` | Own profile get/update/delete |
| `profile-tag-service.ts` | Admin profile tags |
| `tag-definition-service.ts` | Tag definition CRUD |
| `tester-invitation-service.ts` | Tester invite lifecycle |

**No service yet** for sessions, places, waitlist, onboarding, matches, clubs (beyond applications),
gamification math — those call `db.*` in route handlers or `lib/api/*`.

## Routes that bypass services (writes)

Examples of direct Prisma in handlers: `sessions/quick`, `sessions/[id]/{start,close,leave}`,
`places/submit`, `onboarding/complete`, landing `waitlist`, admin places POST/PATCH/DELETE.

Prefer a new `*-service.ts` for non-trivial domain logic; matching neighbors is fine for thin CRUD.

## Schema

- **36 models** across **13** `.prisma` files under `packages/db/prisma/` (`schema.prisma` =
  generator/datasource only; models split by domain).
- **15 migrations**; no incremental rollback tooling (`db:migrate:reset` is full reset).
- **RLS:** enabled on **`places` only** (3 policies). Broad RLS in `docs/database/` is not applied.

## Server Actions

Exactly one `'use server'` file: `apps/client/src/lib/auth/login-actions.ts` (OAuth redirect).
All DB writes go through `route.ts` (or SSR reading `db` for GET-shaped loads).
