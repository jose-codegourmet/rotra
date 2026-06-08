# Phase 3 — Quick Session CTA

**Epic:** Session Discovery Dashboard  
**Prerequisite:** [`PLAN_phase_0_foundation.md`](PLAN_phase_0_foundation.md) (types/API); Phase 1a layout shell  
**Next phase:** [`PLAN_phase_4_active_session_guard.md`](PLAN_phase_4_active_session_guard.md)  
**Estimated effort:** 2–3 days

---

## Objective

Add the bottom-left **START QUICK SESSION** pill button from the design mockup. Tapping opens a sheet/dialog to configure and create a player-organized session. On success, navigate to the new session. Phase 4 will gate this when the user is already in an active queue.

---

## UX Spec (from mockup)

### Collapsed button (default)

Position: `absolute bottom-10 left-10 z-30`

```
┌──────────────────────────────────────────────────┐
│  ( + )  INSTANT QUEUE                            │
│         START QUICK SESSION                      │
└──────────────────────────────────────────────────┘
```

- Pill shape: `rounded-full`
- Left: 56px gradient circle (`from-primary to-primary-container`) with `+` icon
- Right: two-line label stack
  - Line 1: `INSTANT QUEUE` — `text-[10px] uppercase tracking-[0.2em] text-primary-container`
  - Line 2: `START QUICK SESSION` — `text-sm font-black tracking-tight`
- Container: `bg-surface-container-lowest border border-primary-container/20`
- Shadow: `shadow-[0_0_40px_rgba(0,255,136,0.15)]`
- Hover: expand right padding, background shifts to `primary-container`, text to `on-primary-fixed`

### Expanded hover (desktop)

- `hover:pr-8` — reveals arrow icon on right
- Arrow: `arrow_forward_ios` / Lucide `ChevronRight`

---

## Business Rules

Quick Session creates a **player-organized** session per [`08_queue_session.md`](docs/business_logic/client_app/08_queue_session.md):

| Rule | Value |
|------|-------|
| Origin | `player_organized` |
| Schedule type | `NULL` (always informal) |
| EXP / MMR | None |
| Initial status | `draft` → user confirms → `open` |
| Visibility default | `club_members` (user picks club) |
| Host | Current user (`host_id`) |

**Minimum required fields for quick create:**

| Field | UI control | Default |
|-------|------------|---------|
| Club | Select (user's clubs only) | First club or required |
| Location / venue | Text input | Empty |
| Address | Text input (optional) | Empty |
| Date | Date picker | Today |
| Start time | Time picker | Next rounded hour |
| Courts | Number stepper | 1 |
| Players per court | Select 2 or 4 | 4 |
| Match format | Select | Best of 1 |
| Score limit | Number | 21 |

**Auto-computed on save:**

- `total_slots = num_courts × players_per_court`
- `venue_lat` / `venue_lng` from geocoding address (Mapbox Geocoding API) or map pick
- `origin = player_organized`
- `schedule_type = null`

---

## Checklist

### 3.1 — QuickSessionButton

**Folder:** `apps/client/src/components/modules/dashboard/quick-session-button/`

**File:** `QuickSessionButton.tsx`

Props:

```typescript
interface QuickSessionButtonProps {
  disabled?: boolean;
  variant?: "create" | "resume"; // Phase 4 uses "resume"
  onClick: () => void;
  className?: string;
}
```

Phase 3: always `variant="create"`, `onClick` opens sheet.

**Acceptance:** Matches mockup hover/expand behavior; `disabled` reduces opacity and blocks click.

---

### 3.2 — QuickSessionSheet

**Folder:** `apps/client/src/components/modules/dashboard/quick-session-sheet/`

**File:** `QuickSessionSheet.tsx`

Reuse the existing `mobile-drawer/MobileDrawer` (bottom, mobile) and `dialog/Dialog` (desktop ≥1024px) — there is no `Sheet` primitive in this codebase. Build form fields from existing primitives: `field/Field`, `label/Label`, `input/Input`, `select/Select` or `native-select/NativeSelect`, `date-picker/DatePicker` + `calendar/Calendar`, and `button/Button`.

**Form module structure** per [`11_form_engineering_guidelines.md`](docs/techstack/11_form_engineering_guidelines.md):

```
quick-session-sheet/
├── QuickSessionSheet.tsx
├── quick-session-form-schema.ts    ← Zod schema + defaults
└── QuickSessionSheet.stories.tsx
```

**Schema (`quick-session-form-schema.ts`):**

```typescript
import { z } from "zod";

export const quickSessionFormSchema = z.object({
  clubId: z.string().uuid(),
  location: z.string().min(2).max(120),
  address: z.string().max(200).optional(),
  date: z.string(), // ISO date
  startTime: z.string(), // HH:mm
  numCourts: z.coerce.number().int().min(1).max(12),
  playersPerCourt: z.enum(["2", "4"]),
  matchFormat: z.enum(["best_of_1", "best_of_3"]),
  scoreLimit: z.coerce.number().int().min(11).max(30),
  visibility: z.enum(["club_members", "open"]).default("club_members"),
});

export type QuickSessionFormValues = z.infer<typeof quickSessionFormSchema>;
```

**Form UX:**

- Header: `START QUICK SESSION` — `headline-lg`
- Subcopy: "Set up a casual session for your club. No ranked points."
- Footer: Cancel (ghost) + `OPEN SESSION` (primary gradient)
- Loading state on submit; disable double-submit
- Inline Zod errors per field

**Acceptance:** Form validates; submits to API; closes sheet on success.

---

### 3.3 — API route: create quick session

**File:** `apps/client/src/app/api/sessions/quick/route.ts`

```typescript
// POST /api/sessions/quick
// Body: QuickSessionFormValues
// Returns: { sessionId: string, href: string }
```

Server steps:

1. Auth: resolve current profile via Supabase session
2. Validate body with Zod
3. Verify user is member of `clubId`
4. Geocode `address` or `location` → `venue_lat`, `venue_lng`, `venue_address`
5. Prisma `queueSession.create` with:
   - `origin: player_organized`
   - `scheduleType: null`
   - `status: open` (skip draft for quick flow — host is creating and opening in one step)
   - `hostId: profile.id`
   - `dateTime`: combine date + startTime in club timezone (or user local v1)
   - `totalSlots`: computed
6. Auto-register host as `accepted` with `player_status: not_arrived`
7. Return `{ sessionId, href: `/sessions/${sessionId}` }`

**RLS:** Insert allowed if user is club member.

**Acceptance:** POST creates row in `queue_sessions`; returns navigable href.

---

### 3.4 — useQuickSessionMutation hook

**File:** `apps/client/src/hooks/useQuickSessionMutation.ts`

```typescript
// useMutation POST /api/sessions/quick
// onSuccess: router.push(data.href); invalidate ['sessions', 'discover'] and ['sessions', 'active']
```

**Acceptance:** Successful create redirects to session detail page.

---

### 3.5 — Club select data

Fetch user's clubs for the select dropdown:

- Reuse existing club membership query if available
- Or server action / `GET /api/clubs/mine`
- Empty state: "Join a club first" with link to `/clubs/explore`

**Acceptance:** Only clubs the user belongs to appear in select.

---

### 3.6 — Geocoding on save

**File:** `apps/client/src/lib/geo/geocode.ts`

```typescript
export async function geocodeAddress(
  query: string,
): Promise<SessionGeoPoint & { formattedAddress: string } | null>
```

Uses Mapbox Geocoding API (`https://api.mapbox.com/geocoding/v5/mapbox.places/...`).

Called server-side in quick session API route.

**Fallback:** If geocoding fails, save session without coordinates (visible in list only, not map).

---

### 3.7 — Wire into DashboardClient

```tsx
const [sheetOpen, setSheetOpen] = useState(false);

<QuickSessionButton onClick={() => setSheetOpen(true)} />
<QuickSessionSheet open={sheetOpen} onOpenChange={setSheetOpen} />
```

Position unchanged across map/list/grid views.

---

### 3.8 — Toast feedback

On success: Sonner toast — `Session opened. Share the link with your club.`

On error: `Could not create session. Try again.`

---

### 3.9 — Storybook

| Component | Stories |
|-----------|---------|
| `QuickSessionButton` | Default, Hover, Disabled |
| `QuickSessionSheet` | Open, Submitting, Validation errors, No clubs |

---

## Session Setup Parity

Full session setup for Que Masters lives in [`docs/views/client_app/club_owner/session_setup.md`](docs/views/client_app/club_owner/session_setup.md). Quick Session is a **reduced** subset:

| Full setup field | Quick Session |
|------------------|---------------|
| Schedule type (MMR/Fun) | N/A — always informal |
| End time | Omitted (optional later) |
| Shuttle type/cost | Omitted |
| Court cost | Omitted |
| Smart monitor threshold | Default 0.90 |
| Markup | Omitted |

Que Masters creating ranked sessions should use club session setup flow, not Quick Session.

---

## Files Created / Modified (summary)

| Action | Path |
|--------|------|
| Create | `quick-session-button/QuickSessionButton.tsx` |
| Create | `quick-session-sheet/QuickSessionSheet.tsx` |
| Create | `quick-session-sheet/quick-session-form-schema.ts` |
| Create | `apps/client/src/app/api/sessions/quick/route.ts` |
| Create | `apps/client/src/hooks/useQuickSessionMutation.ts` |
| Create | `apps/client/src/lib/geo/geocode.ts` |
| Modify | `dashboard/DashboardClient.tsx` |

---

## Phase 3 Acceptance

- [ ] Quick Session pill visible bottom-left on all dashboard views
- [ ] Click opens sheet with validated form
- [ ] Submit creates `player_organized` session via API
- [ ] Geocoding populates `venue_lat`/`venue_lng` when address provided
- [ ] Success redirects to `/sessions/[id]`
- [ ] Toast confirms creation
- [ ] Storybook stories for button and sheet
- [ ] `pnpm build` passes

---

## Handoff to Phase 4

Phase 4 replaces or disables Quick Session when `useActiveSession` returns a non-null active registration. Button becomes **RESUME SESSION** linking to active session href.
