# Phase 1b — Pins, Tooltips & Graceful Failure

**Epic:** Session Discovery Dashboard  
**Prerequisite:** [`PLAN_phase_1a_map_canvas.md`](PLAN_phase_1a_map_canvas.md)  
**Next phase:** [`PLAN_phase_1c_search_filters.md`](PLAN_phase_1c_search_filters.md)  
**Estimated effort:** 1.5–2 days

---

## Objective

Render venue-grouped session pins on the map canvas, with hover/tap tooltips (including recent-player avatars), a "See more" modal for venues with many sessions, and graceful handling when a session is no longer available. Deliverable: clustered pins you can hover/tap and join.

**Session visibility rule:** A session pin (or venue group) stays on the map as long as the session status is `open` OR `active`. It disappears only when status becomes `closed`, `completed`, or `cancelled`. This means upcoming sessions (future date, status `open`) are always visible.

**Venue clustering rule:** Multiple sessions at the same physical venue (same `venueKey`) are merged into a single **VenuePin** showing a count badge. The pin expands into a tooltip listing sessions sorted by nearest date. When there are more than 2 sessions, a "See more" button opens `VenueSessionsModal`.

---

## Checklist

### 1b.0 — Wire DashboardClient pin state

**File:** `apps/client/src/app/(protected)/dashboard/DashboardClient.tsx`

Add the state the canvas left as stubs in Phase 1a:

- `selectedVenueKey` — which `VenuePin` tooltip is open
- `venueModalKey` — which venue's `VenueSessionsModal` is open
- Pass `venueGroups`, `onSelectVenue`, `onOpenVenueModal`, `onJoinSession` to `DashboardMap`

`onJoinSession` navigates to `/sessions/[id]` in this phase; the active-session guard wraps it in Phase 4.

---

### 1b.1 — VenuePin (replaces single SessionMapPin)

**File:** `dashboard-map/VenuePin.tsx` + `VenuePin.variants.ts`

A single map marker represents **one venue** (which may have 1–N sessions). The pin appearance depends on the venue's most urgent session.

**Variants via `cva`:**

| Variant | When | Style |
|---------|------|-------|
| `live` | Any session in group has `status === 'active'` | Neon `bg-primary-container`, `bolt` icon (filled), glow shadow |
| `upcoming` | All sessions `status === 'open'`, none started | `bg-surface-container-high`, `stadium` icon |
| `multi` | `group.sessions.length > 1` | Adds numeric count badge (bottom-right of pin) |
| `full` (modifier) | **Every** session at the venue is full (`acceptedCount >= totalSlots`) | Desaturated/muted fill (`opacity-60`, `grayscale`), thin `FULL` tag under the pin; **still clickable** (waitlist + cancellations) |
| `selected` | `selectedVenueKey === group.venueKey` | Scale 110%, stronger glow |

**Full handling rules:**

- The `full` treatment is a **modifier** layered on `live`/`upcoming` — a live-but-full venue still reads as live, just muted.
- A `live` session always wins the base variant even if full (a running match matters more than slot count).
- If a multi-session venue has a mix of full and open sessions, the pin is **not** muted — only mute when *all* sessions are full.
- Full pins are never hidden (per the visibility decision: cancellations can reopen slots).

Use `react-map-gl` `Marker` (from `react-map-gl/mapbox`) with `anchor="bottom"`.

**Hover / tap interaction:**

- **Desktop:** `onMouseEnter` → open tooltip (set `selectedVenueKey`); `onMouseLeave` → close after 200ms delay (cancel if cursor moves into tooltip).
- **Mobile:** `onClick` → toggle tooltip. No hover.
- Implementation: `pointer: fine` media query or a `isTouchDevice` check to switch mode.

**Count badge:** Shown when `sessions.length > 1`. Small circle, `bg-primary-container text-on-primary-fixed text-[10px] font-black`.

**Acceptance:** Single session → no badge. Multiple → badge shows count. Live session present → live variant always wins. Hover on desktop, tap on mobile.

---

### 1b.2 — VenuePinTooltip

**File:** `dashboard-map/VenuePinTooltip.tsx`

Rendered as `react-map-gl` `Popup` anchored to the venue coordinates.

**Single session (group.sessions.length === 1):**

```
┌─────────────────────────────────────┐
│ [LIVE NOW / OPEN / UPCOMING]  1.2km │
│ Sunrise Badminton Club              │
│ Cebu City Sports Center             │
│ 🕐 8:00 AM - 11:00 AM              │
│ (◔)(◔)(◔) +9 recently joined        │  ← avatar stack
│ 12/16 Slots        [ JOIN ]         │
└─────────────────────────────────────┘
```

**Player avatar stack ("show 3 avatars of recent players + view more"):**

- Render up to **3 overlapping avatars** from `session.recentPlayers` (newest accepted first), using the existing `small-user-card`/avatar primitive
- Overflow indicator: `+{acceptedCount - 3} recently joined` when `acceptedCount > 3`; the `+N` chip is the **"view more"** affordance → opens the session's player list (links to `/sessions/[id]` roster, or a lightweight roster popover in v1.1)
- Empty state: if `acceptedCount === 0`, show `Be the first to join` instead of avatars
- In the **multi-session** tooltip, the avatar stack appears on each session row (compact, max 3) so each upcoming session shows who's in

**Multiple sessions (group.sessions.length > 1):** Show first 2 sessions (nearest date first), then:

```
┌─────────────────────────────────────┐
│ Lapu-Lapu Hoops Dome     1.5km away │
│ ─────────────────────────────────── │
│ [LIVE]  8:00 AM   12/16  [ JOIN ]   │
│ [OPEN]  2:00 PM    4/16  [ JOIN ]   │
│                                     │
│        [ See 3 more sessions ]      │
└─────────────────────────────────────┘
```

- Each session row: status badge · time · slot fill · Join button
- "See X more sessions" button → calls `onOpenVenueModal(venueKey)`
- Tooltip stays open while cursor is inside it (desktop hover mode)

**Styles:** Glass panel — `bg-bg-base/80 backdrop-blur-xl rounded-xl`.

**Props:** `group: VenueSessionGroup`, `onJoin: (id: string) => void`, `onOpenModal: () => void`, `onClose: () => void`

**Acceptance:** Single session tooltip shows detail + avatars. Multi-session tooltip lists sessions sorted by date. "See more" only appears when count > 2.

---

### 1b.3 — VenueSessionsModal

**Folder:** `apps/client/src/components/modules/dashboard/venue-sessions-modal/`

**File:** `VenueSessionsModal.tsx`

Triggered by "See X more sessions" in `VenuePinTooltip` or from list/grid rows when a venue has multiple sessions.

**Content:**

```
┌──────────────────────────────────────────┐
│ Lapu-Lapu Hoops Dome               [✕]  │
│ Lapu-Lapu City, Cebu · 1.5 km away      │
│ ─────────────────────────────────────── │
│ 5 sessions at this venue                │
│                                         │
│  [LIVE]   8:00 AM  ·  12/16  [ JOIN ]   │
│  [OPEN]   2:00 PM  ·   4/16  [ JOIN ]   │
│  [OPEN]   5:00 PM  ·   0/16  [ JOIN ]   │
│  [UPCOMING] Sat 9:00 AM  ·  2/16 [ JOIN ]│
│  [UPCOMING] Sun 2:00 PM  ·  0/16 [ JOIN ]│
└──────────────────────────────────────────┘
```

- Sessions sorted by `dateTime` ascending (nearest first)
- Status badge: `LIVE` (active), `OPEN` (open + date_time ≤ now), `UPCOMING` (open + date_time > now)
- Each row uses `SessionDiscoveryCard variant="compact"` (the shared card lands in Phase 2; in 1b use an inline row, refactored to the shared card in Phase 2)
- Reuse existing `dialog/Dialog` (desktop: centered modal) / `mobile-drawer/MobileDrawer` (mobile: bottom) — no `Sheet` primitive exists
- Close on backdrop click or Escape

**Props:** `group: VenueSessionGroup | null`, `open: boolean`, `onOpenChange: (v: boolean) => void`, `onJoin: (id: string) => void`

**Acceptance:** Modal opens from "See more" button in tooltip. Rows sorted nearest date first. Closes on escape or outside click. Join navigates to session or triggers active-session guard (Phase 4).

---

### 1b.4 — Graceful failure: stale / unavailable session

Discovery data can be seconds-to-minutes stale. A pin/card may point to a session that has since filled, closed, completed, or been cancelled. Joining must fail gracefully.

**`SessionUnavailableDialog`** — `components/modules/dashboard/session-unavailable-dialog/SessionUnavailableDialog.tsx` (reuse existing `alert-dialog/AlertDialog`).

Triggered when a Join attempt resolves to a session that is no longer joinable:

```
This session is no longer available

It may have ended, been cancelled, or filled up.
Here are other sessions near you.

[ REFRESH NEARBY ]        [ Close ]
```

**Detection (two layers):**

1. **Optimistic:** if local data already shows the session full and availability is the issue, the card still allows a waitlist attempt (full ≠ unavailable).
2. **Authoritative:** on Join, the target `/sessions/[id]` (or a pre-check `GET /api/sessions/[id]`) returns `404`/`410`/status `closed|completed|cancelled` → show `SessionUnavailableDialog` instead of navigating.

**Recovery:**

- `REFRESH NEARBY` → invalidate `['sessions','discover', ...]` and refetch; the stale pin/row disappears
- Map errors (Mapbox token/tile failure) → fall back to List view with a non-blocking toast ("Map unavailable — showing list")
- Geolocation/geocode failure → already handled via Cebu fallback (does not block)

**Acceptance:** Joining a session that has become unavailable shows the dialog (not a crash/blank page) and offers a refresh; map tile failure degrades to list view.

---

## Interaction Spec (pins & tooltips)

| Action | Device | Result |
|--------|--------|--------|
| Hover over VenuePin | Desktop | Open VenuePinTooltip after 100ms |
| Mouse leaves pin+tooltip | Desktop | Close tooltip after 200ms delay |
| Tap VenuePin | Mobile | Toggle VenuePinTooltip open/closed |
| Tap map background | Both | Close any open tooltip |
| Click/tap Join in tooltip | Both | Navigate to `/sessions/[id]` (or active-session guard) |
| Click/tap "See X more" | Both | Open VenueSessionsModal for that venue |
| Click/tap avatar "+N / view more" | Both | Open session roster |
| Join a session that became unavailable | Both | Show SessionUnavailableDialog (graceful), not a crash |
| Pan/zoom map | Both | Close open tooltip |

---

## Storybook stories

| Component | Stories |
|-----------|---------|
| `VenuePin` | Single+live, Single+open, Multi (3), Multi (6), Full (muted), Selected |
| `VenuePinTooltip` | Single session, Two sessions, "See more" visible, Avatar stack + "+N", Empty (be first) |
| `VenueSessionsModal` | 3 sessions, 5 sessions, single session |
| `SessionUnavailableDialog` | Default |

Use mock coordinates around Metro Cebu.

---

## Files Created / Modified (summary)

| Action | Path |
|--------|------|
| Create | `components/modules/dashboard/dashboard-map/VenuePin.tsx` |
| Create | `components/modules/dashboard/dashboard-map/VenuePin.variants.ts` |
| Create | `components/modules/dashboard/dashboard-map/VenuePinTooltip.tsx` |
| Create | `components/modules/dashboard/venue-sessions-modal/VenueSessionsModal.tsx` |
| Create | `components/modules/dashboard/session-unavailable-dialog/SessionUnavailableDialog.tsx` |
| Modify | `apps/client/src/app/(protected)/dashboard/DashboardClient.tsx` (pin/modal state) |
| Modify | `components/modules/dashboard/dashboard-map/DashboardMap.tsx` (render markers) |

---

## Phase 1b Acceptance

- [ ] VenuePins render at correct coordinates; single-session and multi-session variants correct
- [ ] Live sessions always show live pin variant regardless of other sessions at venue
- [ ] Fully-booked venues show muted `full` pin treatment but remain clickable (waitlist)
- [ ] Sessions stay on map until status is closed/completed/cancelled; upcoming open sessions visible
- [ ] Venue tooltip: single session shows session detail; multi shows first 2 + "See more"
- [ ] Tooltip shows up to 3 recent-player avatars + "+N / view more" overflow
- [ ] Hover on desktop opens tooltip; tap on mobile opens tooltip
- [ ] "See more" opens VenueSessionsModal with all sessions sorted by date ascending
- [ ] Joining an unavailable session shows SessionUnavailableDialog (graceful), not a crash
- [ ] Storybook stories for all new components
- [ ] `pnpm build` passes

---

## Handoff to Phase 1c

Phase 1c adds the `MapSearchOverlay` (place + club search), `FilterPanel`, and `ViewToggle`, plus the `filters` state in `DashboardClient` that feeds `useSessionDiscovery`.
