# Implementation status

> **Last verified:** 2026-08-26 · Hand-maintained tables. Machine counts live in `metrics.md`
> (from `scripts/refresh-context.sh`). Update rows in the **same PR** that promotes mock→real.

**Legend:** REAL = persists / wired API · MOCK = `MOCK_*` / toast-only · PARTIAL = mix · STUB = redirect or placeholder.

## Critical: two session tracks

| Track | Routes | Status |
|-------|--------|--------|
| **Mock prototypes** | `/sessions/join`, `/joined`, `/queue`, `/court`, `/attendance`, `/add-match`, `/play/courts`, `/play/queue`, `/play/standings` | MOCK — `MOCK_SESSION_*` / `MOCK_PLAYER_*`, local toasts |
| **Wired live session** | `/find-sessions`, `/find-sessions/[sessionId]` | REAL — `@rotra/db` + session APIs |

Do **not** rebuild session ops against `/sessions/*`. Extend `/find-sessions/*`.

---

## Totals (approx.)

| Metric | Value |
|--------|------:|
| Pages | 71 |
| API `route.ts` handlers | ~73 |
| Client REAL / MOCK / PARTIAL / STUB | ~14 / 19 / 4 / 3 |
| Admin REAL / MOCK / STUB | ~16 / 7 / 3 |
| Landing | 4 REAL |
| Umpire | 2 MOCK + 1 STUB redirect |

Volatile counts: regenerate via `scripts/refresh-context.sh` → `.agents/context/metrics.md`.

---

## Client (`@rotra/client` :3000)

| Route | Status | Notes |
|-------|--------|-------|
| `/` | STUB | Redirect → `/login` (no coming-soon shell); authed → `/dashboard` |
| `/login` | REAL | Universal email/password for users, testers, and admins; Facebook UI dormant |
| `/sign-up` | REAL | Supabase email/password account creation |
| `/forgot-password` | REAL | Supabase recovery email; provider response is anti-enumeration |
| `/login-tester` `/login-admin` | STUB | Compatibility redirects → `/login` |
| `/set-password` | REAL | Session-gated invite + recovery modes |
| `/privacy` `/terms` `/data-deletion` | REAL | `@rotra/legal-content` |
| `/onboarding` | REAL | POST `/api/onboarding/complete` |
| `/home` | STUB | Redirect → `/dashboard` |
| `/dashboard` | REAL | Discovery + Quick Session sheet |
| `/explore` | MOCK | `MOCK_CLUBS` |
| `/find-sessions` | REAL | Open + my sessions |
| `/find-sessions/[sessionId]` | REAL | Live lobby / QM console |
| `/sessions/join` `/joined` `/queue` `/court` `/attendance` `/add-match` `/play/*` | MOCK | Theatre only |
| `/profile` `/profile/[userId]` | PARTIAL | Header API; stats/history/skills/gear = `MOCK_PLAYER` |
| `/notifications` | REAL | |
| `/settings` | PARTIAL | Profile card real-ish; some buttons unwired |
| `/settings/account` | REAL | Name / password / delete APIs |
| `/clubs/apply` | REAL | Club applications API |
| `/clubs` `/clubs/explore` `/clubs/[clubId]/*` (except apply) | MOCK | `MOCK_CLUB*`, `ProvisionBox` |
| `/clubs/[clubId]/manage` | STUB | Redirect → manage/members |

**Quick Session:** REAL — `POST /api/sessions/quick` creates `queueSession` + registration; navigates to `/find-sessions/[id]`. Conflicts with canonical “QM/Owner only create” rules — do not remove without a spec.

### Client APIs (all REAL handlers; not exhaustive)

Auth (universal sign-up/sign-in, forgot/reset password, set-password), profile, onboarding, notifications, club-applications, places search/submit, sessions discover/available/my/active/quick/[id]/live/roster/console/start/close/leave.

---

## Admin (`@rotra/admin` :3001)

| Route | Status | Notes |
|-------|--------|-------|
| `/` | STUB | Hub copy outdated (“static only”) |
| `/login` `/login/otp` `/set-password` `/auth/accept-invite` | REAL | Password primary; OTP path exists |
| `/dashboard` `/analytics` `/moderation` | MOCK | `mock-admin-pages.ts` |
| `/platform-config` `/kill-switches` | MOCK | Edits do not persist |
| `/skills-management` `/mmr-management` | MOCK | In-memory default rows |
| `/approvals` | STUB | → club-applications |
| `/approvals/club-applications` | REAL | |
| `/approvals/demotions` | STUB | Placeholder |
| `/customers` `/customers/[id]` | REAL | |
| `/places` | REAL | |
| `/waitlist` | REAL | |
| `/notifications` | REAL | |
| `/testers` `/testers/[id]` | REAL | |
| `/admins` `/admins/[id]` | REAL | |
| `/tags` | REAL | |
| `/profile` | REAL | |

---

## Landing (`@rotra/landing` :3003)

| Route | Status |
|-------|--------|
| `/` | REAL — waitlist POST |
| `/privacy` `/terms` `/data-deletion` | REAL |

## Umpire (`@rotra/umpire` :3002)

| Route | Status | Notes |
|-------|--------|-------|
| `/` | STUB | Redirect → `/scoreboard` |
| `/scoreboard` | MOCK | Fake Smash Hub match; local +POINT / undo; no API |
| `/submit` | MOCK | Fake Team A 21–19 (2–0); local lock only; no API |

Five OpenSpecs (`umpire-*`) describe token access, scoring engine, realtime, and
submission. **Those are not built.** The two screens are UI shells only.

---

## Auth middleware

| App | Enforcement |
|-----|-------------|
| Client | Session required except public paths; universal email/password, dormant Facebook OAuth |
| Admin | Session + `role === admin` |
| Landing / Umpire | None |
