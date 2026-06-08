# Session Discovery Dashboard — Master Plan

**Epic:** Map-first session discovery at `/dashboard`  
**Status:** Planning complete — execute phases 0–4 in order  
**Last updated:** June 2026

---

## Executive Summary

Replace the placeholder [`apps/client/src/app/(protected)/dashboard/page.tsx`](apps/client/src/app/(protected)/dashboard/page.tsx) with a full-screen, **map-first session discovery hub**. Players browse open queue sessions in their area on an interactive map, switch to List or Grid views, start a Quick Session, and are blocked from starting a second session when already in an active queue.

This epic is inspired by **Airbnb** (map + list discovery, location search, filter chips) and **Nomad Table** (nearby activity pins, instant join). Visual language follows the attached **Kinetic Precision** design system (`DESIGN.md`, `code.html`).

> **Scope note:** Ignore sidebar and navbar from the design mockup. Only the map canvas, view toggle (Map | List | Grid), search/filter overlay, session pins, Quick Session CTA, and active-session guard are in scope.

---

## Goals

| # | Goal | Success criteria |
|---|------|------------------|
| 1 | Map-first default view | `/dashboard` loads with full-viewport Mapbox map centered on **user's current location**; pins for nearby open/active sessions |
| 2 | Multi-view discovery | User can switch Map ↔ List ↔ Grid without losing filter state |
| 3 | Dual-mode search | Place search (city/street, not country) re-centers map; Club search filters pins without moving map |
| 3b | Area-based session list | Sessions filtered by user location + radius; distance shown on cards/pins |
| 4 | Session visibility | Sessions stay on map (as `open` or `active`) until they are `closed`, `cancelled`, or `completed` — upcoming sessions always visible |
| 5 | Venue clustering | Multiple sessions at the same court grouped into one VenuePin with count badge; tooltip sorted by nearest date; "See more" modal for overflow |
| 6 | Quick Session | Bottom-left CTA opens a sheet to create a player-organized session in one flow |
| 7 | Active queue guard | If user is in an active session, Quick Session is replaced by Resume Session; no duplicate join |

---

## Non-Goals (this epic)

- Replacing `/home` or merging home feed into dashboard (dashboard **is** the new home route via nav `href: "/dashboard"`)
- Real-time pin updates via WebSocket (React Query refetch on interval is sufficient for v1)
- Club discovery map (that remains `/clubs/explore` list view)
- Mobile bottom-nav redesign
- Payment or registration backend wiring beyond mock/API stubs in early phases

---

## Route & Navigation

| Item | Value |
|------|-------|
| Route | `/dashboard` |
| Nav label | Home (`NAV_ITEMS[0].href`) |
| Layout | Existing `DashboardLayout` — sidebar at ≥1024px |
| Auth | `(protected)` route group — authenticated only |

The existing [`docs/views/client_app/common/home.md`](docs/views/client_app/common/home.md) describes a card-feed home. **This epic supersedes that layout for `/dashboard`.** The feed-style home spec remains reference for Active Session Banner behavior only.

---

## Design Reference

| Asset | Location | Use |
|-------|----------|-----|
| HTML mockup | `stitch_rotra_ui_toolkit_dashboard/code.html` | Layout, overlay positions, Quick Session pill |
| Design system | `stitch_rotra_ui_toolkit_dashboard/DESIGN.md` | No-Line rule, glass panels, uppercase labels, neon pins |
| View spec (to create) | [`docs/views/client_app/common/session_discovery_dashboard.md`](docs/views/client_app/common/session_discovery_dashboard.md) | Authoritative UI spec for implementation |

### Key UI elements (from mockup)

```
┌─────────────────────────────────────────────────────────────┐
│                    [ Location search + filters ]             │  ← top-center overlay
│                                          [ Map | List | Grid ]│  ← top-right toggle
│                                                              │
│                     FULL-SCREEN MAP                            │
│                     (session pins + tooltips)                  │
│                                                              │
│  [ START QUICK SESSION ]              [ Active courts card ] │  ← bottom overlays
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack Decisions

### Maps: Mapbox GL JS + `react-map-gl` (vis.gl)

| Library | Role |
|---------|------|
| `mapbox-gl` | WebGL map renderer |
| `react-map-gl` | React bindings (`Map`, `Marker`, `Popup`) |
| Custom Mapbox Studio style | Dark base matching `surface-dim` (#131314) |

**Why Mapbox over Google Maps:** Airbnb-grade dark custom styling, smooth marker performance, mature `react-map-gl` ecosystem. **Fallback:** MapLibre GL + same `react-map-gl` adapter if token cost is a concern.

### State

| Concern | Layer | Package |
|---------|-------|---------|
| View mode (map/list/grid) | Redux `uiSlice` | `@reduxjs/toolkit` |
| Nearby sessions | React Query | `@tanstack/react-query` |
| Active session check | React Query | `@tanstack/react-query` |
| Map viewport / selected pin | React `useState` | local |
| Quick Session form | react-hook-form + zod | existing stack |

### Data

| Source | Notes |
|--------|-------|
| `queue_sessions` | Status `open` or `active`, visibility `open` or club member access |
| Geolocation | Browser `navigator.geolocation` → map centers on device position (e.g. Cebu when in Cebu); Cebu City fallback when denied; reverse geocode for city label |
| Distance | Haversine in `lib/geo/haversine.ts` (v1); PostGIS optional later |

### New DB fields (Phase 0)

```prisma
venueLat      Float?   @map("venue_lat")
venueLng      Float?   @map("venue_lng")
venueAddress  String?  @map("venue_address")
```

> `location` and `address` already exist on `QueueSession`; new fields store coordinates for map pins. `venueAddress` is the geocoded/normalized string shown in discovery cards.

---

## Phase Index

Execute in order. Each phase has its own plan file at the repo root.

| Phase | File | Summary | Depends on |
|-------|------|---------|------------|
| **0** | [`PLAN_phase_0_foundation.md`](PLAN_phase_0_foundation.md) | Mapbox install, env vars, Prisma migration, types, geo utils, API stub | — |
| **1a** | [`PLAN_phase_1a_map_canvas.md`](PLAN_phase_1a_map_canvas.md) | Full-bleed map canvas, geolocation, load sequence, skeleton, layout | Phase 0 |
| **1b** | [`PLAN_phase_1b_pins_tooltips.md`](PLAN_phase_1b_pins_tooltips.md) | Venue pins, tooltips, avatars, "see more" modal, graceful failure | Phase 1a |
| **1c** | [`PLAN_phase_1c_search_filters.md`](PLAN_phase_1c_search_filters.md) | Place + club search, FilterPanel, view toggle | Phase 1b |
| **2** | [`PLAN_phase_2_list_grid_views.md`](PLAN_phase_2_list_grid_views.md) | List + Grid views, shared session card, Redux view persistence | Phase 1c |
| **3** | [`PLAN_phase_3_quick_session_cta.md`](PLAN_phase_3_quick_session_cta.md) | Quick Session button + sheet, create-session flow | Phase 0, 1a |
| **4** | [`PLAN_phase_4_active_session_guard.md`](PLAN_phase_4_active_session_guard.md) | Active session detection, CTA guard, resume redirect | Phases 1a–1c, 3 |

---

## Component Architecture

All dashboard UI lives under `apps/client/src/components/modules/dashboard/`:

```
components/modules/dashboard/
├── dashboard-map/
│   ├── DashboardMap.tsx
│   ├── DashboardMap.stories.tsx
│   ├── VenuePin.tsx                  ← replaces SessionMapPin; handles 1–N sessions per venue
│   ├── VenuePin.variants.ts
│   └── VenuePinTooltip.tsx           ← single session detail OR multi-session list + "See more"
├── venue-sessions-modal/
│   └── VenueSessionsModal.tsx        ← full session list for a venue, sorted by date
├── map-search-overlay/
│   └── MapSearchOverlay.tsx          ← Place search + Club search + filter chips
├── view-toggle/
│   ├── ViewToggle.tsx
│   └── ViewToggle.variants.ts
├── session-list-view/
│   └── SessionListView.tsx
├── session-grid-view/
│   └── SessionGridView.tsx
├── session-discovery-card/
│   └── SessionDiscoveryCard.tsx      ← shared card for list/grid/pin tooltip/modal rows
├── quick-session-button/
│   └── QuickSessionButton.tsx
├── quick-session-sheet/
│   └── QuickSessionSheet.tsx
└── active-session-banner/
    └── ActiveSessionBanner.tsx
```

Route files:

```
app/(protected)/dashboard/
├── page.tsx              ← Server Component: metadata, Suspense, initial data
└── DashboardClient.tsx   ← Client Component: view state, map, overlays
```

Hooks & lib:

```
hooks/
├── useGeolocation.ts          ← device position + city label + Cebu fallback
├── useSessionDiscovery.ts
└── useActiveSession.ts

lib/
├── api/session-discovery.ts    ← groups sessions by venueKey; returns VenueSessionGroup[]
└── geo/haversine.ts

types/
└── session-discovery.ts
```

---

## Reuse Existing Code & Conventions (pre-flight)

Before building anything new, every phase must check for and reuse existing primitives, hooks, types, and server utilities. Do **not** re-create what already exists.

**Existing UI primitives to reuse** (`apps/client/src/components/ui/*`):

| Need | Reuse (existing) | Do NOT add |
|------|------------------|------------|
| Bottom sheet (mobile) | `mobile-drawer/MobileDrawer.tsx` | shadcn `Sheet` (no Sheet primitive exists) |
| Popover (desktop FilterPanel) | `popover/Popover.tsx` | new popover dep |
| Modal | `dialog/Dialog.tsx` | — |
| Blocking confirm | `alert-dialog/AlertDialog.tsx` | — |
| Radio (availability filter) | `radio-group/RadioGroup.tsx` | — |
| Tabs (Place/Club, view toggle) | `tabs/Tabs.tsx` | — |
| Selects (Quick Session) | `select/Select.tsx`, `native-select/NativeSelect.tsx` | — |
| Date/time (Quick Session) | `date-picker/DatePicker.tsx`, `calendar/Calendar.tsx` | — |
| Form field/label | `field/Field.tsx`, `label/Label.tsx`, `input-group/InputGroup.tsx` | — |
| Player avatar/identity | `small-user-card/SmallUserCard.tsx` | — |
| Pill/badge | `pill/Pill.tsx` | — |
| Loading | `skeleton/Skeleton.tsx` | — |
| Toast | `sonner` (already wired) | — |

**Hook convention:** Existing hooks use a **folder split** (`hooks/<name>/{client.ts, server.ts, queryKey.ts}`) — see `useProfile/`, `useNotifications/`, `usePlayerProfile/`, `useClubApplication/`. New discovery hooks MUST follow the same shape, not flat single files:

```
hooks/useSessionDiscovery/{client.ts, server.ts, queryKey.ts}
hooks/useActiveSession/{client.ts, server.ts, queryKey.ts}
hooks/useGeolocation/client.ts            ← browser-only, no server/queryKey
```

**Other reuse:**

- Auth/session: existing Supabase server client (used across `app/api/*` routes) — do not roll a new one
- Club membership: check `useClubApplication/` and existing club queries before adding `GET /api/clubs/mine`
- Player profile/avatar data: `useProfile/`, `usePlayerProfile/`
- Forms: follow `docs/techstack/11_form_engineering_guidelines.md` (react-hook-form + zod + `@hookform/resolvers`, all already installed)
- Icons: `lucide-react` (already installed)

**Stack compatibility (verified June 2026):**

- `react-map-gl` v8.1.1 officially supports **React 19** (this app is on React 19.1). v8 changed import paths — import from **`react-map-gl/mapbox`** (for `mapbox-gl >= 3.5.0`), not the bare `react-map-gl`.
- All other deps (Next 15, Redux Toolkit 2, React Query 5, Tailwind 4, shadcn 4, Prisma 6, Supabase, Storybook 10, sonner, date-fns) are already present and compatible. The only new runtime deps are `mapbox-gl` + `react-map-gl`.

---

## API Surface (new)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/sessions/discover` | `GET` | Nearby sessions by lat/lng/radius/filters |
| `/api/sessions/active` | `GET` | Current user's active session registration |
| `/api/sessions/quick` | `POST` | Create player-organized quick session (Phase 3) |

Query params for discover: `lat`, `lng`, `radiusKm` (default 10). Always returns `status IN ('open','active')` — sessions are visible until closed/cancelled/completed. Optional: `placeQuery` (forward-geocode — Mapbox returns new center coords), `clubQuery` (substring match on club name), `scheduleType`, `playersPerCourt`, `weekendOnly`.

Response shape: `{ sessions: SessionDiscoveryItem[], venueGroups: VenueSessionGroup[] }`. `venueGroups` is pre-grouped by `venueKey`, sorted by distance then by dateTime within each group.

---

## Documentation Updates

| Doc | Change |
|-----|--------|
| [`docs/techstack/04_tech_stack_reference.md`](docs/techstack/04_tech_stack_reference.md) | New §3.10 Maps & Geolocation |
| [`docs/techstack/01_tech_stack.md`](docs/techstack/01_tech_stack.md) | TOC link |
| [`docs/views/client_app/common/session_discovery_dashboard.md`](docs/views/client_app/common/session_discovery_dashboard.md) | New view spec |
| [`docs/database/03_queue_sessions.md`](docs/database/03_queue_sessions.md) | `venue_lat`, `venue_lng`, `venue_address` |
| [`docs/business_logic/client_app/08_queue_session.md`](docs/business_logic/client_app/08_queue_session.md) | Discovery map visibility rules |

---

## Acceptance Criteria (epic complete)

- [ ] `/dashboard` renders map view by default with ROTRA dark Mapbox style
- [ ] View toggle switches Map / List / Grid; preference persists in Redux for the session
- [ ] Open and active sessions with coordinates appear as pins; tooltip shows name, time, slots, distance, Join CTA
- [ ] Location search and filter chips update the session list (mock or live API)
- [ ] Quick Session CTA opens sheet; successful create navigates to session detail
- [ ] User with active registration sees Resume Session instead of Quick Session; blocked from creating duplicate
- [ ] Active Session Banner shown when in live session
- [ ] All new components have Storybook stories
- [ ] Phase plan docs and docs/ updates merged

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Mapbox token cost | Free tier (50k loads/mo); MapLibre fallback documented |
| Sessions without lat/lng | Hide from map; show in list with "Location TBD" |
| Geolocation denied | Fallback to Cebu City default; manual city search in v1.1 |
| SSR + Mapbox | Map only in `"use client"` component; `page.tsx` stays server |
| Large bundle | Dynamic import `DashboardMap` with `next/dynamic({ ssr: false })` |

---

## References

- Business logic: [`docs/business_logic/client_app/08_queue_session.md`](docs/business_logic/client_app/08_queue_session.md)
- DB schema: [`docs/database/03_queue_sessions.md`](docs/database/03_queue_sessions.md)
- Component rules: [`docs/techstack/12_component_creation_guidelines.md`](docs/techstack/12_component_creation_guidelines.md)
- State rules: [`docs/techstack/07_state_layer_rules.md`](docs/techstack/07_state_layer_rules.md)
- Existing session UI: [`apps/client/src/components/modules/session/`](apps/client/src/components/modules/session/)
- Nav: [`apps/client/src/constants/nav.ts`](apps/client/src/constants/nav.ts) — Home → `/dashboard`
