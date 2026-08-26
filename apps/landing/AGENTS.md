# AGENTS.md — `@rotra/landing`

> Nested entry for `apps/landing`. Root: `/AGENTS.md`.

**Port:** 3003 · **Public** (no middleware).

## Surface (all REAL, small)

| Route | Purpose |
|-------|---------|
| `/` | Coming soon + waitlist form → `POST /api/waitlist` → `WaitlistSignup` |
| `/privacy` `/terms` `/data-deletion` | `@rotra/legal-content` |

## Patterns

- Feature UI under `components/coming-soon/` (not `modules/`)
- Marketing fixtures: `src/app/constants/coming-soon.ts`
- Needs `DATABASE_URL` at runtime for waitlist via `@rotra/db`
- Excluded from CI Biome matrix (still lint locally before merge)
