# AGENTS.md — `@rotra/admin`

> Nested entry for `apps/admin`. Root: `/AGENTS.md`.

**Port:** 3001 · **Auth:** email + password primary; middleware requires admin role.
OTP exists for invite/recovery — not the main login card path.

## Real vs mock

**REAL (ops):** customers, places, waitlist, testers, admins, tags, notifications, club-application approvals, profile.

**MOCK (edits do not save):** `/dashboard`, `/analytics`, `/moderation`, `/platform-config`,
`/kill-switches`, `/skills-management`, `/mmr-management`.

Hub `/` copy saying “static only” is outdated — there are many API routes.

## Patterns

- Service role via `SUPABASE_SERVICE_ROLE_KEY` for privileged admin ops
- Hooks under `src/hooks/` with `client.ts` / `server.ts` / `queryKey.ts`
- Extra UI buckets: `components/admin-ui/`, `layout/`, `custom/`
- Mapbox for places — client-only dynamic import
- Founding Super Admin guarded by `FOUNDING_SUPER_ADMIN_ID`
