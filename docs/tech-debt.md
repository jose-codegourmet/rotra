# Tech debt register — agent context cleanup follow-ups

> Tracked cleanup from the 2026-08-26 agent-context verification.
> **Rules for new code stay in force** (`AGENTS.md` §0). This file lists existing violations
> so agents do not treat them as precedent — and so humans can schedule cleanup.

## 1. Hardcoded hex (light-mode bugs)

Both themes ship. Hex in components freezes dark values and breaks the light toggle.

Priority session / map / radar / onboarding / auth / chrome files were tokenized in
#97 #98 #100 #115. Remaining **component hex** under `apps/*/src` is:

- `globals.css` `:root` / `.dark` — **expected**
- DarkVeil GLSL `#define` (not a color) — isolated in #115
- `DashboardMap` Mapbox paint `#00cc6a` — Mapbox GL does not interpolate CSS vars
- `LoginCardForm` Facebook brand `#1877F2` / `#1467D4` — official identity (commented)
- `Logo.stories.tsx` (all four apps) — light contrast canvases stay resolved so the
  dark mark stays visible when Storybook `html` has `.dark`; dark canvases use
  `bg-bg-base` + local `.dark`

Storybook preview canvases (`apps/*/.storybook/preview.ts`) use `var(--color-bg-base)`.

Leftover **rgba** glows / chart grid strokes in a few high-traffic views are not hex
and were left as-is by the #90 slices.

## 2. App-level barrel files

Sanctioned: `packages/db/src/index.ts`, `packages/legal-content/src/index.ts`.

**Debt (do not copy):** none remaining from the 2026-08-26 register. The listed
session / slider / hook / umpire `index.ts` re-exports were removed (#91).

Not pure re-export barrels (OK): `apps/*/src/store/index.ts` (store config),
`packages/config/tailwind-config/index.ts` (config object).

## 3. Forms using `register()`

Prefer `Controller` + `Field` for new work. Cleanup targets:

- `ClubApplicationForm`
- Login/OTP/Waitlist patterns that skip colocated schema/default/toast — see `.agents/context/forms.md`

## 4. Story fixtures inlined

Prefer `@/constants/...`. Many of ~181 stories inline mocks; data-heavy module stories should migrate
when touched. Do not block PRs solely for primitive `args`-only stories.

Partial (#93 slice, not done): admin customer *detail* stories import
`MOCK_CUSTOMER_PROFILE*` from `apps/admin/src/constants/mock-customers.ts`.
Directory table / list stories already did. Remaining module stories still inline.

## 5. CI does not run `type-check` — **done**

Resolved: `.github/workflows/biome.yml` now has a `type-check` job (`pnpm db:generate` then
`pnpm type-check`) alongside Biome. Snippet remains in `docs/ways-of-working.md` §6.1.

## 6. Verification recipes — authored; residual human gaps

`.agents/context/verification-recipes.md` is filled from repo-sourced facts (seed, auth
routes, session APIs, Mapbox env, Studio columns). Agents should follow it instead of
inventing login/seed steps.

**Still human-owned (labeled GAP in that file):** first Super Admin credentials;
`club_members` / Que Master rows (`pnpm db:seed` does not create them; approve-club
does not insert membership); Facebook provider + Meta test users (OAuth dormant);
Mapbox token values; paste of auth email HTML into the Supabase dashboard. There is
**no** REAL UI/API to create a Club Que Session of type MMR (`origin: club_queue` +
`scheduleType: mmr`) — do not treat the §6.2 example in `docs/ways-of-working.md` as
shipped.

## 7. Routes that bypass `@rotra/db` services

Sessions / places / onboarding / waitlist often call `db.*` in route handlers. Prefer services for
new non-trivial domain logic; migrate when touching those routes.

Partial (#95 slice, not done): admin notification **broadcasts list** GET now uses
`listNotificationBroadcasts` in `notification-broadcast-service` (POST already did). Testers,
customers, player `/profile/me`, and inbox notifications already called matching services.
Remaining bypasses include sessions, places, onboarding, waitlist, club-application directory /
name-collisions, and leftover one-liners (tag-definition audit logs, admin-user delete rollback).

---

**Cadence:** pick items when touching the file anyway; do not open a mega-cleanup PR without asking.
