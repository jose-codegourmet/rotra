# 0003. Session hats: Que Master and umpire

- Date: 2026-09-01
- Status: accepted

## Context

Existing glossary and ubiquitous-language copy describe Que Master as a per-club role assigned by the Club Owner, and Club Owner self-assign of Que Master as blocked. Phase 1 has no club container and needs someone who can run a night the moment they create a session.

Original product heading:

- “whoever creates the session can assign que_master. que_master should only live in a session. but there are clubs where there are already preferred que_masters”
- Creator can put the hat on themselves; a session can have more than one QM.
- Umpire is a session hat like que_master, not a user role. Same person can be both, or the scoreboard can be handed to someone else.

## Decision

Que Master and umpire are session-only hats assigned by the session creator.

- The creator MAY self-assign Que Master.
- A session MAY have more than one Que Master.
- Umpire is the same kind of hat, not a platform user role. The same person MAY hold both hats, or the scoreboard MAY be handed to someone else.
- Club preferred Que Masters come later as a default for new sessions, not a Phase 1 prerequisite.

Do not rename Que Master to “Queue Master”.

## Consequences

- Do not model Que Master or umpire as additive platform user roles next to player / tester / admin.
- Do not block the session creator from wearing the Que Master hat.
- Do not require a club, club membership, or Owner-assigned preferred QM list before a session can have a Que Master.
- Club-assigned preferred QMs remain future defaulting, not current create gates.
- Glossary and any later OpenSpec change (`openspec/changes/phase-1-open-session-create/`) must describe these as session hats. `openspec/specs/` stays untouched until that change is proposed and synced.
