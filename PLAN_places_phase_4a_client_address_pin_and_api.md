# Places — Phase 4a: Client AddressPinField & Places API Routes

**Epic:** Places (Custom Venue Management)  
**Prerequisite:** [`PLAN_places_phase_3b_admin_crud_dialogs.md`](PLAN_places_phase_3b_admin_crud_dialogs.md)  
**Next phase:** [`PLAN_places_phase_4b_venue_picker_integration.md`](PLAN_places_phase_4b_venue_picker_integration.md)  
**Estimated effort:** 0.75 days

---

## Objective

Build the client-side read/write foundation for Places:

1. Add `reverseGeocode()` to the client geocoding helper
2. Build the client version of `AddressPinField` (dark Mapbox style)
3. Create `GET /api/places/search` — typeahead search for confirmed places
4. Create `POST /api/places/submit` — player submits a new unreviewed place (fire-and-forget)
5. Add `QUERY_KEYS.placesSearch` to the client key factory

No `VenuePicker` or `QuickSessionSheet` changes yet — those land in Phase 4b.

---

## Coding Standards (from `docs/techstack/`)

| Rule | Source |
|------|--------|
| No `index.ts` barrel files; import directly from component file | `12_component_creation_guidelines.md` |
| `cva` recipe in `ComponentName.variants.ts` if variants exist | `12_component_creation_guidelines.md` |
| Props type `ComponentNameProps` declared inside `.tsx` | `12_component_creation_guidelines.md` |
| Storybook fixtures imported from `app/constants/`, never inlined | `12_component_creation_guidelines.md` |
| `cn` from `@/lib/utils` for class merging | `12_component_creation_guidelines.md` |
| Tailwind tokens only — no hardcoded hex values | `05_coding_design_system.md` |

---

## File Structure

```
apps/client/src/
├── components/ui/address-pin-field/
│   ├── AddressPinField.tsx             ← component + AddressPinFieldProps type
│   ├── AddressPinField.stories.tsx
│   └── AddressPinField.variants.ts    ← required IF cva is used
├── app/api/places/
│   ├── search/
│   │   └── route.ts                   ← GET — search confirmed places
│   └── submit/
│       └── route.ts                   ← POST — submit unreviewed place
├── lib/
│   ├── geo/
│   │   └── geocode.ts                 ← add reverseGeocode() here
│   └── api/
│       └── keys.ts                    ← add QUERY_KEYS.placesSearch entry
└── constants/
    └── places-mocks.ts                ← Storybook fixture data
```

---

## `reverseGeocode()` — `lib/geo/geocode.ts`

Add to the existing file (alongside `forwardGeocode` and `geocodeAddress`):

```ts
export async function reverseGeocode(
  lat: number,
  lng: number,
  token: string,
): Promise<string> {
  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`,
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("types", "address,poi,place");
  url.searchParams.set("country", "PH");
  url.searchParams.set("limit", "1");

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    const data = (await res.json()) as { features?: Array<{ place_name: string }> };
    return data.features?.[0]?.place_name ?? `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}
```

Falls back to coordinate string on any error — never throws.

---

## Client `AddressPinField`

Same props contract as the admin version (Phase 2) but uses the **dark Mapbox style**:

```ts
// Uses resolveMapboxStyle() from apps/client/src/constants/dashboard.ts
// which returns rotra-dark-style.json or the env override URL
```

### File structure

```
apps/client/src/components/ui/address-pin-field/
├── AddressPinField.tsx              ← component + AddressPinFieldProps (inside .tsx)
├── AddressPinField.stories.tsx
└── AddressPinField.variants.ts      ← only if cva is used; exports addressPinFieldVariants
```

### Props interface (declared inside `AddressPinField.tsx`)

```ts
export interface AddressPinValue {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface AddressPinFieldProps {
  value?: AddressPinValue | null;
  onChange: (value: AddressPinValue | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
```

### Behavior (same as admin version)

1. Name input (free text) — does not affect geocoding
2. Address search input — debounced 300ms → `forwardGeocode()` → dropdown suggestions
3. Selecting a suggestion → pin flies to location, `onChange` fires
4. Dragging pin → `reverseGeocode()` → address updates, `onChange` fires
5. Clicking map → pin moves, `reverseGeocode()` → `onChange` fires
6. `disabled` prop → all inputs locked, pin not draggable

### SSR dynamic import pattern

```tsx
// In any parent that renders AddressPinField:
import dynamic from "next/dynamic";

const AddressPinField = dynamic(
  () =>
    import("@/components/ui/address-pin-field/AddressPinField").then(
      (m) => m.AddressPinField,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[340px] animate-pulse rounded-xl bg-bg-elevated" />
    ),
  },
);
```

Import path ends with `/AddressPinField` (the file), **not** `/address-pin-field` (the folder).

### Storybook mock constants

```ts
// apps/client/src/constants/places-mocks.ts
import type { AddressPinValue } from "@/components/ui/address-pin-field/AddressPinField";

export const MOCK_ADDRESS_PIN_VALUE: AddressPinValue = {
  name:      "SM Seaside Badminton Court",
  address:   "SM Seaside City Cebu, SRP, Cebu City, 6000 Cebu",
  latitude:  10.2841,
  longitude: 123.8607,
};
```

`AddressPinField.stories.tsx` imports `MOCK_ADDRESS_PIN_VALUE` from `@/constants/places-mocks` — no inline fixtures.

---

## QUERY_KEYS Entry — Client

**File:** `apps/client/src/lib/api/keys.ts` (create if not exists)

```ts
export const QUERY_KEYS = {
  // ...existing keys...
  placesSearch: (q: string) => ["places", "search", q] as const,
} as const;
```

---

## API Route: `GET /api/places/search`

**File:** `apps/client/src/app/api/places/search/route.ts`

```ts
export const runtime = "nodejs";

export async function GET(request: Request) {
  // 1. Require authenticated player JWT (getCurrentProfile())
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ places: [] });

  // 2. Supabase anon/user client — RLS enforces confirmed-only SELECT
  const { data, error } = await supabase
    .from("places")
    .select("id, name, address, latitude, longitude")
    .or(`name.ilike.%${q}%,address.ilike.%${q}%`)
    .eq("status", "confirmed")
    .order("name")
    .limit(6);

  if (error) return NextResponse.json({ places: [] });
  return NextResponse.json({ places: data });
}
```

Returns at most 6 results. RLS on the DB ensures only `confirmed` places are ever returned, even if the `eq("status", "confirmed")` filter were removed.

---

## API Route: `POST /api/places/submit`

**File:** `apps/client/src/app/api/places/submit/route.ts`

```ts
export const runtime = "nodejs";

const submitPlaceSchema = z.object({
  name:      z.string().min(2).max(120),
  address:   z.string().max(200),
  latitude:  z.number(),
  longitude: z.number(),
});

export async function POST(request: Request) {
  // 1. Require authenticated player JWT
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Parse + validate body
  const body = await request.json().catch(() => null);
  const parsed = submitPlaceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  // 3. Insert as unreviewed, submitted_by = player.id
  // Use Prisma (db) — service role — to insert regardless of RLS:
  const place = await db.place.create({
    data: {
      name:         parsed.data.name,
      address:      parsed.data.address,
      latitude:     parsed.data.latitude,
      longitude:    parsed.data.longitude,
      status:       "unreviewed",
      submittedById: profile.id,
    },
  });

  return NextResponse.json({ placeId: place.id });
}
```

This route is fire-and-forget from the caller's perspective — the client does not await the response.

---

## Docs

### Create
- `docs/views/client_app/components/address-pin-field.md` — props, behavior modes (search / drag / click), SSR note, correct dynamic import path, dark style context

### Update
- `docs/views/client_app/common/session_discovery_dashboard.md` — note that `AddressPinField` will be embedded in `VenuePicker` (Phase 4b)

---

## Checklist

### Geocoding
- [ ] Add `reverseGeocode()` to `apps/client/src/lib/geo/geocode.ts`
- [ ] Verify fallback to coordinate string on error (no thrown exceptions)

### QUERY_KEYS
- [ ] Add `QUERY_KEYS.placesSearch` to `apps/client/src/lib/api/keys.ts`

### Client `AddressPinField`
- [ ] Create `apps/client/src/components/ui/address-pin-field/AddressPinField.tsx` — dark style via `resolveMapboxStyle()`
- [ ] Create `AddressPinField.variants.ts` only if `cva` is used
- [ ] Create `apps/client/src/constants/places-mocks.ts` with `MOCK_ADDRESS_PIN_VALUE`
- [ ] Create `AddressPinField.stories.tsx` — imports from `@/constants/places-mocks`
- [ ] No `index.ts` in folder
- [ ] Uses `cn` from `@/lib/utils`
- [ ] No hardcoded hex values
- [ ] Props type `AddressPinFieldProps` declared inside `AddressPinField.tsx`
- [ ] Dynamic import path in usage: `…/address-pin-field/AddressPinField` (file, not folder)
- [ ] Loading skeleton uses `bg-bg-elevated` token

### Component creation checklist (from `12_component_creation_guidelines.md`)
- [ ] Functional component; no class components
- [ ] `cva` recipe in `.variants.ts` if used; not inline in `.tsx`
- [ ] Stories cover: default empty state, pre-filled state, disabled state
- [ ] Story fixtures from `@/constants/places-mocks`, never inlined

### API routes
- [ ] `GET /api/places/search/route.ts` — auth guard, min 2 chars, ilike, limit 6
- [ ] `POST /api/places/submit/route.ts` — auth guard, zod validation, insert `unreviewed`
- [ ] Both routes use `runtime = "nodejs"`
- [ ] Search route: RLS-respecting Supabase client (confirmed-only by DB policy)
- [ ] Submit route: Prisma (service role or user scoped) for insert

### Docs
- [ ] Create `docs/views/client_app/components/address-pin-field.md`
- [ ] Update `docs/views/client_app/common/session_discovery_dashboard.md`

### Validation
- [ ] `GET /api/places/search?q=SM` returns matching confirmed places
- [ ] `GET /api/places/search?q=a` (< 2 chars) returns `{ places: [] }`
- [ ] `POST /api/places/submit` inserts a row with `status = "unreviewed"` and correct `submitted_by`
- [ ] `AddressPinField` renders dark-style mini map; pin is draggable
- [ ] `onChange` fires for search selection, pin drag, and map click
- [ ] No SSR crash — component renders skeleton on server, hydrates on client
