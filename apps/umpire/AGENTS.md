# AGENTS.md — `@rotra/umpire`

> Nested entry for `apps/umpire`. Root: `/AGENTS.md`.

**Port:** 3002 · **Maturity: UI SHELL.**

- `/` redirects to `/scoreboard`.
- `/scoreboard` — live score shell (fake Smash Hub match, local +POINT / undo).
- `/submit` — submit-confirm shell (fake 2–0 lock copy, local locked UI only).
- No API routes, no middleware, no auth, no Redux, no Realtime, no tokens/QR.
- Five OpenSpecs exist (`umpire-overview`, `umpire-token-access`, `umpire-scoring`,
  `umpire-realtime`, `umpire-score-submission`) — scoring engine, token access,
  realtime, and score-submission APIs are **not implemented**.

Do **not** invent scoring engines, token access, or WebSocket channels from those specs without
an OpenSpec change + explicit implementation plan. These two screens are fake-match chrome.
