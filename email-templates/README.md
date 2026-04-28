# Email Templates

This folder stores reusable email templates for external providers.

## Supabase Auth

- Template file: `supabase/magic-link-otp.html`
- Intended dashboard location: Supabase -> Authentication -> Email -> Templates -> Magic link
- Suggested subject: `Your ROTRA Admin one-time code`

### Notes

- This template is OTP-first and shows `{{ .Token }}` prominently.
- It still includes a secondary sign-in link using `{{ .ConfirmationURL }}` as fallback.
- For strict OTP-only UX, you can remove the fallback button section.
