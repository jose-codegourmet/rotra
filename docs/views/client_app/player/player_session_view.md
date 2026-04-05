# View: Player Session View

## Purpose
The in-session experience for Players. A read-only, real-time view of the active session — showing live court activity, queue order, and session standings. Players can also update their own attendance status from this view. All data syncs live via WebSocket.

## Route
`/sessions/:id` (player-facing view) — authenticated players registered for this session

## Roles
**Player** (standard view). **Que Masters** and **Club Owners** are redirected to the QM Console (`/sessions/:id/manage`).

---

## Layout
Full-screen page with header and a 3-tab navigation row below it. Tab content area is scrollable. Offline banner appears above tabs when connection is lost.

```
┌──────────────────────────────────────┐
│  ← Back       Session · Hall B       │  ← Header bar
│                 Saturday, Mar 29     │
├──────────────────────────────────────┤
│  ⚠ OFFLINE – Reconnecting...         │  ← Offline banner (conditional)
├──────────────────────────────────────┤
│  My Status: [ WAITING ▾ ]            │  ← Player's own status selector
├──────────────────────────────────────┤
│   COURTS    │    QUEUE    │ STANDINGS │  ← Tab bar
├──────────────────────────────────────┤
│                                      │
│  [Active tab content]                │
│                                      │
└──────────────────────────────────────┘
│  [Home] [Clubs] [Sessions] [Profile] [🔔] │
```

---

## Components

### Header Bar
- Left: back arrow → `/clubs/:id/sessions`
- Title: `Session · [Venue]` (top line) + `[Day], [Date]` (subtitle line, `text-small`, `color-text-secondary`)
- Right: session info icon (ⓘ) → shows cost breakdown modal on tap
- Background: `color-bg-base`, border-bottom: 1px solid `color-border`
- Height: 64px (taller than standard for two-line title)

### Offline Banner
- Full-width bar, conditionally rendered when WebSocket connection is lost
- Background: `color-warning` at 20% opacity, border-bottom: 1px solid `color-warning`
- Icon: warning triangle (16px, `color-warning`) + text: `OFFLINE – Reconnecting...` — `text-small`, `color-warning`, uppercase
- Animates in from top with `motion-default` (200ms ease-in-out)
- Dismissed automatically on reconnect (smooth fade-out)

### My Status Selector
- Compact row below the offline banner (or below header)
- Label: `My Status:` — `text-small`, `color-text-secondary`
- Current status displayed as a tappable pill: status label + chevron-down icon
- Pill: `color-bg-elevated`, `radius-full`, `text-label`, uppercase
- Status colors:
  - `I Am In` → `color-bg-elevated`, `color-text-primary`
  - `I Am Prepared` → `color-accent-subtle`, `color-accent`
  - `Waiting` → `color-bg-elevated`, `color-text-secondary`
  - `Playing` → `color-accent-subtle`, `color-accent` (non-tappable)
  - `Resting` → `color-bg-elevated`, `color-text-secondary`
  - `Eating` → `color-bg-elevated`, `color-text-secondary`
  - `Exited` → `color-error` tint, `color-error`
- Tap pill → bottom sheet with selectable statuses (only player-controllable ones: I Am In, I Am Prepared, Resting, Eating)
- Playing/Waiting/Suspended/Exited are read-only (set by system or QM)

### Tab Bar
- 3 tabs: **COURTS** · **QUEUE** · **STANDINGS**
- `text-label` uppercase, 44px height
- Active: `color-accent`, 2px bottom border
- Inactive: `color-text-disabled`
- Background: `color-bg-surface`, border-bottom: 1px solid `color-border`

---

## Tab 1: Courts

Live view of all courts in the session.

```
│  ┌────────────────────────────────┐  │  ← Court card (active)
│  │  COURT 1               🟢 LIVE │  │
│  │  ──────────────────────────────│  │  ← Team divider
│  │  TEAM A          vs    TEAM B  │  │
│  │  Alex  •  Maria      Jose • Ana│  │  ← Player names
│  │                                │  │
│  │      18          •     15      │  │  ← Live score (text-display)
│  │                                │  │
│  │  Set 1 / Best of 1             │  │  ← Format + set info
│  │  Running: 12 min               │  │  ← Elapsed time
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │  ← Court card (empty)
│  │  COURT 2           ○ AVAILABLE │  │
│  │  No active match               │  │
│  └────────────────────────────────┘  │
```

**Active Court Card:**
- Background: `color-bg-surface`
- Left stripe: 3px `color-accent` (active match indicator)
- Court name + `LIVE` badge (pulsing dot + text, `color-accent`)
- Team A / Team B layout: 2-column with `vs` divider, `text-small` player names
- Score: `text-display` (28px, Bold), `color-text-primary`, centered in each column
- Leading team score: `color-accent` highlight
- Set info + elapsed time: `text-small`, `color-text-secondary`

**Empty Court Card:**
- `color-bg-surface`, `color-border`, `radius-lg`
- `AVAILABLE` badge: `color-bg-elevated`, `color-text-secondary`
- Body text: `No active match` — `text-body`, `color-text-disabled`
- No left stripe

---

## Tab 2: Queue

Ordered list of upcoming matches. Players can see where they are in the queue.

```
│  Next up                             │  ← Section label
│  ┌────────────────────────────────┐  │
│  │  #1 · Court 1 (finishing soon) │  │
│  │  YOU + Maria  vs  Jose + Ana   │  │  ← "YOU" highlighted
│  │  Est. wait: 5 min              │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  #2                            │  │
│  │  Ben + Carlo  vs  Lisa + Kim   │  │
│  │  Est. wait: 20 min             │  │
│  └────────────────────────────────┘  │
```

**Queue Match Card:**
- Background: `color-bg-surface`, `radius-lg`, `shadow-card`
- Position number: `#[N]` — `text-label`, `color-text-disabled`
- Team names: `text-body`, `color-text-primary`; `vs` separator: `text-small`, `color-text-secondary`
- Player's own name highlighted: `color-accent` text, Bold
- Estimated wait: `text-small`, `color-text-secondary`
- If player is in the next match: card gets `color-accent-subtle` background + `color-accent` left stripe

**Empty Queue:**
`text-body`, `color-text-secondary`, centered: `No upcoming matches in the queue.`

---

## Tab 3: Standings

Session leaderboard. Updates live after each completed match.

```
│  COURT STANDINGS          This session│
│  ─────────────────────────────────────│
│  #   Name           W   L   Win %    │  ← Table header
│  ─────────────────────────────────────│
│  1  [avatar] Alex   5   1   83%      │  ← Your row (highlighted)
│  2  [avatar] Maria  4   1   80%      │
│  3  [avatar] Jose   3   2   60%      │
│     ...                              │
```

**Standings Row:**
- Height: 56px
- Rank: `text-label`, `color-text-secondary`, left-aligned, 32px wide
- Avatar: 28×28px, `radius-full`
- Name: `text-body`, `color-text-primary`
- W/L/Win%: `text-small`, `color-text-secondary`, right-aligned columns
- Player's own row: `color-accent-subtle` background, rank in `color-accent`

**Table Header:**
- `text-micro` uppercase, `color-text-disabled`
- Border-bottom: 1px solid `color-border`

---

## States

### Live Session (Default)
All tabs populated with live data. My Status selector active.

### Offline
Offline banner visible. Last-known state frozen. No interactions allowed that require server response.

### Session Completed
- Header shows `✓ Completed` status badge
- My Status selector hidden
- Courts tab: all courts show "Session ended"
- Queue tab: shows "Session has ended. No further matches."
- Standings tab: final standings remain, with `FINAL` label on the standings header

---

## Modals

### Cost Breakdown Modal
Triggered by tapping the ⓘ icon in the header.

- Background: `color-bg-surface`, `radius-xl`, `shadow-modal`
- Backdrop: `rgba(0,0,0,0.6)`
- Title: `Session Cost Breakdown` — `text-title`, `color-text-primary`
- Rows:
  - Court cost: `₱[amount]` — `text-body`
  - Shuttle cost: `[N] tubes × ₱[amount]` — `text-body`
  - Markup: `₱[amount]` — `text-body`
  - Divider
  - Total: `₱[amount]` — `text-title`, `color-text-primary`, Bold
  - Per player: `₱[amount] / [N] players` — `text-body`, `color-accent`
- Note: `text-micro`, `color-text-disabled`: `Final amount may change as more shuttles are used.`
- Close: `CLOSE` — secondary outline button, full-width

### Leave Session / Early Exit Confirm Modal
Triggered when player updates status to `Exited` via the status selector.

- Title: `Leave This Session?` — `text-title`, `color-text-primary`
- Body: `Your slot will be released to the next waitlisted player. Your payment must be confirmed by the Que Master before you exit.` — `text-body`, `color-text-secondary`
- Actions:
  - Primary: `REQUEST EXIT` — `color-error` background (destructive)
  - Secondary: `Cancel` — outline
- After tapping: QM receives a notification to confirm payment and release slot. Player sees a "Pending exit — waiting for Que Master confirmation" status.

---

## Responsive Layout

### Breakpoints
| Breakpoint | Layout change |
|-----------|--------------|
| Mobile < 768px | Tabs, single column per tab |
| Tablet 768–1023px | Tabs, `max-width: 720px`, centered |
| Desktop ≥ 1024px | Tabs replaced by persistent 3-panel side-by-side layout |

### Desktop (≥ 1024px)

On desktop, the 3 tabs are shown **simultaneously** in a horizontal split — no tab switching needed:

```
┌────────────┬──────────────────────────────────────────────────┐
│  Sidebar   │  Session · Hall B  ·  Saturday, Mar 29    [ⓘ]   │
│            │  My Status: [ I AM PREPARED ▾ ]     ⚠ OFFLINE    │
│            ├──────────────┬────────────────┬───────────────────┤
│            │  COURTS      │  QUEUE         │  STANDINGS        │
│            │  (~35%)      │  (~35%)        │  (~30%)           │
│            │              │                │                   │
│            │  [court      │  [queue match  │  [standings       │
│            │   cards      │   cards -      │   table,          │
│            │   stacked]   │   vertical     │   full height]    │
│            │              │   list on      │                   │
│            │              │   desktop]     │                   │
└────────────┴──────────────┴────────────────┴───────────────────┘
```

- **Courts panel** (~35% of main area): court cards stacked vertically; scores are large and readable at desktop size
- **Queue panel** (~35%): queue cards switch from a horizontal scroll to a **vertical stacked list** on desktop (scroll within panel if overflow)
- **Standings panel** (~30%): leaderboard table always visible; sticky header
- Each panel has its own label header row (`COURTS` / `QUEUE` / `STANDINGS` — `text-label`, `color-text-disabled`, uppercase)
- **My Status selector**: stays in the top bar, above the 3-panel split
- **Offline banner**: spans full width above the 3-panel split
- **Content max-width**: `1200px`

**Queue cards on desktop (vertical layout):**
- Full-width within the Queue panel
- Height: 72px per card
- Drag handle on the left, team names centered, estimated time right

### Tablet (768–1023px)
- Tabs remain; `max-width: 720px`, centered
- Queue stays horizontal scroll

**Modals on desktop**: Cost Breakdown and Leave Session modals render as centered overlays.

---

## Design Tokens
| Token | Usage |
|-------|-------|
| `color-bg-base` | Page background |
| `color-bg-surface` | Court cards, queue cards, standings |
| `color-bg-elevated` | Status selector pill, empty court |
| `color-accent` | Live badge, player highlight, your row, active tab |
| `color-accent-subtle` | Your queue card, your standings row, active court stripe |
| `color-warning` | Offline banner |
| `color-error` | Exit button |
| `color-text-primary` | Scores, names |
| `color-text-secondary` | Metadata, wait times, tab labels |
| `color-text-disabled` | Rank numbers, empty states |
| `text-display` 28px Bold | Live scores |
| `text-heading` 18px SemiBold | Court name |
| `text-body` 15px | Player names, queue entries |
| `text-small` 13px | Metadata, elapsed time |
| `text-micro` 10px | Table headers |
| `radius-lg` 14px | Court and queue cards |
| `shadow-card` | Court and queue cards |
