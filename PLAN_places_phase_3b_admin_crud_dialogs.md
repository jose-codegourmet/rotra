# Places — Phase 3b: Admin CRUD Dialogs & Mutations

**Epic:** Places (Custom Venue Management)  
**Prerequisite:** [`PLAN_places_phase_3a_admin_list_page.md`](PLAN_places_phase_3a_admin_list_page.md)  
**Next phase:** [`PLAN_places_phase_4a_client_address_pin_and_api.md`](PLAN_places_phase_4a_client_address_pin_and_api.md)  
**Estimated effort:** 1.5 days

---

## Objective

Complete the admin Places module with full write capability:

- `CreatePlaceDialog` — admin pins a new confirmed venue
- `EditPlaceDialog` — admin edits an existing place
- `ReviewPlaceDialog` — admin reviews an unreviewed user submission (confirm or delete)
- API routes: `POST /api/places`, `PATCH /api/places/[id]`, `DELETE /api/places/[id]`
- `useMutation` hooks for each operation
- `admin_action_log` entries on all writes
- Toast feedback on success and error (per Form Engineering Guidelines)
- Wire action buttons in `PlacesTable` (stub column from Phase 3a becomes functional)

---

## Coding Standards (from `docs/techstack/`)

| Rule | Source |
|------|--------|
| RHF + `zodResolver`; `Form` + `Controller` pattern (no `register` style) | `11_form_engineering_guidelines.md` |
| Schema in `schema.ts`, defaults in `default.ts` — colocated in form folder | `11_form_engineering_guidelines.md` |
| Form components expose `onSuccess` and `onError` callback props | `11_form_engineering_guidelines.md` |
| Success and error toasts on every mutation | `11_form_engineering_guidelines.md` |
| React Query `useMutation` for all writes; mutation logic stays server-side | `11_form_engineering_guidelines.md` |
| Disable submit + prevent double-submit while mutation is pending | `11_form_engineering_guidelines.md` |
| `cva` recipe in `ComponentName.variants.ts` if variants used | `12_component_creation_guidelines.md` |
| Storybook fixtures from `app/constants/`, never inlined | `12_component_creation_guidelines.md` |
| No `index.ts` barrel files | `12_component_creation_guidelines.md` |
| Tailwind tokens only | `05_coding_design_system.md` |

---

## File Structure

```
apps/admin/src/components/modules/places/
├── create-place-dialog/
│   ├── CreatePlaceDialog.tsx        ← RHF form, AddressPinField, onSuccess/onError props
│   ├── CreatePlaceDialog.stories.tsx
│   ├── schema.ts                   ← zod schema + CreatePlaceFormValues type
│   └── default.ts                  ← defaultCreatePlaceValues() factory
├── edit-place-dialog/
│   ├── EditPlaceDialog.tsx
│   ├── EditPlaceDialog.stories.tsx
│   ├── schema.ts                   ← zod schema + EditPlaceFormValues type
│   └── default.ts                  ← defaultEditPlaceValues(place) factory
└── review-place-dialog/
    ├── ReviewPlaceDialog.tsx        ← No form — confirm/delete action buttons only
    └── ReviewPlaceDialog.stories.tsx

apps/admin/src/app/api/places/
├── route.ts                        ← GET (Phase 3a) + POST (this phase)
└── [id]/
    └── route.ts                    ← PATCH + DELETE

apps/admin/src/hooks/
├── usePlaces.ts                    ← already exists from Phase 3a
└── usePlacesMutations.ts           ← useCreatePlace, useEditPlace, useConfirmPlace, useDeletePlace
```

---

## Form File Naming Convention

Per `docs/techstack/11_form_engineering_guidelines.md`, files **MUST** be named `schema.ts` and `default.ts` inside the form's folder — **not** `create-place-schema.ts` or `create-place-defaults.ts`. The folder name already provides the context:

```
create-place-dialog/schema.ts    ✓ correct
create-place-dialog/create-place-schema.ts    ✗ wrong
```

---

## CreatePlaceDialog

### `schema.ts`

```ts
// apps/admin/src/components/modules/places/create-place-dialog/schema.ts
import { z } from "zod";

export const createPlaceSchema = z.object({
  name:        z.string().min(2, "Name is required").max(120),
  description: z.string().max(500).optional(),
  phone:       z.string().max(30).optional(),
  website:     z.string().url("Enter a valid URL").optional().or(z.literal("")),
  location: z.object({
    name:      z.string(),        // internal — form's name field is source of truth
    address:   z.string().min(5, "Pick a location on the map"),
    latitude:  z.number(),
    longitude: z.number(),
  }),
});

export type CreatePlaceFormValues = z.infer<typeof createPlaceSchema>;
```

### `default.ts`

```ts
// apps/admin/src/components/modules/places/create-place-dialog/default.ts
import type { CreatePlaceFormValues } from "./schema";

export function defaultCreatePlaceValues(): CreatePlaceFormValues {
  return {
    name:        "",
    description: "",
    phone:       "",
    website:     "",
    location: {
      name:      "",
      address:   "",
      latitude:  10.3157,  // Cebu City default
      longitude: 123.8854,
    },
  };
}
```

### `CreatePlaceDialog.tsx` contract

```ts
interface CreatePlaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;     // required per Form Engineering Guidelines
  onError: (error: unknown) => void;
}
```

Behavior:
- `useForm` with `zodResolver(createPlaceSchema)` and `defaultValues: defaultCreatePlaceValues()`
- `AddressPinField` is dynamically imported with `ssr: false` (path: `@/components/ui/address-pin-field/AddressPinField`)
- On submit: calls `useCreatePlace` mutation → success toast + `onSuccess()` + dialog closes
- On error: error toast + `onError(error)` + form preserved
- Submit button disabled while `isPending`; no double-submit

---

## EditPlaceDialog

### `schema.ts`

```ts
// edit-place-dialog/schema.ts
import { createPlaceSchema } from "../create-place-dialog/schema";
import { z } from "zod";

// All fields optional at the top level for PATCH semantics
export const editPlaceSchema = createPlaceSchema;  // same shape; PATCH sends full object
export type EditPlaceFormValues = z.infer<typeof editPlaceSchema>;
```

### `default.ts`

```ts
// edit-place-dialog/default.ts
import type { PlaceRow } from "@/components/modules/places/places-table/PlacesTable";
import type { EditPlaceFormValues } from "./schema";

export function defaultEditPlaceValues(place: PlaceRow): EditPlaceFormValues {
  return {
    name:        place.name,
    description: place.description ?? "",
    phone:       place.phone ?? "",
    website:     place.website ?? "",
    location: {
      name:      place.name,
      address:   place.address,
      latitude:  place.latitude,
      longitude: place.longitude,
    },
  };
}
```

### `EditPlaceDialog.tsx` contract

```ts
interface EditPlaceDialogProps {
  place: PlaceRow;            // used to populate defaultValues
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onError: (error: unknown) => void;
}
```

Same form behavior as Create, pre-populated via `defaultEditPlaceValues(place)`. Submits to `PATCH /api/places/[id]`.

---

## ReviewPlaceDialog

No form — informational display + two action buttons only.

```ts
interface ReviewPlaceDialogProps {
  place: PlaceRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmSuccess: () => void;
  onDeleteSuccess: () => void;
}
```

Displays:
- Place name, address, coordinates
- Submitted by (player display name) + submitted at date
- Two actions: **Confirm** (green) and **Delete** (destructive red)
- Both buttons disabled while their respective mutation is pending

Confirm → calls `useConfirmPlace` → success toast "Place confirmed" → `onConfirmSuccess()`  
Delete → calls `useDeletePlace` → success toast "Place deleted" → `onDeleteSuccess()`

---

## Mutation Hooks — `usePlacesMutations.ts`

**File:** `apps/admin/src/hooks/usePlacesMutations.ts`

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/api/keys";

export function useCreatePlace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePlaceMutationPayload) => { /* POST /api/places */ },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.places() });
      // Toast: "Place created successfully"
    },
    onError: () => {
      // Toast: "Failed to create place"
    },
  });
}

export function useEditPlace() { /* PATCH /api/places/[id] */ }
export function useConfirmPlace() { /* PATCH /api/places/[id] with status: "confirmed" */ }
export function useDeletePlace() { /* DELETE /api/places/[id] */ }
```

All four mutations invalidate `QUERY_KEYS.places()` on success, triggering `PlacesClient` to refetch.

---

## API Routes

### `POST /api/places` (add to existing `route.ts`)

```ts
// Body: { name, address, latitude, longitude, description?, phone?, website? }
// Sets: status = "confirmed", reviewed_by = adminId, reviewed_at = now(), submitted_by = null
// admin_action_log: action = "place_created", entity_type = "place", entity_id = newPlace.id
```

### `PATCH /api/places/[id]`

```ts
// apps/admin/src/app/api/places/[id]/route.ts
// Body: partial place fields OR { status: "confirmed" } for review confirmation
// If status changes unreviewed → confirmed: set reviewed_by, reviewed_at
// admin_action_log:
//   - Full edit: action = "place_updated", before_value = { name, address, ... }
//   - Confirm only: action = "place_confirmed", before_value = { status: "unreviewed" }
```

### `DELETE /api/places/[id]`

```ts
// Hard delete — unreviewed submissions have no meaningful data worth archiving
// admin_action_log: action = "place_deleted", before_value = { name, status }
```

All three routes:
1. Verify admin JWT claim
2. Use service role Prisma client
3. Write to `admin_action_log`

---

## admin_action_log Entries

| Action | Trigger | `before_value` | `after_value` |
|--------|---------|----------------|---------------|
| `place_created` | Admin creates via CreatePlaceDialog | `null` | `{ name, address, lat, lng }` |
| `place_updated` | Admin edits via EditPlaceDialog | `{ name, address, ... }` | updated fields |
| `place_confirmed` | Admin confirms an unreviewed submission | `{ status: "unreviewed" }` | `{ status: "confirmed" }` |
| `place_deleted` | Admin deletes any place | `{ name, status }` | `null` |

Use existing `AdminActionLog` Prisma model. `entity_type = "place"`, `entity_id = places.id`.

---

## Wiring PlacesTable Action Buttons

Update `PlacesClient.tsx` to pass handlers to `PlacesTable`:

```tsx
<PlacesTable
  data={filtered}
  onEdit={(place) => { setEditTarget(place); setEditOpen(true); }}
  onConfirm={(place) => { setReviewTarget(place); setReviewOpen(true); }}
  onDelete={(place) => { setReviewTarget(place); setDeleteOpen(true); }}
/>
```

Also enable the "Add Place" button (disabled in Phase 3a) to open `CreatePlaceDialog`.

---

## Storybook Stories

Stories for all three dialogs import from `apps/admin/src/constants/places-mocks.ts`:

- `CreatePlaceDialog.stories.tsx` — default empty state
- `EditPlaceDialog.stories.tsx` — pre-populated with `MOCK_PLACE_CONFIRMED`
- `ReviewPlaceDialog.stories.tsx` — shows `MOCK_PLACE_UNREVIEWED` submission details

No fixture objects declared inline in story files.

---

## Docs

### Create
- `docs/business_logic/admin_app/12_places_management.md` — full: access model, create flow, review flow, audit log, toast requirements
- Update `docs/views/admin_app/places.md` — add dialog sections: Create, Edit, Review

### Update
- `docs/business_logic/admin_app/README.md` — finalize entry: `12_places_management.md → Places Management`

---

## Checklist

### API routes
- [ ] `POST /api/places` added to `apps/admin/src/app/api/places/route.ts`
- [ ] `apps/admin/src/app/api/places/[id]/route.ts` — PATCH + DELETE
- [ ] All routes verify admin JWT claim
- [ ] All routes use service role Prisma client
- [ ] `admin_action_log` entries on all writes (create, update, confirm, delete)

### Mutation hooks
- [ ] Create `apps/admin/src/hooks/usePlacesMutations.ts`
- [ ] `useCreatePlace` — POST, invalidates, success/error toast
- [ ] `useEditPlace` — PATCH, invalidates, success/error toast
- [ ] `useConfirmPlace` — PATCH with status=confirmed, invalidates, success/error toast
- [ ] `useDeletePlace` — DELETE, invalidates, success/error toast

### CreatePlaceDialog
- [ ] `create-place-dialog/schema.ts` — `createPlaceSchema` + `CreatePlaceFormValues`
- [ ] `create-place-dialog/default.ts` — `defaultCreatePlaceValues()`
- [ ] `create-place-dialog/CreatePlaceDialog.tsx` — RHF, `AddressPinField` dynamic import, `onSuccess`/`onError` props
- [ ] `create-place-dialog/CreatePlaceDialog.stories.tsx` — imports from `@/constants/places-mocks`
- [ ] Submit button disabled while `isPending`; double-submit prevented
- [ ] Success toast shown on create; error toast shown on failure
- [ ] `AddressPinField` dynamic import path references file (`/AddressPinField`), not folder

### EditPlaceDialog
- [ ] `edit-place-dialog/schema.ts` — `editPlaceSchema` + `EditPlaceFormValues`
- [ ] `edit-place-dialog/default.ts` — `defaultEditPlaceValues(place)`
- [ ] `edit-place-dialog/EditPlaceDialog.tsx` — pre-populated RHF, `AddressPinField` dynamic import, `onSuccess`/`onError` props
- [ ] `edit-place-dialog/EditPlaceDialog.stories.tsx`
- [ ] Submit button disabled while `isPending`

### ReviewPlaceDialog
- [ ] `review-place-dialog/ReviewPlaceDialog.tsx` — info display + confirm/delete buttons, no form
- [ ] `review-place-dialog/ReviewPlaceDialog.stories.tsx`
- [ ] Both buttons disabled while their mutation is pending
- [ ] Confirm → success toast "Place confirmed"
- [ ] Delete → success toast "Place deleted"

### PlacesClient wiring
- [ ] "Add Place" button opens `CreatePlaceDialog`
- [ ] `PlacesTable` receives `onEdit`, `onConfirm`, `onDelete` handlers
- [ ] `CreatePlaceDialog`, `EditPlaceDialog`, `ReviewPlaceDialog` are dynamically imported (`ssr: false`) since they contain `AddressPinField`

### Component checklist (per `12_component_creation_guidelines.md`)
- [ ] All components are functional components
- [ ] Props types declared inside `.tsx`, not in `.types.ts`
- [ ] `cn` from `@/lib/utils` used for class merging
- [ ] No `index.ts` files in any of the dialog folders
- [ ] Storybook fixtures from `@/constants/places-mocks`, never inlined
- [ ] No hardcoded hex values

### Form Engineering checklist (per `11_form_engineering_guidelines.md`)
- [ ] Uses RHF `Form` + `Controller` pattern (no `register` style)
- [ ] Schema in `schema.ts`, defaults in `default.ts` — same folder as component
- [ ] `onSuccess` and `onError` callback props on all form dialogs
- [ ] Toasts shown for success and error on every mutation
- [ ] Submit button disabled + double-submit blocked while pending
- [ ] Mutation business logic is server-side (API routes), not in client components

### Docs
- [ ] Create `docs/business_logic/admin_app/12_places_management.md`
- [ ] Update `docs/views/admin_app/places.md` — add Create/Edit/Review dialog sections
- [ ] Update `docs/business_logic/admin_app/README.md`

### Validation
- [ ] Admin creates a place → appears in "Confirmed" tab, success toast shown
- [ ] Admin edits a place → details updated, success toast shown
- [ ] Admin confirms an unreviewed place → moves to "Confirmed" tab, `admin_action_log` updated
- [ ] Admin deletes a place → removed from list, success toast shown
- [ ] All four actions appear in `admin_action_log` with correct `before_value`/`after_value`
- [ ] "Unreviewed" badge count decrements after a review action
