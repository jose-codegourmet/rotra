# View: Club Owner Application

## Purpose
Allows a player to apply for Club Owner status, which grants them the ability to create and manage clubs. Applications are reviewed manually by the platform admin. This is a simple form — not a self-service registration. Players who submit are notified of the outcome via in-app notification.

## Route
`/apply/club-owner` — authenticated players only

## Roles
**Player** (non-Club Owner). Club Owners and Que Masters are redirected away — they have no reason to re-apply.

---

## Layout
Full-screen page with bottom navigation bar. Content is a scrollable single-column form centered on screen. Page uses standard authenticated shell: bottom nav + top header bar.

```
┌──────────────────────────────────────┐
│  ← Back       Apply to Own a Club   │  ← Header bar
├──────────────────────────────────────┤
│                                      │
│  Become a Club Owner                 │  ← Section title
│  Create and manage your own club,    │  ← Subtitle copy
│  host sessions, and grow your        │
│  community.                          │
│                                      │
│  ┌────────────────────────────────┐  │  ← Form card, bg-surface
│  │  Intended Club Name       *    │  │  ← Input label
│  │  [ ________________________ ]  │  │  ← Text input
│  │                                │  │
│  │  Why do you want a club?  *    │  │  ← Textarea label
│  │  [ ________________________ ]  │  │
│  │  [ ________________________ ]  │  │
│  │  [ ________________________ ]  │  │  ← Textarea (3 visible rows)
│  │  0 / 300 characters            │  │  ← Character counter
│  └────────────────────────────────┘  │
│                                      │
│  What happens next                   │  ← Info section title
│  Your application will be reviewed   │  ← Info body copy
│  within 3–5 business days. You'll    │
│  be notified via the app.            │
│                                      │
│  [ SUBMIT APPLICATION ]              │  ← Primary CTA
│                                      │
└──────────────────────────────────────┘
│  [Home] [Clubs] [Sessions] [Profile] [Notif] │  ← Bottom nav
```

---

## Components

### Header Bar
- Back arrow (icon button, left) → navigates to previous screen
- Title: `Apply to Own a Club` — `text-heading` (18px, SemiBold 600), `color-text-primary`, centered
- Background: `color-bg-base`, border-bottom: 1px solid `color-border`
- Height: 56px

### Hero Text Block
- Title: `Become a Club Owner` — `text-title` (22px, SemiBold), `color-text-primary`
- Subtitle: 2-line description of what Club Ownership means — `text-body`, `color-text-secondary`
- Padding: `space-5` (20px) horizontal, `space-8` (32px) top

### Form Card
- Background: `color-bg-surface`
- Border: 1px solid `color-border`
- Border radius: `radius-lg` (14px)
- Padding: `space-6` (24px)
- Margin: 0 `space-4` (16px)

#### Intended Club Name Field
- Label: `Intended Club Name` — `text-small` (13px), `color-text-secondary`, uppercase `text-label` style
- Required indicator: `*` in `color-error`
- Input: standard text field spec (48px height, `color-bg-elevated`, `radius-md`, `color-accent` focus border)
- Placeholder: `e.g. Sunrise Badminton Club`
- Max length: 60 characters
- Error state: `color-error` border + inline message below field: `text-small`, `color-error`

#### Description / Purpose Textarea
- Label: `Why do you want a club?`
- Required indicator: `*`
- Textarea: same styling as input but height expands to 3 lines minimum; auto-grows with content up to 8 lines
- Placeholder: `Describe your intended club, who it's for, and how you plan to run sessions.`
- Max length: 300 characters
- Character counter: `text-small`, `color-text-secondary`, right-aligned below textarea, updates live
- Counter turns `color-error` when ≥ 280 characters

### "What Happens Next" Info Block
- Title: `What happens next` — `text-small`, `color-text-secondary`, uppercase
- Body: plain copy explaining the review process and notification — `text-body`, `color-text-secondary`
- Padding: `space-5` top/bottom, `space-5` horizontal

### Submit Button
- Label: `SUBMIT APPLICATION`
- Style: Primary Button spec from branding — `color-accent` background, black label, 48px height, full-width, `radius-md`, `shadow-accent`
- Margin: `space-5` horizontal, `space-6` bottom
- Disabled state: `color-bg-elevated` background, `color-text-disabled` label — when required fields are empty

---

## States

### Default (Empty Form)
Required fields empty. Submit button is disabled.

### Filling In
Character counter updates live. Submit button activates once both required fields have content.

### Submitting
Submit button shows spinner, becomes non-interactive. Form fields are disabled.

### Success
- Toast: "Application submitted. We'll notify you of the outcome." slides in from top
- User is navigated back to the previous screen (or Home) after 1.5s delay

### Already Applied (Pending)
If the player already has a pending application:
- The page shows a read-only state with their submitted data
- A status banner at top: "Your application is under review." — `color-warning` (`#FFB800`) left border, `color-bg-surface` background
- Submit button is replaced with a disabled "Application Pending" label

### Rejected (Re-apply eligible)
If a previous application was rejected and 30 days have passed:
- A banner displays: "Your previous application was not approved. You may reapply." — `color-text-secondary`
- Form is empty and editable again

---

## Modals

### Submit Confirmation Modal
Triggered when player taps "Submit Application" with valid data.

- Background: `color-bg-surface`, `radius-xl`, `shadow-modal`
- Backdrop: `rgba(0,0,0,0.6)`
- Title: `Submit Your Application?` — `text-title`, `color-text-primary`
- Body: `You're applying to become a Club Owner. This will be reviewed by the ROTRA team.` — `text-body`, `color-text-secondary`
- Actions:
  - Primary: `CONFIRM` — `color-accent` button, full-width
  - Secondary: `Cancel` — outline button, full-width, below primary
- Spacing between buttons: `space-3` (12px)

---

## Responsive Layout

### Breakpoints
| Breakpoint | Range | Layout |
|-----------|-------|--------|
| Mobile | < 768px | Full-screen scroll, single column |
| Tablet | 768px–1023px | Single column, `max-width: 600px`, centered |
| Desktop | ≥ 1024px | Single column, `max-width: 640px`, centered, no bottom nav replacement |

### Desktop (≥ 1024px)

- **Navigation**: Left sidebar replaces bottom nav (see Home for sidebar spec)
- **Content area**: Horizontally centered column, `max-width: 640px`, with generous vertical padding (`space-10` top)
- **Form card**: Full-width within the `640px` column; elevated appearance with `shadow-modal` since there's more visual breathing room
- **Submit button**: Stays full-width within the column; no change needed
- **Modal**: Submit confirmation modal renders as a centered overlay (`max-width: 480px`) rather than a bottom sheet; vertically centered with backdrop

### Tablet (768px–1023px)
- Content column `max-width: 600px`, centered
- Bottom nav still visible (sidebar not yet triggered)

---

## Design Tokens
| Token | Usage |
|-------|-------|
| `color-bg-base` | Page background |
| `color-bg-surface` | Form card, modal background |
| `color-bg-elevated` | Input backgrounds |
| `color-accent` | Submit button, focus borders |
| `color-error` | Required field indicators, validation messages |
| `color-warning` | "Pending" status banner |
| `color-text-primary` | Page title, input values |
| `color-text-secondary` | Labels, helper text |
| `text-title` 22px SemiBold | Hero title |
| `text-heading` 18px SemiBold | Header bar title |
| `text-body` 15px | Descriptions, body copy |
| `text-small` 13px | Field labels, character counter |
| `radius-lg` 14px | Form card |
| `radius-md` 10px | Inputs, buttons |
