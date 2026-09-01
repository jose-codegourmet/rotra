# Design

## Create-session stays on the existing path

`POST /api/sessions/quick` already lets any signed-in player create a `queue_sessions` row (`origin: player_organized`) plus a host registration. Phase 1 product heading matches that path. Do not add a second create endpoint, do not add Facebook / club / ranking-cert gates, and do not delete Quick Session to “fix” the old CO/QM-only rule.

GitHub #75 is the only create-session track.

## Tester is a role, not a login

One `/login`. Roles are additive, e.g. `roles: [admin, tester, user]`. Phase 1 every account has `tester` so TesterOnly-wrapped night slices are visible to everyone. After a Que Master can run a session start to finish, unwrap those slices; tester then becomes a real subset for whatever is unfinished next.

Do not invent a TesterOnly implementation if the code has none yet. When night tools are built, wrap **feature slices** (queue, join, attendance, courts, umpire, player view), not entire routes. The same slice may appear on multiple surfaces.

## Session hats, not user roles

The session creator assigns Que Master and umpire hats on that session. Self-assign is allowed. A session may have more than one Que Master. The same person may hold both hats, or the scoreboard may be handed to someone else.

Do not model these as platform roles next to player / tester / admin. Club preferred QMs are a later default, not a Phase 1 create prerequisite.

Spelling remains **Que Master** (never “Queue Master”).

## Facebook stays parked

#85 is parked. Facebook OAuth source stays in the repo and stays off `/login`. Do not restore it as the Phase 1 door.

## Spec sync

Canonical `openspec/specs/user-roles`, `queue-session` (documented who-may-create), and `auth-flow` still describe the old gates. This folder is a draft. Run `/opsx-propose` to generate validated delta specs before apply / sync. Do not hand-edit `openspec/specs/`.
