# Places — Phase 4b: VenuePicker & QuickSessionSheet Integration

**Epic:** Places (Custom Venue Management)  
**Prerequisite:** [`PLAN_places_phase_4a_client_address_pin_and_api.md`](PLAN_places_phase_4a_client_address_pin_and_api.md)  
**Estimated effort:** 1 day

---

## Objective

Wire the Places system into the client session creation flow:

1. Build `VenuePicker` — typeahead search of confirmed places + "Pin new location" mode using `AddressPinField`
2. Update `schema.ts` and `default.ts` in `QuickSessionSheet`
3. Replace the two plain text venue fields in `QuickSessionSheet` with `VenuePicker`
4. Update `api/sessions/quick/route.ts` — skip geocoding when lat/lng are already provided
5. Fire-and-forget place submission in `useQuickSessionMutation` when a new pin is set

---

## Coding Standards (from `docs/techstack/`)

| Rule | Source |
|------|--------|
| Schema in `schema.ts`, defaults in `default.ts` — update existing files in-place | `11_form_engineering_guidelines.md` |
| RHF `Form` + `Controller` pattern; `onSuccess`/`onError` props | `11_form_engineering_guidelines.md` |
| `cva` recipe in `.variants.ts` if component has variants | `12_component_creation_guidelines.md` |
| No `index.ts` barrel files | `12_component_creation_guidelines.md` |
| Storybook fixtures from `app/constants/`, never inlined | `12_component_creation_guidelines.md` |
| Tailwind tokens only — no hardcoded hex values | `05_coding_design_system.md` |

---

## File Structure

```
apps/client/src/
├── components/
│   ├── ui/venue-picker/
│   │   ├── VenuePicker.tsx              ← component + VenuePickerProps (inside .tsx)
│   │   ├── VenuePicker.stories.tsx
│   │   └── VenuePicker.variants.ts      ← required IF cva is used for mode states/summary card
│   └── modules/dashboard/quick-session-sheet/
│       ├── QuickSessionSheet.tsx        ← updated: VenuePicker replaces two text fields
│       ├── schema.ts                    ← updated: location/address → venue object
│       └── default.ts                  ← updated: venue default values
└── hooks/
    └── useQuickSessionMutation.ts       ← updated: fire-and-forget place submit
```

---

## `VenuePicker` Component

### Value type (exported from `VenuePicker.tsx`)

```ts
export interface VenuePickerValue {
  name:              string;
  address:           string;
  latitude:          number | null;
  longitude:         number | null;
  /** Set when user picks from confirmed places DB */
  placeId?:          string;
  /** Set when user pins a brand-new location not yet in DB */
  isNewSubmission?:  boolean;
}
```

### Props (declared inside `VenuePicker.tsx`)

```ts
interface VenuePickerProps {
  value?: VenuePickerValue | null;
  onChange: (value: VenuePickerValue | null) => void;
  disabled?: boolean;
  className?: string;
}
```

### UX flow

```
VenuePicker
├── [Mode A — search existing, default]
│   ├── Search input — debounced 300ms → GET /api/places/search
│   ├── Results dropdown (max 6, name + truncated address)
│   ├── "Pin a new location" option at dropdown bottom
│   └── When a place is selected: shows summary card with venue name/address + clear button
└── [Mode B — pin new]
    ├── Activated when user clicks "Pin a new location"
    ├── Renders AddressPinField (dark mini map + geocoding)
    ├── When AddressPinField onChange fires:
    │   └── sets VenuePickerValue with isNewSubmission: true, placeId: undefined
    └── Shows summary card "New venue: {name}" with back arrow to return to Mode A
```

### `.variants.ts` rule

If the summary card, mode toggle button, or selected-state styling uses `cva`, extract to `VenuePicker.variants.ts`. Export `venuePickerVariants` (recipe) and `VenuePickerVariants` (type). If no `cva` is needed, do **not** create the file.

### Dynamic import of `AddressPinField` inside `VenuePicker`

`VenuePicker` itself does **not** need dynamic import (it has no Mapbox code directly). The `AddressPinField` it renders in Mode B **does** need it:

```tsx
// Inside VenuePicker.tsx — lazy load only when Mode B is needed
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

`VenuePicker` itself can be imported normally (no `ssr: false` wrapper needed at the `QuickSessionSheet` level).

### Storybook

Stories import from `apps/client/src/constants/places-mocks.ts` (created in Phase 4a):

```ts
// Add to places-mocks.ts:
import type { VenuePickerValue } from "@/components/ui/venue-picker/VenuePicker";

export const MOCK_VENUE_PICKER_CONFIRMED: VenuePickerValue = {
  name:      "SM Seaside Badminton Court",
  address:   "SM Seaside City Cebu, SRP, Cebu City, 6000 Cebu",
  latitude:  10.2841,
  longitude: 123.8607,
  placeId:   "a1b2c3d4-...",
  isNewSubmission: false,
};

export const MOCK_VENUE_PICKER_NEW: VenuePickerValue = {
  name:      "New Court Near Me",
  address:   "Unnamed Road, Cebu City",
  latitude:  10.3157,
  longitude: 123.8854,
  isNewSubmission: true,
};
```

Stories cover: Mode A empty, Mode A with selection, Mode B with new pin set, disabled state.

---

## Schema Update — `schema.ts`

**File:** `apps/client/src/components/modules/dashboard/quick-session-sheet/schema.ts`

Replace separate `location` and `address` fields with a `venue` object. Keep the file named `schema.ts` (do not rename):

```ts
import { z } from "zod";

export const quickSessionFormSchema = z.object({
  clubId: z.union([z.string().uuid("Select a valid club"), z.literal("")]).optional(),

  venue: z.object({
    name:            z.string().min(2, "Venue name is required").max(120),
    address:         z.string().max(200).optional(),
    latitude:        z.number().nullable().optional(),
    longitude:       z.number().nullable().optional(),
    placeId:         z.string().uuid().optional(),
    isNewSubmission: z.boolean().optional(),
  }),

  date:            z.string().min(1, "Date is required"),
  startTime:       z.string().min(1, "Start time is required"),
  numCourts:       z.coerce.number().int().min(1).max(12),
  playersPerCourt: z.enum(["2", "4"]),
  matchFormat:     z.enum(["best_of_1", "best_of_3"]),
  scoreLimit:      z.coerce.number().int().min(11).max(30),
  visibility:      z.enum(["club_members", "open"]),
});

export type QuickSessionFormValues = z.infer<typeof quickSessionFormSchema>;
```

> **Migration note:** The server API also validates this schema. Both must be updated together in the same PR. The old `location` and `address` top-level fields are removed.

---

## Default Values Update — `default.ts`

**File:** `apps/client/src/components/modules/dashboard/quick-session-sheet/default.ts`

Update the existing `defaultQuickSessionValues()` — keep the file name `default.ts`:

```ts
import { format } from "date-fns";
import type { QuickSessionFormValues } from "./schema";

export function defaultQuickSessionValues(): QuickSessionFormValues {
  return {
    clubId:          "",
    venue: {
      name:            "",
      address:         "",
      latitude:        null,
      longitude:       null,
      placeId:         undefined,
      isNewSubmission: false,
    },
    date:            format(new Date(), "yyyy-MM-dd"),
    startTime:       "09:00",
    numCourts:       1,
    playersPerCourt: "4",
    matchFormat:     "best_of_1",
    scoreLimit:      21,
    visibility:      "open",
  };
}
```

---

## `QuickSessionSheet.tsx` Update

Replace the two `<Field>` blocks for `location` and `address` with a single `VenuePicker` controller:

```tsx
<Field data-invalid={!!formState.errors.venue}>
  <FieldLabel>Venue</FieldLabel>
  <FieldContent>
    <Controller
      control={control}
      name="venue"
      render={({ field }) => (
        <VenuePicker
          value={field.value}
          onChange={field.onChange}
          disabled={createMutation.isPending}
        />
      )}
    />
    <FieldError errors={[formState.errors.venue?.name, formState.errors.venue?.address]} />
  </FieldContent>
</Field>
```

`VenuePicker` is imported directly (no `ssr: false` at this level — the `AddressPinField` inside it is already lazy-loaded by `VenuePicker`).

```tsx
import { VenuePicker } from "@/components/ui/venue-picker/VenuePicker";
```

---

## `api/sessions/quick/route.ts` Update

**File:** `apps/client/src/app/api/sessions/quick/route.ts`

Changes:
- Read from `values.venue.*` instead of `values.location` / `values.address`
- Skip `geocodeAddress()` when lat/lng are already present (from DB lookup or manual pin)
- Preserve the geocoding fallback when no coordinates are set

```ts
const { venue } = values;

const hasCoordinates =
  venue.latitude != null && venue.longitude != null;

const geocoded = hasCoordinates
  ? {
      lat:              venue.latitude,
      lng:              venue.longitude,
      formattedAddress: venue.address ?? "",
    }
  : await geocodeAddress(venue.address?.trim() || venue.name.trim());

// Then use geocoded.lat, geocoded.lng, geocoded.formattedAddress as before
await tx.queueSession.create({
  data: {
    // ...
    location:     venue.name.trim(),
    address:      venue.address?.trim() || null,
    venueLat:     geocoded?.lat ?? null,
    venueLng:     geocoded?.lng ?? null,
    venueAddress: geocoded?.formattedAddress ?? null,
    // ...
  },
});
```

---

## Fire-and-Forget Place Submission

**File:** `apps/client/src/hooks/useQuickSessionMutation.ts`

After successful session creation, if `venue.isNewSubmission === true`, submit the new place in the background:

```ts
onSuccess: (data, variables) => {
  // Navigate to session (existing behaviour)
  router.push(data.href);

  // Fire-and-forget — does not affect UX
  if (variables.venue.isNewSubmission) {
    void fetch("/api/places/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name:      variables.venue.name,
        address:   variables.venue.address ?? "",
        latitude:  variables.venue.latitude,
        longitude: variables.venue.longitude,
      }),
    });
  }
},
```

The session is created before this runs. If `fetch` fails, the session is unaffected. The place remains in the admin's unreviewed queue.

---

## Architecture Flow (End-to-End)

```
QuickSessionSheet (form)
    │
    └── VenuePicker (Controller)
            │
            ├── Mode A: search input
            │       │
            │       └── GET /api/places/search  →  confirmed places list
            │               │
            │           user selects
            │               │
            │       venue.placeId set
            │       venue.lat/lng from DB record
            │
            └── Mode B: AddressPinField (lazy)
                    │
                    user pins + names location
                    │
                venue.isNewSubmission = true
                venue.lat/lng from map pin
                │
        form submits  →  POST /api/sessions/quick
                                │
                        session created ✓
                                │
                        (if isNewSubmission)
                                └──→  POST /api/places/submit
                                       (fire-and-forget → unreviewed)
                                               │
                                       admin reviews in Phase 3b UI
                                       confirmed → available to all users
```

---

## Docs

### Create
- `docs/views/client_app/components/venue-picker.md` — props, mode A/B flow, fire-and-forget submission, RHF Controller usage

### Update
- `docs/views/client_app/common/session_discovery_dashboard.md` — venue field is now `VenuePicker` in `QuickSessionSheet`
- `docs/views/client_app/que_master/session_setup.md` — venue selection via `VenuePicker`
- `docs/business_logic/client_app/08_queue_session.md` — add "Venue / Places" subsection: confirmed places offered as choices; new pins submitted as unreviewed; does not block session creation

---

## Checklist

### `VenuePicker` component
- [ ] Create `apps/client/src/components/ui/venue-picker/VenuePicker.tsx`
- [ ] Props type `VenuePickerProps` and `VenuePickerValue` interface declared inside `VenuePicker.tsx`
- [ ] Create `VenuePicker.variants.ts` only if `cva` is used; exports `venuePickerVariants` recipe + `VenuePickerVariants` type
- [ ] Create `VenuePicker.stories.tsx` — imports fixtures from `@/constants/places-mocks`
- [ ] Add `MOCK_VENUE_PICKER_CONFIRMED` and `MOCK_VENUE_PICKER_NEW` to `constants/places-mocks.ts`
- [ ] No `index.ts` in `components/ui/venue-picker/`
- [ ] `cn` from `@/lib/utils` for class merging
- [ ] No hardcoded hex values
- [ ] `AddressPinField` dynamically imported inside `VenuePicker` with correct file path
- [ ] Loading skeleton uses `bg-bg-elevated` token

### Mode A behavior
- [ ] Search input debounced 300ms → `GET /api/places/search`
- [ ] Dropdown shows up to 6 confirmed places
- [ ] Selecting a place sets `placeId`, `latitude`, `longitude`, `isNewSubmission: false`
- [ ] Summary card shown after selection with clear button

### Mode B behavior
- [ ] "Pin a new location" option at dropdown bottom switches to Mode B
- [ ] `AddressPinField` renders with dark Mapbox style
- [ ] Pinning sets `isNewSubmission: true`, `placeId: undefined`
- [ ] Summary card shows "New venue: {name}" with back arrow to Mode A

### Schema + defaults (files stay named `schema.ts` and `default.ts`)
- [ ] Update `schema.ts` — replace `location`/`address` with `venue` object
- [ ] Update `default.ts` — new `venue` shape in `defaultQuickSessionValues()`
- [ ] Verify `QuickSessionFormValues` TypeScript type is correct after change

### `QuickSessionSheet.tsx`
- [ ] Replace two `<Field>` blocks with single `VenuePicker` `Controller`
- [ ] Import `VenuePicker` directly: `from "@/components/ui/venue-picker/VenuePicker"`
- [ ] `formState.errors.venue.name` and `formState.errors.venue.address` surface correctly

### API route update
- [ ] Update `apps/client/src/app/api/sessions/quick/route.ts` — read `values.venue.*`
- [ ] Skip `geocodeAddress()` when `venue.latitude` and `venue.longitude` are present
- [ ] Fallback to `geocodeAddress(venue.address || venue.name)` when no coordinates
- [ ] Schema validation in route updated to match new `venue` object shape

### `useQuickSessionMutation` update
- [ ] Fire-and-forget `POST /api/places/submit` in `onSuccess` when `venue.isNewSubmission`
- [ ] Uses `void fetch(...)` — not awaited, does not block navigation

### Component creation checklist (from `12_component_creation_guidelines.md`)
- [ ] Functional component; no class components
- [ ] `cva` recipe in `.variants.ts` if used; not inline in `.tsx`
- [ ] Stories cover: empty/default, confirmed selection, new pin set, disabled
- [ ] Story fixtures from `@/constants/places-mocks`, never inlined

### Docs
- [ ] Create `docs/views/client_app/components/venue-picker.md`
- [ ] Update `docs/views/client_app/common/session_discovery_dashboard.md`
- [ ] Update `docs/views/client_app/que_master/session_setup.md`
- [ ] Update `docs/business_logic/client_app/08_queue_session.md`

### End-to-end validation
- [ ] User searches "SM" → confirmed places appear in dropdown
- [ ] User selects a confirmed place → lat/lng from DB, no geocoding API call made
- [ ] User selects "Pin a new location" → `AddressPinField` renders
- [ ] User pins and names a new location → session created → unreviewed place appears in admin
- [ ] Admin confirms the place → it appears in the next user's VenuePicker search
- [ ] Network failure on place submit → session is created; place submission fails silently
