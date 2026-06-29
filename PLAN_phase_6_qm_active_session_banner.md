# PLAN Phase 6 — ActiveSessionBanner Verification

> **Goal:** Confirm banner only appears for `current` sessions; update stories for new type shape.
>
> **Status:** 🔲 Pending
>
> **Depends on:** [Phase 5](./PLAN_phase_5_qm_dashboard_client.md)

---

## Files

| File | Action |
|------|--------|
| `apps/client/src/components/modules/dashboard/active-session-banner/ActiveSessionBanner.tsx` | **No prop changes** — gate is upstream |
| `apps/client/src/components/modules/dashboard/active-session-banner/ActiveSessionBanner.stories.tsx` | Add `dateTime` to mocks |
| `apps/client/src/components/modules/dashboard/already-in-session-dialog/AlreadyInSessionDialog.stories.tsx` | Add `dateTime` to mocks |

---

## Component: no logic change

`ActiveSessionBanner` receives `session: ActiveSessionSummary` and renders:
- `LIVE` when `session.status === "active"`
- `IN QUEUE` when `session.status === "open"`

**Contract:** Parent (`DashboardClient`) passes **only** `current` — never `scheduled`.

Optional future enhancement (not this phase):
- Show "Starts at …" subtitle when we add a `ScheduledSessionBanner` — **out of scope**

---

## Verification checklist

- [ ] `DashboardClient` passes `current` not `enrolled` to banner
- [ ] `scheduled` enrollment never reaches `ActiveSessionBanner`
- [ ] Banner `href` / `onNavigate` still uses `/find-sessions/[id]`

---

## Story updates

### `ActiveSessionBanner.stories.tsx`

Add `dateTime` to both mocks:

```typescript
const liveSession: ActiveSessionSummary = {
  // ...existing fields
  dateTime: new Date().toISOString(),
  status: "active",
};

const queueSession: ActiveSessionSummary = {
  // ...existing fields
  dateTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  status: "open",
};
```

### `AlreadyInSessionDialog.stories.tsx`

```typescript
const activeSession: ActiveSessionSummary = {
  // ...existing fields
  dateTime: new Date().toISOString(),
};
```

Consider adding story `ScheduledEnrollment` using future `dateTime` — dialog copy is the same (enrolled in another session).

---

## Acceptance criteria

- [ ] Stories compile with `dateTime` field
- [ ] No banner rendered in dashboard for scheduled-only state (manual QA via Phase 5)
- [ ] `ActiveSessionBanner.tsx` diff is zero or comment-only

---

## Regression checks

| Session passed | Expected label |
|----------------|----------------|
| `status: "active"` | `LIVE` |
| `status: "open"` (current) | `IN QUEUE` |

Scheduled sessions must never be passed — if they are, that is a Phase 5 bug.
