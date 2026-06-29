# PLAN Phase 1 — Active Session API (`current` / `scheduled`)

> **Goal:** Change `GET /api/sessions/active` to split enrollment into `current` and `scheduled` using a date/time gate.
>
> **Status:** 🔲 Pending
>
> **Depends on:** [Phase 0](./PLAN_phase_0_qm_session_docs.md)
>
> **Next:** [Phase 2 — Types](./PLAN_phase_2_qm_session_types.md)

---

## File

`apps/client/src/app/api/sessions/active/route.ts`

---

## Current behavior (bug)

```typescript
// Returns single field — no date/time gate
{ active: ActiveSessionSummary | null }
```

Selection logic (unchanged intent):
1. Filter registrations: `accepted` | `waitlisted` | `reserved`, not `exited`, session `open` | `active`
2. Sort: prefer DB `active` → higher `player_status` → most recent `dateTime`
3. Return best as `active`

**Problem:** Future `open` session immediately becomes `active` in API response.

---

## Target behavior

```typescript
{ current: ActiveSessionSummary | null, scheduled: ActiveSessionSummary | null }
```

After picking `best` registration (same sort as today):

```typescript
function isCurrentSession(
  session: { status: string; dateTime: Date },
  now = new Date(),
): boolean {
  if (session.status === "active") return true;
  if (session.status === "open" && session.dateTime.getTime() <= now.getTime()) {
    return true;
  }
  return false;
}
```

| `isCurrentSession` | Response |
|--------------------|----------|
| `true` | `{ current: summary, scheduled: null }` |
| `false` | `{ current: null, scheduled: summary }` |
| no registrations | `{ current: null, scheduled: null }` |

Only **one** of `current` / `scheduled` is non-null (best enrollment classified, not two separate sessions).

---

## Implementation steps

### 1. Add `isCurrentSession` helper
Place above `toActiveSessionSummary` in `route.ts`.

### 2. Include `dateTime` in Prisma query
Already available on `session.dateTime` — ensure `toActiveSessionSummary` receives and maps it (Phase 2 adds field to type).

### 3. Update `toActiveSessionSummary`
Add parameter / read `session.dateTime` and include in summary:
```typescript
dateTime: reg.session.dateTime.toISOString(),
```

### 4. Replace empty responses
```typescript
function emptyResponse(): ActiveSessionResponse {
  return { current: null, scheduled: null };
}
```
Use for: zero registrations, missing `best`, success paths.

### 5. Classify best registration
```typescript
const summary = toActiveSessionSummary(best, profile.id);
const response = isCurrentSession(best.session)
  ? { current: summary, scheduled: null }
  : { current: null, scheduled: summary };
```

### 6. Breaking change note
Any client reading `active` will break until Phase 4–5. Ship Phases 1–2 together or feature-flag.

---

## API contract

### Request
`GET /api/sessions/active` — auth required

### Response 200
```json
{
  "current": {
    "sessionId": "uuid",
    "title": "Saturday Smash",
    "isOwner": true,
    "clubName": null,
    "location": "Cebu Sports Center",
    "dateTime": "2026-06-29T06:00:00.000Z",
    "status": "open",
    "playerStatus": "not_arrived",
    "admissionStatus": "accepted",
    "courtHint": null,
    "href": "/find-sessions/uuid"
  },
  "scheduled": null
}
```

### Response 401
`{ "error": "Unauthorized" }`

---

## Test matrix

| DB status | dateTime | Expected bucket |
|-----------|----------|-----------------|
| `open` | +2 hours | `scheduled` |
| `open` | −1 hour | `current` |
| `active` | +2 hours (edge) | `current` (DB active wins) |
| `open` | now (exact) | `current` |
| no registration | — | both null |

### Priority unchanged
User with DB `active` session tomorrow **and** `open` session today → `active` wins sort → `current`.

---

## Acceptance criteria

- [ ] Response shape is `{ current, scheduled }` never `{ active }`
- [ ] Future `open` enrollment → `scheduled` only
- [ ] Past `open` or DB `active` → `current` only
- [ ] `dateTime` included in summary ISO string
- [ ] Sort/priority logic unchanged from current route
- [ ] 401/500 behavior unchanged

---

## Manual test

1. Create Quick Session with date = tomorrow → `curl /api/sessions/active` → `scheduled` populated, `current` null
2. Create Quick Session with date = today, time = 1 hour ago → `current` populated
3. Start session in QM console (DB `active`) → `current` with `status: "active"`
