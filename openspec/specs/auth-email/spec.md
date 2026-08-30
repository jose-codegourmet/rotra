# Auth Email Specification

## Purpose

Supabase Auth transactional email for ROTRA. Templates are authored as standalone HTML in
the repo, pasted into the Supabase dashboard, rendered by Supabase with Go-template variables,
and delivered through Resend over custom SMTP. Every auth-email trigger today originates in
`apps/admin`. The app never imports these HTML files and never calls the Resend API.

## Requirements

### Requirement: Template authoring location
App-specific auth email templates SHALL live at `apps/<app>/src/email-templates/<name>.html`.
Cross-app / shared templates SHALL live at `email-templates/<provider>/<name>.html`. Templates
MUST be standalone HTML with inline CSS and table layout. App code MUST NOT import, bundle, or
render these files at runtime.

#### Scenario: Admin invite template location
- GIVEN an agent needs the Supabase "Invite user" template source
- WHEN they look in the repo
- THEN they find it at `apps/admin/src/email-templates/invite-user.html`
- AND no Next.js route or component imports that file

#### Scenario: Shared magic-link template location
- GIVEN a template intended for reuse across apps
- WHEN it is stored in the repo
- THEN it lives under root `email-templates/<provider>/`

### Requirement: Deployment is manual paste into Supabase
A template takes effect only when a human pastes its HTML into **Supabase Dashboard →
Authentication → Emails → Templates** for the matching slot. Merging a change to an
`*/email-templates/*.html` file SHALL NOT alter delivered mail. Agents and PRs MUST treat a
template edit as incomplete until the dashboard paste is done (or explicitly deferred).

#### Scenario: Merge without paste
- GIVEN a PR that edits `apps/admin/src/email-templates/reset-password.html`
- WHEN the PR merges and no one updates the Supabase dashboard
- THEN recipients continue to receive the previously pasted dashboard HTML

### Requirement: One template slot per Supabase project
The Supabase project exposes exactly one HTML body per Auth email template slot (Invite user,
Magic link, Reset password, Confirm signup, Change email, Reauthentication). Where multiple
audiences share a slot, the single deployed template MUST serve all of them. Per-app folders
in the repo are authoring conventions; they do not deploy independently.

#### Scenario: Admin and tester share Invite user
- GIVEN both admin invite and tester invite call Supabase `inviteUserByEmail`
- WHEN Supabase sends the invite email
- THEN both audiences receive the HTML currently pasted into the "Invite user" slot

### Requirement: Supported Go-template variables
Auth email templates SHALL only use Supabase Auth Go-template variables that the Auth service
injects. The variables used by committed ROTRA templates are `{{ .Token }}`,
`{{ .ConfirmationURL }}`, `{{ .TokenHash }}`, `{{ .RedirectTo }}`, `{{ .Email }}`, and
`{{ index .UserMetadata "<key>" }}`. Templates MUST NOT assume app-runtime env vars or
client-side data.

#### Scenario: Magic link shows OTP
- GIVEN the Magic link template includes `{{ .Token }}`
- WHEN Supabase renders an OTP email
- THEN the recipient sees the six-digit code in place of that placeholder

### Requirement: Invite links compose from redirectTo
The committed Invite user template composes the accept URL as
`{{ .RedirectTo }}/auth/accept-invite?token_hash={{ .TokenHash }}&type=invite&next=/set-password`.
Callers of `inviteUserByEmail` MUST pass `redirectTo` as an origin (or origin + base path such
as `/login-tester`) with **no** trailing slash and **no** `/auth/accept-invite` suffix —
Supabase and/or the template append the path.

#### Scenario: Admin invite redirectTo
- GIVEN an admin invite via `POST /api/admin-users/invite`
- WHEN `inviteUserByEmail` runs
- THEN `redirectTo` is the admin app origin from `resolveAdminAppOrigin(request)`

#### Scenario: Tester invite redirectTo
- GIVEN a tester invite via `POST /api/testers`
- WHEN `inviteUserByEmail` runs
- THEN `redirectTo` is `{CLIENT_ORIGIN}/login-tester` with no trailing path beyond that base

### Requirement: Trigger inventory — admin is the only origin
Every Supabase Auth email today SHALL be triggered from `apps/admin` API routes. Landing
waitlist signup MUST NOT send auth email (it only inserts a `waitlistSignup` row). Client and
umpire MUST NOT call Supabase Auth email-sending APIs for product flows.

| Slot | Trigger(s) | Repo HTML source(s) |
|------|------------|---------------------|
| Invite user | `POST /api/admin-users/invite`, `POST /api/admin-users/[id]/resend-invite`, `POST /api/testers`, `POST /api/testers/[id]/resend` (and related tester invite paths) | `apps/admin/src/email-templates/invite-user.html` |
| Reset password | `POST /api/auth/reset-password` → `resetPasswordForEmail` | `apps/admin/src/email-templates/reset-password.html` |
| Magic link | `POST /api/auth/request-otp`, `POST /api/auth/resend-otp` → `signInWithOtp` | `apps/admin/src/email-templates/magic-link.html`; also `email-templates/supabase/magic-link-otp.html` |
| Confirm signup / Change email / Reauthentication | No ROTRA code path | — |

#### Scenario: Admin password reset
- GIVEN any email string posted to admin `POST /api/auth/reset-password`
- WHEN the route succeeds
- THEN Supabase sends a reset email using the Reset password template
- AND the API does not reveal whether the email exists

#### Scenario: Waitlist does not send auth mail
- GIVEN a visitor posts a valid email to landing `POST /api/waitlist`
- WHEN the row is created
- THEN no Supabase Auth email template is rendered

### Requirement: Delivery via Supabase to Resend SMTP
Supabase Auth SHALL render the dashboard template and relay delivery through **Resend** over
custom SMTP configured in the Supabase project. Application code SHALL NOT hold Resend API
keys for auth email, SHALL NOT depend on a Resend SDK for these messages, and SHALL NOT send
auth email by calling Resend directly.

#### Scenario: No app-side Resend send
- GIVEN an admin invite or OTP request succeeds
- WHEN the email is delivered
- THEN Supabase Auth is the sender that invoked Resend
- AND no `apps/*` package imports a Resend client for that message

## Known gaps

These are current defects or ambiguities. They are **not** requirements to implement from this
spec alone.

1. **Invite user branding mismatch.** Committed `invite-user.html` is admin-branded end to end
   ("Internal Platform Operations Applet", "ROTRA Admin", idle-session footer) yet the same
   Supabase slot also serves player **tester** invites (`redirectTo` → client `/login-tester`).
   `docs/business_logic/admin_app/11_tester_management.md` expects admin-vs-tester branches in
   the dashboard template; the committed file has none.
2. **Duplicate Magic link sources.** Both `apps/admin/src/email-templates/magic-link.html` and
   `email-templates/supabase/magic-link-otp.html` target the Magic link slot. Which body is
   actually pasted in the dashboard is not recorded in the repo.
3. **Per-app folders are aspirational beyond admin.** Only `apps/admin/src/email-templates/`
   exists today. Client, landing, and umpire have no template folders yet; the convention in
   `AGENTS.md` is the standard going forward.

## Source

- `apps/admin/src/email-templates/invite-user.html`
- `apps/admin/src/email-templates/magic-link.html`
- `apps/admin/src/email-templates/reset-password.html`
- `email-templates/supabase/magic-link-otp.html`
- `email-templates/README.md`
- `apps/admin/src/lib/supabase/admin.ts`
- `apps/admin/src/app/api/admin-users/invite/route.ts`
- `apps/admin/src/app/api/admin-users/[id]/resend-invite/route.ts`
- `apps/admin/src/app/api/auth/reset-password/route.ts`
- `apps/admin/src/app/api/auth/request-otp/route.ts`
- `apps/admin/src/app/api/auth/resend-otp/route.ts`
- `apps/admin/src/app/api/testers/route.ts`
- `packages/db/src/tester-invitation-service.ts`
- `AGENTS.md` (§5 Auth email)
