# Notifications Specification

## Purpose

Client inbox for the current player's notifications. The protected shell prefetches a short list for badges and a desktop dropdown. The `/notifications` page lists a first page of rows and can mark all as read. There is no per-item mark-read or pagination UI.

## Requirements

### Requirement: Inbox list API
`GET /api/notifications/me` MUST require a current profile (HTTP 401 otherwise). It SHALL list notifications for `recipientId === current profile.id`, newest first. Pagination SHALL default to `page=1`, `limit=20`, and clamp `limit` to 1–50. The response MUST include `rows`, `page`, `limit`, `total`, `unreadCount`, and `hasMore`. Each row SHALL include `id`, `type`, `severity`, `title`, `body`, `isRead`, `readAt`, and `createdAt`.

#### Scenario: Authenticated inbox fetch
- GIVEN a signed-in profile with notifications
- WHEN they GET `/api/notifications/me?page=1&limit=20`
- THEN the API returns that player's rows plus `unreadCount`

#### Scenario: Unauthenticated inbox fetch
- GIVEN no current profile
- WHEN they GET `/api/notifications/me`
- THEN the API returns HTTP 401

### Requirement: Mark all read
`POST /api/notifications/me/read-all` MUST require a current profile. It SHALL mark all of that recipient's unread notifications as read and return `{ ok: true, count }`. Database failure SHALL return HTTP 500.

#### Scenario: Mark all as read from the inbox page
- GIVEN the player has `unreadCount > 0`
- WHEN they use “Mark all as read”
- THEN `POST /api/notifications/me/read-all` runs
- AND notification queries are invalidated

### Requirement: Inbox page
`/notifications` SHALL prefetch page 1 with limit 20 on the server. The client SHALL refetch every 30 seconds. Empty state copy SHALL be “You're all caught up.” Load failure SHALL show “Unable to load notifications. Please refresh the page.” The page MUST NOT render further pages even when `hasMore` is true. Rows SHALL be display-only (no click-to-open or per-item read).

#### Scenario: Empty inbox
- GIVEN the player has no notifications
- WHEN they open `/notifications`
- THEN they see “You're all caught up.”

#### Scenario: First page only
- GIVEN `hasMore` is true
- WHEN the inbox page renders
- THEN only the first 20 rows are shown
- AND no pagination control loads the next page

### Requirement: Shell badges and dropdown
The protected layout SHALL prefetch page 1 with limit 5 for the shell. `DashboardLayout` SHALL pass `unreadCount` to navbar, sidebar, mobile header, and bottom nav. The unread badge SHALL be hidden when `unreadCount <= 0`. Desktop SHALL show a bell dropdown of up to 5 items plus “View all” to `/notifications`. Mobile header SHALL link the bell to `/notifications` without a dropdown.

#### Scenario: Unread badge hidden
- GIVEN `unreadCount` is 0
- WHEN the shell renders
- THEN the notification badge is not shown

#### Scenario: Desktop preview
- GIVEN unread notifications exist
- WHEN the desktop bell dropdown opens
- THEN up to 5 adapted items are shown
- AND “View all” goes to `/notifications`

### Requirement: Type to UI kind mapping
Client adapters SHALL map known `NotificationType` values to UI kinds (session, club, system, and others defined in `NOTIFICATION_TYPE_TO_KIND`). Unknown types SHALL map to `system`.

#### Scenario: Unknown type
- GIVEN a notification whose type is not in the mapping table
- WHEN it is adapted for the UI
- THEN its kind is `system`

## Source

- `apps/client/src/app/(protected)/notifications/page.tsx`
- `apps/client/src/app/(protected)/layout.tsx`
- `apps/client/src/app/api/notifications/me/route.ts`
- `apps/client/src/app/api/notifications/me/read-all/route.ts`
- `apps/client/src/hooks/useNotifications/client.ts`
- `apps/client/src/hooks/useNotifications/server.ts`
- `apps/client/src/layouts/DashboardLayout/DashboardLayout.tsx`
- `apps/client/src/components/modules/notifications/**`
- `packages/db/src/notification-service.ts`
- `packages/db/prisma/models_notifications.prisma`
