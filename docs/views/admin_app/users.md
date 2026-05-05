# View: Users (player directory)

## Purpose

This page is a **filtered lens** over the single [`profiles`](../../database/01_users_and_profiles.md) table — the same table used everywhere else. **Everyone is a player.** Tags such as club owner, que master, or admin are derived attributes on that row, not separate entities or tables.

This lens shows **`profiles` where `admin_role IS NULL`**: regular players, club owners, and que masters who do **not** hold platform Admin or Super Admin roles. Profiles with `admin_role` set are intentionally excluded here because they are managed under [`./admins.md`](./admins.md) (invite, role change, deactivate, audit). That same person might still be a club owner in the Client App; once granted admin access they disappear from this directory and appear only under Admins.

Platform admins use this view to look up a player, understand account state and tags at a glance, drill into match / club / review history, and jump into Moderation when enforcement is needed.

This view is **read-oriented**. Mutating player accounts (warn, suspend, delete) is owned by [`./moderation.md`](./moderation.md) — the user detail page links into Moderation pre-filtered to the selected player rather than duplicating those forms here. Every irreversible player-facing action runs through one auditable code path.

**Admins** live at [`./admins.md`](./admins.md) under a different lens; this view filters them out with `admin_role IS NULL`.

## Data model (one table, two lenses)

| Lens | SQL filter | What you see |
|------|------------|--------------|
| **Users** (this doc) | `admin_role IS NULL` | Players, including club owners and que masters who are not platform admins |
| **Admins** | `admin_role IS NOT NULL` | Platform Admin / Super Admin profiles plus lifecycle controls |

Tag derivations (same rules as [`../../database/01_users_and_profiles.md`](../../database/01_users_and_profiles.md)) apply within each lens; see **Tags** column below.

## Routes

| Path | Purpose |
|------|---------|
| `/admin/users` | Player directory (non-admin profiles) |
| `/admin/users/[id]` | User detail page — player-centric (profile + history + activity) |

Deep-linkable filters (mirrored to query string so a row click can be reproduced from a URL):

- `/admin/users?status=active` — directory pre-filtered by high-level status
- `/admin/users?verified=false` — only un-verified profiles (no email verification or onboarding incomplete)
- `/admin/users?club=<club_id>` — only members of a specific club
- `/admin/users?q=<text>` — pre-populates the search box

## Roles

| Role | Access |
|------|--------|
| Super Admin | Full read; full action panel on detail page (deep-links to Moderation) |
| Platform Admin | Full read; same action panel (Moderation enforces Super-Admin-only guards on permanent suspension and deletion) |
| Inactive admin | Blocked by middleware before reaching this route |

No mutations occur from this view. Actions taken via the action panel route through Moderation, which writes the canonical `admin_action_log` entry.

---

## Layout

Standard admin shell with KPI strip, filter / search bar, then a single full-width directory table. Detail page uses a single-column information stack with sticky action sidebar.

```
┌─────────────────────┬──────────────────────────────────────────────────────┐
│  SIDEBAR (240px)    │  ● PRODUCTION                              Admin ▾   │
│                     ├──────────────────────────────────────────────────────┤
│  [▪] Dashboard      │  Users                                               │
│  [▪] Kill Switches  │  Browse player profiles (non-admin lens).             │
│  [▪] Environments   │                                                      │
│  [▪] Approvals      │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  [▪] Moderation     │  │  Total   │ │ Active   │ │ Verified │ │Deact.  │  │
│  [▪] Users  ←       │  │  4,213   │ │  2,891   │ │  3,902   │ │   12   │  │
│  [▪] Admins         │  └──────────┘ └──────────┘ └──────────┘ └────────┘  │
│  [▪] Platform       │                                                      │
│       Config        │  Directory                                           │
│  [▪] Analytics      │  Search and filter player accounts.                  │
│                     │                                                      │
│                     │  [ 🔍 name, email, phone, player ID ____ ] [Status▾] │
│                     │  [Verified▾] [Club ▾] [Registered ▾] [Last active ▾] │
│                     │  ┌────────────────────────────────────────────────┐  │
│                     │  │ Player    │Email│Tags     │MMR│Status│ ⋯  │  │
│                     │  │───────────┼─────┼─────────┼───┼──────┼────│  │
│                     │  │ Alex S.   │…    │CO       │…  │Active│ ⋯ │  │
│                     │  │ Maria R.  │…    │QM       │…  │Active│ ⋯ │  │
│                     │  │ Carlos D. │…    │—        │…  │Deact.│ ⋯ │  │
│                     │  │ ...                                                │  │
│                     │  └────────────────────────────────────────────────┘  │
│                     │                              [ Page 1 of 169 →  ]    │
└─────────────────────┴──────────────────────────────────────────────────────┘
```

**Column key:** `CO` = Club owner, `QM` = Que master (illustrative; real UI uses full tag pills). **Status** in the table is only **Active** or **Deactivated** (see below). Temp vs permanent suspension and deleted state are shown on the **detail** page, not as four status pills in the directory.

---

## Components

### Page Header

- Title: `Users` — `text-title` (20px, SemiBold), `color-text-primary`
- Subtitle: `Browse player profiles (non-admin lens).` — `text-body`, `color-text-secondary`
- No primary action button — the Admin App does not create player accounts from here; players self-register through Facebook OAuth on the Client App. (See [`../../database/01_users_and_profiles.md`](../../database/01_users_and_profiles.md).)

### KPI Strip

Four KPI cards in a horizontal flex row, `space-4` gap. Same visual spec as the corresponding strip in [`./admins.md`](./admins.md).

Cards (left to right):
1. **Total** — count of all rows in `profiles` where `admin_role IS NULL` — `color-text-primary`
2. **Active (30d)** — distinct players with at least one in-app activity (session join, match recorded, review submitted, profile edit) in the last 30 days — `color-accent`
3. **Verified** — `profiles.is_verified = true` — `color-accent`
4. **Deactivated** — rows currently considered **deactivated** per moderation (active suspension in `admin_action_log`) — `color-error` if > 0, otherwise `color-text-secondary`

Each card supports click-to-filter:
- Active → `/admin/users?last_active=30d`
- Verified → `/admin/users?verified=true`
- Deactivated → `/admin/users?status=deactivated` or routes to Moderation: `/admin/moderation?tab=accounts&filter=suspended` when surfacing enforcement backlog

### Search & Filter Toolbar

A single row of inputs above the table (wraps to a second row on narrower viewports):

- **Search input** (full-width on its row): `🔍 name, email, phone, player ID` — debounced 400ms; matches across `profiles.name`, `profiles.email`, `profiles.phone`, and `profiles.id`. Pressing Enter forces an immediate query.
- **Status** dropdown — `All`, **`Active`**, **`Deactivated`** (high-level only in the directory; temp/perm suspension and deleted account nuances belong on detail + Moderation)
- **Verified** dropdown — `All`, `Verified`, `Unverified` (un-verified = `is_verified = false`)
- **Club** dropdown (typeahead) — searches the `clubs` table; filter narrows to members of the selected club
- **Registered** dropdown — `All time`, `Last 7d`, `Last 30d`, `Last 90d`, `Custom range…`
- **Last active** dropdown — `All time`, `Today`, `Last 7d`, `Last 30d`, `Inactive 90d+`

All filter selections are reflected in the URL (`?status=…&verified=…&club=…`) so a particular filter view can be bookmarked or shared.

### Directory Table

Server-paginated. Default page size 50. Default sort: `last_active` desc.

| Column | Source | Notes |
|--------|--------|-------|
| Player | `profiles.name` + avatar | `text-body`, `color-text-primary`; 32×32 avatar (initials or `avatar_url`), `radius-full` |
| Email | `profiles.email` | `text-small`, `color-text-secondary`; truncates with ellipsis; small `✓` icon if `email_verified = true`, otherwise `color-warning` `!` |
| **Tags** | derived | See **Tag pills** below. Render left-to-right in order: **Club owner** → **Que master** → **Deactivated** (omit tags that do not apply). Use compact pills (`text-micro`, `radius-full`). |
| MMR | `profiles.mmr` | Right-aligned numeric. Tooltip on hover: calibration matches; `(calibrating)` micro-label if `calibration_completed_at IS NULL` |
| Matches | `profiles.mmr_matches_played` | Right-aligned numeric |
| Clubs | derived | `COUNT(club_members)` for this player; numeric badge; tooltip lists club names |
| **Status** | derived | **Only two values in this column:** **`Active`** (`color-accent-subtle` + `color-accent`) or **`Deactivated`** (`color-bg-elevated` + `color-text-disabled` or `color-warning` when suspended). Deactivated = active moderation suspension _or_ account deleted per Moderation state (detail page shows temp/perm/deleted narrative). |
| Last active | derived | Relative time; full timestamp on hover; `Never` when applicable |
| Actions | — | Kebab `⋯` button → row menu |

#### Tag pills (this lens)

Within `/users`, **Admin** and **Super admin** tags never appear — those profiles are out of scope. Tags shown:

| Tag | When shown | Derivation |
|-----|------------|------------|
| **Club owner** | Player owns at least one club | `EXISTS (clubs WHERE owner_id = profiles.id)` |
| **Que master** | Player is an active que master in at least one club | `EXISTS (club_members WHERE player_id = profiles.id AND role = 'que_master' AND membership active)` |
| **Deactivated** | Player is under an active suspension or otherwise deactivated per Moderation | Derived from `admin_action_log` / moderation state (same rules as [`../../database/01_users_and_profiles.md`](../../database/01_users_and_profiles.md)) |

**Row interactions:**
- Hover: `color-bg-elevated`
- Click anywhere except the kebab → navigates to `/admin/users/[id]`
- **Deactivated** rows may render at 90% opacity for scanability
- Deleted accounts (if listed): micro-label under name on detail; directory may still show a **Deactivated** tag + Status per product choice

**Row kebab menu:**

| Action | Effect |
|--------|--------|
| Copy email | Toast `"Email copied"` |
| Copy player id | Toast `"Player ID copied"` |
| View profile | Navigates to `/admin/users/[id]` |
| Open in Client App | Opens public profile URL in the Client App in a new tab (verify route in Client App before shipping) |
| Take action → | Opens Moderation pre-filtered: `/admin/moderation?tab=accounts&player=[id]` |

### Pagination & Result Count

- Below the table, right-aligned: `Showing 1–50 of 4,213 · [ ← Prev ] [ Next → ]`
- Page size selector (left side): `Rows per page: [ 50 ▾ ]` — options 25 / 50 / 100
- Both controls reflect to the URL (`?page=N&size=50`)

### Empty / Loading / Error States

- Initial load: skeleton rows in the table; KPI strip placeholders
- No matches: `"No players match the current filters."` — centered in the table, `text-body`, `color-text-disabled`. `[ Clear filters ]` link below.
- API error: `color-error-subtle` banner above the table — `"Couldn't load players. Try refreshing."` with a `[ Retry ]` button.

---

## User Detail Page

Route `/admin/users/[id]`. Single-column information stack with a sticky **Actions** sidebar on the right. **404** if `profiles.admin_role IS NOT NULL` — deep-link to [`./admins.md`](./admins.md) for that id.

```
┌─────────────────────────────────────────────────────┬─────────────────────┐
│  ← All users                                        │  ACTIONS            │
│                                                     │                     │
│  [Av]  Alex Santos                                  │  Status: Active     │
│        @alex_santos · alex@example.com              │  Tags: CO · QM      │
│        Player id  u_abc123                          │  History: 0 warns,  │
│        Active · Verified · Joined Jan 12, 2026      │           0 susp.   │
│                                                     │  [ Take action → ]  │
│  ── Profile ─────────────────────────────────────   │      (→ Moderation) │
│  [ snapshot of profile fields ]                     │  [ Open in Client ↗]│
│  ── Gamification ────────────────────────────────   │  ── Quick links     │
│  MMR 1320 · EXP 4,128 · Tier Elite 1                │  [ View clubs →   ] │
│  [ small chart of MMR over last 30 matches ]        │  [ View matches → ] │
│  ── Memberships ─────────────────────────────────   │  [ View reviews → ] │
│  [ table of clubs the player belongs to ]           │                     │
│  ── Recent activity ─────────────────────────────   │                     │
│  [ unified timeline: matches, sessions, reviews,    │                     │
│    flag events, admin actions on this player ]      │                     │
└─────────────────────────────────────────────────────┴─────────────────────┘
```

### Header block

- **Back link:** `← All users` — `text-small`, `color-accent`
- **Avatar:** 56×56 circle, initials or `profiles.avatar_url`, `radius-full`
- **Name:** `text-title`, `color-text-primary`. Optional `@handle` when available.
- **Email:** `text-body`, `color-text-secondary`. Verified badge when `email_verified = true`.
- **Player id:** monospace, copy icon
- **Meta line:** High-level status · Verified · `Joined <month year>` — `text-small`, `color-text-secondary`
- **Tags row:** Same tag pills as directory (Club owner, Que master, Deactivated). Suspension **type** (temp end date, perm, deleted) lives in banner + Moderation, not as four mutually exclusive directory statuses.

### Profile block

A two-column label/value grid summarising the [`profiles`](../../database/01_users_and_profiles.md) row. Read-only.

| Field | Source | Notes |
|-------|--------|-------|
| Phone | `profiles.phone` | Hidden behind `[ Show ]` toggle; reveals + logs `player_pii_viewed` in `admin_action_log` |
| Age | `profiles.age` | Same toggle + audit as phone |
| Playing level | `profiles.playing_level` | Pill |
| Format / court / play mode | `profiles.*` | Pills |
| Playing since | `profiles.playing_since` | `text-body` |
| Tournament wins (last year) | `profiles.tournament_wins_last_year` | `text-body` |
| Onboarding | `profiles.onboarding_completed` | `Complete` or `Incomplete` |
| Auth provider | Client App | e.g. Facebook OAuth |

### Gamification, Memberships, Recent Activity

Same structure as before: MMR/EXP/tier, optional sparkline, EXP breakdown, memberships table (`Owner` / `Que master` / `Member`), unified activity timeline (matches, sessions, reviews, flags, `admin_action_log` for this player).

### Actions sidebar

- **Status** — Active vs deactivated narrative; link to Moderation for suspension detail
- **Tags** — Repeat Club owner / Que master / Deactivated pills
- **`[ Take action → ]`** → `/admin/moderation?tab=accounts&player=[id]`
- **`[ Open in Client App ↗ ]`**
- **Quick links** — View clubs / matches / reviews

### Read-only states on the detail page

- **Suspended (temp / perm)** — banner above Profile with reason and dates per Moderation
- **Deleted** — greyscale avatar + banner; PII removed per governance

---

## Privacy & PII Audit

Phone and age are private per schema. Toggle reveal logs:

```text
action       = 'player_pii_viewed'
entity_type  = 'player'
entity_id    = <target profile id>
note         = JSON({ field: 'phone' | 'age' })
```

Requires enum extensions per [`../../business_logic/admin_app/08_user_management.md`](../../business_logic/admin_app/08_user_management.md) patterns.

---

## Data Sources

| Item | Table / view |
|------|--------------|
| Directory rows | `profiles WHERE admin_role IS NULL` |
| Tags | See [`../../database/01_users_and_profiles.md`](../../database/01_users_and_profiles.md) — Roles & tags derivation |
| Verified | `profiles.is_verified` |
| MMR / EXP / matches | `profiles` cached fields |
| Last active | Derived from activity tables + `profiles.updated_at` |
| Club memberships | `club_members JOIN clubs` |
| Activity feed | Union of domain events + `admin_action_log` for player |

---

## Responsive Layout

| Breakpoint | Range | Layout |
|---|---|---|
| Desktop (primary) | ≥ 1280px | Full layout; detail Actions sidebar right |
| Desktop (compact) | 1024px–1279px | Toolbar wraps; may hide `Clubs` column |
| Tablet | 768px–1023px | Sidebar hidden; simplified table |
| Mobile | < 768px | Not supported |

---

## Cross-links

- Moderation (enforcement): [`./moderation.md`](./moderation.md)
- Admin lens (platform team): [`./admins.md`](./admins.md)
- Schema & tag rules: [`../../database/01_users_and_profiles.md`](../../database/01_users_and_profiles.md)
- Audit log: [`./audit_log.md`](./audit_log.md)
- Client App: [`../client_app/`](../client_app/)
- Admin user management (invites, roles): [`../../business_logic/admin_app/08_user_management.md`](../../business_logic/admin_app/08_user_management.md)

---

## Design Tokens

| Token | Usage |
|---|---|
| `color-bg-base` | Page background |
| `color-bg-surface` | KPI cards, table container |
| `color-bg-elevated` | Row hover, inputs |
| `color-border` | Borders |
| `color-accent` | Active status, links, tag pills (Club owner / Que master accent variant) |
| `color-warning` | Deactivated tag when suspension-related |
| `color-error` | Critical banners |
| `color-text-primary` / `secondary` / `disabled` | Hierarchy |
| `radius-full` | Tag pills, avatars |
