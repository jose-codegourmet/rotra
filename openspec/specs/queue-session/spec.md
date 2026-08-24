# Queue Session Specification

## Purpose

Client queue-session discovery, casual session creation, live lobby/console reads, mock join/waitlist screens, and a mock attendance check-in screen in `apps/client`. Players can find open/active sessions, create a Quick Session, start/close as host, and leave. Standalone `/sessions/join` and `/sessions/joined` screens render the Smash Hub Ortigas fixture; JOIN does not persist a registration. Standalone `/sessions/attendance` renders the Smash Hub Ortigas attendance fixture; I AM IN is a client-only toast and local arrived flip. `GET /api/sessions/[id]` is still mock discovery only. There is no POST register/waitlist or attendance API. The prepared-flow step is shown locked and is not implemented. Umpire/QR scoring is not implemented in the client.

## Requirements

### Requirement: Authenticated session APIs
Session APIs under `/api/sessions/*` MUST require a current profile. Missing auth SHALL return HTTP 401.

#### Scenario: Discover without a session
- GIVEN no current profile
- WHEN `GET /api/sessions/discover` is called
- THEN the API returns HTTP 401

### Requirement: Geo discovery
`GET /api/sessions/discover` SHALL require numeric `lat` and `lng`. It MUST return `{ sessions, venueGroups }` for `queue_sessions` with status `open` or `active` that are visible to the viewer. Sessions with visibility `club_members` SHALL be hidden unless the viewer is an active member of that `clubId`. Open sessions whose `dateTime` is more than 12 hours in the past SHALL be excluded. Missing coordinates SHALL return HTTP 400.

#### Scenario: Valid discovery query
- GIVEN a signed-in player and valid `lat`/`lng`
- WHEN they GET `/api/sessions/discover`
- THEN the response includes `sessions` and `venueGroups` from the database

#### Scenario: Missing coordinates
- GIVEN a signed-in player
- WHEN they GET `/api/sessions/discover` without `lat` and `lng`
- THEN the API returns HTTP 400

### Requirement: Available, my, and active session lists
`GET /api/sessions/available` SHALL list open/active sessions visible to the user (no geo filter). `GET /api/sessions/my` SHALL list sessions the user is registered for. `GET /api/sessions/active` SHALL return the best current or scheduled enrolled session where `admissionStatus` is `accepted`, `waitlisted`, or `reserved` and `playerStatus` is not `exited`, for sessions in `open` or `active`.

#### Scenario: Find-sessions available tab
- GIVEN a signed-in player
- WHEN `/find-sessions` loads the Available tab
- THEN it reads `GET /api/sessions/available`

#### Scenario: Dashboard active banner
- GIVEN the player has an accepted registration on an open or active session
- WHEN the dashboard loads
- THEN `GET /api/sessions/active` can return that session for the banner

### Requirement: Quick Session create
`POST /api/sessions/quick` SHALL validate the Quick Session form, optionally require an active `club_members` row when `clubId` is set (HTTP 403 otherwise), force `visibility` to `open` when there is no club, geocode the venue when coordinates are missing, and in one transaction create a `queue_sessions` row (`origin: player_organized`, `status: open`) plus a host registration with `admissionStatus: accepted`.

#### Scenario: Clubless quick session
- GIVEN a signed-in player
- WHEN they post a valid payload without `clubId`
- THEN a session is created with `visibility` `open`
- AND the host is registered as accepted
- AND the client navigates to `/find-sessions/{id}`

#### Scenario: Club-scoped session without membership
- GIVEN a `clubId` the player is not an active member of
- WHEN they post `/api/sessions/quick`
- THEN the API returns HTTP 403

### Requirement: Host start and close
`POST /api/sessions/[id]/start` SHALL allow only the `hostId`, and only when status is `open`, then set status to `active`. `POST /api/sessions/[id]/close` SHALL allow only the host, and only when status is `draft`, `open`, or `active`, then set status to `closed`. Wrong host SHALL return 403. Wrong status SHALL return 409. Missing session SHALL return 404.

#### Scenario: Host starts an open session
- GIVEN the current profile is the session host
- AND the session status is `open`
- WHEN they POST `/api/sessions/[id]/start`
- THEN the session status becomes `active`

#### Scenario: Non-host tries to start
- GIVEN a player who is not `hostId`
- WHEN they POST start
- THEN the API returns HTTP 403

### Requirement: Leave session
`POST /api/sessions/[id]/leave` SHALL set the viewer's registration to `playerStatus: exited` and `admissionStatus: exited`. Missing registration SHALL return 404. Already-exited SHALL return 409.

#### Scenario: Registered player leaves
- GIVEN the viewer has a non-exited registration
- WHEN they POST leave
- THEN that registration is marked exited

### Requirement: Live read models
`GET /api/sessions/[id]/live` SHALL return session context plus `viewerRegistration` (null when missing or exited). `GET /api/sessions/[id]/roster` SHALL return accepted and waitlisted players. `GET /api/sessions/[id]/console` SHALL return courts, queue, roster, and standings derived from `Match` rows and registrations. Missing sessions SHALL return 404.

#### Scenario: Live page routing
- GIVEN a session loaded via `/find-sessions/[sessionId]`
- WHEN status is `open` and the viewer is the host
- THEN the QM pre-active lobby is shown
- AND when status is `active` the host sees the QM console and others see the player active view
- AND `closed` / `completed` / `cancelled` show the closed view

### Requirement: Mock join and waitlist screens
`/sessions/join` and `/sessions/joined` SHALL render standalone mock UI: dashboard chrome and the tester banner MUST be hidden via `isSessionStandaloneRoute`. Copy, capacity, and queue SHALL come from `MOCK_SESSION_JOIN` (Smash Hub Ortigas). Queue player statuses SHALL be `accepted`, `waitlisted`, or `reserved`. Accepted slot max SHALL be `courts × playersPerCourt` via `acceptedCapacity()`. JOIN on `/sessions/join` SHALL be a client `Link` to `/sessions/joined` and MUST NOT POST a register or waitlist API. `/sessions/joined` SHALL show the accepted state, a decorative (non-encoded) QR, and SHARE QR that uses Web Share or clipboard of the mock join path `/sessions/join`.

#### Scenario: Join listing is standalone mock
- GIVEN a signed-in player
- WHEN they open `/sessions/join`
- THEN the Smash Hub Ortigas listing renders (status, meta cards, capacity, queue)
- AND dashboard chrome and the tester banner are hidden

#### Scenario: JOIN navigates without persisting
- GIVEN the player is on `/sessions/join`
- WHEN they activate JOIN
- THEN the client navigates to `/sessions/joined`
- AND no register or waitlist API is called
- AND no session-registration row is created

#### Scenario: Accepted share screen
- GIVEN a signed-in player
- WHEN they open `/sessions/joined`
- THEN the accepted state is shown with a decorative QR and SHARE QR
- AND SHARE QR uses Web Share when available, otherwise copies `/sessions/join` to the clipboard

### Requirement: Mock attendance check-in screen
`/sessions/attendance` SHALL render standalone mock UI: dashboard chrome and the tester banner MUST be hidden via `isSessionStandaloneRoute`. The header SHALL be ROTRA / Run the game. with no tester chip. Copy and session details SHALL come from `MOCK_SESSION_ATTENDANCE` and `MOCK_SESSION_ATTENDANCE_META` (Smash Hub Ortigas). Default state SHALL be Accepted + Not arrived: YOUR STATUS `Joined • not arrived` with ACCEPTED, orange NOT ARRIVED, event 2×2 (Smash Hub Ortigas, Sun, Aug 23, 7:00—9:00 PM, Doubles • 2 x 4), `8 accepted • rest waitlisted`, and ATTENDANCE Step 1 of 2 with I am in (NOW) and I am prepared (LOCKED). Sticky I AM IN SHALL toast and flip local arrived state only. It MUST NOT call an attendance API or write the database. The prepared step SHALL stay locked; the prepared flow is not implemented.

#### Scenario: Attendance screen is standalone mock
- GIVEN a signed-in player
- WHEN they open `/sessions/attendance`
- THEN the Smash Hub Ortigas attendance fixture renders (Accepted + Not arrived, event meta, Step 1 of 2)
- AND dashboard chrome and the tester banner are hidden
- AND no tester chip is shown

#### Scenario: I AM IN is local only
- GIVEN the player is on `/sessions/attendance` in the default not-arrived state
- WHEN they activate I AM IN
- THEN a client toast reports check-in
- AND the UI flips locally to arrived (ARRIVED, `Joined • arrived`, Step 1 DONE / IN, CTA YOU’RE IN disabled)
- AND no attendance API is called
- AND no registration or attendance row is written

#### Scenario: Prepared step stays locked
- GIVEN the player is on `/sessions/attendance`
- WHEN they view ATTENDANCE Step 1 of 2
- THEN I am prepared is shown as LOCKED
- AND there is no implemented prepared-flow action

### Requirement: Session-id join check remains mock-only
`GET /api/sessions/[id]` SHALL look up `MOCK_SESSION_DISCOVERY` only (HTTP 404 if absent, 410 if status is not `open` or `active`). There is no POST register/waitlist endpoint. The register button on the live `/find-sessions/[sessionId]` page SHALL be a no-op stub. Dashboard join that depends on the mock GET MAY report real database sessions as unavailable.

#### Scenario: Real session id on mock join check
- GIVEN a database session id that is not in `MOCK_SESSION_DISCOVERY`
- WHEN the dashboard join flow GETs `/api/sessions/[id]`
- THEN the API returns HTTP 404

#### Scenario: No register API
- GIVEN a player who is not registered
- WHEN they use the live-page register control
- THEN no session-registration row is created

### Requirement: Home aliases to dashboard
`/home` SHALL redirect to `/dashboard`. `/dashboard` SHALL be the geo discovery home (map/list/grid, filters, venue modal, active banner, Quick Session sheet). `/find-sessions` SHALL show Available and My Sessions tabs backed by the live list APIs.

#### Scenario: /home redirect
- GIVEN a signed-in player
- WHEN they request `/home`
- THEN they are redirected to `/dashboard`

## Source

- `apps/client/src/app/(protected)/dashboard/page.tsx`
- `apps/client/src/app/(protected)/find-sessions/page.tsx`
- `apps/client/src/app/(protected)/find-sessions/[sessionId]/page.tsx`
- `apps/client/src/app/(protected)/home/page.tsx`
- `apps/client/src/app/(protected)/sessions/join/page.tsx`
- `apps/client/src/app/(protected)/sessions/joined/page.tsx`
- `apps/client/src/app/(protected)/sessions/attendance/page.tsx`
- `apps/client/src/app/api/sessions/**`
- `apps/client/src/app/api/sessions/[id]/route.ts`
- `apps/client/src/constants/mock-session-join.ts`
- `apps/client/src/constants/mock-session-attendance.ts`
- `apps/client/src/lib/sessions/session-standalone-route.ts`
- `apps/client/src/lib/sessions/session-display-utils.ts`
- `apps/client/src/components/modules/session/session-join-view/SessionJoinView.tsx`
- `apps/client/src/components/modules/session/session-joined-view/SessionJoinedView.tsx`
- `apps/client/src/components/modules/session/session-attendance-view/SessionAttendanceView.tsx`
- `apps/client/src/components/modules/session/session-join-view/SessionJoinView.stories.tsx`
- `apps/client/src/components/modules/session/session-joined-view/SessionJoinedView.stories.tsx`
- `apps/client/src/components/modules/session/session-attendance-view/SessionAttendanceView.stories.tsx`
- `apps/client/src/lib/api/session-discovery.ts`
- `apps/client/src/lib/api/session-live.ts`
- `apps/client/src/lib/api/session-roster.ts`
- `apps/client/src/lib/api/session-console.ts`
- `apps/client/src/hooks/useSessionDiscovery/**`
- `apps/client/src/hooks/useQuickSessionMutation.ts`
- `apps/client/src/hooks/useStartSessionMutation.ts`
- `apps/client/src/hooks/useCloseSessionMutation.ts`
- `apps/client/src/hooks/useLeaveSessionMutation.ts`
- `packages/db/prisma/models_session.prisma`
- `packages/db/prisma/models_match.prisma`
