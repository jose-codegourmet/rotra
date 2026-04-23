# Admin App — Business Logic

The Admin App is an internal operations dashboard used exclusively by the platform team. It is not exposed to players, club owners, or any public user. Its primary responsibilities are platform safety, configuration, and oversight.

---

## Who Uses This App

| User | Role |
|------|------|
| **Platform Admin** | Internal team member with full platform authority |

Admin accounts are created manually at the system level — there is no self-registration flow.

---

## Core Responsibilities

| Responsibility | Description |
|---------------|-------------|
| Kill switches | Toggle any platform feature on/off without a code deploy |
| Environment management | Switch and configure dev / staging / production environments |
| Club applications & demotions | Review club applications, demotion requests, and related complaints |
| Platform moderation | Handle flagged reviews, account suspensions, content removal |
| Platform configuration | Manage gamification parameters, skill dimensions, system constants |
| MMR & skills management | Configure MMR asymmetry, match EXP awarding behavior, and MMR calibration parameters for competitive sessions |
| Platform analytics | Monitor active clubs, session volume, player retention, and health metrics |

---

## Document Index

| File | Description |
|------|-------------|
| [01_admin_overview.md](./01_admin_overview.md) | Admin role, access levels, account management |
| [02_kill_switches.md](./02_kill_switches.md) | Feature flags, kill switches, rollback controls |
| [03_environment_management.md](./03_environment_management.md) | Dev / staging / production environment config |
| [04_approvals_and_moderation.md](./04_approvals_and_moderation.md) | Club applications, demotions, complaints, moderation, account actions |
| [05_platform_config.md](./05_platform_config.md) | Global constants — EXP rates, tier thresholds, skill dimensions |
| [06_platform_analytics.md](./06_platform_analytics.md) | Platform health dashboard and metrics |
| [07_mmr_and_skills_management.md](./07_mmr_and_skills_management.md) | MMR and match EXP governance, guardrails, and operational workflows |

---

## Relationship to Client App

The Admin App is a management layer **on top of** the Client App. Admin actions take effect on the live Client App:

- A kill switch toggled in the Admin App immediately hides or disables the corresponding feature in the Client App
- A **club application** approved in the Admin App mints a `clubs` row and unlocks **ownership of that club** in the Client App
- Config changes to EXP rates or tier thresholds apply to future Client App calculations
- Moderation actions (suspensions, content removal) propagate instantly to the Client App

The Admin App never exposes player-facing UI — it is a tool-only interface.
