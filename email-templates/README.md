# Email Templates

Auth email HTML that humans paste into **Supabase Dashboard → Authentication → Emails →
Templates**. Supabase renders Go-template variables and relays delivery through **Resend**
(custom SMTP). Nothing in `apps/` imports these files at runtime.

## Where templates live

| Kind | Path |
|------|------|
| App-specific | `apps/<app>/src/email-templates/<name>.html` |
| Shared / cross-app | `email-templates/<provider>/<name>.html` (this folder) |

When both a shared and an app-specific file target the same Supabase slot, the app-specific
one wins for that app's authoring intent. The Supabase project still has **one** deployed body
per slot — see `openspec/specs/auth-email/spec.md`.

## This folder (shared)

- `supabase/magic-link-otp.html` — OTP-first Magic link body (`{{ .Token }}` prominent;
  `{{ .ConfirmationURL }}` as fallback). Suggested subject: `Your ROTRA Admin one-time code`.
- Admin also keeps `apps/admin/src/email-templates/magic-link.html` for the same slot; which
  body is pasted in the dashboard is not recorded in-repo (known gap in the OpenSpec).

## Admin app templates

See `apps/admin/src/email-templates/`:

- `invite-user.html` → Invite user
- `magic-link.html` → Magic link
- `reset-password.html` → Reset password

## Notes

- Inline CSS + table layout only (no Tailwind / design tokens / JSX).
- Merging an HTML edit does **not** change delivered mail until someone pastes it into the
  dashboard.
- Full trigger inventory and known gaps: `openspec/specs/auth-email/spec.md`.
