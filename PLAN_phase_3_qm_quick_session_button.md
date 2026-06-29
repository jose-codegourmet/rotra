# PLAN Phase 3 — QuickSessionButton `scheduled` Variant

> **Goal:** Add a third button variant for future enrolled sessions — muted styling, no "active session" language.
>
> **Status:** ✅ Done
>
> **Depends on:** [Phase 2](./PLAN_phase_2_qm_session_types.md)
>
> **Next:** [Phase 5](./PLAN_phase_5_qm_dashboard_client.md)

---

## Files

| File | Action |
|------|--------|
| `apps/client/src/components/modules/dashboard/quick-session-button/QuickSessionButton.tsx` | Add variant |
| `apps/client/src/components/modules/dashboard/quick-session-button/QuickSessionButton.stories.tsx` | Add `Scheduled` story |

---

## Current API

```typescript
variant?: "create" | "resume";  // default "create"
```

## Target API

```typescript
variant?: "create" | "scheduled" | "resume";  // default "create"
```

---

## Variant spec (from docs)

| Variant | Icon | Micro label | Main label | aria-label |
|---------|------|-------------|------------|------------|
| `create` | `Plus` | `SCHEDULE SESSION` | `START QUICK SESSION` | "Start a quick session" |
| `scheduled` | `Calendar` | `UPCOMING SESSION` | `VIEW SESSION` | "View your upcoming session" |
| `resume` | `Play` | `ACTIVE SESSION` | `RESUME SESSION` | "Resume your active session" |

Import: `Calendar` from `lucide-react`.

---

## Styling rules

### `create` and `resume` (unchanged)
- Border: `border-accent/20`
- Shadow: `shadow-[0_0_40px_rgba(0,255,136,0.15)]`
- Icon circle: gradient `from-accent to-accent-dim`
- Hover: `hover:bg-accent hover:pr-8`

### `scheduled` (new — muted)
- Border: `border-outline-variant/20`
- Background: `bg-bg-surface/95`
- Shadow: `shadow-md` only — **no accent glow**
- Icon circle: `bg-bg-elevated text-text-secondary` — flat, no gradient
- Hover: `hover:bg-bg-elevated hover:pr-6` — subtle, not accent fill
- Chevron: `text-text-secondary` on hover

**Rationale:** Future session must not read as LIVE/active.

---

## Implementation approach

Use a `VARIANT_CONFIG` const map:

```typescript
const VARIANT_CONFIG = {
  create: { icon: Plus, microLabel: "...", mainLabel: "...", ariaLabel: "...", muted: false },
  scheduled: { icon: Calendar, ..., muted: true },
  resume: { icon: Play, ..., muted: false },
} as const;
```

Single render path; branch on `config.muted` for classNames.

---

## Stories

Add to `QuickSessionButton.stories.tsx`:

```typescript
export const Scheduled: Story = {
  args: { variant: "scheduled", onClick: noop },
};
```

Keep existing: `Default`, `Hover`, `Disabled`, `Resume`.

---

## Acceptance criteria

- [x] Three variants render correct labels and icons
- [x] `scheduled` has no accent glow / pulse
- [x] Accessible `aria-label` per variant
- [x] Storybook `Scheduled` story added
- [x] No dashboard wiring yet (Phase 5)

---

## Out of scope

- Showing formatted `dateTime` on the button (future enhancement)
- Disabling button while loading
