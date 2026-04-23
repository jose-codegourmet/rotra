# View: Admin notifications

## Purpose

Surfaces **`admin_notifications`** for platform admins: new club applications, demotion requests, complaints, moderation flags (types per [`../../database/12_club_governance.md`](../../database/12_club_governance.md)).

## Delivery model (MVP)

- **No Realtime requirement** — fetch unread count + recent list when the admin opens the shell or dropdown (keeps Admin app light).
- Client app player notifications still use Realtime per [`../client_app/common/notification_center.md`](../client_app/common/notification_center.md).

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
