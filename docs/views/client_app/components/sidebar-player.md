# Component: Sidebar — Player

## Purpose
The primary navigation shell for the **Player** role on desktop (≥1024px). A fixed left sidebar that replaces the mobile bottom navigation bar entirely. Contains the ROTRA wordmark, all nav items, a conditional Live Session strip (when the player is in an active session), and a user identity footer.

## Breakpoint
**Active at ≥1024px only.** At <1024px, navigation falls back to the bottom nav bar (see `navbar-player.md`).

## Roles
**Player** — standard authenticated user.

---

## Layout

```
┌─────────────────────┐
│  ROTRA              │  ← Wordmark
│                     │
│  ┌───────────────┐  │  ← Live Session strip (conditional)
│  │ 🟢 LIVE       │  │
│  │ Sunrise BC    │  │
│  │ Hall B        │  │
│  │ [VIEW SESSION→]│  │
│  └───────────────┘  │
│                     │
│  [🏠]  Home         │  ← Nav item (active)
│  [🏸]  Clubs        │
│  [📋]  Sessions     │
│  [👤]  Profile      │
│  [🔔]  Notifications│  ← with unread badge
│                     │
│  ─────────────────  │  ← Divider
│                     │
│  [av]  Alex Santos  │  ← User identity
│        Warrior 2    │
│  [ Logout ]         │
└─────────────────────┘
```

---

## Spec

### Container
- **Width:** 240px, fixed position, full viewport height (`100vh`)
- **Background:** `color-bg-surface`
- **Right border:** 1px solid `color-border`
- **Z-index:** above main content, below modals
- **No collapse/toggle** — always visible at ≥1024px (no hamburger)

---

## Sections

### 1. Wordmark

```
┌─────────────────────┐
│  ROTRA              │
└─────────────────────┘
```

- **Content:** `ROTRA` — `text-title` (22px, SemiBold), `color-text-primary`, letter-spacing -0.5px
- **Padding:** `space-6` (24px) horizontal, `space-6` top, `space-4` bottom
- **Height:** ~64px

---

### 2. Live Session Strip (Conditional)

Only rendered when the player is currently registered and active in an ongoing session. Positioned between the wordmark and the nav items.

```
┌───────────────────────┐
│  🟢 LIVE              │
│  Sunrise Badminton    │
│  Hall B               │
│  [ VIEW SESSION → ]   │
└───────────────────────┘
```

- **Background:** `color-accent-subtle` (`#00FF8820`)
- **Border:** 1px solid `color-accent-dim`
- **Border-radius:** `radius-lg` (14px)
- **Left stripe:** 3px solid `color-accent`
- **Margin:** `space-3` horizontal (fits within sidebar padding), `space-2` bottom
- **Padding:** `space-3` (12px) all sides

#### Strip Content
- **Live label row:** 8px pulsing dot (`color-accent`, opacity 1→0.4, 1.2s ease-in-out) + `LIVE` — `text-micro` uppercase, `color-accent`, letter-spacing 0.5px
- **Club name:** `text-small` (13px, SemiBold), `color-text-primary`; truncated with ellipsis if > 1 line
- **Venue:** `text-micro`, `color-text-secondary`
- **CTA:** `VIEW SESSION →` — `text-micro`, `color-accent`, displayed on its own row, right-aligned within the strip
- **Tap anywhere on strip** → navigates to `/sessions/:id`

#### Hidden state
When no active session: strip is fully unmounted (not hidden with CSS — no reserved space).

---

### 3. Navigation Items

```
│  [icon]  Home         │  ← active
│  [icon]  Clubs        │
│  [icon]  Sessions     │
│  [icon]  Profile      │
│  [icon]  Notifications│
```

- **Item height:** 48px
- **Layout:** horizontal flex — icon (20px stroke) + label (`text-body`, 15px, `color-text-primary` or `color-text-disabled`)
- **Padding:** `space-4` (16px) horizontal
- **Border-radius on hover/active background:** `radius-md` (8px)
- **Gap between icon and label:** `space-3` (12px)

#### Active item
- Icon + label: `color-accent`
- Background: `color-accent-subtle`
- No left border indicator (background fill is the indicator)

#### Inactive item
- Icon + label: `color-text-disabled`
- Background: transparent
- Hover: `color-bg-elevated` background, icon + label shift to `color-text-primary`

#### Nav Item List

| Label | Icon | Route |
|-------|------|-------|
| Home | house | `/home` |
| Clubs | shield | `/clubs` |
| Sessions | calendar | `/sessions` |
| Profile | user-circle | `/profile` |
| Notifications | bell | `/notifications` |

#### Notification badge
- Positioned right-aligned on the Notifications row (replaces the icon badge style used in bottom nav)
- Pill: `color-error` bg, white text, `text-micro`, `radius-full`, min-width 20px, height 20px
- Shows count 1–99 or `99+`
- Hidden when 0 unread

---

### 4. Divider

- 1px horizontal line, `color-border`
- `space-4` vertical margin above and below
- Full width of sidebar (flush to edges, no horizontal padding)

---

### 5. User Identity Footer

```
│  [av]  Alex Santos  │
│        Warrior 2    │
│  [ Logout ]         │
```

- **Avatar:** 32×32px, `radius-full`, 1px `color-border` border
- **Name:** `text-small` (13px, SemiBold), `color-text-primary`, truncated with ellipsis, max 1 line
- **Tier label:** `text-micro` (10px), `color-text-secondary` (e.g. `Warrior 2`)
- **Layout:** horizontal flex (avatar left + text column right), `space-3` gap
- **Padding:** `space-4` horizontal, `space-4` vertical
- **Tap on avatar or name** → navigates to `/profile`

#### Logout
- Below the avatar row, `space-2` top margin
- `Logout` — `text-small` (13px), `color-text-secondary`, no background
- Hover: `color-text-primary`
- Tap → triggers logout confirmation or direct logout depending on app config

---

## Layout Integration

The sidebar is rendered as part of the app shell, not within any page. All page routes render their content to the right of the sidebar.

```
┌─────────────┬──────────────────────────────────────────────────┐
│  Sidebar    │  Main content area                               │
│  240px      │  (margin-left: 240px)                            │
│  fixed      │  Page renders here                               │
│             │                                                  │
└─────────────┴──────────────────────────────────────────────────┘
```

- **Main content margin-left:** 240px (matches sidebar width)
- **Main content full height:** `100vh`, independent scroll
- **No top header bar** on desktop — page-level headers within main content area take over (see `navbar-player.md` section 1)

---

## Design Tokens

| Token | Usage |
|-------|-------|
| `color-bg-surface` | Sidebar background |
| `color-bg-elevated` | Nav item hover background |
| `color-border` | Right border, divider, avatar border |
| `color-accent` | Active nav icon + label, live strip elements |
| `color-accent-subtle` | Active nav item background, live strip background |
| `color-accent-dim` | Live strip border |
| `color-text-primary` | Wordmark, active nav label, name |
| `color-text-secondary` | Tier label, logout link |
| `color-text-disabled` | Inactive nav icon + label |
| `color-error` | Notification badge background |
| `text-title` 22px SemiBold | Wordmark |
| `text-body` 15px | Nav item labels |
| `text-small` 13px | User name, logout |
| `text-micro` 10px | Live label, tier, notification count, venue |
| `radius-md` 8px | Nav item hover/active background |
| `radius-lg` 14px | Live session strip |
| `radius-full` | Avatar |
