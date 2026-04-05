# View: Admin Login

## Purpose

The entry point to the ROTRA Admin App. Platform team members authenticate with email and password followed by a mandatory TOTP (Time-based One-Time Password) second factor. There is no self-registration, password reset via the UI, or social OAuth — all admin accounts are provisioned manually at the system level.

This screen is the only page accessible without a valid admin session. Authenticated admins are redirected to `/admin/dashboard`. The page is IP-restricted by default; visitors outside the allowlist see a hard block screen before credentials are ever presented.

## Route

`/admin/login` — public (IP-restricted), unauthenticated only

## Roles

Platform Admin, Super Admin (unauthenticated). Authenticated admins are immediately redirected to `/admin/dashboard`.

---

## Layout

Full-viewport two-column split. Left panel is a brand/context panel. Right panel contains the authentication form. No sidebar, no environment bar — those only appear after a successful session is established.

```
┌──────────────────────────────┬────────────────────────────────────┐
│                              │                                    │
│   LEFT PANEL  (50%)          │   RIGHT PANEL  (50%)               │
│   color-bg-surface           │   color-bg-base                    │
│                              │                                    │
│   ROTRA                      │   ┌────────────────────────────┐   │
│   Admin Console              │   │  Step 1: Credentials       │   │
│                              │   │                            │   │
│   "The operating layer       │   │  Email                     │   │
│    for platform control."    │   │  [ __________________ ]    │   │
│                              │   │                            │   │
│   ─────────────────────────  │   │  Password                  │   │
│                              │   │  [ __________________ ] 👁 │   │
│   ⚠  Internal use only.      │   │                            │   │
│   This application is        │   │  [ Sign In → ]             │   │
│   restricted to authorised   │   │                            │   │
│   platform team members.     │   └────────────────────────────┘   │
│                              │                                    │
│                              │   Need help? Contact the           │
│                              │   Super Admin.                     │
│                              │                                    │
└──────────────────────────────┴────────────────────────────────────┘
```

After step 1 succeeds, the right panel transitions in place to the TOTP step without a page reload:

```
┌──────────────────────────────┬────────────────────────────────────┐
│   [Left panel unchanged]     │                                    │
│                              │   ┌────────────────────────────┐   │
│                              │   │  Step 2: Two-Factor Auth   │   │
│                              │   │                            │   │
│                              │   │  Open your authenticator   │   │
│                              │   │  app and enter the 6-digit │   │
│                              │   │  code.                     │   │
│                              │   │                            │   │
│                              │   │  [ _ ][ _ ][ _ ][ _ ][ _ ][ _ ]│
│                              │   │                            │   │
│                              │   │  [ Verify → ]              │   │
│                              │   │                            │   │
│                              │   │  ← Back to sign in         │   │
│                              │   └────────────────────────────┘   │
└──────────────────────────────┴────────────────────────────────────┘
```

---

## Components

### Left Panel

- Width: 50%, minimum width: 480px
- Background: `color-bg-surface` (`#1A1A1D`)
- Flex column, vertically centered, `space-12` (48px) horizontal padding
- **Wordmark block:**
  - `ROTRA` — `text-display` (28px, Bold 700), `color-text-primary`, letter-spacing -1px
  - `Admin Console` — `text-heading` (18px, SemiBold), `color-text-secondary`, `space-2` top margin
- **Tagline:**
  - `"The operating layer for platform control."` — `text-body` (15px, Regular), `color-text-secondary`, `space-6` top margin, max-width 320px
- **Divider:** 1px solid `color-border`, `space-8` top and bottom margin
- **Warning notice block:**
  - Warning icon (16px, `color-warning`)  inline with label `Internal use only.` (`text-label`, `color-warning`)
  - Body copy: `"This application is restricted to authorised platform team members. Unauthorised access attempts are logged and reported."` — `text-small` (13px), `color-text-secondary`
- No decorative imagery; the left panel uses negative space intentionally

### Right Panel

- Width: 50%
- Background: `color-bg-base` (`#0B0B0C`)
- Flex column, centered both axes
- Contains the auth card + footer help text

### Auth Card

- Background: `color-bg-surface`
- Border: 1px solid `color-border`
- Border radius: `radius-xl` (20px)
- Shadow: `shadow-modal` (`0 8px 32px rgba(0,0,0,0.6)`)
- Padding: `space-8` (32px)
- Width: 400px fixed

### Step 1 — Credentials Form

- **Card title:** `Sign in` — `text-heading` (18px, SemiBold), `color-text-primary`
- **Email field:**
  - Label: `Email` — `text-small` (13px, Medium), `color-text-secondary`
  - Input: full-width, height 44px, `color-bg-elevated` background, 1px `color-border` border, `radius-md` (10px), `text-body` (15px), `color-text-primary`
  - Input type `email`, autocomplete `email`
  - Focus ring: 1.5px `color-accent` border
- **Password field:**
  - Label: `Password` — same as email label
  - Input: same styling as email; input type `password`
  - Right-side toggle icon (eye / eye-off, 16px stroke, `color-text-disabled`) — click toggles plaintext visibility
- **Error inline:** below the offending field — `text-small`, `color-error`, with a small warning icon; e.g. `"Incorrect email or password."`
- **Sign In button:**
  - Height: 44px, full-width
  - Background: `color-accent`
  - Label: `Sign In` — `text-label` (12px, uppercase, Medium), white
  - Border radius: `radius-md`
  - Hover: `color-accent` at 90% brightness
  - Loading state: label replaced with 20px spinner (white), non-interactive
  - Enter key submits the form

### Step 2 — TOTP Form

- **Card title:** `Two-factor authentication` — `text-heading`, `color-text-primary`
- **Instruction copy:** `"Open your authenticator app and enter the 6-digit code."` — `text-body`, `color-text-secondary`
- **OTP input:** Six individual single-digit boxes in a flex row
  - Each box: 48×56px, `color-bg-elevated` background, 1px `color-border` border, `radius-md`, `text-display` (28px, Bold), `color-text-primary`, center-aligned
  - Focus: active box has 1.5px `color-accent` border
  - Auto-advances to next box on digit entry; backspace clears and moves back
  - Paste of a 6-digit string fills all boxes
- **Verify button:** same spec as Sign In button; label `Verify`; submits automatically when all 6 digits are filled
- **Back link:** `← Back to sign in` — `text-small`, `color-text-secondary`, underline on hover; clears step 2 state and returns to step 1

### Footer Help Text

- Positioned below the auth card, centered
- Copy: `Need help? Contact the Super Admin.`
- Style: `text-small`, `color-text-disabled`

### IP Block Screen (pre-credential, out-of-allowlist)

If a request originates from an IP address outside the configured allowlist, the entire page is replaced with a minimal block screen:

- Full viewport, `color-bg-base` background
- Centered card (same style as auth card, max-width 480px)
- Lock icon (40px stroke, `color-text-disabled`)
- Title: `Access restricted` — `text-heading`, `color-text-primary`
- Body: `"This application is only accessible from authorised networks. If you believe this is an error, contact your platform administrator."` — `text-body`, `color-text-secondary`
- No form elements, no "login anyway" option
- IP block events are logged server-side

---

## States

### Default
Step 1 form visible. Fields empty. Sign In button is enabled but the server validates on submit.

### Step 1 — Loading
Sign In button enters loading state (spinner) after submit. Both fields become non-interactive.

### Step 1 — Error: Invalid Credentials
Inline error appears below the password field: `"Incorrect email or password."` Neither field reveals which one is wrong. Both fields remain editable. Rate limiting: after 5 consecutive failures the form locks for 15 minutes and displays: `"Too many attempts. Try again in 15 minutes."` — `color-error`, centered below the button.

### Step 1 — Error: Account Inactive
If the admin account has been deactivated: `"This account has been disabled. Contact the Super Admin."` — `color-error` inline below the button.

### Step 2 — Default
Six empty OTP boxes. Verify button disabled until all six are filled.

### Step 2 — Loading
Verify button enters loading state after the sixth digit is entered (auto-submit) or after manual click.

### Step 2 — Error: Invalid Code
All six boxes shake (horizontal translate animation, 200ms ease), clear, and refocus on box 1. Error message below boxes: `"Invalid code. Check your authenticator app and try again."` — `text-small`, `color-error`.

### Step 2 — Error: Code Expired
`"This code has expired. A new code has been generated in your app."` — same styling. Boxes clear and refocus.

### Success
On successful TOTP verification, the page navigates to `/admin/dashboard` with a fade transition. No success state shown on the login screen itself.

---

## Responsive Layout

The Admin App is desktop-first. The login screen has a defined degradation path but is not optimised for mobile use.

| Breakpoint | Range | Layout |
|---|---|---|
| Desktop (primary) | ≥ 1024px | Two-column split as specified above |
| Tablet | 768px–1023px | Single column; left panel collapses to a top bar with wordmark only; auth card centered below |
| Mobile | < 768px | Single column; left panel hidden entirely; auth card full-width with `space-4` (16px) horizontal margin; TOTP boxes shrink to 40×48px |

On tablet and mobile, the warning notice from the left panel appears as a small banner directly above the auth card.

---

## Design Tokens

| Token | Usage |
|---|---|
| `color-bg-base` `#0B0B0C` | Right panel, page background |
| `color-bg-surface` `#1A1A1D` | Left panel, auth card background |
| `color-bg-elevated` | Input field backgrounds |
| `color-border` `#2A2A2E` | Card border, input borders |
| `color-accent` | Sign In and Verify button background, active input focus ring |
| `color-error` | Inline error messages, rate-limit warning |
| `color-warning` | Internal-use-only notice icon and label |
| `color-text-primary` `#F0F0F2` | Card titles, input text, OTP digits |
| `color-text-secondary` `#9090A0` | Labels, instruction copy, tagline |
| `color-text-disabled` `#4A4A55` | Footer help text |
| `shadow-modal` | Auth card shadow |
| `radius-xl` 20px | Auth card corners |
| `radius-md` 10px | Inputs, buttons, OTP boxes |
| `text-display` 28px Bold | OTP digit characters |
| `text-heading` 18px SemiBold | Card titles, `Admin Console` label |
| `text-body` 15px | Instruction copy, tagline |
| `text-label` 12px Medium uppercase | Button labels |
| `text-small` 13px | Field labels, inline errors |
