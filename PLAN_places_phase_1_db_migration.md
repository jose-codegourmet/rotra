# Places — Phase 1: DB Migration

**Epic:** Places (Custom Venue Management)  
**Next phase:** [`PLAN_places_phase_2_address_pin_component.md`](PLAN_places_phase_2_address_pin_component.md)  
**Estimated effort:** 0.5 days

---

## Objective

Introduce the `places` table to Supabase — the canonical registry of badminton venues in the app. This table is the single source of truth for all venue data: admin-curated confirmed venues, and user-submitted unreviewed pins from session creation.

Mapbox is used only as the **map engine and geocoding tool** — it does not store venues. All venue records live here.

---

## Why We Need This

Mapbox's POI coverage is incomplete for Philippine badminton venues. Small local courts (e.g. "SM Seaside Badminton Court", "Shuttle Masters Arena") may not exist in Mapbox's dataset at all. A custom `places` table gives the platform:

- Full control over venue listings
- A moderation layer for user-submitted venues
- A foundation for future features (ratings, court availability, reservations)

---

## Status Design

Two statuses only — keep it simple:

| Status | Who sets it | Meaning |
|--------|-------------|---------|
| `confirmed` | Admin (on create, or after review) | Venue is verified and visible to all users as a choice |
| `unreviewed` | System (when a player pins a new place during session creation) | Pending admin review; not yet offered to other users as a choice |

Admin-created places are `confirmed` immediately.  
Player-submitted places start as `unreviewed` and do NOT block the player — their session still proceeds normally.

---

## Schema

### Enum

```sql
CREATE TYPE place_status_enum AS ENUM ('confirmed', 'unreviewed');
```

### Table: `places`

```sql
CREATE TABLE places (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),

  name          text        NOT NULL,
  address       text        NOT NULL,
  latitude      double precision NOT NULL,
  longitude     double precision NOT NULL,

  description   text,
  phone         text,
  website       text,

  status        place_status_enum NOT NULL DEFAULT 'unreviewed',

  -- NULL when created by an admin directly
  submitted_by  uuid        REFERENCES profiles(id) ON DELETE SET NULL,

  -- Populated when an admin reviews the record
  reviewed_by   uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at   timestamptz,

  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
```

### Indexes

```sql
CREATE INDEX idx_places_status     ON places(status);
CREATE INDEX idx_places_submitted_by ON places(submitted_by);
CREATE INDEX idx_places_lat_lng    ON places(latitude, longitude);
```

### RLS

```sql
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read confirmed places
CREATE POLICY "Confirmed places visible to authenticated users"
  ON places FOR SELECT
  TO authenticated
  USING (status = 'confirmed');

-- Authenticated users can submit new places (forced to unreviewed, must own the row)
CREATE POLICY "Authenticated users can submit unreviewed places"
  ON places FOR INSERT
  TO authenticated
  WITH CHECK (
    status = 'unreviewed'
    AND submitted_by = auth.uid()
  );

-- Players can see their own unreviewed submissions
CREATE POLICY "Users can view their own unreviewed submissions"
  ON places FOR SELECT
  TO authenticated
  USING (submitted_by = auth.uid());
```

> Admin app uses the **service role key** for all admin operations — it bypasses RLS entirely. No separate admin RLS policy needed.

---

## Prisma Model

**File:** `packages/db/prisma/schema/places.prisma` (create new file following the split-schema pattern)

```prisma
enum PlaceStatus {
  confirmed
  unreviewed

  @@map("place_status_enum")
}

model Place {
  id          String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name        String
  address     String
  latitude    Float
  longitude   Float
  description String?
  phone       String?
  website     String?
  status      PlaceStatus @default(unreviewed)

  submittedBy   Profile?  @relation("PlaceSubmittedBy",  fields: [submittedById], references: [id], onDelete: SetNull)
  submittedById String?   @db.Uuid

  reviewedBy   Profile?   @relation("PlaceReviewedBy",   fields: [reviewedById],  references: [id], onDelete: SetNull)
  reviewedById String?    @db.Uuid
  reviewedAt   DateTime?  @db.Timestamptz(6)

  createdAt   DateTime    @default(now()) @db.Timestamptz(6)
  updatedAt   DateTime    @default(now()) @updatedAt @db.Timestamptz(6)

  @@map("places")
}
```

Add back-relations to the `Profile` model for both `PlaceSubmittedBy` and `PlaceReviewedBy`.

---

## Migration File

**Path:** `packages/db/prisma/migrations/20260611120000_add_places/migration.sql`

The file contains:
1. `CREATE TYPE place_status_enum`
2. `CREATE TABLE places` with all columns and FK constraints
3. All `CREATE INDEX` statements
4. `ALTER TABLE places ENABLE ROW LEVEL SECURITY`
5. All `CREATE POLICY` statements
6. `updated_at` auto-update trigger (Prisma `@updatedAt` handles this in the client, but the SQL migration must also include the trigger so the column stays accurate on direct DB writes):

```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER places_updated_at
  BEFORE UPDATE ON places
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

> Check if `set_updated_at()` function already exists from a prior migration. If so, skip the `CREATE OR REPLACE FUNCTION` and only add the `CREATE TRIGGER`.

Follow the exact timestamp format used by existing migrations (e.g. `20260609120000_clubless_quick_sessions`).

---

## Docs

### Create

**`docs/database/15_places.md`**

Content must cover:
- Overview of what a Place is and why the table exists (Mapbox POI gap)
- Status lifecycle: `unreviewed` (player-submitted) → `confirmed` (admin-reviewed) or deleted
- Full table DDL (enum, columns, constraints, indexes)
- RLS policy rationale (players: read confirmed + insert unreviewed own; service role: full access)
- Relationship to `queue_sessions` (sessions reference venues via lat/lng today; `place_id` FK is a future follow-up)
- Future considerations: images, ratings, court count, `place_id` FK on `queue_sessions`

Update the database index doc:

**`docs/database/README.md`** — add entry: `15_places.md → Places`

---

## Checklist

### DB
- [ ] Create `packages/db/prisma/schema/places.prisma` with `PlaceStatus` enum and `Place` model
- [ ] Add `PlaceSubmittedBy` and `PlaceReviewedBy` back-relations to `Profile` model in `packages/db/prisma/schema/profiles.prisma`
- [ ] Create `packages/db/prisma/migrations/20260611120000_add_places/migration.sql`
- [ ] Check if `set_updated_at()` trigger function already exists; if not, include it in the migration
- [ ] Run `pnpm db:migrate` to apply migration to Supabase
- [ ] Run `pnpm db:generate` to regenerate Prisma client
- [ ] Verify `Place`, `PlaceStatus` are exported from `@rotra/db`
- [ ] Verify `packages/db` TypeScript compiles with no errors after changes (`pnpm --filter @rotra/db build`)

### Docs
- [ ] Create `docs/database/15_places.md` (full schema + status lifecycle + RLS rationale)
- [ ] Update `docs/database/README.md` — add `15_places.md` entry to the index
