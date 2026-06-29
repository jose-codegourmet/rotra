# PLAN Phase 5 — DashboardClient Wiring

> **Goal:** Wire `current` / `scheduled` / `enrolled` into `/dashboard` — the primary user-facing fix.
>
> **Status:** ✅ Done
>
> **Depends on:** [Phase 3](./PLAN_phase_3_qm_quick_session_button.md), [Phase 4](./PLAN_phase_4_qm_active_session_hook.md)
>
> **Next:** [Phase 6](./PLAN_phase_6_qm_active_session_banner.md)

---

## File

`apps/client/src/app/(protected)/dashboard/DashboardClient.tsx`

---

## Current code (bug locations)

```typescript
const { data: activeData } = useActiveSession();
const active = activeData?.active ?? null;
```

```typescript
// Banner — shows for any enrollment
{active ? <ActiveSessionBanner session={active} ... /> : null}

// Button — resume vs create only
<QuickSessionButton
  variant={active ? "resume" : "create"}
  onClick={() => active ? router.push(active.href) : setSheetOpen(true)}
/>

// Sheet hidden when enrolled
{!active ? <QuickSessionSheet ... /> : null}

// Join guard
if (active && active.sessionId !== sessionId) { setBlockedDialogOpen(true); }

// Dialog
{active ? <AlreadyInSessionDialog activeSession={active} ... /> : null}
```

Also remove debug log:
```typescript
console.log("[+] DEBUG", { data, effectiveCenter, filters });
```

---

## Target code

### Import
```typescript
import { useEnrolledSessionState } from "@/hooks/useActiveSession/client";
```

### State derivation
```typescript
const { current, scheduled, enrolled } = useEnrolledSessionState();
```

### ActiveSessionBanner — `current` only
```typescript
{current ? (
  <ActiveSessionBanner
    session={current}
    onNavigate={() => router.push(current.href)}
    className="absolute top-4 left-4 right-4 z-[25]"
  />
) : null}
```

### QuickSessionButton — three-way variant
```typescript
<QuickSessionButton
  variant={current ? "resume" : scheduled ? "scheduled" : "create"}
  onClick={() => {
    if (current) router.push(current.href);
    else if (scheduled) router.push(scheduled.href);
    else setSheetOpen(true);
  }}
/>
```

### QuickSessionSheet — hidden when any enrollment
```typescript
{!enrolled ? (
  <QuickSessionSheet open={sheetOpen} onOpenChange={setSheetOpen} />
) : null}
```

### Join guard — `enrolled` (blocks for scheduled too)
```typescript
const handleJoinSession = useCallback(async (sessionId: string) => {
  if (enrolled && enrolled.sessionId !== sessionId) {
    setBlockedDialogOpen(true);
    return;
  }
  // ... rest unchanged
}, [router, enrolled]);
```

### AlreadyInSessionDialog — `enrolled`
```typescript
{enrolled ? (
  <AlreadyInSessionDialog
    open={blockedDialogOpen}
    onOpenChange={setBlockedDialogOpen}
    activeSession={enrolled}
    onGoToSession={() => {
      setBlockedDialogOpen(false);
      router.push(enrolled.href);
    }}
  />
) : null}
```

---

## Behavior matrix

| `current` | `scheduled` | Banner | Button variant | Sheet | Join other session |
|-----------|-------------|--------|----------------|-------|-------------------|
| null | null | hidden | `create` | open | allowed |
| set | null | shown | `resume` | hidden | blocked |
| null | set | hidden | `scheduled` | hidden | blocked |

`current` and `scheduled` both non-null should not occur from API (single best enrollment).

---

## Implementation steps

1. Replace `useActiveSession` with `useEnrolledSessionState`
2. Rename all `active` references per matrix above
3. Remove `console.log` debug block
4. Verify `QuickSessionSheet` not mountable while enrolled (can't create second session)
5. Run `tsc --noEmit` in `apps/client`

---

## Acceptance criteria

- [x] Future Quick Session → `scheduled` button, no banner
- [x] Past `open` session → banner (`IN QUEUE`) + `resume`
- [x] DB `active` → banner (`LIVE`) + `resume`
- [x] Join elsewhere while scheduled → dialog blocks
- [x] No `active` field references remain in file
- [x] Debug `console.log` removed

---

## Manual QA script

1. Log in as QM/CO
2. Create Quick Session tomorrow → return to dashboard → expect **UPCOMING SESSION**
3. Tap button → navigates to `/find-sessions/[id]`
4. Return to dashboard → still scheduled variant, no banner
5. Try Join on map pin → **AlreadyInSessionDialog**
6. Leave session (if leave flow works) → **START QUICK SESSION** returns
7. Create session with start time 1h ago → **RESUME SESSION** + banner

---

## Out of scope

- Showing countdown on scheduled button
- Auto-refresh when `dateTime` crosses now (relies on 30s refetch or navigation)
