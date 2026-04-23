# Admin App — 01 Admin Overview

## What the Admin App Is

The Admin App is an internal-only web dashboard for the platform team. It provides a single place to control, monitor, and configure the entire badminton platform without touching code or running deployments.

The Admin App is intentionally separate from the Client App to:
- Prevent accidental exposure of platform controls to end users
- Allow internal operations to continue even if the Client App has an incident
- Keep audit trails for all admin actions isolated and tamper-proof

---

## Admin User

There is a single admin role at the platform level. Admin accounts are created directly in the system — there is no registration, invite, or self-service flow.

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

| Level | Who | How |
|-------|-----|-----|
| Super Admin | Platform owner | Created at system level; cannot be deleted |
| Admin | Internal team member | Created by Super Admin; can be revoked |

All admin actions are logged in **`admin_action_log`** with:
- Timestamp
- Admin account that performed the action
- `action`, `entity_type`, `entity_id`
- `before_value` / `after_value` JSON (uncapped) and optional `note`

Logs are append-only — no admin can edit or delete rows (future cron may prune very old rows).

---

## Auth & Security

- Admin App is hosted at a separate URL (not the same domain as the Client App)
- Login is email + password with mandatory 2FA (TOTP)
- Sessions expire after 4 hours of inactivity
- All Admin App traffic is IP-restricted to the internal team by default (configurable)
- Failed login attempts are rate-limited and logged

---

## MVP Phase

The Admin App is the canonical surface for **club applications**, **demotions**, **complaints**, **`admin_notifications`**, and **`admin_action_log`**. See [`../client_app/16_mvp_plan.md`](../client_app/16_mvp_plan.md) — Phase 3, Admin Role section.

In-app **admin notifications** (dropdown + `/admin/notifications`) are fetched when opened; full **Realtime** is optional and not required for MVP on the Admin app.
