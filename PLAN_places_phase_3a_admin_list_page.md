# Places — Phase 3a: Admin List Page & Read Layer

**Epic:** Places (Custom Venue Management)  
**Prerequisite:** [`PLAN_places_phase_2_address_pin_component.md`](PLAN_places_phase_2_address_pin_component.md)  
**Next phase:** [`PLAN_places_phase_3b_admin_crud_dialogs.md`](PLAN_places_phase_3b_admin_crud_dialogs.md)  
**Estimated effort:** 1 day

---

## Objective

Wire up the read layer of the admin Places module:

- Add "Places" to the admin navigation
- Build `page.tsx` (server prefetch) and `PlacesClient.tsx` (tabbed view)
- Build `PlacesTable` (TanStack Table) showing all places, read-only (action stubs only)
- Implement `GET /api/places` so the client can refetch after mutations (added in Phase 3b)
- Add the `QUERY_KEYS.places` entry to the centralized key factory

No dialogs, no mutations, no audit log yet — those land in Phase 3b.

---

## Coding Standards (from `docs/techstack/`)

| Rule | Source |
|------|--------|
| TanStack Table (`createColumnHelper`, `useReactTable`) for all tabular data | `05_coding_design_system.md §4.4` |
| Server Component prefetches via Prisma; Client Component uses TanStack Query `initialData` | `08_data_fetching_conventions.md` |
| No `index.ts` barrel files; import directly from the component file | `12_component_creation_guidelines.md` |
| `cva` recipe in `ComponentName.variants.ts` if component has variants | `12_component_creation_guidelines.md` |
| Storybook fixtures imported from `app/constants/`, never inlined | `12_component_creation_guidelines.md` |
| Tailwind tokens only — no hardcoded hex values | `05_coding_design_system.md §4.1` |

---

## Access Rules

Both `admin` and `super_admin` can view all places (confirmed + unreviewed). The page is behind the existing `(protected)` layout which enforces auth.

---

## File Structure

```
apps/admin/src/app/(protected)/places/
├── page.tsx                   ← Server Component — Prisma prefetch, passes initialPlaces
└── PlacesClient.tsx           ← "use client" — tabs, table, TanStack Query

apps/admin/src/components/modules/places/
└── places-table/
    ├── PlacesTable.tsx        ← TanStack Table, read-only (action stubs)
    ├── PlacesTable.stories.tsx
    └── PlacesTable.variants.ts ← status badge cva recipe (required — badge has variants)

apps/admin/src/app/api/places/
└── route.ts                   ← GET only in this phase (POST added in Phase 3b)

apps/admin/src/hooks/
└── usePlaces.ts               ← useQuery wrapper (QUERY_KEYS.places)

apps/admin/src/lib/api/
└── keys.ts                    ← add QUERY_KEYS.places entry (create file if not exists)

apps/admin/src/constants/
└── places-mocks.ts            ← Storybook fixture data (shared with Phase 3b stories)
```

No `index.ts` anywhere. Imports reference full file paths.

---

## Navigation

**File:** `apps/admin/src/constants/admin.ts`

```ts
// Add to ROUTES object:
PLACES: "/places",

// Add to ADMIN_NAV_ITEMS array (after "Customers", before "Tags"):
{
  label: "Places",
  href: ROUTES.PLACES,
  icon: MapPin,   // lucide-react
},
```

---

## Server Prefetch — `page.tsx`

```tsx
// apps/admin/src/app/(protected)/places/page.tsx
import { db } from "@rotra/db";
import { PlacesClient } from "./PlacesClient";

export const metadata = { title: "Places — ROTRA Admin" };

export default async function PlacesPage() {
  const places = await db.place.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      submittedBy: { select: { id: true, displayName: true } },
      reviewedBy:  { select: { id: true, displayName: true } },
    },
  });

  return <PlacesClient initialPlaces={places} />;
}
```

Prisma is called directly here — no API layer on the read path from the server.

---

## QUERY_KEYS Entry

**File:** `apps/admin/src/lib/api/keys.ts` (create if not exists, following existing pattern)

```ts
export const QUERY_KEYS = {
  // ...existing keys...
  places: (status?: "confirmed" | "unreviewed") =>
    status ? ["places", status] : ["places"],
} as const;
```

---

## `usePlaces` Hook

**File:** `apps/admin/src/hooks/usePlaces.ts`

```ts
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/api/keys";

export function usePlaces(status?: "confirmed" | "unreviewed") {
  return useQuery({
    queryKey: QUERY_KEYS.places(status),
    queryFn: async () => {
      const url = status
        ? `/api/places?status=${status}`
        : "/api/places";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch places");
      return res.json() as Promise<{ places: PlaceRow[] }>;
    },
  });
}
```

---

## `PlacesClient.tsx` Layout

```
PlacesClient (receives initialPlaces prop)
├── Header row
│   ├── Title: "Places"
│   └── "Add Place" button — disabled/hidden in Phase 3a (wired in Phase 3b)
├── Tabs: "All" | "Confirmed" | "Unreviewed"
│   └── "Unreviewed" tab has a badge showing count of unreviewed
└── PlacesTable (filtered by active tab)
    └── data = initialPlaces filtered client-side by tab
```

`usePlaces()` is initialized with `initialData: { places: initialPlaces }` so TanStack Query starts hydrated.

---

## PlacesTable — TanStack Table

### `PlacesTable.variants.ts`

The status badge uses `cva` — **required** for a component with two distinct visual variants:

```ts
// PlacesTable.variants.ts
import { cva, type VariantProps } from "class-variance-authority";

export const placeStatusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-micro font-medium uppercase tracking-widest",
  {
    variants: {
      status: {
        confirmed:  "bg-accent/10 text-accent",
        unreviewed: "bg-warning/10 text-warning",
      },
    },
    defaultVariants: { status: "confirmed" },
  },
);

export type PlaceStatusBadgeVariants = VariantProps<typeof placeStatusBadgeVariants>;
```

### Columns

| Column | Notes |
|--------|-------|
| Name | Primary identifier, truncated at 60 chars |
| Address | Truncated at 80 chars |
| Status | Badge using `placeStatusBadgeVariants` (confirmed = green, unreviewed = amber) |
| Submitted by | `submittedBy.displayName` or "Admin" if null |
| Created at | `format(createdAt, "dd MMM yyyy")` |
| Actions | **Stub column in Phase 3a** — shows disabled icon buttons with `TODO` comment; wired in Phase 3b |

Rows: `bg-surface`. Hover: `bg-elevated`. Follows design system `Table` override.

### `PlacesTable.tsx` structure

```tsx
// Props type declared inside PlacesTable.tsx (not in .types.ts)
interface PlacesTableProps {
  data: PlaceRow[];
  // Action handlers undefined in Phase 3a; passed from PlacesClient in Phase 3b
  onEdit?: (place: PlaceRow) => void;
  onConfirm?: (place: PlaceRow) => void;
  onDelete?: (place: PlaceRow) => void;
}
```

Optional action handlers: when undefined, action buttons are rendered disabled. Phase 3b will pass them.

### Storybook mock data

```ts
// apps/admin/src/constants/places-mocks.ts
import type { PlaceRow } from "@/components/modules/places/places-table/PlacesTable";

export const MOCK_PLACE_CONFIRMED: PlaceRow = {
  id: "a1b2c3d4-...",
  name: "SM Seaside Badminton Court",
  address: "SM Seaside City Cebu, SRP, Cebu City, 6000 Cebu",
  latitude: 10.2841,
  longitude: 123.8607,
  status: "confirmed",
  submittedBy: null,
  reviewedBy: { id: "admin-id", displayName: "Admin Jose" },
  createdAt: new Date("2026-06-01"),
  // ...
};

export const MOCK_PLACE_UNREVIEWED: PlaceRow = {
  id: "e5f6g7h8-...",
  name: "Shuttle Masters Arena",
  address: "Hernan Cortes St, Mandaue City, Cebu",
  latitude: 10.3471,
  longitude: 123.9254,
  status: "unreviewed",
  submittedBy: { id: "player-id", displayName: "Juan Dela Cruz" },
  reviewedBy: null,
  createdAt: new Date("2026-06-09"),
  // ...
};

export const MOCK_PLACES_LIST: PlaceRow[] = [
  MOCK_PLACE_CONFIRMED,
  MOCK_PLACE_UNREVIEWED,
];
```

`PlacesTable.stories.tsx` imports `MOCK_PLACES_LIST` from `@/constants/places-mocks`.

---

## API Route — `GET /api/places`

**File:** `apps/admin/src/app/api/places/route.ts`

```ts
export async function GET(request: Request) {
  // 1. Verify admin JWT claim (follow existing admin API route auth pattern)
  // 2. Read optional ?status= query param
  // 3. Use service role Prisma client → bypasses RLS
  // 4. db.place.findMany({ where: { status: statusFilter } })
  // 5. Return JSON array
}
```

Uses service role client — admin sees all statuses regardless of RLS.

---

## Docs

### Create
- `docs/views/admin_app/places.md` — initial draft covering route, nav, table columns, tabs (CRUD dialog sections TBD in Phase 3b)

### Update
- `docs/business_logic/admin_app/README.md` — add placeholder: `12_places_management.md → Places Management (see Phase 3b)`

---

## Checklist

### Navigation
- [ ] Add `PLACES: "/places"` to `ROUTES` in `apps/admin/src/constants/admin.ts`
- [ ] Add `Places` nav item to `ADMIN_NAV_ITEMS` with `MapPin` icon, positioned after "Customers"

### Query keys
- [ ] Add `QUERY_KEYS.places` to `apps/admin/src/lib/api/keys.ts` (create file if missing)

### Hook
- [ ] Create `apps/admin/src/hooks/usePlaces.ts` with `useQuery` wrapping `GET /api/places`

### API route
- [ ] Create `apps/admin/src/app/api/places/route.ts` — GET handler only
- [ ] Route verifies admin JWT claim before querying
- [ ] Uses service role Prisma client

### Mock constants
- [ ] Create `apps/admin/src/constants/places-mocks.ts` with `MOCK_PLACE_CONFIRMED`, `MOCK_PLACE_UNREVIEWED`, `MOCK_PLACES_LIST`

### Table
- [ ] Create `PlacesTable.variants.ts` — `placeStatusBadgeVariants` cva recipe + `PlaceStatusBadgeVariants` type
- [ ] Create `PlacesTable.tsx` — TanStack Table, `PlacesTableProps` type declared inside `.tsx`
- [ ] Create `PlacesTable.stories.tsx` — imports from `@/constants/places-mocks`
- [ ] Stub action column (disabled buttons, `TODO: wire in Phase 3b` comment)
- [ ] Row style: `bg-surface`; hover: `bg-elevated`
- [ ] No hardcoded hex values

### Page
- [ ] Create `apps/admin/src/app/(protected)/places/page.tsx` — Server Component, Prisma prefetch
- [ ] Create `apps/admin/src/app/(protected)/places/PlacesClient.tsx` — tabs, `usePlaces({ initialData })`, renders `PlacesTable`
- [ ] "Add Place" button rendered but disabled (wired in Phase 3b)

### Component creation checklist (from `12_component_creation_guidelines.md`)
- [ ] `PlacesTable` is functional component; no class components
- [ ] Props type inside `.tsx`, not in `.types.ts`
- [ ] `cva` recipe in `.variants.ts`, not inline
- [ ] `cn` from `@/lib/utils` used for class merging
- [ ] No `index.ts` in `components/modules/places/places-table/`

### Docs
- [ ] Create `docs/views/admin_app/places.md` (initial: route, nav, table columns, tabs)
- [ ] Update `docs/business_logic/admin_app/README.md`

### Validation
- [ ] Navigating to `/places` shows the table with server-prefetched data (no loading spinner)
- [ ] Tabs filter data client-side correctly
- [ ] "Unreviewed" badge count is accurate
- [ ] Storybook stories render confirmed and unreviewed rows correctly
