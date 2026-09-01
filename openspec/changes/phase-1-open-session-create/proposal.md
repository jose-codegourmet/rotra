# Phase 1 open session create

## Why

Phase 1 is an open tester club-night (ADR 0001, ADR 0003). Canonical OpenSpec still says only Club Owner / Que Master may create Que Sessions, and it models Que Master as a per-club role assigned by the Owner. Those rules would block the only thing Phase 1 is trying to prove: anyone can run a night.

GitHub #75 is the only create-session track. This change aligns specs with that heading. It does not invent a second create API.

## What Changes

- Every account is a tester. Create-session is open to any authenticated user.
- No Facebook, club-membership, or ranking-cert gate on create.
- Que Master and umpire are session hats assigned by the session creator (self-assign allowed, multiple QMs allowed). They are not platform user roles.
- Unfinished night tools (queue, join, attendance, courts, umpire, player view) remain TesterOnly-wrapped **feature slices** until a Que Master can run a session start to finish, then unwrap.
- Facebook OAuth stays parked in the codebase (#85). Do not restore it as the Phase 1 door.
- Do not silently delete `POST /api/sessions/quick`.

Later (out of this change): club preferred Que Masters as a default; ranked games require ranking certification; tester becomes a real subset for whatever is unfinished next.

## Impact

- Affected capabilities (inferred): `queue-session` (create / who may host), `user-roles` (tester additive; QM and umpire as session hats), `auth-flow` (tester is a role flag, not a separate login).
- Planning artifacts only until `/opsx-propose` validates and completes deltas.
- Does not invent APIs, screens, or routes. Existing Quick Session create remains the shipping path.
- `openspec/specs/` is not edited by this draft.

## Skipped / unimplemented

- Club preferred Que Master lists.
- Ranking-certification gate for ranked / MMR games.
- Tester as a real subset after the night is unwrapped.
- A TesterOnly hook/component — none exists in code yet; new night work should be shaped as slices when it is built.
