# View: Club Owner Approvals

## Purpose

The approvals view is the structured replacement for the manual email-based Club Owner application process (`jose@codegourmet.io`). It presents all pending Club Owner applications in a sortable queue and provides a split-pane review interface where the admin can examine the applicant's profile, activity history, and stated purpose before approving or rejecting.

Approval is immediate and irreversible without a follow-up admin action. Rejection requires an optional note; rejected applicants are notified in-app and cannot re-apply for a configurable cooldown period (default 30 days).

## Route

`/admin/approvals` — authenticated admins only

## Roles

Platform Admin, Super Admin. Both roles have equal access to this view.

---

## Layout

Two-column split pane. The left pane holds the application queue table. The right pane shows the detail view for the selected application. When no application is selected, the right pane shows an empty state prompt.

```
┌─────────────────────┬──────────────────────────────────────────────────────┐
│  SIDEBAR (240px)    │  ● PRODUCTION                              Admin ▾   │
│                     ├──────────────────────────────────────────────────────┤
│  [▪] Dashboard      │  Club Owner Approvals                                │
│  [▪] Kill Switches  │  ─────────────────────────────────────────────────   │
│  [▪] Environments   │  3 Pending  ·  142 Total (all time)                  │
│  [▪] Approvals   3← │                                                      │
│  ...                ├────────────────────────────┬───────────────────────── │
│                     │  QUEUE  (45%)              │  DETAIL PANE  (55%)     │
│                     │                            │                         │
│                     │  [ Filter: Pending ▾ ]     │  ← Select an applica-   │
│                     │  [ Sort: Oldest First ▾ ]  │     tion to review      │
│                     │                            │                         │
│                     │  ┌────────────────────────┐│                         │
│                     │  │ ● Alex Santos          ││                         │
│                     │  │ Sunrise BC · 2 days    ││                         │
│                     │  │ [ Pending ]            ││                         │
│                     │  ├────────────────────────┤│                         │
│                     │  │ ● Maria Reyes          ││                         │
│                     │  │ Metro BC · 5 days      ││                         │
│                     │  │ [ Pending ]            ││                         │
│                     │  ├────────────────────────┤│                         │
│                     │  │ ● Carlo Dizon          ││                         │
│                     │  │ Eastside Shuttlers     ││                         │
│                     │  │ · 1 day    [ Pending ] ││                         │
│                     │  └────────────────────────┘│                         │
└─────────────────────┴────────────────────────────┴─────────────────────────┘
```

When an application is selected in the queue:

```
┌──────────────────────────────────┬─────────────────────────────────────────┐
│  QUEUE (selected row highlighted)│  DETAIL PANE                            │
│                                  │                                         │
│  [● Alex Santos — selected]      │  Alex Santos          [ View Profile ↗ ]│
│  [  Maria Reyes               ]  │  @alex_santos · Facebook: Alex Santos   │
│  [  Carlo Dizon               ]  │  Applied: Mar 28, 2026 (2 days ago)     │
│                                  │                                         │
│                                  │  Requested club name:                   │
│                                  │  Sunrise Badminton Club                 │
│                                  │                                         │
│                                  │  Purpose / Description:                 │
│                                  │  "We want to organise weekly sessions   │
│                                  │   at Sunrise Sports Hall, targeting     │
│                                  │   intermediate-level players..."        │
│                                  │                                         │
│                                  │  ── Player Activity ─────────────────   │
│                                  │  Sessions attended:   24                │
│                                  │  Matches played:      87                │
│                                  │  Clubs joined:        2                 │
│                                  │  Member since:        Jan 2026          │
│                                  │  Tier:                Elite 1           │
│                                  │                                         │
│                                  │  ── Previous Applications ────────────  │
│                                  │  None                                   │
│                                  │                                         │
│                                  │  ┌─────────────────┐ ┌───────────────┐  │
│                                  │  │  Reject         │ │  Approve ✓    │  │
│                                  │  └─────────────────┘ └───────────────┘  │
└──────────────────────────────────┴─────────────────────────────────────────┘
```

---

## Components

### Queue Summary Bar

- Full-width strip directly below the page header
- Background: `color-bg-surface`; border-bottom: 1px `color-border`; `space-5` padding
- **Pending count:** `text-body`, Bold, `color-text-primary` (e.g. `3 Pending`)
- **Total all-time:** `text-body`, `color-text-secondary` (e.g. `142 Total (all time)`)
- Separator: `·` between the two counts

### Queue Controls

Two inline dropdowns in the queue pane header:

- **Filter dropdown:** `Pending` (default) · `Approved` · `Rejected` · `All`
  - Dropdown: `color-bg-elevated` background, `color-border` border, `radius-md`, `text-body`, 40px height, 160px width
- **Sort dropdown:** `Oldest First` (default) · `Newest First` · `A–Z by Name`
  - Same styling as filter dropdown

### Queue List

- Background: `color-bg-surface`
- Each application row: 80px height, `space-4` horizontal padding; border-bottom 1px `color-border`
- Row layout:
  - **Avatar:** 36×36px circle, initials-based, `radius-full`; background colour derived from applicant name (deterministic hue)
  - **Player name:** `text-body` (15px, Medium), `color-text-primary`
  - **Requested club name:** `text-small`, `color-text-secondary`
  - **Submission age:** `text-small`, `color-text-disabled` — e.g. `"2 days ago"`
  - **Status badge:** right-aligned pill
    - `Pending` — `color-warning-subtle` bg, `color-warning` text
    - `Approved` — `color-accent-subtle` bg, `color-accent` text
    - `Rejected` — `color-error-subtle` bg, `color-error` text
- Selected row: `color-accent-subtle` background; 3px left inset bar `color-accent`
- Hover (unselected): `color-bg-elevated` background
- Clicking a row selects it and loads the detail pane
- Empty state (no applications matching filter): centred message `"No applications found."` — `text-body`, `color-text-disabled`

### Detail Pane

Shown when an application is selected. Right-side panel, 55% width.

- Background: `color-bg-base`; left border: 1px `color-border`; `space-6` padding
- Scrollable if content exceeds viewport height

**Applicant Header:**
- Player name — `text-title` (20px, SemiBold), `color-text-primary`
- Username / Facebook identity — `text-small`, `color-text-secondary`
- Submission date — `text-small`, `color-text-disabled` — full date + relative (e.g. `"Mar 28, 2026 (2 days ago)"`)
- `View Profile ↗` link — top-right, `text-small`, `color-accent` — opens the player's Client App profile in a new tab

**Requested Club Name:**
- Label: `"Requested club name:"` — `text-small`, `color-text-secondary`
- Value: `text-heading` (18px, SemiBold), `color-text-primary`

**Purpose / Description:**
- Label: `"Purpose / Description:"` — `text-small`, `color-text-secondary`
- Body: quotation-styled block — `text-body`, `color-text-primary`; `color-bg-surface` background; `radius-md`; `space-4` padding; left border 3px `color-accent-dim`
- Max display height: 160px; if content is taller, the block scrolls internally with a fade-out gradient at the bottom

**Player Activity Section:**

Section label: `"Player Activity"` — `text-small`, uppercase, `color-text-disabled`; divider line

A 3-column stats grid:

| Stat | Value |
|---|---|
| Sessions attended | count |
| Matches played | count |
| Clubs joined | count |
| Member since | month + year |
| Current tier | tier name + sub-rank |
| Win rate | % (shown only if ≥ 5 scored matches) |

- Each stat: label (`text-small`, `color-text-secondary`) + value (`text-heading`, `color-text-primary`) stacked vertically
- Arranged in a 3-column grid with `space-4` gap
- Tier badge: small coloured pill matching tier colour

**Previous Applications Section:**

Section label: `"Previous Applications"` — `text-small`, uppercase, `color-text-disabled`; divider line

- If no prior applications: `"None"` — `text-body`, `color-text-disabled`
- If prior applications exist: a table of past submissions:
  - Columns: Date · Club Name Requested · Outcome · Decided By · Re-apply Cooldown
  - Rejected rows show a cooldown badge: `"Re-apply eligible: [date]"` — `color-warning-subtle` bg, `color-warning` text if cooldown active; `color-accent-subtle` bg if cooldown has passed

**Action Buttons:**

Two buttons at the bottom of the detail pane, anchored to the bottom edge (sticky footer within the pane):

- **Reject button:** `color-bg-surface` background, `color-error` border (1px), `color-error` label `"Reject"`, `text-label`, `radius-md`, height 44px, width 160px — triggers the Reject Modal
- **Approve button:** `color-accent` background, white label `"Approve ✓"`, `text-label`, `radius-md`, height 44px, width 160px — triggers the Approve Confirmation Modal

---

## Modals

### Approve Confirmation Modal

```
┌───────────────────────────────────────────────────┐
│  Approve Club Owner: Alex Santos?                 │
│  ─────────────────────────────────────────────    │
│  This will immediately grant Club Owner role to   │
│  Alex Santos. They will be able to create a club  │
│  and manage sessions.                             │
│                                                   │
│  Alex will receive an in-app notification.        │
│                                                   │
│  [  Cancel  ]              [ Approve → ]          │
└───────────────────────────────────────────────────┘
```

- Same modal card spec as other views (`shadow-modal`, `radius-xl`, `color-bg-surface`, max-width 440px)
- **Title:** `"Approve Club Owner: [Name]?"` — `text-heading`, `color-text-primary`
- **Body:** impact statement — `text-body`, `color-text-secondary`
- **Notification note:** `text-small`, `color-text-disabled`
- **Cancel button:** `color-bg-elevated`, `color-text-primary`
- **Approve button:** `color-accent` background, white, label `"Approve →"`
- On confirmation: application status updates to `Approved` in the queue; detail pane shows approved state; player receives in-app notification; queue row moves out of Pending filter if filter is active

### Reject Modal

```
┌───────────────────────────────────────────────────┐
│  Reject application: Alex Santos                  │
│  ─────────────────────────────────────────────    │
│  Rejection reason (shown to the applicant):       │
│  [ _________________________________________ ]    │
│  [ _________________________________________ ]    │
│  Optional. Max 500 characters.                    │
│                                                   │
│  The applicant cannot re-apply for 30 days.       │
│                                                   │
│  [  Cancel  ]            [ Confirm Rejection ]    │
└───────────────────────────────────────────────────┘
```

- **Title:** `"Reject application: [Name]"` — `text-heading`, `color-text-primary`
- **Rejection note textarea:** optional; `color-bg-elevated` bg, `radius-md`, `color-border` border; placeholder `"Optional: explain why this application was rejected. This note will be shown to the applicant."`; max 500 chars; character counter (`text-micro`, `color-text-disabled`)
- **Cooldown note:** `text-small`, `color-text-secondary` — `"The applicant cannot re-apply for [N] days."` (N from platform config `thresholds.reapply_after_rejection_days`)
- **Cancel button:** `color-bg-elevated`, `color-text-primary`
- **Confirm button:** `color-error` background, white, label `"Confirm Rejection"`
- On confirmation: application status updates to `Rejected`; rejection note attached to record; player receives in-app notification (with note if provided); queue row removed from Pending filter

---

## States

### Empty Queue (all pending resolved)
Queue pane shows: large checkmark icon (40px, `color-accent`) + `"All applications reviewed."` — `text-heading`, `color-text-secondary`. Sidebar badge clears to zero.

### Application Loading
Clicking a queue row triggers a brief skeleton placeholder in the detail pane while data loads (skeleton bars for each content block, `color-bg-elevated` background, pulse animation).

### Decision Confirmed
After approve or reject is confirmed:
- The queue row badge updates to `Approved` or `Rejected`
- The detail pane action buttons become inactive (replaced by a read-only outcome strip: `"Approved by [Admin] on [date]"` or `"Rejected by [Admin] on [date]"`)
- The detail pane remains visible so the admin can review the decision before moving on

### Applicant in Cooldown
If an application is in the queue for a player who previously had a rejected application within the cooldown window, the Previous Applications section in the detail pane shows a warning: `"This applicant re-applied before their cooldown period ended."` — `color-warning-subtle` bg banner, `color-warning` text. The approve/reject actions are still available; the admin makes the call.

---

## Responsive Layout

| Breakpoint | Range | Layout |
|---|---|---|
| Desktop (primary) | ≥ 1280px | Two-column split pane (45% queue / 55% detail) |
| Desktop (compact) | 1024px–1279px | Two-column split pane (40% / 60%) |
| Tablet | 768px–1023px | Queue full-width; detail pane opens as a right-side drawer overlay |
| Mobile | < 768px | Not supported |

---

## Design Tokens

| Token | Usage |
|---|---|
| `color-bg-base` | Detail pane background |
| `color-bg-surface` | Queue list, section cards, modal card |
| `color-bg-elevated` | Row hover, filter dropdowns, reject note textarea |
| `color-border` | Row separators, panel borders, input borders |
| `color-accent` | Approve button, selected row bar, CTA links, tier-colour for Apex |
| `color-accent-subtle` | Selected row background, approved badge background, cooldown-passed badge |
| `color-accent-dim` | Description block left border |
| `color-error` | Reject button border + label, rejected badge text, confirm rejection button |
| `color-error-subtle` | Rejected badge background |
| `color-warning` | Pending badge text, cooldown-active badge text, early re-apply warning |
| `color-warning-subtle` | Pending badge background, cooldown-active badge background, early re-apply banner |
| `color-text-primary` | Player name, stats values, modal titles |
| `color-text-secondary` | Metadata, labels, modal body |
| `color-text-disabled` | Submission age, section headers, empty states |
| `shadow-modal` | Confirmation modals |
| `radius-xl` 20px | Modal cards |
| `radius-md` 10px | Buttons, inputs, description block |
| `text-title` 20px SemiBold | Player name in detail pane |
| `text-heading` 18px SemiBold | Club name, stats values |
| `text-body` 15px | Queue row names, description text |
| `text-small` 13px | Metadata, labels, previous applications |
| `text-micro` 10px | Character counters, badge text |
