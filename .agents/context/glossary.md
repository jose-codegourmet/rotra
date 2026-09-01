# Glossary

> **Last verified:** 2026-08-26 · Exact spelling is load-bearing in UI copy and code comments.

## Brand and product

| Term | Meaning |
|------|---------|
| **ROTRA** | Product name — always all-caps in UI. Coined word; not an acronym. |
| Tagline | *Run the game.* |
| Que Session / Que Schedule | Synonyms for the core scheduled/live session entity |
| Que Master | Session operator role — **never** “Queue Master” |
| Quick Umpire | Guest scorer via one-time token (docs/specs; umpire app is a UI shell) |
| Rate and Review | Canonical post-match rating CTA |
| Quick Session | Player-organized session create on client dashboard (code is REAL; product conflict with Owner/QM-only create) |

## Four concepts agents conflate

| Concept | What it is | Moves when |
|---------|------------|------------|
| **Skill Rating** | Peer-computed 1.0–5.0 across six dimensions | All session types with reviews |
| **MMR** | Competitive ladder (starts 1000, floor 0) | **Only** Club Que Session type `MMR` |
| **Tier** | Cosmetic EXP badge | EXP thresholds |
| **Playing level** | Self-declared | Cosmetic only |

## Session types (do not swap)

| Term | Meaning |
|------|---------|
| **Fun Games** | *Club* session type — no EXP/MMR |
| **Friendly** | Informal **clubless** session |
| **MMR** session | Competitive club session — MMR moves |

## Admission vs status

| Concept | Meaning |
|---------|---------|
| **Admission** | Seat state: Accepted / Waitlisted |
| **Player status** | Live activity: Not Arrived → I Am In → I Am Prepared → Playing / Waiting |

## Three “queues”

| Mechanism | Meaning |
|-----------|---------|
| **Match Queue** | Ordered matches inside a live session |
| **Session waitlist** | Overflow FIFO for seats when capacity full |
| **Automatic Queueing** | Matchmaking engine that proposes candidate matches |

## Match outcomes

| Term | Meaning |
|------|---------|
| **Voided** | Match cancelled after scoring; **reverses** EXP/MMR — never call “Unscored” |
| Scored | Counts toward history / boards per spec |

## Roles (additive)

| Role | Scope |
|------|-------|
| Player | Default platform role |
| Club Owner | Per club; from approved club application |
| Que Master | Per club; assigned by Owner |
| Umpire | Per match (Preset / On-the-fly; Authenticated / Quick Umpire) |
| Admin | Platform-only (Admin app) |

Admin-internal: Founding Super Admin, Super Admin, Platform Admin — see `openspec/specs/admin-users`.

Full vocabulary contract: `openspec/specs/ubiquitous-language/spec.md`.
