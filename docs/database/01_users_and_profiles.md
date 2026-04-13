# 01 — Users & Profiles

## Overview

Authentication is handled entirely by **Supabase Auth** with Facebook as the OAuth provider. The `profiles` table extends the built-in `auth.users` table with all ROTRA-specific player data. All other tables reference `profiles.id`.

Gear items are modeled as independent rows (not JSONB) to allow querying, filtering, and clean relational joins. Each gear item can have multiple "where to buy" links via `gear_item_links`.

`player_self_assessments` holds the player's own skill dimension scores, set during onboarding and editable later. These are used as a baseline in the weighted skill rating until at least 5 external ratings accumulate per dimension.

---

## Enums

```sql
CREATE TYPE playing_level_enum AS ENUM ('beginner', 'intermediate', 'advanced');

CREATE TYPE format_preference_enum AS ENUM ('singles', 'doubles', 'both');

CREATE TYPE court_position_enum AS ENUM ('front', 'back', 'both');

CREATE TYPE play_mode_enum AS ENUM ('competitive', 'social', 'both');

CREATE TYPE gear_category_enum AS ENUM ('racket', 'shoes', 'bag');

CREATE TYPE racket_balance_enum AS ENUM ('head_heavy', 'head_light', 'even_balanced');

CREATE TYPE shoe_fit_enum AS ENUM ('wide', 'narrow', 'standard');
```

---

## Table: `profiles`

Extends `auth.users`. Created automatically via a Supabase Auth trigger on new user signup.

```sql
CREATE TABLE profiles (
  id                              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  facebook_id                     text UNIQUE NOT NULL,
  name                            text NOT NULL,
  avatar_url                      text,
  phone                           text,

  -- Self-declared level (separate from computed skill rating)
  playing_level                   playing_level_enum,

  -- Play style preferences (informational only; no queue priority effect)
  format_preference               format_preference_enum,
  court_position                  court_position_enum,
  play_mode                       play_mode_enum,

  -- Gamification totals (derived from exp_transactions; cached here for fast reads)
  exp_total                       int NOT NULL DEFAULT 0,
  mmr                             int NOT NULL DEFAULT 1000,

  -- One-time EXP bonus flag
  profile_completed_bonus_claimed bool NOT NULL DEFAULT false,

  -- Onboarding completion (phone collection step)
  onboarding_completed            bool NOT NULL DEFAULT false,

  created_at                      timestamptz NOT NULL DEFAULT now(),
  updated_at                      timestamptz NOT NULL DEFAULT now()
);
```

### Notes

- `exp_total` and `mmr` are **cached aggregates**. The authoritative records are `exp_transactions` and `mmr_transactions`. These caches are updated by a Postgres trigger or server-side function whenever a transaction row is inserted — never written directly by the client.
- `facebook_id` maps to the `sub` claim from Supabase's Facebook OAuth provider; stored for server-side deduplication.
- `playing_level` is self-declared and distinct from the computed skill rating in `player_skill_ratings`.
- `onboarding_completed` gates access — users who have not completed phone collection are redirected away from the main app.

### Trigger: auto-create profile on signup

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, facebook_id, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'provider_id',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Indexes

```sql
CREATE INDEX idx_profiles_facebook_id ON profiles(facebook_id);
```

---

## Table: `gear_items`

Each gear item is a "mini post" on the player's public profile. Players can have multiple items per category.

```sql
CREATE TABLE gear_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category    gear_category_enum NOT NULL,

  -- Common fields
  title       text NOT NULL,
  description text,
  brand       text,
  model       text,

  -- Racket-specific
  balance_type    racket_balance_enum,
  string_brand    text,
  string_model    text,
  string_tension  numeric(5, 2),  -- e.g. 28.00 lbs
  grip            text,

  -- Shoes-specific
  shoe_size   numeric(4, 1),      -- e.g. 10.5
  fit_type    shoe_fit_enum,

  -- Bags-specific
  capacity    text,               -- e.g. "6-racket"

  display_order int NOT NULL DEFAULT 0,

  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
```

### Notes

- Category-specific columns are `NULL` when not applicable (e.g. `shoe_size` is null on a racket row).
- `display_order` allows players to reorder items in their showcase.

### Indexes

```sql
CREATE INDEX idx_gear_items_player_id ON gear_items(player_id);
CREATE INDEX idx_gear_items_category  ON gear_items(category);
```

---

## Table: `gear_item_links`

One-to-many "where to buy" URLs per gear item.

```sql
CREATE TABLE gear_item_links (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gear_item_id uuid NOT NULL REFERENCES gear_items(id) ON DELETE CASCADE,
  label        text,   -- optional display label, e.g. "Lazada", "Shopee"
  url          text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);
```

### Indexes

```sql
CREATE INDEX idx_gear_item_links_gear_item_id ON gear_item_links(gear_item_id);
```

---

## Table: `player_self_assessments`

The player's self-declared score per skill dimension, set during profile setup and editable later. One row per (player, dimension) pair.

```sql
CREATE TABLE player_self_assessments (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id               uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dimension_id            uuid NOT NULL REFERENCES skill_dimensions(id) ON DELETE CASCADE,

  -- Score 1–5 matching the main skill scale
  score                   int NOT NULL CHECK (score BETWEEN 1 AND 5),

  -- Tracks when self-assessment weight phases out (≥5 external ratings per dimension)
  external_ratings_count  int NOT NULL DEFAULT 0,

  updated_at              timestamptz NOT NULL DEFAULT now(),

  UNIQUE (player_id, dimension_id)
);
```

### Notes

- `external_ratings_count` is incremented server-side when a new `match_review_ratings` row targeting this player and dimension is accepted within the 24-hour window.
- Once `external_ratings_count >= 5`, the self-assessment weight drops from `×1` to `×0` in the weighted skill calculation (see `05_reviews_and_ratings.md`).

### Indexes

```sql
CREATE INDEX idx_self_assessments_player_id    ON player_self_assessments(player_id);
CREATE INDEX idx_self_assessments_dimension_id ON player_self_assessments(dimension_id);
```

---

## Relationships

```
auth.users (Supabase managed)
    └── profiles (1:1 via FK)
            ├── gear_items (1:many)
            │       └── gear_item_links (1:many)
            └── player_self_assessments (1:many, one per dimension)
                    └── skill_dimensions (many:1)
```

---

## Player Profile Completeness

The `profile_completed_bonus_claimed` flag is set to `true` (and a `+20 EXP` transaction is inserted) when all of the following are present:

| Requirement | Column / Table |
|---|---|
| Name set | `profiles.name` |
| Playing level set | `profiles.playing_level` |
| Play style set | `profiles.format_preference`, `court_position`, `play_mode` |
| At least one gear item | `gear_items` count ≥ 1 |
| Phone collected | `profiles.phone` |
