# Phase 0 — Foundation

**Epic:** Session Discovery Dashboard  
**Prerequisite:** None  
**Next phase:** [`PLAN_phase_1a_map_canvas.md`](PLAN_phase_1a_map_canvas.md)  
**Estimated effort:** 1–2 days

---

## Objective

Install map dependencies, extend the database schema with geolocation fields, scaffold types/utilities/API routes, and configure environment variables so Phases 1–4 can build UI on a stable foundation.

---

## Checklist

### 0.1 — Install map dependencies

**Location:** `apps/client`

```bash
pnpm --filter client add mapbox-gl react-map-gl
pnpm --filter client add -D @types/mapbox-gl
```

**Version guidance (June 2026):**

| Package | Target |
|---------|--------|
| `mapbox-gl` | ^3.x (>= 3.5.0) |
| `react-map-gl` | ^8.1.1 (verified React 19 support) |

**Import path (v8):** Import from **`react-map-gl/mapbox`**, NOT the bare `react-map-gl`. v8 split endpoints by base library:

```typescript
import Map, { Marker, Popup } from "react-map-gl/mapbox";
```

**Acceptance:** `apps/client/package.json` lists both packages; `pnpm install` succeeds; no React 19 peer-dep warnings.

---

### 0.2 — Environment variables

Add to `apps/client/.env.example` and local `.env`:

```env
# Mapbox — public token (URL-restricted in Mapbox dashboard)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ...

# Optional: custom style URL (defaults to ROTRA dark style constant)
NEXT_PUBLIC_MAPBOX_STYLE_URL=mapbox://styles/rotra/...
```

**Mapbox dashboard setup:**

1. Create a Mapbox account / project
2. Create a **dark custom style** in Mapbox Studio:
   - Base: `#131314` (`surface-dim`)
   - Roads: muted `#353436`
   - Water: `#0E0E0F`
   - Labels: `#B9CBB9` (`on-surface-variant`)
3. Restrict token to `localhost:*` and production domain

**Acceptance:** Token loads map tiles in dev without console 401 errors.

---

### 0.3 — Mapbox CSS import

**File:** `apps/client/src/app/globals.css`

```css
@import "mapbox-gl/dist/mapbox-gl.css";
```

Place after existing Tailwind imports. Do not scope — Mapbox controls need global styles.

**Acceptance:** Map controls render correctly (zoom buttons, attribution).

---

### 0.4 — Prisma schema migration

**File:** `packages/db/prisma/models_session.prisma`

Add to `QueueSession` model:

```prisma
venueLat     Float?  @map("venue_lat")
venueLng     Float?  @map("venue_lng")
venueAddress String? @map("venue_address")
```

Add composite index for discovery queries (optional but recommended):

```prisma
@@index([venueLat, venueLng], map: "idx_queue_sessions_geo")
```

**Also add the `completed` session status.** The lifecycle now distinguishes `closed` (queue done, payments settling) from `completed` (everyone paid). Extend the status enum:

```prisma
enum SessionStatus {
  draft
  open
  active
  closed
  completed   // NEW — all payments settled; session fully wrapped
  cancelled
}
```

Discovery only ever queries `open` and `active`, so `completed` is excluded from the map/list the same as `closed`/`cancelled`. See [`docs/database/03_queue_sessions.md`](docs/database/03_queue_sessions.md) and [`docs/business_logic/client_app/08_queue_session.md`](docs/business_logic/client_app/08_queue_session.md).

**Migration steps:**

```bash
pnpm db:migrate:dev --name add_session_venue_coordinates_and_completed_status
pnpm db:generate
```

**Backfill strategy (document only — run as separate script):**

- Sessions with `address` text → geocode via Mapbox Geocoding API on save (Phase 3 form)
- Existing rows: `venue_lat`/`venue_lng` NULL until host edits session or bulk geocode job runs

**Acceptance:** Migration applies cleanly; Prisma client exposes new fields.

---

### 0.5 — TypeScript types

**File:** `apps/client/src/types/session-discovery.ts`

```typescript
export type DashboardViewMode = "map" | "list" | "grid";

export interface SessionGeoPoint {
  lat: number;
  lng: number;
}

export interface SessionDiscoveryItem {
  id: string;
  clubId: string;
  clubName: string;
  location: string;
  venueAddress: string | null;
  coordinates: SessionGeoPoint | null;
  /**
   * Stable key for grouping sessions at the same physical court/venue.
   * Derived by rounding lat/lng to 3 decimal places (~111m grid) in the API mapper.
   * Multiple sessions that share a venueKey are clustered into one VenuePin on the MAP.
   * (List/Grid views remain flat — one entry per session — and do NOT use this grouping.)
   */
  venueKey: string;
  dateTime: string; // ISO
  endTime: string | null;
  /**
   * Sessions appear on the map while status is 'open' OR 'active'.
   * They are removed (no longer discoverable) only when status becomes
   * 'closed', 'cancelled', or 'completed'.
   * An 'open' session with a future date_time is considered "upcoming"
   * in the UI but is still fetched under status='open'.
   */
  status: "open" | "active";
  scheduleType: "mmr" | "fun_games" | null;
  origin: "player_organized" | "club_queue";
  totalSlots: number;
  acceptedCount: number;
  /**
   * Up to 3 most-recently-accepted players, newest first — for the avatar
   * stack shown on hover/tap in VenuePinTooltip. recentPlayersCount is the
   * total accepted count so the UI can render a "+N / view more" overflow.
   */
  recentPlayers: SessionPlayerPreview[];
  distanceKm: number | null;
  playersPerCourt: number;
}

export interface SessionPlayerPreview {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

/**
 * A venue group — one physical location that has one or more discoverable sessions.
 * Rendered as a single VenuePin on the map.
 */
export interface VenueSessionGroup {
  venueKey: string;
  coordinates: SessionGeoPoint;
  venueName: string;       // location field of the first session
  venueAddress: string | null;
  distanceKm: number | null;
  /**
   * All sessions at this venue, sorted by dateTime ascending (nearest first).
   * The map tooltip shows the first 2; "See more" opens VenueSessionsModal.
   */
  sessions: SessionDiscoveryItem[];
}

export interface SessionDiscoveryFilters {
  radiusKm: number;
  /**
   * Place search — city, street, or neighbourhood level (country is excluded).
   * Used to forward-geocode a new map center via Mapbox Geocoding API.
   * Mutually exclusive with clubQuery in the search overlay UX (separate inputs).
   */
  placeQuery?: string;
  /**
   * Club search — free-text filter against clubName.
   * Narrows the session list/pins without changing the map center.
   */
  clubQuery?: string;
  /**
   * Slot availability filter. Default (undefined) = show BOTH full and not-full.
   * Full sessions are intentionally NOT hidden by default — cancellations can free
   * a slot, and players can still waitlist.
   * - "not_full": only sessions where acceptedCount < totalSlots
   * - "full": only sessions where acceptedCount >= totalSlots
   * - undefined: show both (default)
   */
  slotAvailability?: "full" | "not_full";
  scheduleType?: "mmr" | "fun_games";
  playersPerCourt?: number;
  weekendOnly?: boolean;
}

export interface ActiveSessionSummary {
  sessionId: string;
  clubName: string;
  location: string;
  status: "open" | "active";
  playerStatus: string;
  admissionStatus: string;
  href: string;
}
```

**Key type decisions:**

- `venueKey` is a short derived string (e.g. `"10.316_123.885"` at 3dp precision — ~111m grid). Sessions within the same grid cell share a key and are grouped as one `VenueSessionGroup`.
- `status` in `SessionDiscoveryItem` only ever returns `open` or `active` from the API — `closed`, `cancelled`, and `completed` sessions are excluded at query time.
- `placeQuery` controls the *map center* (geocoding); `clubQuery` filters *which sessions* appear without moving the map.

**Acceptance:** Types imported by hooks and components without `any`.

---

### 0.6 — Haversine distance utility

**File:** `apps/client/src/lib/geo/haversine.ts`

```typescript
const EARTH_RADIUS_KM = 6371;

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  return `${km.toFixed(1)} km away`;
}
```

**Unit test (optional):** San Francisco to Oakland ≈ 13 km.

**Acceptance:** Used by discover API mapper and card components.

---

### 0.7 — Session discovery server helper

**File:** `apps/client/src/lib/api/session-discovery.ts`

Responsibilities:

1. Query `queue_sessions` where `status IN ('open', 'active')` — this includes upcoming sessions (future `date_time`) because they are still discoverable until they close/cancel/complete
2. Filter by bounding box or Haversine radius (v1: fetch candidates in bbox, filter in app)
3. Optionally filter by `clubQuery` (case-insensitive substring match on club name)
4. Join `clubs` for club name
5. Count `session_registrations` where `admission_status = 'accepted'`
6. Fetch the 3 most-recently-accepted players per session (join `profiles` for `displayName`/`avatarUrl`, order by `registered_at desc limit 3`) → `recentPlayers`
7. Derive `venueKey` from rounded coordinates: `${lat.toFixed(3)}_${lng.toFixed(3)}` (~111m grid)
8. Map to `SessionDiscoveryItem[]` including `venueKey` and `recentPlayers`
9. Sort by `distanceKm` ascending then `dateTime` ascending within same venue

**RLS note:** Player must see sessions for clubs they belong to (`visibility = club_members`) plus all `visibility = open` sessions.

**When does a session leave the map?** Only when its `status` changes to `closed`, `cancelled`, or `completed`. A session that is `open` but hasn't started yet (future `date_time`) stays on the map and shows as "Upcoming".

**Stub for Phase 0–1 (before API route):**

**File:** `apps/client/src/constants/mock-session-discovery.ts`

Export 5–7 mock `SessionDiscoveryItem` objects with Metro Cebu coordinates. **Include at least two sessions sharing the same `venueKey`** (same badminton court, different dates/times) to enable VenuePin clustering dev and the "See more" modal from day one.

**Acceptance:** `getNearbySessions(lat, lng, filters)` returns typed array; mock fallback when DB empty.

---

### 0.8 — API route stubs

**File:** `apps/client/src/app/api/sessions/discover/route.ts`

```typescript
// GET /api/sessions/discover?lat=10.32&lng=123.89&radiusKm=10&clubQuery=sunrise&placeQuery=mandaue
// Returns: { sessions: SessionDiscoveryItem[], venueGroups: VenueSessionGroup[] }
```

`venueGroups` is derived server-side: group `sessions` by `venueKey`, sort each group's sessions by `dateTime` ascending, then sort groups by `distanceKm`.

**File:** `apps/client/src/app/api/sessions/active/route.ts`

```typescript
// GET /api/sessions/active
// Returns: { active: ActiveSessionSummary | null }
```

Phase 0: return mock data or empty. Wire to Prisma in Phase 4.

**Acceptance:** Routes return 200 JSON; auth check via existing Supabase server client.

---

> **Hook convention:** Existing hooks use a folder split (`hooks/<name>/{client.ts, server.ts, queryKey.ts}`) — see `useProfile/`, `useNotifications/`, `usePlayerProfile/`, `useClubApplication/`. All new hooks below MUST follow this shape, not flat single files.

### 0.9 — User location hook (`useGeolocation`)

**File:** `apps/client/src/hooks/useGeolocation/client.ts` (browser-only; no `server.ts`/`queryKey.ts` needed)

The map must center on **where the user is right now** — e.g. if they are in Cebu, the map opens on Cebu, not a hardcoded US city.

**Priority order for map center:**

| Priority | Source | Example |
|----------|--------|---------|
| 1 | Browser `navigator.geolocation.getCurrentPosition` | User in Cebu → map centers on Cebu coords |
| 2 | Mapbox reverse geocode of device coords | Search overlay shows `Cebu City` (not raw lat/lng) |
| 3 | Regional fallback | **Cebu City, Philippines** (`10.3157, 123.8854`) when permission denied or unsupported |

**Hook contract:**

```typescript
export type GeolocationStatus = "idle" | "loading" | "granted" | "denied" | "unsupported";

// Returns:
{
  center: SessionGeoPoint;       // device coords or Cebu fallback
  status: GeolocationStatus;
  locationLabel: string;         // e.g. "Cebu City" or "Your location"
  isUserLocation: boolean;       // true when status === "granted"
  refresh: () => void;           // re-request position (tap location in search overlay)
}
```

**Options:** `enableHighAccuracy: true`, `timeout: 12_000`, `maximumAge: 60_000`.

**Acceptance:** Hook resolves without blocking render; label updates after reverse geocode when Mapbox token is set.

---

### 0.10 — React Query hooks (skeleton)

**Folder:** `apps/client/src/hooks/useSessionDiscovery/{client.ts, server.ts, queryKey.ts}`

```typescript
// queryKey.ts → ['sessions', 'discover', lat, lng, filters]
// client.ts   → useQuery, staleTime: 60_000, enabled: lat/lng defined
// server.ts   → prefetch helper for RSC (page.tsx initial data)
```

**Folder:** `apps/client/src/hooks/useActiveSession/{client.ts, server.ts, queryKey.ts}`

```typescript
// queryKey.ts → ['sessions', 'active']
// client.ts   → useQuery, refetchInterval: 30_000, refetchOnWindowFocus: true
```

**Acceptance:** Hooks compile; used in `DashboardClient` with mock data.

---

### 0.11 — Redux: dashboard view mode

**File:** `apps/client/src/store/slices/uiSlice.ts`

Extend state:

```typescript
interface UIState {
  isMobileDrawerOpen: boolean;
  dashboardViewMode: DashboardViewMode; // default: 'map'
}
```

Add reducers: `setDashboardViewMode`, `resetDashboardViewMode`.

**Acceptance:** View mode persists across client navigations within the same browser session.

---

### 0.12 — Dynamic import helper

**File:** `apps/client/src/app/(protected)/dashboard/DashboardClient.tsx` (shell only in Phase 0)

```typescript
import dynamic from "next/dynamic";

const DashboardMap = dynamic(
  () => import("@/components/modules/dashboard/dashboard-map/DashboardMap"),
  { ssr: false, loading: () => <DashboardMapSkeleton /> },
);
```

Prevents Mapbox from loading on server.

**Acceptance:** Build passes; no `window is not defined` errors.

---

### 0.13 — Constants

**File:** `apps/client/src/constants/dashboard.ts`

```typescript
// Regional fallback — Philippines (Cebu City), NOT a US default
export const DEFAULT_MAP_CENTER = { lat: 10.3157, lng: 123.8854 };
export const DEFAULT_MAP_ZOOM = 12;
export const USER_LOCATION_ZOOM = 13; // city-level when device location granted
export const DEFAULT_RADIUS_KM = 10;
export const MAPBOX_STYLE_URL =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL ??
  "mapbox://styles/mapbox/dark-v11"; // replace with ROTRA custom style
export const DASHBOARD_VIEW_MODES = ["map", "list", "grid"] as const;
```

**Mock discovery data** (`mock-session-discovery.ts`) should use **Metro Cebu** coordinates (Cebu City, Mandaue, Lapu-Lapu) so dev/testing matches the primary market.

---

## Files Created / Modified (summary)

| Action | Path |
|--------|------|
| Create | `apps/client/src/types/session-discovery.ts` |
| Create | `apps/client/src/lib/geo/haversine.ts` |
| Create | `apps/client/src/lib/api/session-discovery.ts` |
| Create | `apps/client/src/constants/mock-session-discovery.ts` |
| Create | `apps/client/src/constants/dashboard.ts` |
| Create | `apps/client/src/hooks/useGeolocation/client.ts` |
| Create | `apps/client/src/hooks/useSessionDiscovery/{client,server,queryKey}.ts` |
| Create | `apps/client/src/hooks/useActiveSession/{client,server,queryKey}.ts` |
| Create | `apps/client/src/app/api/sessions/discover/route.ts` |
| Create | `apps/client/src/app/api/sessions/active/route.ts` |
| Modify | `packages/db/prisma/models_session.prisma` |
| Modify | `apps/client/package.json` |
| Modify | `apps/client/src/app/globals.css` |
| Modify | `apps/client/src/store/slices/uiSlice.ts` |
| Modify | `apps/client/.env.example` |
| Modify | `docs/database/03_queue_sessions.md` |

---

## Phase 0 Acceptance

- [ ] `mapbox-gl` and `react-map-gl` installed
- [ ] `NEXT_PUBLIC_MAPBOX_TOKEN` documented in `.env.example`
- [ ] Prisma migration adds `venue_lat`, `venue_lng`, `venue_address` and `completed` status
- [ ] Types, haversine util, mock data (Cebu area), API stubs, hooks exist
- [ ] `useGeolocation` centers on device location; Cebu fallback when denied
- [ ] `uiSlice` stores `dashboardViewMode`
- [ ] `globals.css` imports Mapbox CSS
- [ ] `pnpm build` passes for `apps/client`

---

## Handoff to Phase 1a

Phase 1a consumes:

- `SessionDiscoveryItem` type + mock data
- `useSessionDiscovery` hook
- `DashboardViewMode` in Redux
- Mapbox env + CSS ready
- `useGeolocation` hook + Cebu-centered constants
- `DashboardClient.tsx` shell with dynamic map import
