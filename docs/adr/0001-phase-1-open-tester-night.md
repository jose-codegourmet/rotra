# 0001. Phase 1 open tester night

- Date: 2026-09-01
- Status: accepted

## Context

Phase 1 needs people using the app before club membership, ranking certification, or a finished Que Master night exist. Canonical OpenSpec still says only Club Owner / Que Master may create Que Sessions, and Facebook was the documented player door. Those gates would block the only thing Phase 1 is trying to prove: a club night.

Original product heading:

- “Phase 1, every user is a tester. Create-session is open to everyone. TesterOnly still wraps unfinished night tools, but everyone can see them because everyone is a tester. After the night works, unwrap and tester becomes a real subset for whatever is unfinished next.”
- “anyone really create a session. the club member can host fun games and ranked games (but only if they ranking certified) but for this phase. I want everyone to create sessions. because this is phase 1. I want them to use the app”
- “so no more facebook. testers will just be a flag in the user type or role so it is like name: jose roles: [admin, tester, user]”
- “testers can see whatever is being wrapped in a <TesterOnly></TesterOnly> hook and component”
- “when the night actually works” / “think of it as feature first approach” / “there are features that will not be tied up to only a specific set of screens”
- Club night (queue, join, attendance, courts, umpire, player view) is one TesterOnly feature. Club is a later container, not a prerequisite.

Session-create work is already ticketed as GitHub #75. Facebook OAuth is parked as GitHub #85, not deleted from the codebase.

## Decision

Phase 1 is an open tester club-night.

- There is one `/login`. Tester is an additive user role (with player / admin), not a separate login.
- Every account is a tester so any authenticated user can create a session. No Facebook, club-membership, or ranking-cert gate on create.
- Unfinished night tools (queue, join, attendance, courts, umpire, player view) stay behind TesterOnly until a Que Master can run a session start to finish, then unwrap. After that, tester becomes a real subset for whatever is unfinished next.
- Features are not bound to one screen. The same slice may appear on multiple surfaces.
- Club is a later container, not a Phase 1 prerequisite. Later: club members host Fun Games and ranked games; ranked only if ranking-certified.
- Facebook is not the Phase 1 door (#85 parked, not deleted).
- GitHub #75 is the only create-session track. Do not open a second one.

## Consequences

- Agents MUST NOT “fix” player Quick Session (`POST /api/sessions/quick`) back to Club Owner / Que Master-only create. Canonical OpenSpec still says CO/QM-only until `openspec/changes/phase-1-open-session-create/` is proposed and synced.
- New night work is shaped as TesterOnly-wrapped feature slices, not whole-route gates. Do not invent a TesterOnly implementation if the code has none yet.
- Do not restore Facebook as the public login door for Phase 1.
- Do not invent a second create-session API or ticket alongside #75.
- Club preferred Que Masters, ranking-cert gates, and tester-as-subset are out of Phase 1.
