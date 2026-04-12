# Club profile & manage — refinement backlog

Bare UI and routes exist under `apps/client` for `/clubs/[clubId]/*` and `/clubs/[clubId]/manage/*`. This file tracks what to build next (no API work until you intentionally schedule it).

## Phase 1 — Data, auth, and demos

- Replace `MOCK_CLUB` / `?as=` with real session and club membership resolution.
- Enforce **owner vs Que Master** permissions (e.g. delete club owner-only; QM cannot delete).
- Gate **public `/members`** preview vs full table using real membership, not only `?as=member`.
- Invite banners and disabled-invite states from `docs/views/client_app/common/club_profile.md`.
- Remove or **dev-only** guard the `?as=` query param.

## Phase 2 — Calendar and SEO

- Replace `ClubScheduleCalendarPlaceholder` with a real calendar (separate task).
- Add `generateMetadata` per segment (title/description) for sharing and deep links.

## Phase 3 — Operations and content

- Que Master assignment flows per `docs/views/client_app/club_owner/club_owner_hub.md`.
- **Owners and Que Masters** publish **announcements** and **share upcoming queue schedules** (product + UI).
- Wire **invite link / QR** toggle in **Manage → Settings** to the member overview sidebar.

## Phase 4 — Visual polish

- Align surfaces and motion with Stitch / kinetic design specs if desired.
- Responsive polish beyond horizontal-scroll tab bars.

## Deferred (explicit)

- Join request **modal** and **approve/reject** APIs.
- **Delete club**: admin portal flow; interim contact `jose@codegourmet.io` (document only until implemented).

## Route map (reference)

| Area | Paths |
|------|--------|
| Profile | `/clubs/[id]`, `/overview`, `/schedule`, `/rules`, `/members`, `/announcements` |
| Manage | `/clubs/[id]/manage/members`, `/requests`, `/statistics`, `/settings`, `/blacklist` |

## Components (reference)

- `apps/client/src/components/modules/club-profile/` — tab navs, sidebars, tables, `ProvisionBox`, role gate layout client.
