# Known drift — docs vs code

> **Last verified:** 2026-08-26 · When sources disagree, the **Reality** column wins.
> Add a row in the same PR that discovers new drift.

## Docs that lie (or lag)

| Topic | Docs say | Reality |
|-------|----------|---------|
| Component folders | `components/shadcn/` + `components/rotra/` (`docs/techstack/`) | `components/ui/` + `components/modules/` (+ admin extras) |
| Writes / mutations | Server Actions in `server/actions/` | Almost entirely `app/api/**/route.ts` + `@rotra/db`; **one** `'use server'` file (OAuth) |
| Client fetch layer | `lib/api` helpers + centralized keys (`AGENTS.md` pre-2026-08-26) | Fetch in `hooks/*/server.ts`; keys in `hooks/*/queryKey.ts`; `lib/api` is server Prisma helpers |
| Redux live session | Redux owns queue / score / player status | Only `auth` + `ui` slices; live session is React Query |
| Admin Redux | “Redux NOT used in Admin” (older tech docs) | Admin has `authSlice` + Redux store |
| Umpire Redux / PWA | Store + `next-pwa` | Umpire stub; **no** Redux deps; **no** `next-pwa` |
| Supabase Realtime | Two shipped cases (smart monitor; score→review) | **Zero** subscriptions in apps; cases are specs/docs only |
| Theme | “Dark mode only — no light theme” | Light + dark CSS vars; client `ThemeToggle` + `next-themes` |
| Story fixtures path | `app/constants/` | Client/admin: `src/constants/`; landing has `src/app/constants/coming-soon.ts` |
| Hook naming | `use-kebab-case.ts` | camelCase: `useSessionLive`, `useQuickSessionMutation` |
| Agent entry | No `AGENTS.md` (`REPO_SUMMARY` §6.11 / §7) | Root `AGENTS.md` + `.agents/context/` (this tree) |
| RLS | Broad policies in `docs/database/09_*` | Migrations enable RLS on **`places` only** |
| Places provider | Google Places note (moved to `docs/adr/superseded-google-places-chatgpt-note.md`) | **Mapbox** only in code |
| Admin hub copy | “Static pages only — no APIs” on `/` | Admin has ~42 API routes; many ops pages are REAL |
| Tests | Silent / aspirational | Near-zero test files; no test runner in CI |
| Business logic vs OpenSpec | Both may describe a feature | OpenSpec + code = implemented; `docs/business_logic/` may be unbuilt |
| Client authentication | Business docs describe Facebook as the player identity anchor plus separate tester/admin client routes | `/login` is universal email/password; legacy tester/admin URLs redirect; Facebook implementation is dormant |
| `profiles.is_verified` | Database docs describe a generated composite verification value | Migration schema stores a plain `BOOLEAN NOT NULL DEFAULT false`; client code does not read it |

## Rules the code still violates (debt, not precedent)

Tracked in `docs/tech-debt.md`. Summary:

| Rule (for new code) | Current debt |
|---------------------|--------------|
| No new app-level barrels | ~9+ `index.ts` re-exports under `apps/` |
| No hardcoded hex (breaks light theme) | ~30 files / ~296 hex matches in component source |
| Forms: `Controller` not `register` | `ClubApplicationForm`, onboarding steps use `register` |
| Story fixtures from `src/constants/` | Many stories inline mocks; ~67% of stories skip shared fixtures |

## Product conflict (do not “fix” silently)

Canonical rules: only Club Owner / Que Master create Que Sessions.
Code: player **Quick Session** via `POST /api/sessions/quick` is real and persists.
Resolve only via OpenSpec change.
