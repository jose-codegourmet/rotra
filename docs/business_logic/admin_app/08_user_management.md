# Admin App — 08 User Management

## Overview

The User Management module is where Super Admins provision, deactivate, and audit other admin accounts. It is the **only** entry point for new admin users — there is no self-registration, no public sign-up, and no Supabase OAuth path on the Admin App.

User Management is exposed at `/users` in the Admin App. Every admin can open the directory, but only **Super Admins** can mutate it.

---

## Roles

| Role | DB value | Capabilities |
|------|---|---|
| Super Admin | `profiles.admin_role = 'super_admin'` | Everything below + manage other admin accounts |
| Admin | `profiles.admin_role = 'admin'` | Read-only on `/users`. Cannot invite, deactivate, change role, or force sign-out other admins. |

There is exactly one **founding Super Admin**, seeded directly in the database at deploy time. The founding Super Admin cannot be deactivated, demoted, or removed by any UI flow — it is the platform's safety floor. Every other admin (including additional Super Admins) can be created, demoted, or deactivated through this module.

`admin_role` is a Postgres enum:

```sql
CREATE TYPE admin_role_enum AS ENUM ('super_admin', 'admin');
```

A `profiles` row with a non-null `admin_role` is an admin account. A null value means the row is a regular player profile.

> The Supabase JWT claim `app_metadata.role = 'admin'` continues to be the gate that lets the Admin App pass middleware (see `requireAdminSession()` in `apps/admin/src/lib/auth/admin-session.ts`). The DB column is the source of truth for *which kind* of admin and *whether they're currently active*.

---

## Storage Model

Admins live in the same `profiles` table as players. Admin-specific state is captured in additional columns rather than a separate table — this matches the answer chosen during design review and keeps the auth-id linkage trivial (`auth.users.id = profiles.id` for both admins and players).

```sql
ALTER TABLE profiles
  ADD COLUMN admin_role            admin_role_enum,                                   -- null = player; non-null = admin
  ADD COLUMN admin_is_active       bool        NOT NULL DEFAULT false,
  ADD COLUMN admin_invited_by      uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN admin_invited_at      timestamptz,
  ADD COLUMN admin_activated_at    timestamptz,
  ADD COLUMN admin_deactivated_at  timestamptz,
  ADD COLUMN admin_deactivated_by  uuid        REFERENCES profiles(id) ON DELETE SET NULL,

  -- An admin row must have a role and an invited_at; a non-admin row has neither.
  ADD CONSTRAINT chk_admin_consistency CHECK (
    (admin_role IS NULL AND admin_invited_at IS NULL)
    OR
    (admin_role IS NOT NULL AND admin_invited_at IS NOT NULL)
  );

CREATE INDEX idx_profiles_admin_role
  ON profiles(admin_role) WHERE admin_role IS NOT NULL;
```

### Founding Super Admin protection

The founding Super Admin's `profiles.id` is recorded in a server-side environment constant (`FOUNDING_SUPER_ADMIN_ID`). Every mutating route in this module compares the **target** id to that constant and returns 403 if they match. There is **no** UI affordance — the protection is enforced server-side regardless of the calling Super Admin.

A "last active Super Admin" guard is layered on top: any operation that would leave zero active Super Admins is rejected with 403, even if the founding Super Admin happens to be deactivated for some unforeseen reason.

### Derived: `last_active_at`

The directory shows a `Last active` timestamp. This is **not** a column — it is derived from `admin_action_log`:

```text
last_active_at = max(admin_action_log.created_at) WHERE admin_action_log.admin_id = profiles.id
```

If the admin has never written a row to `admin_action_log`, last active is shown as `Never`.

---

## Lifecycle

```text
[invited]  ─►  [active]  ─►  [inactive]
                  ▲             │
                  └─────────────┘
              (re-activated by Super Admin)
```

| State | profile shape | Login? |
|-------|---------------|--------|
| `invited` | `admin_role` set, `admin_is_active = false`, an open `admin_invitations` row exists | OTP can be sent (Supabase `auth.users` row exists) but `requireAdminSession` rejects with 403 because `admin_is_active = false` |
| `active` | `admin_role` set, `admin_is_active = true` | Yes |
| `inactive` | `admin_role` set, `admin_is_active = false`, no open invitation | OTP send is allowed by Supabase but `requireAdminSession` returns 403; UI is fully gated |

There is no soft-delete and no hard-delete UI flow. An admin who should no longer have access is **deactivated**. The row stays in `profiles` for audit reasons.

---

## Inviting an Admin (Super Admin only)

Triggered from the directory page via `Add user`.

1. Super Admin enters **email**, **name**, and **role** (`Admin` or `Super admin`).
2. Server validates:
   - Caller has `admin_role = 'super_admin'` and `admin_is_active = true`.
   - Email is not already an admin profile.
   - There is no open admin invitation for that email (status `pending`).
3. Server, in a single transaction:
   - Creates a Supabase `auth.users` row via the service role with `app_metadata.role = 'admin'` (this is what makes the email eligible to receive an OTP later — see [Login](#login-recap-from-01_admin_overviewmd)).
   - Inserts a `profiles` row with `admin_role = <chosen>`, `admin_is_active = false`, `admin_invited_by = <super admin>`, `admin_invited_at = now()`.
   - Inserts an `admin_invitations` row with status `pending` (see schema below).
   - Sends the OTP-style invite email — the same Supabase magic-code email used for sign-in.
   - Writes an `admin_action_log` entry: `action = 'admin_invited'`.
4. Recipient receives the email and enters the code on `/login`.
5. On the first successful `verify-otp`:
   - `admin_invitations.status` flips to `accepted`, `accepted_at = now()`, `accepted_by = <profile id>`.
   - `profiles.admin_is_active` is set to `true`, `admin_activated_at = now()`.
   - `admin_action_log` entry: `action = 'admin_activated'`.

Until step 5 happens, the invited admin can complete the OTP exchange but every server action returns 403, because `admin_is_active = false`.

### `admin_invitations`

Admin invitations live in a **separate table** from `email_invitations` (which is for players). Isolating the audit trail lets us evolve admin invites independently and keeps RLS simple.

```sql
CREATE TABLE admin_invitations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL,
  role          admin_role_enum NOT NULL,
  invited_by    uuid NOT NULL REFERENCES profiles(id),

  status        invitation_status_enum NOT NULL DEFAULT 'pending', -- pending | accepted | expired | revoked

  accepted_by   uuid REFERENCES profiles(id) ON DELETE SET NULL,
  accepted_at   timestamptz,

  expires_at    timestamptz NOT NULL DEFAULT now() + interval '7 days',
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Only one open admin invite per email at a time
CREATE UNIQUE INDEX idx_admin_invitations_pending_email
  ON admin_invitations(email)
  WHERE status = 'pending';

CREATE INDEX idx_admin_invitations_email  ON admin_invitations(email);
CREATE INDEX idx_admin_invitations_status ON admin_invitations(status);
```

A `Resend invite` action revokes any existing `pending` row, inserts a fresh one, and re-issues the OTP email.

---

## Login (recap from `01_admin_overview.md`)

The Admin App authenticates with **email + Supabase email-OTP only**. There is no password, no Facebook OAuth, no social provider, and no public sign-up. This is the entire flow for MVP.

The implementation in `apps/admin/src/app/api/auth/request-otp/route.ts` calls Supabase with `shouldCreateUser: false`. Combined with the invitation flow above, this means OTPs can only be delivered to email addresses that the Super Admin has invited (because that flow is the only place that creates an `auth.users` row with `role = 'admin'`). Requests for unknown emails return the same generic success message — there is no enumeration leak.

After `verify-otp` succeeds, the middleware in `apps/admin/src/middleware.ts` and `requireAdminSession()` enforce **all three** of the following on every authenticated request:

1. `app_metadata.role === 'admin'` (or `user_metadata.role === 'admin'`).
2. `profiles.admin_role IS NOT NULL`.
3. `profiles.admin_is_active = true`.

Any failure redirects to `/login?error=forbidden` for page requests, or returns 403 for API requests.

> The older view doc `docs/views/admin_app/login.md` describes a two-step password + TOTP UI. That description pre-dates the OTP-only implementation. **This file (and `01_admin_overview.md`) are authoritative for the auth flow.** TOTP is out of scope for MVP and will be reflected here when added.

---

## Operations on Existing Admins

All operations below are **Super Admin only**, except where noted, and **all** of them write to `admin_action_log` in the same transaction as the data change.

| Action | Allowed when | Effect | `admin_action_log` action |
|--------|--------------|--------|---------------------------|
| Resend invite | target has `admin_is_active = false` AND has a `pending` or `expired` `admin_invitations` row | Revoke any open pending row, insert a fresh one, send a new OTP email | `admin_invite_resent` |
| Deactivate | target is currently active **and** is not the founding Super Admin **and** is not the only remaining active Super Admin | Set `admin_is_active = false`, `admin_deactivated_at = now()`, `admin_deactivated_by = <super admin>`; revoke all Supabase sessions for the target (force sign-out) | `admin_deactivated` |
| Reactivate | target has `admin_is_active = false` and no open invitation | Set `admin_is_active = true`, `admin_activated_at = now()` | `admin_reactivated` |
| Change role | target is **not** the founding Super Admin AND (when demoting Super Admin → Admin) is not the only remaining active Super Admin | Update `profiles.admin_role`; revoke all Supabase sessions for the target so the new claim is re-fetched on next login | `admin_role_changed` (with `before_value` / `after_value`) |
| Force sign-out | target is active | Revoke all Supabase sessions for that user via the service role | `admin_force_signed_out` |
| View action log | any admin (read-only on the detail page) | Render two filtered timelines: actions **performed by** this admin (`admin_id = target.id`) and actions **performed on** this admin (`entity_type = 'admin_user' AND entity_id = target.id`) | (read; no log entry written) |

Notes:

- **No hard delete.** Once a row exists in `profiles` with a non-null `admin_role`, it is preserved. Reuse the email by reactivating instead of recreating.
- The founding Super Admin guard rejects deactivate, role change, and (implicitly) anything that would lock them out, regardless of which Super Admin is calling.
- Force sign-out is its own action so a Super Admin can log a target out without changing their role or active status (e.g. after credential exposure on the recipient's email).

---

## Page Permissions

| User | `/users` directory | `/users/[id]` detail | Mutations |
|------|--------------------|----------------------|-----------|
| Super Admin (active) | View all | View all | All operations above (subject to founding-Super-Admin and last-Super-Admin guards) |
| Admin (active) | View all | View all (read-only) | None — `Add user` button is hidden, and all row actions other than `Copy email` and `View details` are hidden |
| Inactive admin | Cannot reach `/users` (blocked by middleware) | — | — |

The page-level gate is enforced in three independent places, and **all three** must agree:

1. Middleware allows the request through (admin role + active).
2. Page render hides Super-Admin-only UI based on the caller's `admin_role`.
3. API routes re-check `admin_role` and the founding-/last-Super-Admin guards before mutating. The UI is never the source of truth for authorisation.

---

## API Routes (target shape)

These are not yet implemented — the Users module today is mock-only (`apps/admin/src/constants/mock-admin-users.ts`). When wired up, the routes follow the existing admin API conventions (per-route admin actor resolution via `getAdminActorProfileId()` in `apps/admin/src/lib/admin-actor.ts`):

| Route | Method | Caller | Purpose |
|-------|--------|--------|---------|
| `/api/admin-users` | `GET` | Any active admin | List admin profiles for the directory |
| `/api/admin-users/invite` | `POST` | Super Admin | Create invitation + auth user + profile (transactional) |
| `/api/admin-users/[id]` | `GET` | Any active admin | Detail + filtered `admin_action_log` timelines |
| `/api/admin-users/[id]/resend-invite` | `POST` | Super Admin | Re-issue invitation |
| `/api/admin-users/[id]/deactivate` | `POST` | Super Admin | Deactivate + force sign-out |
| `/api/admin-users/[id]/reactivate` | `POST` | Super Admin | Reactivate |
| `/api/admin-users/[id]/role` | `PATCH` | Super Admin | Change `admin_role` |
| `/api/admin-users/[id]/force-signout` | `POST` | Super Admin | Revoke all sessions for the target |

Every mutating route writes one `admin_action_log` row in the same transaction as the data change.

---

## Audit Log

`admin_action_log` is the single source of truth for who-did-what. The User Management module both writes to it (every mutation) and reads from it (the detail-page action history panels and the derived `last_active_at`).

Two enum extensions are required to support this module — they slot into the existing types defined in [`docs/database/12_club_governance.md`](../../database/12_club_governance.md):

```sql
ALTER TYPE admin_action_enum ADD VALUE 'admin_invited';
ALTER TYPE admin_action_enum ADD VALUE 'admin_invite_resent';
ALTER TYPE admin_action_enum ADD VALUE 'admin_activated';
ALTER TYPE admin_action_enum ADD VALUE 'admin_deactivated';
ALTER TYPE admin_action_enum ADD VALUE 'admin_reactivated';
ALTER TYPE admin_action_enum ADD VALUE 'admin_role_changed';
ALTER TYPE admin_action_enum ADD VALUE 'admin_force_signed_out';

ALTER TYPE admin_action_entity_enum ADD VALUE 'admin_user';
```

| `action` | `entity_type` | `entity_id` | Notes |
|----------|---------------|-------------|-------|
| `admin_invited` | `admin_user` | invited admin's `profiles.id` | `after_value` carries `{ email, role }` |
| `admin_invite_resent` | `admin_user` | target `profiles.id` | |
| `admin_activated` | `admin_user` | target `profiles.id` | Written by the verify-otp handler when an invite is consumed; `admin_id` is the target themselves (they activated their own account) |
| `admin_deactivated` | `admin_user` | target `profiles.id` | |
| `admin_reactivated` | `admin_user` | target `profiles.id` | |
| `admin_role_changed` | `admin_user` | target `profiles.id` | `before_value` / `after_value` carry the role |
| `admin_force_signed_out` | `admin_user` | target `profiles.id` | |

The detail page renders two panels off this single table:

- **Activity by this admin** — `WHERE admin_id = <target>.id`. This is what the target has done.
- **Activity on this admin** — `WHERE entity_type = 'admin_user' AND entity_id = <target>.id`. This is what has been done to the target.

---

## MVP Scope vs Today

The current implementation under `apps/admin/src/components/modules/users/` is **mock-only**:

| Layer | Status |
|-------|--------|
| Directory UI (`AdminUsersTable`, `UsersView`) | Built, mock data |
| Add User dialog | Built, no API call |
| User detail page | Built, mock data |
| `admin_role` and `admin_is_active` columns | Not yet in `profiles` |
| `admin_invitations` table | Not yet in schema |
| API routes above | Not yet implemented |
| `admin_action_enum` / `admin_action_entity_enum` extensions | Not yet applied |
| Force sign-out via service role | Not yet implemented |
| `FOUNDING_SUPER_ADMIN_ID` env constant | Not yet wired |

The mock distinguishes `Admin` vs `Super admin` as a free-text role string and treats `active`/`inactive` as a UI badge. This document describes the **target** shape — replace mocks with the model above when User Management is implemented for real.

---

## Relationship to Other Docs

- [`01_admin_overview.md`](./01_admin_overview.md) — Admin role and access summary; auth flow is described there at a glance and elaborated here.
- [`docs/database/12_club_governance.md`](../../database/12_club_governance.md) — `admin_action_log` schema and the `admin_action_enum` / `admin_action_entity_enum` definitions extended above.
- [`docs/database/08_admin.md`](../../database/08_admin.md) — Admin role JWT-claim model and platform-wide RLS pattern.
- [`docs/database/01_users_and_profiles.md`](../../database/01_users_and_profiles.md) — The `profiles` table that admin rows live in.
- [`docs/views/admin_app/login.md`](../../views/admin_app/login.md) — Login UI. The password + TOTP description there pre-dates the email-OTP-only implementation; this doc is authoritative for the auth flow.
