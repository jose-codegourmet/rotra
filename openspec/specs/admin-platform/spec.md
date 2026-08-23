# Admin Platform Specification

## Purpose

Admin pages for dashboard, kill switches, platform config, analytics, MMR, skills, and moderation. These routes exist and require an admin session, but they render mock or in-memory data. They do not persist configuration or enqueue real moderation work.

## Requirements

### Requirement: Protected mock pages
`/dashboard`, `/kill-switches`, `/platform-config`, `/analytics`, `/mmr-management`, `/skills-management`, and `/moderation` SHALL be reachable only through the admin auth gates. They MUST NOT call dedicated persistence APIs for their domain data.

#### Scenario: Signed-out visitor
- GIVEN no admin session
- WHEN they request `/kill-switches`
- THEN middleware redirects to `/login`

### Requirement: Dashboard uses mock KPIs
`/dashboard` SHALL render KPI cards, an activity feed, and attention counts from `MOCK_*` constants. Links to other admin modules MAY be real routes. Counts MUST NOT come from a live metrics API.

#### Scenario: Dashboard attention cards
- GIVEN a signed-in admin
- WHEN they open `/dashboard`
- THEN pending-approvals and moderation counts are computed from mock arrays

### Requirement: Kill switches are local UI state
`/kill-switches` SHALL render `MOCK_KILL_SWITCHES`. Toggles SHALL update React local state only and MUST NOT persist. The page SHALL state that toggles are not persisted.

#### Scenario: Toggle a kill switch
- GIVEN the kill-switches page
- WHEN an admin flips a switch
- THEN only local component state changes
- AND no kill-switch API is called

### Requirement: Platform config and analytics are display-only
`/platform-config` SHALL render a mock key/value table. Edit controls SHALL have no persistence handlers. `/analytics` SHALL render mock KPIs, a static chart, and a mock top-clubs table with no analytics API.

#### Scenario: Platform config edit
- GIVEN the platform-config page
- WHEN an admin uses an edit control
- THEN no platform-config row is written to the database

### Requirement: MMR and skills tables are in-memory
`/mmr-management` SHALL edit in-memory defaults from `constants/mmr-asymmetry-config.ts` and SHALL state that no API exists. `/skills-management` SHALL edit in-memory defaults from `constants/match-exp-config.ts`. Reloading the page SHALL restore the constants, not saved values.

#### Scenario: Reload after editing MMR
- GIVEN an admin changed a local MMR table value
- WHEN they reload `/mmr-management`
- THEN the table shows the shipped constants again

### Requirement: Moderation queue is mock
`/moderation` SHALL render `MOCK_MODERATION`. View/Resolve actions SHALL be non-functional. `?player=&tab=` MAY show `ModerationPlayerFocusBanner` with the player id and copy that full tooling is future. Customer detail “Take action” MAY deep-link here.

#### Scenario: Resolve is inert
- GIVEN a mock moderation row
- WHEN the admin clicks Resolve
- THEN no moderation record is updated in the database

## Source

- `apps/admin/src/app/(protected)/dashboard/page.tsx`
- `apps/admin/src/app/(protected)/kill-switches/page.tsx`
- `apps/admin/src/app/(protected)/platform-config/page.tsx`
- `apps/admin/src/app/(protected)/analytics/page.tsx`
- `apps/admin/src/app/(protected)/mmr-management/page.tsx`
- `apps/admin/src/app/(protected)/skills-management/page.tsx`
- `apps/admin/src/app/(protected)/moderation/page.tsx`
- `apps/admin/src/constants/mock-admin-pages.ts`
- `apps/admin/src/constants/mmr-asymmetry-config.ts`
- `apps/admin/src/constants/match-exp-config.ts`
