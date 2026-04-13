# 08 — Admin

## Overview

The Admin app (`apps/admin`) manages platform-level operations. These four tables back the core admin features: Club Owner application approvals, feature kill switches, platform-wide configuration, and content moderation flags.

All rows in these tables are readable and writable only by users with the Admin role (enforced via RLS — see `09_rls_and_realtime.md`).

---

## Enums

```sql
CREATE TYPE application_status_enum AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE moderation_entity_enum AS ENUM ('review', 'player', 'club');

CREATE TYPE moderation_status_enum AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');

CREATE TYPE environment_enum AS ENUM ('production', 'staging', 'development');
```

---

## Table: `club_owner_applications`

Players submit a Club Owner application with their intended club name and a short intent statement. Until the Admin module is fully built, these are reviewed manually at `jose@codegourmet.io`. The table supports the future Admin UI approval flow.

```sql
CREATE TABLE club_owner_applications (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Intended club details (the club does not exist yet at submission time)
  club_name text NOT NULL,
  intent    text NOT NULL,

  status    application_status_enum NOT NULL DEFAULT 'pending',

  -- Filled when an Admin reviews the application
  reviewed_by  uuid REFERENCES profiles(id),
  review_note  text,
  reviewed_at  timestamptz,

  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
```

### Approval Flow

```
Player submits application
         │
         ▼
  status = 'pending'
         │
   Admin reviews in Admin app (or manual email review for MVP)
         │
    ┌────┴────┐
 approved   rejected
    │            │
    ▼            ▼
Create clubs   Notify player
row for new    (notification
club + notify  inserted)
player
```

When approved:
1. A row is inserted into `clubs` with `owner_id = player_id`.
2. A notification is sent to the player.
3. `status` is set to `'approved'` and `reviewed_by`, `reviewed_at` are populated.

When rejected:
1. A notification is sent to the player with the rejection note.
2. `status` is set to `'rejected'`.

### Notes

- A player may have multiple application rows (e.g. applied, rejected, re-applied). Only one `pending` application per player is enforced at the application layer (not at DB level, to preserve history).
- Players are notified of the outcome via the `notifications` table (`type = 'club_owner_application_result'`).

### Indexes

```sql
CREATE INDEX idx_club_apps_player_id ON club_owner_applications(player_id);
CREATE INDEX idx_club_apps_status    ON club_owner_applications(status);
CREATE INDEX idx_club_apps_created   ON club_owner_applications(created_at DESC);
```

---

## Table: `kill_switches`

Feature flags that can disable specific platform features without a code deploy. Scoped per environment so a switch can be toggled in staging without affecting production.

```sql
CREATE TABLE kill_switches (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Machine-readable key (e.g. 'enable_mmr_sessions', 'enable_umpire_scoring')
  key         text NOT NULL,
  environment environment_enum NOT NULL,

  label       text NOT NULL,       -- human-readable name
  description text,                -- explains what turning this off does

  is_enabled  bool NOT NULL DEFAULT true,

  updated_by  uuid REFERENCES profiles(id),
  updated_at  timestamptz NOT NULL DEFAULT now(),

  UNIQUE (key, environment)
);
```

### Seed Data (example switches)

```sql
INSERT INTO kill_switches (key, environment, label, description, is_enabled) VALUES
  ('enable_mmr_sessions',      'production', 'MMR Sessions',           'Allows creation of MMR (competitive) club queue sessions', true),
  ('enable_umpire_scoring',    'production', 'Umpire Scoring',         'Enables the umpire live scoring interface', true),
  ('enable_exp_gamification',  'production', 'EXP Gamification',       'Awards EXP and tier badges', true),
  ('enable_club_leaderboard',  'production', 'Club Leaderboard',       'Displays the cumulative club leaderboard', true),
  ('enable_sharing',           'production', 'Sharing',                'Enables profile, match, and leaderboard sharing', true),
  ('enable_player_reviews',    'production', 'Player Reviews',         'Allows post-match player-to-player reviews', true),
  ('maintenance_mode',         'production', 'Maintenance Mode',       'Shows a maintenance screen to all users', false);
```

### Notes

- The application reads kill switches at startup and caches them. Changes are picked up on next request or after a configurable TTL.
- `maintenance_mode` is a special switch that, when enabled, redirects all non-admin traffic to a maintenance page.
- The Admin UI `kill-switches` page in `apps/admin` maps directly to this table.

### Indexes

```sql
CREATE INDEX idx_kill_switches_key_env ON kill_switches(key, environment);
CREATE INDEX idx_kill_switches_enabled ON kill_switches(is_enabled);
```

---

## Table: `platform_config`

Key-value store for Admin-configurable platform parameters. Values are stored as `jsonb` to accommodate scalars, arrays, and objects without schema changes.

```sql
CREATE TABLE platform_config (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Machine key (e.g. 'exp_awards', 'mmr_asymmetry_config', 'tier_thresholds')
  key         text NOT NULL UNIQUE,
  description text,

  -- JSONB to accommodate any value shape
  value       jsonb NOT NULL,

  updated_by  uuid REFERENCES profiles(id),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
```

### Seed Data (example config entries)

```sql
INSERT INTO platform_config (key, description, value) VALUES
  ('exp_awards', 'EXP amounts awarded per action', '{
    "match_played": 10,
    "match_won": 15,
    "review_submitted": 5,
    "high_rating_received": 5,
    "umpire_duty": 8,
    "profile_completed": 20,
    "session_attended": 5
  }'),
  ('mmr_asymmetry_config', 'Mixed-rank MMR multipliers', '{
    "mmr_gap_threshold": 200,
    "lower_rated_win_multiplier": 0.7,
    "lower_rated_loss_multiplier": 1.3,
    "higher_rated_win_multiplier": 1.3,
    "higher_rated_loss_multiplier": 0.7
  }'),
  ('review_source_weights', 'Skill rating source weights by reviewer role', '{
    "que_master": 3,
    "umpire": 3,
    "opponent": 2,
    "partner": 1.5,
    "self_assessment": 1
  }'),
  ('sandbagging_thresholds', 'Detection thresholds for sandbagging flags', '{
    "win_rate_vs_higher_mmr": 0.6,
    "external_vs_self_gap": 1.5,
    "min_signals_for_flag": 2
  }'),
  ('smart_monitor_default_threshold', 'Default score proximity alert threshold', '0.9'),
  ('attendance_window_default_minutes', 'Default attendance confirmation window', '15'),
  ('review_window_hours', 'Hours after match completion to submit reviews', '24');
```

### Notes

- `platform_config` replaces hard-coded constants for values that the Admin may need to tune without a code deploy.
- The application reads this table at startup and caches. A cache invalidation endpoint (admin-only) forces a reload.
- The Admin UI `platform-config` page in `apps/admin` provides a structured editor for these values.

### Indexes

```sql
CREATE INDEX idx_platform_config_key ON platform_config(key);
```

---

## Table: `moderation_flags`

Records of content or player behavior flagged for review. Populated by automated signals (profanity filter, sandbagging detection) and future user reports.

```sql
CREATE TABLE moderation_flags (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who flagged this (NULL if system-generated)
  reporter_id uuid REFERENCES profiles(id) ON DELETE SET NULL,

  -- What is being flagged
  entity_type moderation_entity_enum NOT NULL,
  entity_id   uuid NOT NULL,  -- FK to reviews, profiles, or clubs (not enforced at DB level)

  reason      text NOT NULL,

  status      moderation_status_enum NOT NULL DEFAULT 'pending',

  -- Admin review
  reviewed_by   uuid REFERENCES profiles(id),
  review_note   text,
  reviewed_at   timestamptz,

  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
```

### Moderation Lifecycle

```
Flagged (automated or user report)
           │
           ▼
    status = 'pending'
           │
      Admin reviews in Admin app (moderation page)
           │
    ┌──────┴──────┬──────────┐
 'reviewed'   'resolved'  'dismissed'
    │              │           │
   (noted,       (action     (no action
   watching)     taken)      needed)
```

### Entity Types and Actions

| `entity_type` | `entity_id` | Possible Actions |
|---|---|---|
| `review` | `match_reviews.id` | Remove review, warn reviewer, suspend review privileges |
| `player` | `profiles.id` | Warn player, suspend account, ban (future) |
| `club` | `clubs.id` | Warn Club Owner, pause club, archive club |

### Notes

- `reporter_id = NULL` for system-generated flags (profanity filter, sandbagging detection).
- The same entity may have multiple flags (e.g. a review flagged by automated profanity filter and then by a user report). No deduplication constraint — each flag is an independent record.
- Admin UI `moderation` page in `apps/admin` is the primary interface for this table.

### Indexes

```sql
CREATE INDEX idx_moderation_entity     ON moderation_flags(entity_type, entity_id);
CREATE INDEX idx_moderation_status     ON moderation_flags(status);
CREATE INDEX idx_moderation_reporter   ON moderation_flags(reporter_id);
CREATE INDEX idx_moderation_created    ON moderation_flags(created_at DESC);
```

---

## Admin Role

The Admin role is not stored in a `profiles` column for MVP. Instead, Admin access is controlled via Supabase's built-in custom claims:

```sql
-- Set on the JWT via a Supabase Auth Hook or Edge Function
-- custom_claims: { "role": "admin" }
```

RLS policies on all admin tables check for this claim:

```sql
-- Example pattern used across admin tables
CREATE POLICY "admin_only" ON kill_switches
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

See `09_rls_and_realtime.md` for the full RLS configuration.

---

## Relationships

```
profiles ──► club_owner_applications (1:many as applicant)
profiles ──► club_owner_applications (1:many as reviewer)
profiles ──► kill_switches (1:many as updater)
profiles ──► platform_config (1:many as updater)
profiles ──► moderation_flags (1:many as reporter)
profiles ──► moderation_flags (1:many as reviewer)
```
