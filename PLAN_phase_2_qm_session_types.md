# PLAN Phase 2 — Session Discovery Types

> **Goal:** Update TypeScript types to match Phase 1 API response.
>
> **Status:** 🔲 Pending
>
> **Depends on:** [Phase 1](./PLAN_phase_1_qm_active_session_api.md)
>
> **Next:** [Phase 3](./PLAN_phase_3_qm_quick_session_button.md) · [Phase 4](./PLAN_phase_4_qm_active_session_hook.md) (parallel)

---

## File

`apps/client/src/types/session-discovery.ts`

---

## Current types

```typescript
export interface ActiveSessionSummary {
  sessionId: string;
  title: string | null;
  isOwner: boolean;
  clubName: string | null;
  location: string;
  status: "open" | "active";
  playerStatus: string;
  admissionStatus: string;
  courtHint: string | null;
  href: string;
}

export interface ActiveSessionResponse {
  active: ActiveSessionSummary | null;
}
```

---

## Target types

```typescript
export interface ActiveSessionSummary {
  sessionId: string;
  title: string | null;
  isOwner: boolean;
  clubName: string | null;
  location: string;
  dateTime: string; // ISO 8601 — required for "Starts at…" UI
  status: "open" | "active";
  playerStatus: string;
  admissionStatus: string;
  courtHint: string | null;
  href: string;
}

export interface ActiveSessionResponse {
  /** Operating or start time reached — dashboard "in session" */
  current: ActiveSessionSummary | null;
  /** Enrolled but dateTime in the future */
  scheduled: ActiveSessionSummary | null;
}
```

---

## Migration: find all `active` usages

Run after type change:

```bash
rg 'activeData\?\.active|ActiveSessionResponse|\.active\s*\?\?' apps/client/src
```

Expected updates (Phases 4–5):
| File | Change |
|------|--------|
| `DashboardClient.tsx` | `active` → `current` / `scheduled` / `enrolled` |
| `route.ts` | Already updated in Phase 1 |
| `useActiveSession/server.ts` | Return type auto-updates |
| `*.stories.tsx` | Add `dateTime` to mock summaries |

**Do not** leave `active` field — remove entirely to force compile errors on missed consumers.

---

## Story mock updates (Phase 3/5/6)

Every `ActiveSessionSummary` literal needs `dateTime`:

```typescript
// Live / current
dateTime: new Date().toISOString(),

// Past open (IN QUEUE)
dateTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),

// Scheduled (future)
dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
```

Files:
- `ActiveSessionBanner.stories.tsx`
- `AlreadyInSessionDialog.stories.tsx`

---

## Acceptance criteria

- [ ] `ActiveSessionResponse` has `current` and `scheduled` only
- [ ] `ActiveSessionSummary` includes `dateTime: string`
- [ ] `tsc --noEmit` passes after Phases 1–5 complete (will fail mid-migration — expected)

---

## Optional helper type (not required)

```typescript
export type EnrolledSessionBucket = "current" | "scheduled";
```

Defer unless multiple files need it.
