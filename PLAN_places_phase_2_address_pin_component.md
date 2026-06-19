# Places — Phase 2: Address Pin Component

**Epic:** Places (Custom Venue Management)  
**Prerequisite:** [`PLAN_places_phase_1_db_migration.md`](PLAN_places_phase_1_db_migration.md)  
**Next phase:** [`PLAN_places_phase_3a_admin_list_page.md`](PLAN_places_phase_3a_admin_list_page.md)  
**Estimated effort:** 1 day

---

## Objective

Build a reusable `AddressPinField` component — a compact map-picker with geocoding search — that allows users to set a physical location by either:

1. Typing an address (Mapbox geocoding suggestions), or
2. Clicking/dragging a pin directly on a mini-map

The component is built **twice independently** — once for each app — because they have different styling systems and Tailwind configs. They share the same UX contract (props interface) but are not extracted into a shared package.

---

## Why Two Separate Instances

- The admin app has its own Tailwind config, color tokens, and component conventions
- The client app has the dark Mapbox style; admin should use a lighter, neutral style
- Sharing a component across apps via a package would introduce a `mapbox-gl` peer dependency to `packages/` and complicate SSR/bundle configs
- Copy-with-parity approach: same props interface, same internal logic, different styling

---

## Admin App: Add Mapbox Dependencies

The admin app currently has no Mapbox. Install:

```bash
pnpm --filter @rotra/admin add mapbox-gl react-map-gl
pnpm --filter @rotra/admin add -D @types/mapbox-gl
```

Add the Mapbox CSS import in the admin app's `globals.css`:

```css
@import "mapbox-gl/dist/mapbox-gl.css";
```

Add `NEXT_PUBLIC_MAPBOX_TOKEN` to `apps/admin/.env.local` (same token as client).

---

## Component Contract (both apps share this interface)

```tsx
export interface AddressPinValue {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface AddressPinFieldProps {
  value?: AddressPinValue | null;
  onChange: (value: AddressPinValue | null) => void;
  /** Optional: label shown above the field. Default: "Location" */
  label?: string;
  /** Optional: placeholder text for the search input */
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
```

---

## Component Anatomy

```
AddressPinField
├── Search input (text)
│   ├── Mapbox geocoding suggestions dropdown
│   └── Loading spinner while searching
├── Mini map (react-map-gl/mapbox, 280px tall)
│   ├── Draggable Marker (the selected pin)
│   └── Click-to-place: clicking map moves the pin
└── Cleared state: "No location set" with a "Pick on map" hint
```

### Behavior flow

1. User types in search input → debounced (300ms) → `forwardGeocode()` → suggestions dropdown
2. User selects a suggestion → pin flies to that location → `onChange` fires with geocoded values
3. User drags the pin → reverse geocode the new coordinates → update address string → `onChange` fires
4. User clicks anywhere on the mini map → pin moves to click point → reverse geocode → `onChange` fires
5. Name field is always editable independently (text input above the map, not the geocoding input)

### Note on the "name" field

The `AddressPinField` captures the venue **name** separately from the address. The address is what Mapbox returns; the name is what the human calls the place ("SM Seaside Badminton Court"). The component renders both:

```
[ Name input field      ] ← free text, controlled
[ Address search input  ] ← drives the geocoder and coordinates
[ Mini map with pin     ] ← shows current lat/lng
```

---

## File Paths

Component folders follow the ROTRA naming convention — kebab-case folder, PascalCase file, no `index.ts` barrel files. Import directly from the component file.

### Admin app

```
apps/admin/src/components/ui/address-pin-field/
├── AddressPinField.tsx              ← component + AddressPinFieldProps type
├── AddressPinField.stories.tsx      ← required; fixtures from constants (see below)
└── AddressPinField.variants.ts      ← required IF cva is used for input/map wrapper styles
```

Import as: `import { AddressPinField } from "@/components/ui/address-pin-field/AddressPinField"`

### Client app (built in Phase 4a, same structure)

```
apps/client/src/components/ui/address-pin-field/
├── AddressPinField.tsx
├── AddressPinField.stories.tsx
└── AddressPinField.variants.ts      ← required IF cva is used
```

Import as: `import { AddressPinField } from "@/components/ui/address-pin-field/AddressPinField"`

### `.variants.ts` rule

Per `docs/techstack/12_component_creation_guidelines.md`:
- **MUST** use `cva` for any component that has variants or sizes; recipe goes in `AddressPinField.variants.ts`
- If the component has no `cva` variants at all, do **not** create the file
- The `.variants.ts` exports the recipe (`addressPinFieldVariants`) and its type (`AddressPinFieldVariants`)

### Storybook mock constants

Per component creation guidelines, story fixtures **MUST** be imported from `app/constants/`, not inlined.

Create a mock fixture file:

```
apps/admin/src/constants/places-mocks.ts
```

```ts
// apps/admin/src/constants/places-mocks.ts
import type { AddressPinValue } from "@/components/ui/address-pin-field/AddressPinField";

export const MOCK_ADDRESS_PIN_VALUE: AddressPinValue = {
  name:      "SM Seaside Badminton Court",
  address:   "SM Seaside City Cebu, SRP, Cebu City, 6000 Cebu",
  latitude:  10.2841,
  longitude: 123.8607,
};
```

`AddressPinField.stories.tsx` imports from `"@/constants/places-mocks"`, never declares fixture objects inline.

---

## Mapbox Style for Admin

The client app uses the custom dark `rotra-dark-style.json`. For the admin map picker, use a lighter neutral style suitable for a data management context:

```ts
// apps/admin/src/constants/mapbox.ts
export const ADMIN_MAP_STYLE = "mapbox://styles/mapbox/light-v11";
```

Or use the Streets style (`mapbox://styles/mapbox/streets-v12`) if more road detail is preferred. Do not share the dark style with admin — it is branded for the client app experience.

---

## Reverse Geocoding Helper

Both apps need a `reverseGeocode()` helper. Add to the existing `lib/geo/geocode.ts` in each app:

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
    const data = await res.json();
    return data.features?.[0]?.place_name ?? `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}
```

---

## SSR / Dynamic Import

`AddressPinField` must be dynamically imported with `ssr: false` wherever it's used, since `mapbox-gl` requires browser APIs.

```tsx
// In the parent form component — import path references the FILE, not a folder/barrel
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

Note: the loading skeleton uses `bg-bg-elevated` (ROTRA token), not `bg-muted` (shadcn token). No hardcoded hex values.

---

## Integration with react-hook-form

The component accepts `value` / `onChange` directly, making it compatible with `Controller` from `react-hook-form`:

```tsx
<Controller
  name="location"
  control={control}
  render={({ field }) => (
    <AddressPinField
      value={field.value}
      onChange={field.onChange}
      label="Venue location"
    />
  )}
/>
```

This follows the existing Form Engineering Guidelines pattern for controlled field components.

---

## Docs

### Create

**`docs/views/client_app/components/address-pin-field.md`**

Content must cover:
- What the component does (mini map + geocoding search + draggable pin)
- Props interface (`AddressPinValue`, `AddressPinFieldProps`)
- Behavior: Mode A (text search → suggestion selected), Mode B (drag pin → reverse geocode)
- SSR note: must be dynamically imported with `ssr: false`
- Usage example with `react-hook-form` `Controller`

**`docs/views/admin_app/components/address-pin-field.md`** (create the `components/` subfolder if it doesn't exist)

Same content as above but note the admin-specific differences:
- Uses `ADMIN_MAP_STYLE` (`light-v11`) instead of the dark client style
- Lives at `apps/admin/src/components/ui/address-pin-field/AddressPinField.tsx`

---

## Checklist

### Admin app setup
- [ ] Install `mapbox-gl`, `react-map-gl`, `@types/mapbox-gl` in `apps/admin`
- [ ] Add `@import "mapbox-gl/dist/mapbox-gl.css"` to `apps/admin/src/app/globals.css`
- [ ] Add `NEXT_PUBLIC_MAPBOX_TOKEN` to `apps/admin/.env.local`
- [ ] Create `apps/admin/src/constants/mapbox.ts` with `ADMIN_MAP_STYLE`

### Shared geocoding
- [ ] Add `reverseGeocode()` helper to `apps/admin/src/lib/geo/geocode.ts` (create file)
- [ ] Add `reverseGeocode()` to existing `apps/client/src/lib/geo/geocode.ts`

### Admin component
- [ ] Create `apps/admin/src/components/ui/address-pin-field/AddressPinField.tsx` — component + `AddressPinFieldProps` type (declared in `.tsx`, not `.types.ts`)
- [ ] Create `apps/admin/src/components/ui/address-pin-field/AddressPinField.variants.ts` — only if `cva` is used; exports `addressPinFieldVariants` and `AddressPinFieldVariants`
- [ ] Create `apps/admin/src/constants/places-mocks.ts` — `MOCK_ADDRESS_PIN_VALUE` fixture
- [ ] Create `apps/admin/src/components/ui/address-pin-field/AddressPinField.stories.tsx` — imports fixtures from `@/constants/places-mocks`
- [ ] No `index.ts` — import directly from `AddressPinField.tsx`
- [ ] Uses `cn` from `@/lib/utils` for class merging
- [ ] No hardcoded hex values — Tailwind tokens only
- [ ] `React.forwardRef` not needed (no single root DOM element that callers need to ref); plain function component is correct
- [ ] Verify Storybook renders the component with a draggable pin

### Component checklist (from `12_component_creation_guidelines.md`)
- [ ] Functional component, no class components
- [ ] Props type `AddressPinFieldProps` declared inside `AddressPinField.tsx`
- [ ] `cva` recipe in `.variants.ts` if used; not inline in `.tsx`
- [ ] Stories cover default state + disabled state + pre-filled state
- [ ] Story fixtures imported from `@/constants/places-mocks`, not inlined

### Docs
- [ ] Create `docs/views/client_app/components/address-pin-field.md`
- [ ] Create `docs/views/admin_app/components/address-pin-field.md`

### Validation
- [ ] Component fires `onChange` when a suggestion is selected
- [ ] Component fires `onChange` when pin is dragged (with reverse-geocoded address)
- [ ] Component fires `onChange` when map is clicked
- [ ] Name field is editable independently without resetting lat/lng
- [ ] SSR: component renders `bg-bg-elevated` skeleton server-side, hydrates client-side
- [ ] Dynamic import path references the file (`/AddressPinField`), not a folder
- [ ] `disabled` prop locks both inputs and disables pin dragging
