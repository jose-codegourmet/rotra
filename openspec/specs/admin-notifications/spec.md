# Admin Notifications Specification

## Purpose

Admin inbox for platform alerts, plus a super-admin broadcast API with no compose UI in the admin app. Side-effect notifications are created from other admin mutations (customers, tags, admin lifecycle, testers).

## Requirements

### Requirement: Admin inbox list
`GET /api/notifications/me` SHALL require `requireAdminSession()` and list notifications for the current admin only. Pagination SHALL default to page 1, limit 20, clamped 1–50. Rows SHALL include `id`, `type`, `severity`, `targetUrl`, `title`, `body`, `readAt`, and `createdAt`, plus list metadata including `unreadCount`.

#### Scenario: Admin fetches own inbox
- GIVEN notifications addressed to the current admin
- WHEN they GET `/api/notifications/me`
- THEN only that admin's rows are returned

#### Scenario: Non-admin
- GIVEN no admin session
- WHEN they GET `/api/notifications/me`
- THEN the API returns HTTP 401 or 403

### Requirement: Mark all read
`POST /api/notifications/me/read-all` SHALL mark the current admin's unread inbox items as read. There is no per-notification mark-read API or UI.

#### Scenario: Mark all as read
- GIVEN unread admin notifications
- WHEN the admin POSTs `/api/notifications/me/read-all`
- THEN those items become read
- AND `unreadCount` becomes 0 on the next list

### Requirement: Inbox page and shell dropdown
`/notifications` SHALL show the admin inbox. The shell dropdown SHALL poll about every 30 seconds and MAY link items via `targetUrl`. “View all” SHALL go to `/notifications`.

#### Scenario: Dropdown link
- GIVEN an inbox row with a `targetUrl`
- WHEN the admin opens it from the shell dropdown
- THEN they navigate to that URL

### Requirement: Broadcast API is super-admin only
`GET` and `POST /api/notifications/broadcasts` SHALL return HTTP 403 unless `adminRole` is `super_admin`. POST SHALL validate audience (tag slugs and/or admin roles) and SHALL require `targetUrl` when `appScopes` includes `admin`. It MUST call `broadcastNotification()` in `@rotra/db`. Hooks for broadcasts exist but no admin page SHALL render a compose form.

#### Scenario: Super admin lists broadcasts
- GIVEN the caller is `super_admin`
- WHEN they GET `/api/notifications/broadcasts`
- THEN paginated broadcast rows are returned

#### Scenario: Regular admin posts a broadcast
- GIVEN the caller is `admin` not `super_admin`
- WHEN they POST `/api/notifications/broadcasts`
- THEN the API returns HTTP 403

### Requirement: Side-effect notifications
Other admin modules SHALL create admin inbox notifications when they mutate customers, tag definitions, admin lifecycle, or tester invites. Those writes happen in `@rotra/db` services, not from a compose UI.

#### Scenario: Customer edit notifies other admins
- GIVEN an admin updates a customer profile
- WHEN the customer mutation succeeds
- THEN other admins can receive an inbox notification about that change

## Source

- `apps/admin/src/app/(protected)/notifications/page.tsx`
- `apps/admin/src/app/api/notifications/me/route.ts`
- `apps/admin/src/app/api/notifications/me/read-all/route.ts`
- `apps/admin/src/app/api/notifications/broadcasts/route.ts`
- `apps/admin/src/hooks/useAdminNotifications/**`
- `apps/admin/src/hooks/useNotificationBroadcast/**`
- `packages/db/src/notification-service.ts`
- `packages/db/src/notification-broadcast-service.ts`
- `packages/db/prisma/models_notifications.prisma`
