# Admin App — 01 Admin Overview

## What the Admin App Is

The Admin App is an internal-only web dashboard for the platform team. It provides a single place to control, monitor, and configure the entire badminton platform without touching code or running deployments.

The Admin App is intentionally separate from the Client App to:
- Prevent accidental exposure of platform controls to end users
- Allow internal operations to continue even if the Client App has an incident
- Keep audit trails for all admin actions isolated and tamper-proof

---

## Admin User

Admin accounts are created **only** through the invitation flow run by a Super Admin from the Admin App's Users module — there is no public registration or self-service flow. See [`08_user_management.md`](./08_user_management.md) for the full lifecycle (invite → activation → deactivation → role change → audit) and the underlying schema.

### Capabilities

| Action | Details |
|--------|---------|
| Approve / reject **club applications**; manage **demotion requests** and **complaints** | Structured queues; see [`../../database/12_club_governance.md`](../../database/12_club_governance.md) |
| Manage all kill switches | Toggle any feature flag on/off across the platform |
| Switch and configure environments | Manage dev, staging, and production configs |
| Platform-wide moderation | Flagged reviews, account suspensions, content removal |
| Manage global rankings | Featured leaderboards, cross-club standings |
| Configure gamification parameters | EXP rates, tier thresholds, badge criteria |
| Manage skill dimensions | Add/edit/retire skill dimensions without a deploy |
| View platform analytics | Active clubs, sessions per week, player retention, revenue signals |

### What Admin Cannot Do

- Admins do not interact with live sessions — session management is the Que Master's domain
- Admins do not override match scores directly — that is scoped to the Que Master
- Admins do not appear in any player-facing view, leaderboard, or club roster

---

## Access Model

| Level | DB value | Who | How |
|-------|----------|-----|-----|
| Founding Super Admin | `profiles.admin_role = 'super_admin'`, id matches `FOUNDING_SUPER_ADMIN_ID` | Platform owner | Seeded directly in the database; cannot be deactivated, demoted, or removed by any UI flow |
| Super Admin | `profiles.admin_role = 'super_admin'` | Senior internal team member | Invited by another Super Admin; can be deactivated or demoted |
| Admin | `profiles.admin_role = 'admin'` | Internal team member | Invited by a Super Admin; can be deactivated, reactivated, or promoted |

Inviting, deactivating, role-changing, and force-signing-out other admins is **Super Admin only**. Regular Admins have read-only access to the Users module. Full lifecycle and guards (founding-Super-Admin protection, last-active-Super-Admin guard) are documented in [`08_user_management.md`](./08_user_management.md).

All admin actions are logged in **`admin_action_log`** with:
- Timestamp
- Admin account that performed the action
- `action`, `entity_type`, `entity_id`
- `before_value` / `after_value` JSON (uncapped) and optional `note`

Logs are append-only — no admin can edit or delete rows (future cron may prune very old rows).

---

## Auth & Security

- Admin App is hosted at a separate URL (not the same domain as the Client App).
- Login is **email + Supabase email-OTP only**. There is no password, no Facebook OAuth, no social provider, and no public sign-up.
- The OTP request endpoint is called with `shouldCreateUser: false`, so OTPs are only delivered to email addresses that already exist as admin auth users — and the only path that creates such a user is the Super-Admin-driven invitation flow in [`08_user_management.md`](./08_user_management.md). Requests for unknown emails return the same generic success message (no enumeration leak).
- Every authenticated request must satisfy all three of: JWT claim `app_metadata.role = 'admin'`, `profiles.admin_role IS NOT NULL`, and `profiles.admin_is_active = true`.
- Sessions expire after 4 hours of inactivity.
- All Admin App traffic is IP-restricted to the internal team by default (configurable).
- Failed login attempts are rate-limited and logged.

> TOTP / second-factor auth is **out of scope for MVP**. The view doc `docs/views/admin_app/login.md` describes a password + TOTP UI that pre-dates the OTP-only implementation; this file is authoritative for the auth flow.

---

## MVP Phase

The Admin App is the canonical surface for **club applications**, **demotions**, **complaints**, **`admin_notifications`**, and **`admin_action_log`**. See [`../client_app/16_mvp_plan.md`](../client_app/16_mvp_plan.md) — Phase 3, Admin Role section.

In-app **admin notifications** (dropdown + `/admin/notifications`) are fetched when opened; full **Realtime** is optional and not required for MVP on the Admin app.
