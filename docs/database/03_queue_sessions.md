# 03 — Queue Sessions

## Overview

A **Queue Session** is the central operational unit of ROTRA — a bounded, time-limited badminton event hosted under a club. Sessions contain a player roster, a match queue, and real-time state.

Two origin types exist:
- **Player-organized** — created by any club member; always informal, no EXP or MMR awarded.
- **Club queue** — created by a Que Master or Club Owner; must specify a schedule type (MMR competitive or Fun Games).

Only `origin = 'club_queue'` AND `schedule_type = 'mmr'` sessions award EXP and MMR changes.

This file covers:
- `queue_sessions` — session metadata and configuration
- `session_registrations` — per-player admission, in-session status, and payment tracking

---

## Enums

```sql
CREATE TYPE session_origin_enum AS ENUM ('player_organized', 'club_queue');

-- Only applicable when origin = 'club_queue'; NULL for player_organized
CREATE TYPE schedule_type_enum AS ENUM ('mmr', 'fun_games');

CREATE TYPE session_status_enum AS ENUM ('draft', 'open', 'active', 'closed', 'cancelled');

CREATE TYPE session_visibility_enum AS ENUM ('club_members', 'open');

CREATE TYPE match_format_enum AS ENUM ('best_of_1', 'best_of_3');

CREATE TYPE markup_type_enum AS ENUM ('flat', 'percentage');

CREATE TYPE admission_status_enum AS ENUM ('accepted', 'waitlisted', 'reserved', 'exited');

CREATE TYPE player_session_status_enum AS ENUM (
  'not_arrived',
  'i_am_in',
  'i_am_prepared',
  'playing',
  'waiting',
  'resting',
  'eating',
  'suspended',
  'exited'
);

CREATE TYPE join_session_method_enum AS ENUM ('app', 'qr');

CREATE TYPE payment_status_enum AS ENUM ('unpaid', 'paid', 'partial');
```

---

## Table: `queue_sessions`

```sql
CREATE TABLE queue_sessions (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id  uuid NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  host_id  uuid NOT NULL REFERENCES profiles(id),

  -- Session classification
  origin        session_origin_enum NOT NULL,
  schedule_type schedule_type_enum,  -- NULL when origin = 'player_organized'

  status     session_status_enum NOT NULL DEFAULT 'draft',
  visibility session_visibility_enum NOT NULL DEFAULT 'club_members',

  -- Venue & time
  location  text NOT NULL,
  address   text,
  date_time timestamptz NOT NULL,
  end_time  timestamptz,

  -- Court configuration
  num_courts       int NOT NULL CHECK (num_courts > 0),
  players_per_court int NOT NULL CHECK (players_per_court > 0),
  -- Computed and stored for fast slot capacity checks
  total_slots      int NOT NULL GENERATED ALWAYS AS (num_courts * players_per_court) STORED,

  -- Match format
  match_format  match_format_enum NOT NULL DEFAULT 'best_of_1',
  score_limit   int NOT NULL DEFAULT 21,
  -- Que Master's time estimate per match (used for wait time display)
  match_duration_estimate_minutes int NOT NULL DEFAULT 15,

  -- Shuttle & cost inputs
  shuttle_type         text,
  shuttle_cost_per_tube numeric(10, 2),
  shuttles_used        int NOT NULL DEFAULT 0,
  court_cost           numeric(10, 2),
  markup_type          markup_type_enum,
  markup_amount        numeric(10, 2),

  -- Smart monitoring threshold (e.g. 0.9 = alert at 90% of score limit)
  smart_monitor_threshold  numeric(3, 2) NOT NULL DEFAULT 0.90,

  -- Minutes after session start before Que Master can auto-move no-show Accepted players to Waitlist
  attendance_window_minutes int NOT NULL DEFAULT 15,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- schedule_type must be set when origin is club_queue
  CONSTRAINT club_queue_requires_schedule_type
    CHECK (origin = 'player_organized' OR schedule_type IS NOT NULL)
);
```

### Notes

- `total_slots` is a **generated column** — it is always `num_courts × players_per_court` and cannot be written directly.
- `status` transitions follow a strict state machine (see diagram below).
- `shuttles_used` is updated by the Que Master during the session as tubes are consumed; it feeds the cost calculation.
- `smart_monitor_threshold` is configurable per session by the Que Master (default 90%).

### Per-Player Cost Formula

```
total_cost       = court_cost + (shuttles_used × shuttle_cost_per_tube)
per_player_cost  = ceil(total_cost / accepted_player_count)

if markup_type = 'flat':
    per_player_cost += markup_amount

if markup_type = 'percentage':
    per_player_cost += per_player_cost * (markup_amount / 100)
```

This is calculated at the application layer and written to each player's `session_registrations.per_player_cost` row when payment is settled or at session close.

### Session Status State Machine

```
draft ──► open ──► active ──► closed
  │                  │
  └──────────────────┴──► cancelled
```

| Status | Meaning |
|---|---|
| `draft` | Setup incomplete; not visible to players |
| `open` | Accepting registrations; visible to members |
| `active` | Session has started; matches running |
| `closed` | Session ended; read-only |
| `cancelled` | Cancelled before or during; read-only |

### Indexes

```sql
CREATE INDEX idx_queue_sessions_club_id    ON queue_sessions(club_id);
CREATE INDEX idx_queue_sessions_host_id    ON queue_sessions(host_id);
CREATE INDEX idx_queue_sessions_status     ON queue_sessions(status);
CREATE INDEX idx_queue_sessions_date_time  ON queue_sessions(date_time);
CREATE INDEX idx_queue_sessions_origin     ON queue_sessions(origin);
CREATE INDEX idx_queue_sessions_schedule   ON queue_sessions(schedule_type);
```

---

## Table: `session_registrations`

One row per player per session. Tracks admission state, real-time in-session status, and payment.

```sql
CREATE TABLE session_registrations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES queue_sessions(id) ON DELETE CASCADE,
  player_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Admission (capacity-based)
  admission_status admission_status_enum NOT NULL DEFAULT 'waitlisted',

  -- Position in the waitlist; NULL when not waitlisted
  -- Lower number = earlier in line (FIFO)
  waitlist_position int,

  -- How the player joined the session
  join_method join_session_method_enum NOT NULL DEFAULT 'app',

  -- Real-time in-session state
  player_status player_session_status_enum NOT NULL DEFAULT 'not_arrived',

  -- Payment tracking (managed manually by Que Master)
  payment_status  payment_status_enum NOT NULL DEFAULT 'unpaid',
  payment_amount  numeric(10, 2) NOT NULL DEFAULT 0,
  -- Frozen at settlement or session close
  per_player_cost numeric(10, 2),

  registered_at timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),

  UNIQUE (session_id, player_id)
);
```

### Notes

- **Admission vs. player status**: `admission_status` is a capacity/slot concern; `player_status` is the real-time in-venue state. A player can be `accepted` but still `not_arrived`.
- **Waitlist FIFO**: `waitlist_position` is managed by the application layer. When an Accepted player exits, the row with `waitlist_position = 1` (lowest number) is promoted to `accepted`. All other positions shift down by 1.
- **Reserved**: `admission_status = 'reserved'` is a Que Master-set state holding a slot for a specific player (e.g. late arrival confirmed by phone). The player is not included in the regular waitlist.
- **Payment confirmation for early exit**: before the Que Master marks a player as `exited`, `payment_status` must be `'paid'` or `'partial'` (enforced at the application layer). Slot release only happens after this confirmation.
- **Early exit cost**: early-exiting players pay the **same per-head fee as all other players** — they are not given a discount for leaving early. Their `per_player_cost` is **snapshotted at the time they exit** (based on the cost inputs available at that moment: `court_cost`, `shuttles_used × shuttle_cost_per_tube`, current `accepted_player_count`, and any markup). This snapshot is written to their `session_registrations.per_player_cost` row immediately when the Que Master confirms their exit.
- **Queue rotation eligibility**: only rows where `player_status IN ('i_am_prepared', 'waiting')` (plus optionally `'resting'` at Que Master discretion) are considered for match assignment.

### Admission Status State Machine

```
waitlisted ──► accepted ──► exited
                 │
              reserved
```

| Transition | Trigger |
|---|---|
| `waitlisted → accepted` | Slot opens (another player exits) or session has capacity on join |
| `accepted → exited` | Player exits; Que Master confirms payment first |
| `waitlisted → exited` | Player removes themselves from the waitlist |
| `accepted → reserved` | Que Master manually holds the slot |

### Player Status Transitions

| Status | Set By | Meaning |
|---|---|---|
| `not_arrived` | System (default) | Registered but not at venue |
| `i_am_in` | Player (or Que Master override) | Arrived at venue |
| `i_am_prepared` | Player (or Que Master override) | Ready to play; in rotation pool |
| `playing` | System (auto on match start) | Currently in an active match |
| `waiting` | System (auto after match ends) | Queued; ready for next match |
| `resting` | Player or Que Master | On break; skipped in rotation |
| `eating` | Player or Que Master | Meal break; skipped in rotation |
| `suspended` | Que Master only | Temporarily out of rotation |
| `exited` | Player or Que Master | Left the session |

> **Match assignment overrides break state.** If a player is `resting` or `eating` and is assigned to a match by the Que Master, their status is set to `playing` immediately on match start. When the match ends, they are set to `waiting` — not returned to their prior break state. If they wish to take another break, they must set `resting` or `eating` again manually.

### Indexes

```sql
CREATE INDEX idx_session_reg_session_id     ON session_registrations(session_id);
CREATE INDEX idx_session_reg_player_id      ON session_registrations(player_id);
CREATE INDEX idx_session_reg_admission      ON session_registrations(admission_status);
CREATE INDEX idx_session_reg_player_status  ON session_registrations(player_status);
CREATE INDEX idx_session_reg_payment        ON session_registrations(payment_status);
-- Efficient waitlist ordering
CREATE INDEX idx_session_reg_waitlist ON session_registrations(session_id, waitlist_position)
  WHERE admission_status = 'waitlisted';
```

---

## Realtime Subscriptions

Both tables are published to Supabase Realtime. See `09_rls_and_realtime.md` for full configuration.

| Table | Subscribed By | Events |
|---|---|---|
| `queue_sessions` | Que Masters, Players, Umpires | `UPDATE` (status, cost changes) |
| `session_registrations` | Que Masters, Players | `INSERT`, `UPDATE` (status, payment, waitlist) |

---

## Relationships

```
clubs ──► queue_sessions (1:many)
profiles ──► queue_sessions (1:many via host_id)
queue_sessions ──► session_registrations (1:many)
profiles ──► session_registrations (1:many)
queue_sessions ──► matches (1:many)  [see 04_matches.md]
```
