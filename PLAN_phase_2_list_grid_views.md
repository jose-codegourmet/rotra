# Phase 2 — List & Grid Views

**Epic:** Session Discovery Dashboard  
**Prerequisite:** [`PLAN_phase_1c_search_filters.md`](PLAN_phase_1c_search_filters.md)  
**Next phase:** [`PLAN_phase_3_quick_session_cta.md`](PLAN_phase_3_quick_session_cta.md)  
**Estimated effort:** 2–3 days

---

## Objective

Implement List and Grid alternate views for session discovery, wired to the same data source and filters as the map. View preference persists in Redux. Extract a shared session card component used across map tooltips, list rows, and grid tiles.

**Grouping rule:** The **map** clusters sessions at the same venue into one `VenuePin` (via `venueGroups`). **List and Grid are flat** — one row/tile **per session**, sorted by distance ascending then `dateTime` ascending. They consume the flat `sessions` array, NOT `venueGroups`. No "See more" grouping in list/grid; every session is its own entry.

---

## View Switching Behavior

`DashboardClient` renders one of three panels based on `dashboardViewMode`:

| Mode | Component | Data prop | Layout |
|------|-----------|-----------|--------|
| `map` | `DashboardMap` | `venueGroups` (clustered) | Full-bleed (Phase 1) |
| `list` | `SessionListView` | `sessions` (flat) | Scrollable single column |
| `grid` | `SessionGridView` | `sessions` (flat) | Responsive 2–3 column grid |

**Shared across all views:**

- `MapSearchOverlay` — remains visible (location + filters apply to all modes)
- `ViewToggle` — remains top-right
- `QuickSessionButton` — remains bottom-left (Phase 3)
- `ActiveSessionBanner` — top strip when applicable (Phase 4)

**Transition:** Use `opacity` + `translate-y` CSS transition (150ms) when switching views. Do not unmount the discovery query — the same `useSessionDiscovery` result feeds all three (map reads `venueGroups`, list/grid read the flat `sessions`).

```tsx
const view = useAppSelector((s) => s.ui.dashboardViewMode);
const { sessions, venueGroups } = useSessionDiscovery(center, filters);

return (
  <div className="relative h-full w-full">
    <MapSearchOverlay ... />
    <ViewToggle ... />
    {view === "map" && <DashboardMap venueGroups={venueGroups} ... />}
    {view === "list" && <SessionListView sessions={sessions} ... />}
    {view === "grid" && <SessionGridView sessions={sessions} ... />}
  </div>
);
```

---

## Checklist

### 2.1 — SessionDiscoveryCard (shared)

**Folder:** `apps/client/src/components/modules/dashboard/session-discovery-card/`

**File:** `SessionDiscoveryCard.tsx` + `SessionDiscoveryCard.variants.ts`

Extract card layout from `VenuePinTooltip` and [`sessions/page.tsx`](apps/client/src/app/(protected)/sessions/page.tsx) patterns.

**Variants (`cva`):**

| Variant | Use |
|---------|-----|
| `compact` | Map VenuePinTooltip rows + VenueSessionsModal rows |
| `list` | List row — horizontal layout |
| `grid` | Grid tile — vertical card |

**Shared content blocks:**

| Block | Content |
|-------|---------|
| Status badge | `LIVE NOW` / `OPEN` / `UPCOMING` — uppercase |
| Title | Club name + venue (`location`) |
| Meta row | Time range, distance, slot fill |
| CTA | `Join` button or link to `/sessions/[id]` |

**Status mapping:**

| `session.status` | Badge | Dot/glow |
|------------------|-------|----------|
| `active` | LIVE NOW | `primary-container` pulse |
| `open` | OPEN | muted |
| future `open` with date > now | UPCOMING | `surface-container-highest` |

**Design tokens (No-Line rule):**

- No 1px dividers between list items — use `gap-3` and `bg-surface-container-low` row backgrounds
- Cards: `bg-surface-container-high` on `bg-surface-dim` page background

**Acceptance:** One card component powers tooltip, list, and grid with variant prop.

---

### 2.2 — SessionListView

**Folder:** `apps/client/src/components/modules/dashboard/session-list-view/`

**File:** `SessionListView.tsx`

Layout:

```
┌──────────────────────────────────────────────┐
│  [ search overlay - inherited from parent ]   │
│  ┌────────────────────────────────────────┐  │
│  │ SessionDiscoveryCard variant=list       │  │
│  ├────────────────────────────────────────┤  │
│  │ SessionDiscoveryCard variant=list       │  │
│  ├────────────────────────────────────────┤  │
│  │ ...                                     │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

- Container: `absolute inset-0 z-0 overflow-y-auto pt-32 pb-24 px-4 md:px-8`
- Background: `bg-surface-dim` (not map)
- Sort: distance ascending, then `dateTime` ascending — flat, one row per session (no venue grouping)
- Section header (optional): `12 sessions near you` — `text-micro uppercase`

**Empty state:**

```
No sessions in this area.
Try expanding your search radius or check back later.
```

Centered, `text-text-secondary`, link to adjust filters.

**Loading:** Skeleton rows (3×) using existing skeleton patterns.

**Acceptance:** List scrolls independently; cards match session list page density.

---

### 2.3 — SessionGridView

**Folder:** `apps/client/src/components/modules/dashboard/session-grid-view/`

**File:** `SessionGridView.tsx`

Grid:

```css
grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4
```

- Same scroll container as list view
- `SessionDiscoveryCard variant="grid"`
- Live sessions: `sm:col-span-2` on tablet+ (mirrors sessions page live card span)

**Acceptance:** Responsive 1/2/3 columns; live session spans 2 cols on md+.

---

### 2.4 — Refactor VenuePinTooltip & VenueSessionsModal

Replace inline session-row markup with the shared card:

```tsx
<SessionDiscoveryCard variant="compact" session={session} onJoin={onJoin} />
```

Used for each session row inside `VenuePinTooltip` (single + multi) and every row in `VenueSessionsModal`. Wrapped in the glass panel container for map popup positioning.

---

### 2.5 — Sort & filter parity

Ensure List and Grid respect the same filters as Map:

| Filter | Map | List | Grid |
|--------|-----|------|------|
| `radiusKm` | bbox/pin visibility | row set | tile set |
| `playersPerCourt` | pin filter | row filter | tile filter |
| `weekendOnly` | pin filter | row filter | tile filter |
| `slotAvailability` | pin filter | row filter | tile filter |
| `clubQuery` (club search) | pin filter | row filter | tile filter |
| `placeQuery` (place search) | re-centers map | re-centers source coords | re-centers source coords |

Filtering happens in `useSessionDiscovery` or a `useMemo` in `DashboardClient` — single source of truth. The same filtered `sessions`/`venueGroups` feed all three views.

---

### 2.6 — List/Grid map background option

**Design decision:** List and Grid use solid `bg-surface-dim` background, **not** the map underneath. This matches Airbnb list mode behavior and improves readability.

Map component unmounts when `view !== 'map'` to free WebGL context.

---

### 2.7 — Keyboard & a11y

| Key | Action |
|-----|--------|
| `Tab` | Focus moves through cards and Join buttons |
| `Enter` on card | Navigate to session detail |
| View toggle | `role="tablist"` + `aria-selected` on active mode |

---

### 2.8 — Storybook

| Component | Stories |
|-----------|---------|
| `SessionDiscoveryCard` | compact, list, grid; live, open, upcoming |
| `SessionListView` | With sessions, empty, loading |
| `SessionGridView` | With sessions, empty, loading |

---

### 2.9 — Active Courts carousel (optional v1.1)

The HTML mockup includes a bottom-right "Active Courts" glass card. **Defer to Phase 4 or v1.1** unless time permits:

- Shows 1–3 live sessions with active match scores
- Data from `sessions.filter(s => s.status === 'active')`
- Links to session live view

Document as stretch goal in Phase 2; not blocking acceptance.

---

## Comparison with `/sessions`

| Aspect | `/sessions` | Dashboard List/Grid |
|--------|-------------|---------------------|
| Data | User's registered sessions | Nearby discoverable sessions |
| Filters | My / Upcoming / Past tabs | Location + chips |
| Card style | Similar tokens | Shared `SessionDiscoveryCard` |
| CTA | Register / View | Join |

Do not merge routes — dashboard is discovery; `/sessions` is personal schedule.

---

## Files Created / Modified (summary)

| Action | Path |
|--------|------|
| Create | `session-discovery-card/SessionDiscoveryCard.tsx` |
| Create | `session-list-view/SessionListView.tsx` |
| Create | `session-grid-view/SessionGridView.tsx` |
| Modify | `dashboard-map/VenuePinTooltip.tsx` |
| Modify | `venue-sessions-modal/VenueSessionsModal.tsx` |
| Modify | `dashboard/DashboardClient.tsx` |

---

## Phase 2 Acceptance

- [ ] View toggle switches between Map, List, and Grid with smooth transition
- [ ] List view shows scrollable session rows with distance and Join CTA
- [ ] Grid view shows responsive card grid
- [ ] `SessionDiscoveryCard` shared across all three views
- [ ] Filters from search overlay apply to all views
- [ ] View mode persists in Redux across navigation
- [ ] Map unmounts in list/grid mode (no WebGL leak)
- [ ] Empty and loading states implemented
- [ ] Storybook stories added
- [ ] `pnpm build` passes

---

## Handoff to Phase 3

Phase 3 wires `QuickSessionButton` at bottom-left (already positioned in layout). List/Grid views leave space at bottom for the CTA (`pb-24`).
