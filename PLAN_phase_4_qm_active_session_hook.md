# PLAN Phase 4 — useActiveSession Hook & Selectors

> **Goal:** Consume new API shape and expose ergonomic selectors for dashboard and future LIVE chrome.
>
> **Status:** 🔲 Pending
>
> **Depends on:** [Phase 2](./PLAN_phase_2_qm_session_types.md)
>
> **Next:** [Phase 5](./PLAN_phase_5_qm_dashboard_client.md) · [Phase 7](./PLAN_phase_7_qm_live_chrome.md)

---

## Files

| File | Action |
|------|--------|
| `apps/client/src/hooks/useActiveSession/client.ts` | Add `useEnrolledSessionState` |
| `apps/client/src/hooks/useActiveSession/server.ts` | No logic change — types flow from Phase 2 |
| `apps/client/src/hooks/useActiveSession/queryKey.ts` | No change |

---

## `useActiveSession` (keep as-is)

Thin React Query wrapper — returns `{ data: ActiveSessionResponse | undefined, ... }`.

```typescript
export function useActiveSession() {
  return useQuery({
    queryKey: activeSessionQueryKey,
    queryFn: fetchActiveSession,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    staleTime: 10_000,
  });
}
```

Invalidation sites (unchanged key):
- `useQuickSessionMutation.ts`
- `useLeaveSessionMutation/client.ts`
- `useCloseSessionMutation/client.ts`

---

## New: `useEnrolledSessionState`

Add to `client.ts`:

```typescript
export function useEnrolledSessionState(): {
  current: ActiveSessionSummary | null;
  scheduled: ActiveSessionSummary | null;
  enrolled: ActiveSessionSummary | null;
  live: ActiveSessionSummary | null;
} {
  const { data } = useActiveSession();
  const current = data?.current ?? null;
  const scheduled = data?.scheduled ?? null;
  const enrolled = current ?? scheduled;
  const live = current?.status === "active" ? current : null;
  return { current, scheduled, enrolled, live };
}
```

### Selector semantics

| Field | Use for |
|-------|---------|
| `current` | `ActiveSessionBanner`, `resume` button, player LIVE strip |
| `scheduled` | `scheduled` button |
| `enrolled` | Join guard (`AlreadyInSessionDialog`), hide create sheet |
| `live` | QM LIVE strip / pulse dot — **DB `active` only** |

---

## Why not put gate logic client-side?

Server is source of truth. Client selectors only derive convenience values. Optional: client could re-check `dateTime` for instant UI between refetches — **defer** unless flicker reported (30s refetch interval).

---

## Acceptance criteria

- [ ] `fetchActiveSession` typed as `ActiveSessionResponse` with `current`/`scheduled`
- [ ] `useEnrolledSessionState` exported from `client.ts`
- [ ] `enrolled` = `current ?? scheduled`
- [ ] `live` = `current` only when `status === "active"`
- [ ] No consumers updated yet (Phase 5)

---

## Future consumers (Phase 7)

```typescript
// sidebar-que-master.tsx (when built)
const { live } = useEnrolledSessionState();
if (!live) return null; // no LIVE strip
```

```typescript
// sidebar-player.tsx (when built)
const { current } = useEnrolledSessionState();
if (!current) return null;
```
