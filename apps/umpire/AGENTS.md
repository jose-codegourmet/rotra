# AGENTS.md — `@rotra/umpire`

> Nested entry for `apps/umpire`. Root: `/AGENTS.md`.

**Port:** 3002 · **Maturity: STUB.**

- One page: “Live scoring interface — coming soon.”
- No API routes, no middleware, no auth, no Redux, no Realtime.
- Five OpenSpecs exist (`umpire-overview`, `umpire-token-access`, `umpire-scoring`,
  `umpire-realtime`, `umpire-score-submission`) — **none are implemented**.

Do **not** invent scoring engines, token access, or WebSocket channels from those specs without
an OpenSpec change + explicit implementation plan. Treat this app as empty until then.
