# View: Admin notifications

## Purpose

Surfaces **`admin_notifications`** for platform admins: new club applications, demotion requests, complaints, moderation flags (types per [`../../database/12_club_governance.md`](../../database/12_club_governance.md)).

## Delivery model (MVP)

- **No Realtime requirement** — fetch unread count + recent list when the admin opens the shell or dropdown (keeps Admin app light).
- Client app player notifications still use Realtime per [`../client_app/common/notification_center.md`](../client_app/common/notification_center.md).

## Severity

Each admin notification carries a `severity` of `urgent`, `warning`, or `info`.

- `urgent` — incidents that require immediate action (moderation flags, kill switches, rate-limit alerts).
- `warning` — items that need attention soon (open approvals, escalations, appeals).
- `info` — confirmations and FYIs (system events, completed actions, maintenance).

- `urgent` rows show a left accent bar and a `ShieldAlert` icon in the `error` color, with a subtle `bg-error` wash while unread.
- `warning` rows show a left accent bar and an `AlertTriangle` icon in the `warning` color, with a subtle `bg-warning` wash while unread.
- `info` rows render with no severity treatment. Read/unread state for info is conveyed by title color only.

The bell dropdown row and the full notifications page (`/notifications`) use this treatment. For `urgent` and `warning`, read rows drop the background wash and the icon is shown at reduced opacity. `info` rows have no icon.

Until the DB schema lands, severity is sourced from the mock list at [`../../../apps/admin/src/constants/mock-notifications.ts`](../../../apps/admin/src/constants/mock-notifications.ts).

## Navbar dropdown

- Bell icon with **unread badge** (count of rows where `read_at IS NULL` for current admin).
- Dropdown lists **5 most recent** notifications (newest first).
- **Mark all as read** at top of panel.
- Each row: title, short body, relative time; tap → set `read_at`, navigate to `target_url` (e.g. `/admin/approvals/club-applications?id=…`).

## Full page route

`/admin/notifications`

- Paginated list, same columns as dropdown plus `type` and absolute timestamp.
- **Mark all as read** in header.

## Cross-link

[`../../database/12_club_governance.md`](../../database/12_club_governance.md) — `admin_notifications` + `admin_notification_type_enum`.
