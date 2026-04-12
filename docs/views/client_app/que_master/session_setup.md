# View: Session Setup

## Purpose
The form used to configure and create a queue session. **Club queue** flows (this view, when opened by **Que Master** or **Club Owner**) require **Schedule type**: **MMR (competitive)** vs **Fun Games (no points)**. **Players** use the same or a sibling route for **player-organized** sessions — all shared fields except **Schedule type** (always informal / no EXP–MMR progression). Draft → open lifecycle is unchanged.

## Route
`/sessions/new` (create) or `/sessions/:id/edit` (edit existing draft) — may include query or club context to distinguish player-organized vs club queue.

## Roles
**Que Master** and **Club Owner** for **club queue** (full form including Schedule type). **Player** for **player-organized** subset (no Schedule type).

---

## Layout
Full-screen scrollable form with a header bar and a sticky bottom save/publish bar. Grouped into logical sections separated by dividers. No tabs — single long scroll.

```
┌──────────────────────────────────────┐
│  ← Back         Create Session       │  ← Header bar
├──────────────────────────────────────┤
│                                      │
│  ── Venue & Time ─────────────────   │  ← Section header
│  Venue Name *                        │  ← Label
│  [ __________________________ ]      │  ← Text input
│                                      │
│  Location / Address                  │
│  [ __________________________ ]      │
│                                      │
│  Date *                              │
│  [ Mar 29, 2025         📅 ]         │  ← Date picker input
│                                      │
│  Start Time *   End Time             │
│  [ 8:00 AM  ]   [ 11:00 AM ]        │  ← Time pickers (side by side)
│                                      │
│  ── Schedule type (club queue only) ─│
│  Session mode *                      │
│  ◉ MMR (competitive)                 │  ← EXP/MMR/ranked eligible
│  ○ Fun Games (no points)             │  ← No EXP/MMR; standings recorded
│  Helper: Fun still records matches   │
│  and session/club standings.         │
│                                      │
│  ── Courts & Players ──────────────  │
│  Number of Courts *                  │
│  [ 2              ─ + ]              │  ← Stepper
│                                      │
│  Players per Court *                 │
│  [ 4              ─ + ]              │  ← Stepper (default 4 for doubles)
│                                      │
│  Total Slots: 8                      │  ← Auto-computed, read-only
│                                      │
│  ── Match Format ──────────────────  │
│  Match Format *                      │
│  ◉ Best of 1   ○ Best of 3          │  ← Radio group
│                                      │
│  Score Limit per Set *               │
│  [ 21             ─ + ]              │  ← Stepper
│                                      │
│  Smart Monitoring Threshold          │
│  [ 90%            ─ + ]              │  ← Stepper (%)
│  Alert QM when score reaches X% of  │  ← Helper text
│  win condition.                      │
│                                      │
│  ── Cost & Shuttle ────────────────  │
│  Court Cost (total) *                │
│  [ ₱ _______________________  ]      │  ← Number input with currency prefix
│                                      │
│  Shuttle Type                        │
│  [ Feather ▾ ]                       │  ← Dropdown
│                                      │
│  Shuttle Brand                       │
│  [ __________________________ ]      │
│                                      │
│  Shuttle Cost per Tube               │
│  [ ₱ _______________________  ]      │
│                                      │
│  Markup per Player                   │
│  [ ₱ _______________________  ]      │  ← Optional organizer margin
│                                      │
│  Estimated fee per player: ₱ 120     │  ← Auto-computed, read-only, color-accent
│                                      │
│  ── Visibility ────────────────────  │
│  Who can join?                       │
│  ◉ Club Members Only                 │
│  ○ Open via Link / QR                │
│                                      │
└──────────────────────────────────────┘
├──────────────────────────────────────┤
│  [ SAVE DRAFT ]   [ PUBLISH SESSION ]│  ← Sticky bottom bar
└──────────────────────────────────────┘
```

---

## Components

### Header Bar
- Back arrow → triggers Discard Draft confirm modal if form has unsaved changes
- Title: `Create Session` (new) or `Edit Session` (draft edit) — `text-heading`, centered
- Background: `color-bg-base`, border-bottom: 1px solid `color-border`
- Height: 56px

### Section Headers
- Text: e.g. `Venue & Time`, `Courts & Players` — `text-small`, `color-text-secondary`, uppercase
- Separator line extends to the right
- Margin-top: `space-8` (32px)

### Field Labels
- `text-small` (13px), `color-text-secondary`
- Required fields: `*` suffix in `color-error`

### Text Inputs
- Height: 48px, `color-bg-elevated`, `radius-md`
- Border: 1.5px solid `color-border` (default), `color-accent` (focus), `color-error` (error)
- `text-body`, `color-text-primary`
- Placeholder: `color-text-secondary`

### Date Picker Input
- Triggers native OS date picker on tap
- Display format: `Mar 29, 2025`
- Calendar icon right-aligned inside field: 20px stroke, `color-text-secondary`

### Time Picker Inputs
- Two inputs side by side (Start / End), equal width with `space-3` gap
- Tap triggers native OS time picker

### Steppers (Number of Courts, Players per Court, Score Limit, Smart Monitoring %)
- Layout: label + minus button + value + plus button
- Minus/plus: 32×32px icon buttons, `color-bg-elevated`, `radius-md`
- Value display: `text-title` (22px), `color-text-primary`, centered
- Min/max constraints enforced (e.g. courts: 1–20; players per court: 2 or 4; score limit: 11–30)

### Total Slots (Auto-computed)
- Text: `Total Slots: [N]` — `text-body`, `color-text-secondary`; value in `color-accent`
- Formula: `players_per_court × number_of_courts`
- Updates live as steppers change

### Radio Groups (Match Format, Visibility)
- Each option: 48px touch target row
- Radio circle: 20px, `color-accent` when selected, `color-border` when unselected
- Label: `text-body`, `color-text-primary`

### Dropdown (Shuttle Type)
- Displays selected option with chevron-down icon
- Taps → opens native picker or in-app bottom sheet selector
- Options: Feather / Plastic

### Currency Inputs
- `₱` prefix label left-aligned inside the field, `text-body`, `color-text-secondary`
- Numeric keyboard on focus
- Value: `text-body`, `color-text-primary`

### Estimated Fee Per Player (Auto-computed)
- Text: `Estimated fee per player: ₱[amount]` — `text-body`; value in `color-accent`, Bold
- Formula: `(court_cost + (shuttles_used × shuttle_cost_per_tube) + markup) ÷ total_slots`
- Note below: `text-micro`, `color-text-disabled`: `Final cost may vary based on shuttles used.`
- Updates live as cost fields change

### Sticky Bottom Bar
- Background: `color-bg-surface`, border-top: 1px solid `color-border`
- Padding: `space-4`
- Two buttons side by side:
  - `SAVE DRAFT` — secondary outline button, left (40% width)
  - `PUBLISH SESSION` — primary `color-accent` button, right (60% width)
- `PUBLISH SESSION` is disabled until all required fields are valid

---

## States

### Empty Form
All fields empty, `PUBLISH SESSION` disabled, `SAVE DRAFT` enabled.

### Partially Filled
Auto-computed fields (slots, fee) update as values change. Validation errors only show after user touches a field and leaves it empty.

### Editing Draft
`SAVE DRAFT` updates the existing draft. Header title changes to `Edit Session`.

### Validation Error
- Affected input gets `color-error` border
- Inline error message below field: `text-small`, `color-error`
- e.g. `Venue name is required.`, `Score limit must be between 11 and 30.`

---

## Modals

### Discard Draft Confirm Modal
Triggered when back arrow is tapped and there are unsaved changes.

- Background: `color-bg-surface`, `radius-xl`, `shadow-modal`
- Backdrop: `rgba(0,0,0,0.6)`
- Title: `Discard Changes?` — `text-title`, `color-text-primary`
- Body: `Your session details have not been saved.` — `text-body`, `color-text-secondary`
- Actions:
  - Primary: `DISCARD` — destructive outline (`color-error` border + text)
  - Secondary: `KEEP EDITING` — `color-accent` filled (keep editing is the safer action)

---

## Responsive Layout

### Breakpoints
| Breakpoint | Layout change |
|-----------|--------------|
| Mobile < 768px | Single column scroll, sticky bottom save bar |
| Tablet 768–1023px | Single column, `max-width: 640px`, sticky bottom bar |
| Desktop ≥ 1024px | Two-column form layout; action buttons inline in header |

### Desktop (≥ 1024px)

```
┌────────────┬──────────────────────────────────────────────────┐
│  Sidebar   │  Create Session   [ SAVE DRAFT ] [ PUBLISH ]     │
│            ├──────────────────────────────────────────────────┤
│            │  LEFT COLUMN (~50%)  │  RIGHT COLUMN (~50%)      │
│            │                      │                           │
│            │  ── Venue & Time ──  │  ── Courts & Players ──   │
│            │  [venue fields]      │  [court/player steppers]  │
│            │                      │  Total Slots: 8           │
│            │  ── Match Format ──  │                           │
│            │  [format fields]     │  ── Cost & Shuttle ──     │
│            │                      │  [cost fields]            │
│            │  ── Visibility ────  │  Est. fee: ₱120           │
│            │  [visibility radio]  │                           │
└────────────┴──────────────────────┴───────────────────────────┘
```

- **Sticky bottom save bar**: Removed on desktop — `SAVE DRAFT` and `PUBLISH SESSION` buttons move to the **top-right of the page header bar** (standard primary + secondary button pairing)
- **Form sections**: Two-column layout at desktop
  - Left column: Venue & Time, Match Format, Visibility
  - Right column: Courts & Players (with Total Slots readout), Cost & Shuttle (with Est. Fee readout)
- **Section headers**: Same visual treatment, just split across columns
- **Content max-width**: `1000px` for the two-column form; columns have `space-8` gap
- **Modals**: Discard confirm renders as centered overlay (`max-width: 440px`)

### Tablet (768–1023px)
- Single column, `max-width: 640px`
- Sticky bottom bar stays

---

## Design Tokens
| Token | Usage |
|-------|-------|
| `color-bg-base` | Page background |
| `color-bg-surface` | Bottom bar |
| `color-bg-elevated` | Inputs, stepper buttons |
| `color-accent` | Published CTA, computed values, focus borders |
| `color-error` | Required indicators, validation errors |
| `color-border` | Input borders, section dividers |
| `color-text-primary` | Input values, stepper values |
| `color-text-secondary` | Labels, placeholders, section headers |
| `color-text-disabled` | Helper notes |
| `text-heading` 18px SemiBold | Header bar |
| `text-title` 22px SemiBold | Stepper values |
| `text-body` 15px | Input values, labels |
| `text-small` 13px | Field labels, validation messages |
| `text-micro` 10px | Helper notes |
| `radius-md` 10px | Inputs, stepper buttons |
