# 07 — Notifications

## Overview

All in-app notifications are persisted in a single `notifications` table. This covers session reminders, in-session events (match assignment, umpire duty, waitlist promotion), post-session summaries, and club management events.

Notifications are inserted server-side (via Supabase Edge Functions or server actions) and read by the client via Supabase Realtime subscription. Push delivery (mobile) is out of scope for MVP — in-app only.

---

## Enum

```sql
CREATE TYPE notification_type_enum AS ENUM (
  -- Session reminders (pre-session)
  'session_reminder_2h',
  'session_reminder_1h',
  'session_reminder_30m',
  'session_reminder_5m',
  'session_started',

  -- In-session events
  'match_assigned',          -- player is in the next match
  'umpire_assigned',         -- player has been assigned as umpire
  'score_near_limit',        -- Que Master: match nearing end (smart monitor)
  'match_completed',         -- all participants: submit your review
  'waitlist_promoted',       -- player moved from waitlist to accepted
  'payment_reminder',        -- player: settle your session fee

  -- Post-session
  'session_ended',
  'review_window_closing',   -- 2 hours left to submit review
  'leaderboard_published',

  -- Club events
  'join_request_result',     -- approved or rejected
  'direct_invite_received',  -- Club Owner sent a direct invite
  'club_owner_application_result'  -- Admin approved or rejected application
);
```

---

## Table: `notifications`

```sql
CREATE TABLE notifications (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  type  notification_type_enum NOT NULL,
  title text NOT NULL,
  body  text NOT NULL,

  is_read bool NOT NULL DEFAULT false,
  read_at timestamptz,

  -- Allows deep-linking from the notification to the relevant entity
  related_entity_type text,  -- e.g. 'session', 'match', 'club', 'review'
  related_entity_id   uuid,  -- FK to the related entity (not enforced at DB level for flexibility)

  -- For scheduled reminders: when this notification should be sent
  -- NULL = send immediately on insert
  scheduled_at timestamptz,
  sent_at      timestamptz,

  created_at   timestamptz NOT NULL DEFAULT now()
);
```

### Notes

- **Scheduled notifications** (e.g. session reminders at 2h, 1h, 30m, 5m) are inserted with a `scheduled_at` timestamp. A Supabase Edge Function runs on a cron schedule, queries for unsent notifications where `scheduled_at <= now()` and `sent_at IS NULL`, sends them, and updates `sent_at`.
- **Immediate notifications** have `scheduled_at = NULL` and are treated as "send now" — `sent_at` is populated on insert.
- `related_entity_type` + `related_entity_id` enable the client to navigate to the correct screen on tap. No FK constraint is added here because `related_entity_id` may reference any of several tables.
- `is_read` is toggled client-side when the player opens the notification center or taps a specific notification.
- Notifications are **never deleted** — they are the player's notification history. Old notifications may be soft-archived in a future phase.

### Notification Content Examples

| Type | Title | Body |
|---|---|---|
| `session_reminder_2h` | "Session in 2 hours" | "Your session at [venue] starts in 2 hours." |
| `session_reminder_1h` | "Session in 1 hour" | "1 hour until your session at [venue]." |
| `session_reminder_30m` | "Session starting soon" | "Your session starts in 30 minutes. Head to [venue]." |
| `session_reminder_5m` | "Session starting now" | "Your session is starting! Head to the court." |
| `session_started` | "Session has started" | "Your session at [venue] has begun. Mark yourself as In." |
| `match_assigned` | "You're up next" | "You're playing on Court [X]. Get ready!" |
| `umpire_assigned` | "Umpire duty" | "You're umpiring the next match on Court [X]." |
| `score_near_limit` | "Match nearing end" | "Match on Court [X] is at [score]/[limit]. Prepare next match." |
| `match_completed` | "Match complete" | "Submit your player reviews. Window closes in 24 hours." |
| `waitlist_promoted` | "You're in!" | "A slot opened up. You've been accepted into the session." |
| `payment_reminder` | "Payment due" | "Please settle your session fee with the Que Master." |
| `session_ended` | "Session over" | "View the final leaderboard for [session name]." |
| `review_window_closing` | "2 hours left" | "Submit your match reviews before the window closes." |
| `leaderboard_published` | "Final standings live" | "The final leaderboard for [session] is now published." |
| `join_request_result` | "Join request update" | "Your request to join [club name] was approved / rejected." |
| `direct_invite_received` | "Club invitation" | "[Club Owner name] has invited you to join [club name]." |
| `club_owner_application_result` | "Application update" | "Your Club Owner application has been approved / rejected." |

### Indexes

```sql
CREATE INDEX idx_notifications_recipient_id  ON notifications(recipient_id);
CREATE INDEX idx_notifications_is_read       ON notifications(recipient_id, is_read);
CREATE INDEX idx_notifications_scheduled_at  ON notifications(scheduled_at)
  WHERE scheduled_at IS NOT NULL AND sent_at IS NULL;
CREATE INDEX idx_notifications_type          ON notifications(type);
CREATE INDEX idx_notifications_created_at    ON notifications(created_at DESC);
```

---

## Session Reminder Scheduling

When a session is created with a `date_time`, the server inserts scheduled reminder rows automatically:

```sql
-- Inserted for each accepted player when they join (or when session is created)
INSERT INTO notifications (recipient_id, type, title, body, related_entity_type, related_entity_id, scheduled_at)
VALUES
  (:player_id, 'session_reminder_2h',  ..., :session_id, :date_time - INTERVAL '2 hours'),
  (:player_id, 'session_reminder_1h',  ..., :session_id, :date_time - INTERVAL '1 hour'),
  (:player_id, 'session_reminder_30m', ..., :session_id, :date_time - INTERVAL '30 minutes'),
  (:player_id, 'session_reminder_5m',  ..., :session_id, :date_time - INTERVAL '5 minutes');
```

When a player is moved from `waitlisted → accepted`, the same reminder rows are inserted. If a player exits or the session is cancelled, their pending scheduled notifications are soft-cancelled by setting `sent_at = now()` (so the cron job skips them) and updating the body to a cancellation message — or alternatively, a hard delete of unsent reminders is acceptable here since they are operational, not historical.

---

## Realtime

The `notifications` table is published to Supabase Realtime with a filter on `recipient_id`. Each client subscribes only to their own notifications:

```js
supabase
  .channel('notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `recipient_id=eq.${userId}`
  }, handleNewNotification)
  .subscribe()
```

---

## Relationships

```
profiles ──► notifications (1:many via recipient_id)
```

`related_entity_id` may reference `queue_sessions`, `matches`, `clubs`, or `match_reviews` — resolved at the application layer by `related_entity_type`.
