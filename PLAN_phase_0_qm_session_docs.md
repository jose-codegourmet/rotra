# PLAN Phase 0 — QM Session Active State Documentation

> **Goal:** Establish canonical docs for **enrolled** vs **in session (current)** before any code changes.
>
> **Status:** ✅ Complete (verify checklist below)
>
> **Next:** [`PLAN_phase_1_qm_active_session_api.md`](./PLAN_phase_1_qm_active_session_api.md)

---

## Why docs first

The codebase had no rule that dashboard "active session" UI must respect `dateTime`. Discovery pins already distinguish `UPCOMING` vs `OPEN` via `getSessionDisplayStatus`, but `/api/sessions/active` and `DashboardClient` did not. Docs must be the source of truth before implementation.

---

## Files updated

| File | What was added |
|------|----------------|
| [`docs/views/client_app/common/session_discovery_dashboard.md`](./docs/views/client_app/common/session_discovery_dashboard.md) | `QuickSessionButton` variant table; § Active-Session Guard — Date/Time Gate; `current` / `scheduled` states; API response shape; dashboard state table |
| [`docs/business_logic/client_app/08_queue_session.md`](./docs/business_logic/client_app/08_queue_session.md) | §3.4 Enrolled vs in-session; §5.5 Dashboard current-session gate |
| [`docs/views/client_app/common/quick_session_sheet.md`](./docs/views/client_app/common/quick_session_sheet.md) | Post-submission dashboard state table |
| [`docs/views/client_app/que_master/que_master_console.md`](./docs/views/client_app/que_master/que_master_console.md) | Pre-Active dashboard affordances table |
| [`docs/views/client_app/components/navbar-que-master.md`](./docs/views/client_app/components/navbar-que-master.md) | Date/time gate note for LIVE badge |
| [`docs/views/client_app/components/sidebar-que-master.md`](./docs/views/client_app/components/sidebar-que-master.md) | Live Console strip gate; `useEnrolledSessionState` wiring note |
| [`docs/views/client_app/components/sidebar-player.md`](./docs/views/client_app/components/sidebar-player.md) | Live Session strip gate |

---

## Key definitions (canonical)

### Enrolled
User has a `session_registrations` row where:
- `admission_status` ∈ `accepted`, `waitlisted`, `reserved`
- `player_status` ≠ `exited`
- `queue_sessions.status` ∈ `open`, `active`

### Current (in session for dashboard)
Enrolled **and**:
- `queue_sessions.status === 'active'`, **or**
- `queue_sessions.status === 'open'` **and** `dateTime <= now`

### Scheduled
Enrolled **and**:
- `queue_sessions.status === 'open'` **and** `dateTime > now`

---

## Verification checklist

- [ ] `session_discovery_dashboard.md` documents all three `QuickSessionButton` variants
- [ ] `08_queue_session.md` §5.4 still describes join guard for **all** enrollments
- [ ] `08_queue_session.md` §5.5 separates join guard from dashboard chrome
- [ ] `quick_session_sheet.md` post-submission table matches API behavior to be built in Phase 1
- [ ] QM console doc states LIVE strip hidden before DB `active`
- [ ] No contradictions between business logic and view docs

---

## Review questions (resolve before Phase 1)

1. **`open` + past `dateTime`:** Show `IN QUEUE` banner (not `LIVE`) until host starts session — confirmed in docs?
2. **Attendance window:** Should `endTime` affect `current`? Current spec uses `dateTime` only; defer `endTime` gate unless product says otherwise.
3. **Waitlisted future session:** Classified as `scheduled` if `dateTime > now` — same gate as accepted?

---

## Deliverable

Docs merged. No code changes in this phase.
