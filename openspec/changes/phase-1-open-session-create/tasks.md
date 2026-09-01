# Tasks

Planning draft only. Run `/opsx-propose` before treating these as an apply-ready checklist. Do not implement from this folder until that cycle completes. Do not invent APIs, screens, or routes.

## Spec alignment

- [ ] `/opsx-propose` this change and write delta specs for `queue-session`, `user-roles`, and `auth-flow`.
- [ ] `queue-session`: Phase 1 create is open to any authenticated user; keep existing Quick Session as the shipping path (GitHub #75 only).
- [ ] `user-roles`: Tester is an additive user role; Phase 1 every account has it. Que Master and umpire are session hats assigned by the creator (self-assign, multiple QMs), not platform roles.
- [ ] `auth-flow`: one `/login`; tester is not a separate login. Facebook remains parked (#85), not the Phase 1 door.

## Product constraints (when implementing #75 / night slices)

- [ ] Do not add Facebook, club-membership, or ranking-cert gates on create.
- [ ] Do not silently delete `POST /api/sessions/quick`.
- [ ] Session creator can assign Que Master (including self) and umpire hats; more than one QM is allowed.
- [ ] Unfinished night tools stay TesterOnly-wrapped **feature slices** (queue, join, attendance, courts, umpire, player view) until a Que Master can run a session start to finish, then unwrap. Do not invent TesterOnly if the code has none yet.

## Out of this change

- [ ] Club preferred Que Masters as a default (later).
- [ ] Ranked games require ranking certification (later).
- [ ] Tester becomes a real subset after the night works (later).
