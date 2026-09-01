# OpenSpec index

> **Last verified:** 2026-08-26 · One line per domain. **built** = meaningful UI+API shipped;
> **partial** = schema/API or UI theatre incomplete; **unbuilt** = specs only / stub app.
> Always open `openspec/specs/<domain>/spec.md` before changing behavior.

| Domain | Status | Notes |
|--------|--------|-------|
| `product-vision` | built (docs) | Constraints / audiences |
| `ubiquitous-language` | built (docs) | Vocabulary contract |
| `canonical-rules` | partial | Some RULE-* conflict with code (Quick Session) |
| `user-roles` | partial | Roles modeled; club role UI largely mock |
| `auth-flow` | built | Client Facebook + gates; Admin password |
| `auth-email` | built | Admin-triggered Supabase Auth mail; templates pasted to dashboard, relayed via Resend |
| `onboarding` | built | Wizard + complete API |
| `landing` | built | Waitlist + legal |
| `legal` | built | Shared legal-content pages |
| `settings` | partial | Account real; hub partially theatre |
| `clubs` | partial | Apply real; browse/manage mock |
| `queue-session` | partial | `/find-sessions/*` real; `/sessions/*` mock; queue/court/attendance/add-match/player play screens product incomplete |
| `automatic-queueing` | unbuilt | Spec only |
| `umpire-overview` | unbuilt / UI shell | `/scoreboard` + `/submit` fake-match shells; no token/API |
| `umpire-token-access` | unbuilt | |
| `umpire-scoring` | unbuilt / UI shell | Local +POINT / undo only; no scoring engine |
| `umpire-realtime` | unbuilt | No Realtime in apps |
| `umpire-score-submission` | unbuilt | |
| `skill-rating` | unbuilt / UI mock | Profile skills show `MOCK_PLAYER` |
| `mmr-calibration` | unbuilt | Admin MMR page in-memory |
| `review-system` | unbuilt | |
| `cost-system` | unbuilt | |
| `gamification` | unbuilt | Schema exists; UI math pages mock |
| `leaderboard` | unbuilt | |
| `match-history` | unbuilt | Profile history mock |
| `player-profile` | partial | Identity real; cards mock |
| `player-comparison` | unbuilt | |
| `notifications` | built | Client + admin inboxes |
| `sharing` | unbuilt | |
| `tournament` | unbuilt | Phase 3 |
| `admin-overview` | partial | Hub mock KPIs; many ops real |
| `admin-auth` | built | |
| `admin-approvals` | partial | Club applications real; demotions stub |
| `admin-users` | built | Admins + customers modules |
| `admin-places` | built | |
| `admin-notifications` | built | |
| `admin-platform` | unbuilt / mock | Kill switches, platform-config mock |

When promoting mock→real: update `.agents/context/implementation-status.md` and sync the matching spec.
