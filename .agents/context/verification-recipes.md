# Verification recipes

> **Last verified:** 2026-09-01 · Sourced from the repo (code, OpenSpecs, env examples,
> seed, commands). Not a product promise. **Do not invent** emails, passwords, token
> values, or click-paths that are not in the docs/code.
>
> **Companion:** `docs/ways-of-working.md` §6 (verification block). Until a gap below is
> filled by a human, state it honestly in the PR.

**Reality check (AGENTS.md §7):** `/sessions/*` (join, queue, court, attendance, add-match,
play Courts/Queue/Standings) is **mock theatre**. Club pages beyond `/clubs/apply` are
**mock / ProvisionBox**. Admin `/dashboard`, `/analytics`, `/moderation`, `/platform-config`,
`/kill-switches`, `/skills-management`, `/mmr-management` do **not** persist. Storybook
(`:6006` / `:6007` / `:6008`) is not production. The **real** live session stack is
`/find-sessions` and `/find-sessions/[sessionId]`.

**How to use:** each recipe answers one stub question. A **GAP** box is something the
repo does not specify — a human maintainer must fill it. Do not treat a GAP as a
working step.

---

## Shared local setup (all recipes)

From `README.md`, `.agents/context/commands.md`, and `apps/client/.env.example`.

```bash
source ~/.nvm/nvm.sh   # if `nvm` is not already a function
nvm use                # Node 24 — `.nvmrc`
pnpm install
pnpm approve-builds    # first install only
```

**Database env** — `packages/db/.env` (README; there is no committed example file):

```env
DATABASE_URL="postgresql://..."   # Supabase tx pooler (often :6543)
DIRECT_URL="postgresql://..."     # Supabase direct URL (migrations)
```

**App env** — each app’s `.env.local`. The **only** committed example is
`apps/client/.env.example` (Mapbox). Other values are listed in
`.agents/context/commands.md` and are **tribal** — do not invent secrets:

| Variable | Used by |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | client, admin |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client, admin |
| `SUPABASE_SERVICE_ROLE_KEY` | client, admin (service-role client) |
| `DATABASE_URL` | `@rotra/db` |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | client, admin maps |
| `NEXT_PUBLIC_MAPBOX_STYLE_URL` | client dashboard (optional) |
| `MAPBOX_SECRET_TOKEN` | server geocode (optional; falls back to public token) |
| `ROTRA_DEV_PROFILE_ID` | client local profile override (`apps/client/src/lib/server/current-profile.ts`) |
| `NEXT_PUBLIC_ADMIN_APP_URL` | admin invite `redirectTo` |
| `NEXT_PUBLIC_CLIENT_APP_ORIGIN` | admin → client links / tester invites |
| `FOUNDING_SUPER_ADMIN_ID` | admin user guards (not a seed) |
| `CLIENT_ADMIN_LOGIN_GATE_PASSWORD` | listed in commands.md; client admin-gate path is **legacy / dormant** after email-password auth |

**Run:**

```bash
nvm use && make dev-client    # :3000
nvm use && make dev-admin     # :3001
nvm use && pnpm db:studio     # Prisma Studio
nvm use && pnpm db:seed       # skill dimensions + ranking tiers only
```

Prisma Studio command is `pnpm db:studio` (root) or `pnpm --filter @rotra/db db:studio`.
Studio opens the models in `packages/db/prisma/` against `DATABASE_URL`.

---

## 1. Seed a local club + Que Master membership

### What `pnpm db:seed` actually does

`packages/db/prisma/seed.ts` (wired in `packages/db/package.json` as
`"seed": "node --import tsx prisma/seed.ts"`) **upserts only**:

- `skillDimension` — six rows matching `docs/database/05_reviews_and_ratings.md` Seed Data
- `rankingTierConfig` — six tiers matching `docs/database/06_gamification.md` Seed Data

It does **not** create `auth.users`, `profiles`, `clubs`, `club_members`, or
`queue_sessions`. There is no other seed file in the repo.

### REAL path that mints a `clubs` row (no Que Master)

1. Create / sign in a **client** player (`/sign-up` → `/login` — see §3).
2. Submit a club application on **`/clubs/apply`** (`POST /api/club-applications/me`).
3. Sign in to **admin** (`:3001`) and approve at **`/approvals/club-applications`**
   (`POST /api/club-applications/:id/approve` → `approveClubApplication()` in
   `packages/db/src/club-application-service.ts`).

Approval creates a `clubs` row (`ownerId` = applicant `playerId`, `status: active`,
invite token generated) and notifies the applicant. It does **not** insert
`club_members`.

A repo-wide search of app code finds **no** `clubMember.create` / `tx.clubMember`.
`GET /api/clubs/mine` and `POST /api/sessions/quick` (when `clubId` is set) both
read **`club_members`** (`status: active`), not `clubs.ownerId`. So a minted club
does **not** by itself make the owner appear in the Quick Session club picker.

### Que Master assignment is mock

`ClubRole` in `packages/db/prisma/enums.prisma` is `member | que_master | owner`.
Promote-to-QM on `/clubs/[clubId]/manage/members` is **local/placeholder**
(`openspec/specs/clubs/spec.md`; `ManageMembersClient.tsx` flips local state).
Do not treat `?as=que_master` demo query as a DB role.

### Confirm in Prisma Studio

Open `pnpm db:studio` and inspect:

| Studio model | Table (`@@map`) | What to look for |
|--------------|-----------------|------------------|
| `Club` | `clubs` | `ownerId`, `name`, `status` |
| `ClubMember` | `club_members` | `clubId` + `playerId`, `role`, `status` |
| `Profile` | `profiles` | `id` must match `Club.ownerId` / `ClubMember.playerId` |

`role = que_master` and `status = active` is the membership the rest of the stack
treats as Que Master (`docs/database/01_users_and_profiles.md` derivation rule).

### GAP — human must provision membership

The repo has **no** seed club, **no** seed Que Master, **no** committed emails/
passwords, and **no** API that writes `club_members`.

A human maintainer must, in **this project’s** Supabase/Prisma (not invented
here):

1. Ensure a `profiles` row exists (client sign-up / `ensureProfileRow`, or
   Supabase Auth + matching `profiles.id`).
2. Insert `club_members` (and a `clubs` row if approval was not used) via
   Prisma Studio or SQL — `role` = `owner` or `que_master`, `status` = `active`.
3. Optionally set `ROTRA_DEV_PROFILE_ID` to that `profiles.id` to load the row
   without a cookie session (overrides `getCurrentProfile()`).

Until that is written down with **this** environment’s IDs, agents cannot
complete a club-scoped Quick Session (`clubId` → 403 if no active membership).

---

## 2. Admin OTP / invite accept on a fresh machine

**Ports / auth:** Admin is `:3001`. Password is primary; OTP exists for
invite/recovery — **not** the main login card (`apps/admin/AGENTS.md`,
`openspec/specs/admin-auth/spec.md`).

### Env on a fresh machine

No `apps/admin/.env.example`. You still need the Supabase trio +
`SUPABASE_SERVICE_ROLE_KEY` + `DATABASE_URL` (invite uses the service-role
client in `apps/admin/src/lib/supabase/admin.ts`). Set
`NEXT_PUBLIC_ADMIN_APP_URL` when the public origin differs from `request.url`
(invite `redirectTo`).

**Chicken-and-egg:** `POST /api/admin-users/invite` requires an already
authenticated **active Super Admin** (`requireAdminSession` +
`assertActiveSuperAdmin`). `pnpm db:seed` does **not** create that user.
`FOUNDING_SUPER_ADMIN_ID` only **guards** mutations; it does not insert a row.

### GAP — first Super Admin

Product docs (`docs/business_logic/admin_app/01_admin_overview.md`) say the
founding Super Admin is “seeded directly in the database.” That is **not** in
`prisma/seed.ts`. A human must already have, or must create in **Supabase
Dashboard + `profiles`**:

- an `auth.users` row with `app_metadata.role = "admin"` (invite path sets this)
- a `profiles` row: `adminRole = super_admin`, `adminIsActive = true`, `email` set
- `FOUNDING_SUPER_ADMIN_ID` = that `profiles.id` if you want founding guards

No email or password is committed. Do not invent one.

### Invite accept (after a Super Admin exists)

1. Open Admin `/admins` (REAL — `implementation-status.md`).
2. Super Admin invites via `POST /api/admin-users/invite`
   (`inviteAdminAuthUser` → `auth.admin.inviteUserByEmail` with
   `redirectTo = resolveAdminAppOrigin(request)`, then `inviteAdminUser()`).
3. Invitee gets a Supabase **Invite user** email. Committed HTML:
   `apps/admin/src/email-templates/invite-user.html`. **Merging the file does
   nothing** until a human pastes it into **Supabase Dashboard → Authentication
   → Emails → Templates → Invite user** (`docs/email-templates.md`).
4. Template link (once pasted):

   `{{ .RedirectTo }}/auth/accept-invite?token_hash={{ .TokenHash }}&type=invite&next=/set-password`

   `RedirectTo` is the origin from step 2 (env or request).
5. `/auth/accept-invite` requires `token_hash` + `type=invite`; otherwise
   `/login?error=invite_invalid`. Continue → `/auth/callback` → default
   `/set-password`.
6. `/set-password` requires a session. `POST /api/auth/set-password` (password
   ≥ 8 chars) calls `activateAdminIfNeeded()` and sends the admin to `/dashboard`.

Resend: `POST /api/admin-users/:id/resend-invite` (same `redirectTo` rules).

### OTP path (exists; not on the login card)

- `/login` is email + password only (`AdminLoginForm` → `POST /api/auth/sign-in`).
  There is **no** “Sign in with OTP” CTA (`openspec/specs/admin-auth/spec.md`).
- `/login/otp` **requires** `?email=` (valid email or redirect to `/login`).
- `POST /api/auth/request-otp` and `POST /api/auth/resend-otp` call
  `signInWithOtp` with `shouldCreateUser: false` (anti-enumeration on unknown
  emails). `POST /api/auth/verify-otp` accepts a **6-digit** `token`,
  `type: "email"`.
- The OTP page copy assumes a code was already sent; the form’s **resend**
  control is what actually calls `/api/auth/resend-otp`. There is no
  repo-documented click-path from `/login` that requests the first code.
- OTP mail uses the **Magic link or OTP** slot. Committed HTML:
  `apps/admin/src/email-templates/magic-link.html` (`{{ .Token }}`). Same
  paste-into-dashboard rule.

**Returning admin (not invite):** `/login` → email/password →
`activateAdminIfNeeded()` → `/dashboard` (or safe `next`).

### Related: tester invite (client, not Admin OTP)

Admin `/testers` (REAL) calls `createTesterProfile` with
`redirectTo = ${NEXT_PUBLIC_CLIENT_APP_ORIGIN}/login-tester`. Missing origin
→ HTTP 503. Client middleware **redirects** `/login-tester` → `/login` and
`/login-tester/auth/accept-invite` → `/auth/accept-invite` (token verify →
`/set-password?mode=invite`). Client invite HTML is **not** authored
(`docs/email-templates.md` — 0/13 client slots).

---

## 3. Facebook OAuth test user for client login

### What the client actually shows

`/login` mounts `PlayerSignInCard` (email/password → `POST /api/auth/player-sign-in`).
`/sign-up` mounts `PlayerSignUpCard` (`POST /api/auth/player-sign-up`, password
≥ 8). Facebook is **not** mounted on `/login`
(`openspec/changes/player-email-password-auth`, `known-drift.md`,
`implementation-status.md`).

`LoginCard` / `LoginCardForm` (Facebook CTA → `startFacebookSignInAction` in
`apps/client/src/lib/auth/login-actions.ts`) remains in the tree and in
**Storybook** (`LoginCard.stories.tsx`). That is **not** the shipping login.

### Dormant OAuth code (if a human re-enables it)

`startFacebookSignInAction` calls `signInWithOAuth({ provider: "facebook",
scopes: "public_profile email", redirectTo: ${origin}/auth/callback?next=/dashboard })`.
`GET /auth/callback` exchanges `code` for a session; errors → `/login?error=oauth`
or `auth`. Middleware forwards `/?code=` to `/auth/callback`.

### GAP — no test-user recipe in the repo

There is **no** Facebook App ID, test-user email, password, or Meta dashboard
click-path in the repo. `.env.example` does not list Facebook keys (Supabase
Dashboard holds the provider). Product note: Meta review is blocking public
Facebook OAuth (`openspec/changes/player-email-password-auth/proposal.md`).

A human who needs Facebook specifically must configure **this** project’s
Supabase Auth → Facebook provider and Meta test users, then re-expose the
dormant card. Until then, **verify client login with `/sign-up` + `/login`**.

If `signUp` returns `needsConfirmation: true`, the user must confirm email
via Supabase (client confirm-signup template is **missing**; delivery depends
on the dashboard slot + Resend SMTP).

`ways-of-working.md` §6.2 still says “logged in via Facebook OAuth” as an
example verification line — treat that as **stale** relative to `/login`.

---

## 4. Club Que Session of type MMR on REAL surfaces

### Vocabulary

| Product term | DB (`queue_sessions`) |
|--------------|------------------------|
| Club Que Session | `origin = club_queue` |
| Session type MMR | `scheduleType = mmr` |
| Fun Games (club) | `scheduleType = fun_games` |
| Friendly / Quick / player-organized | `origin = player_organized` (`scheduleType` null in the Quick path) |

MMR **moves** only on Club Que + MMR (`AGENTS.md` §4, glossary). Admin
`/mmr-management` is **MOCK** (in-memory; edits do not save).

### What REAL create does today

The only wired create is **`POST /api/sessions/quick`**
(`apps/client/src/app/api/sessions/quick/route.ts`,
`openspec/specs/queue-session/spec.md`):

- `origin: "player_organized"`
- `scheduleType: null`
- `status: "open"`
- `clubId` optional; if set, requires an active `club_members` row (else 403)
- clubless → `visibility: "open"`
- host `session_registrations` row (`admissionStatus: accepted`)
- client navigates to **`/find-sessions/{id}`** (REAL lobby / QM console)

UI: `/dashboard` Quick Session sheet (`QuickSessionSheet` →
`useQuickSessionMutation`). There is **no** `POST /api/sessions` club-create
handler. `docs/views/client_app/common/session_discovery_dashboard.md` still
lists that route — **docs lag**; do not call it.

`/sessions/*` setup / queue / court screens are **MOCK**. `/clubs/[clubId]/*`
except apply is **MOCK**. You cannot create `origin: club_queue` +
`scheduleType: mmr` from those pages.

Discovery **can filter** `scheduleType=mmr|fun_games`
(`GET /api/sessions/discover`) **if such rows exist**. Nothing in app code
writes `origin: "club_queue"` or `scheduleType: "mmr"`.

### GAP — no REAL Club Que + MMR create

An end-to-end “create Club Que Session (type: MMR) from `/dashboard` → appears
in `/find-sessions`” path (`docs/ways-of-working.md` §6.2 example) is **not
implemented**. Do not claim it.

**What you can verify on REAL surfaces:**

1. Sign in on client (`/login`).
2. Create a Quick Session from `/dashboard` (clubless, or `clubId` only if
   §1 membership exists).
3. Confirm the row in Studio (`origin = player_organized`, `scheduleType` empty).
4. Open `/find-sessions` and `/find-sessions/[sessionId]`.
5. Host `POST /api/sessions/[id]/start` / `close` / `leave` as specified.

**What a human could do outside the app (not a product path):** insert a
`queue_sessions` row in Studio with `origin = club_queue`, `scheduleType = mmr`,
and a non-null `clubId` (CHECK `clubless_only_player_organized` in
`packages/db/prisma/migrations/20260609120000_clubless_quick_sessions/migration.sql`).
`docs/database/03_queue_sessions.md` also describes
`club_queue_requires_schedule_type`; that constraint is **not** in applied
Prisma migrations — do not assume it. After insert, `/find-sessions` may list
it if status/visibility/geo filters match. That is **not** an e2e create
recipe.

---

## 5. Confirm Quick Session vs club session rows in `pnpm db:studio`

Open Studio → model **`QueueSession`** (table `queue_sessions`).

| | Quick Session (REAL create) | Club Que Session (intended / docs) |
|--|-----------------------------|-------------------------------------|
| `origin` | `player_organized` | `club_queue` |
| `scheduleType` | `null` | `mmr` or `fun_games` |
| `clubId` | `null` (clubless) or a UUID the host is an **active member** of | required by CHECK if `origin ≠ player_organized` |
| `hostId` | creating `profiles.id` | owner / Que Master (when a create API exists) |
| `status` | `open` on create | docs: draft → open → … |
| Host seat | `SessionRegistration` (`session_registrations`): `playerId` = host, `admissionStatus` = `accepted` | not created by any current club-create API |

Also check `Club` / `ClubMember` if `clubId` is set.

**Do not confuse:**

- A Quick Session **with** `clubId` is still `origin = player_organized`. It is
  **not** a Club Que Session and does **not** award MMR.
- `Fun Games` ≠ `Friendly` (glossary). Friendly ≈ clubless / player-organized.
- Mock `/sessions/*` and Storybook fixtures (`mock-session-discovery.ts` uses
  `club_queue` + `mmr`) are **not** Studio rows.

`GET /api/sessions/my` lists registrations for the signed-in profile;
`GET /api/sessions/available` lists visible open/active sessions (no geo).

---

## 6. Mapbox tokens (dashboard map / places)

### Variables

| Variable | Where | Role |
|----------|--------|------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | `apps/client/.env.local`, `apps/admin/.env.local` | Public token. Dashboard map (`DashboardMap.tsx`), search overlay, `AddressPinField` (client + admin). |
| `NEXT_PUBLIC_MAPBOX_STYLE_URL` | client only (optional) | Hosted Studio style. If unset, `apps/client/src/constants/dashboard.ts` uses bundled `mapbox/rotra-dark-style.json`. |
| `MAPBOX_SECRET_TOKEN` | client server env (optional) | `geocodeAddress()` in `apps/client/src/lib/geo/geocode.ts` prefers this, then `NEXT_PUBLIC_MAPBOX_TOKEN`. Used by `POST /api/sessions/quick` when the venue has no coordinates. |

Committed placeholder (not a real token): `apps/client/.env.example`

```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ...
NEXT_PUBLIC_MAPBOX_STYLE_URL=mapbox://styles/rotra/...
```

Admin has **no** `.env.example`. `docs/views/admin_app/components/address-pin-field.md`
says put the **same** public token in `apps/admin/.env.local`.

### What happens if the public token is missing

`DashboardMap` and `AddressPinField` render a “Map unavailable” empty state
telling you to set `NEXT_PUBLIC_MAPBOX_TOKEN`. They do not crash.

### Dashboard / places behavior (when set)

- Map components are client-only (`next/dynamic({ ssr: false })` or `"use client"`).
- Geocoding is scoped to **`country=PH`**. Default map center is Cebu
  (`DEFAULT_MAP_CENTER` in `apps/client/src/constants/dashboard.ts`).
- Sessions without `venueLat` / `venueLng` appear in list/grid, not as pins
  (`docs/techstack/04_tech_stack_reference.md`).
- Restrict the **public** token by HTTP referrer in the Mapbox dashboard
  (localhost + production domains). Comment in `.env.example`: “URL-restricted
  in Mapbox dashboard.”

### GAP — token values

No live `pk.` / secret token is committed. A human must create a Mapbox token
for **this** project and paste it into the app env files. Do not copy
placeholder `pk.eyJ...` into production.

---

## Residual gaps (human-owned)

| # | Gap | Who fills it |
|---|-----|----------------|
| 1 | Seed or document a real `clubs` + `club_members` (`owner` / `que_master`) for the shared Supabase project | Maintainer / Prisma Studio |
| 2 | First Super Admin (`auth.users` + `profiles` + `FOUNDING_SUPER_ADMIN_ID`); no password in repo | Maintainer / Supabase Dashboard |
| 3 | Paste admin (and eventually client) auth email HTML into Supabase Emails | Maintainer (`docs/email-templates.md`) |
| 4 | Facebook provider + Meta test users, if OAuth is re-enabled | Maintainer |
| 5 | REAL Club Que Session create (`origin: club_queue`, `scheduleType: mmr`) | Product + OpenSpec + code — **not** a docs-only fill |
| 6 | Mapbox token + referrer allowlist for local + deployed origins | Maintainer |
| 7 | Admin `.env.example` (and remaining client env keys) | Maintainer |

Agents: copy the relevant recipe into the PR **Verified** / **Not verified**
block. Prefer “Not verified — GAP §N” over a fake e2e claim.
