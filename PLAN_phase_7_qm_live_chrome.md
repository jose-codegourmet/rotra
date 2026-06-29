# PLAN Phase 7 — LIVE Navbar / Sidebar Chrome

> **Goal:** Document and wire LIVE indicators (QM + Player) to use `current` / `live` selectors — not raw enrollment.
>
> **Status:** 🔲 Pending (components largely **spec-only** today)
>
> **Depends on:** [Phase 4](./PLAN_phase_4_qm_active_session_hook.md)

---

## Current state

LIVE strip / pulse dot are **documented** but **not implemented** in:
- `apps/client/src/components/ui/navbar/Navbar.tsx` — no session awareness
- `apps/client/src/components/ui/sidebar/Sidebar.tsx` — no LIVE strip
- `apps/client/src/components/ui/bottom-nav/BottomNav.tsx` — no pulse dot

Docs already updated (Phase 0):
- `docs/views/client_app/components/navbar-que-master.md`
- `docs/views/client_app/components/sidebar-que-master.md`
- `docs/views/client_app/components/sidebar-player.md`

---

## Wiring rules (canonical)

| Chrome element | Selector | When visible |
|----------------|----------|--------------|
| Player Live Session strip (sidebar) | `current` | `current !== null` |
| QM Live Console strip (sidebar) | `live` or `current` | Product: strip at `current`; pulse dot at `live` only |
| QM Sessions nav pulse dot | `live` | DB `active` only |
| Player active session banner on home | `current` | Same as dashboard banner |

**Never show LIVE chrome for `scheduled` only.**

---

## Recommended implementation (when building chrome)

### 1. Create `LiveSessionStrip` component (player)

```
apps/client/src/components/modules/shell/live-session-strip/LiveSessionStrip.tsx
```

```typescript
export function LiveSessionStrip() {
  const { current } = useEnrolledSessionState();
  if (!current) return null;
  // Render strip per sidebar-player.md spec
  // onClick → router.push(current.href)
}
```

### 2. Create `LiveConsoleStrip` component (QM)

```
apps/client/src/components/modules/shell/live-console-strip/LiveConsoleStrip.tsx
```

```typescript
export function LiveConsoleStrip() {
  const { live } = useEnrolledSessionState();
  if (!live) return null;
  // Render per sidebar-que-master.md
  // onClick → router.push(`/sessions/${live.sessionId}/manage`) — verify route exists
}
```

**Route note:** Live UI is at `/find-sessions/[id]` today; QM console spec says `/sessions/:id/manage`. Align routes in a separate task.

### 3. Integrate into `Sidebar.tsx`

```typescript
<LiveSessionStrip />  // or role-conditional: player vs QM
<LiveConsoleStrip />   // QM only
<nav>...</nav>
```

### 4. Bottom nav pulse (mobile QM)

```typescript
const { live } = useEnrolledSessionState();
// Pass showLiveDot={live != null} to Sessions tab
```

---

## Phase 7 minimal deliverable (this feature)

If full chrome build is out of scope, Phase 7 **minimum**:

- [ ] `useEnrolledSessionState` exists (Phase 4)
- [ ] Docs reference correct selectors (Phase 0 — done)
- [ ] No premature LIVE UI wired to `active` / enrollment without gate
- [ ] Add TODO comment in `Sidebar.tsx` pointing to this plan

**Full chrome build** can be a follow-up ticket: `PLAN_phase_7b_live_chrome_components.md` if needed.

---

## Acceptance criteria (minimal)

- [ ] No LIVE strip shows for future scheduled Quick Session
- [ ] When chrome is built, it imports `useEnrolledSessionState` not raw `useActiveSession().data.active`
- [ ] QM pulse dot only when `live` (DB `active`)

---

## Acceptance criteria (full build)

- [ ] Player sidebar strip mounts/unmounts with `current`
- [ ] QM sidebar strip mounts with `live`
- [ ] Scheduled enrollment: no strip, no dot
- [ ] Tap strip navigates to correct session route
- [ ] Storybook stories for strips with `current` / `scheduled` mock states

---

## Test matrix

| Enrollment | DB status | dateTime | Player strip | QM strip | QM dot |
|------------|-----------|----------|--------------|----------|--------|
| yes | `open` | future | hidden | hidden | hidden |
| yes | `open` | past | shown | hidden* | hidden |
| yes | `active` | any | shown | shown | shown |

\*QM may show console shortcut at `current` before `active` — confirm with product. Docs say LIVE label only at DB `active`.

---

## Dependencies / blockers

- QM manage route may not exist at `/sessions/:id/manage` — grep before linking
- Role detection in shell: need `currentProfile` roles or session `isOwner` flag
- Multiple concurrent sessions: API returns one best — strip shows one; edge case per docs

---

## Related docs

- [`docs/views/client_app/components/sidebar-que-master.md`](./docs/views/client_app/components/sidebar-que-master.md)
- [`docs/views/client_app/components/sidebar-player.md`](./docs/views/client_app/components/sidebar-player.md)
- [`PLAN_phase_4_qm_active_session_hook.md`](./PLAN_phase_4_qm_active_session_hook.md)
