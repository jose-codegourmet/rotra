# 20 — Player Onboarding

## Overview

The player onboarding wizard is a mandatory, multi-step profile setup screen that runs immediately after the phone number collection step for all new accounts. It collects the core identity and playing background details that seed the player's public profile and inform skill matching.

Onboarding is triggered once per account lifetime. Returning users are never redirected here.

---

## 20.1 Route & Access Guard

| Property | Value |
|----------|-------|
| Route | `/onboarding/profile` |
| Access | Authenticated new accounts only |
| Guard condition | `player.onboarding_completed === false` |
| Bypass allowed | No — the screen cannot be dismissed or skipped |
| Redirect (authenticated, completed) | `/home` |
| Redirect (unauthenticated) | `/login` |

The guard is evaluated server-side on every request to `/onboarding/profile`. Once `onboarding_completed` is set to `true` on the player record, this route permanently redirects to `/home`.

---

## 20.2 Position in the Auth Flow

```
1. User taps "Continue with Facebook"
2. Facebook OAuth consent screen
3. App receives Facebook access token
4. Server validates token → creates new Player account
5. App issues session token → redirects to /onboarding/phone
6. Player submits phone number → /onboarding/phone marks phone as collected
7. App redirects to /onboarding/profile  ← NEW
8. Player completes 5-step wizard
9. Server sets player.onboarding_completed = true
10. App redirects to /home
```

---

## 20.3 Wizard Structure

The onboarding is a **5-step linear wizard** with a progress indicator. Players move forward one step at a time. Back navigation is allowed between steps (data is preserved). The wizard cannot be submitted with any step incomplete.

| Step | Field | Input Type | Required | Stored As |
|------|-------|-----------|----------|-----------|
| 1 | Name | Text input (pre-filled from Facebook) | Yes | `player.display_name` |
| 2 | Age | Integer picker (13–99) | Yes | `player.age` |
| 3 | Playing since | Year picker or "Less than 1 year" | Yes | `player.playing_since` |
| 4 | Court position | Single-select chip group | Yes | `player.court_position` |
| 5 | Tournament wins last year | Single-select chip group | Yes | `player.tournament_wins_last_year` |

---

## 20.4 Step Definitions

### Step 1 — Name

**Purpose:** Confirm or correct the display name seeded from Facebook. Players frequently have Facebook names that differ from the name they want shown in the app.

| Property | Value |
|----------|-------|
| Pre-filled value | Facebook `name` field from OAuth |
| Min length | 2 characters |
| Max length | 40 characters |
| Allowed characters | Letters, spaces, hyphens, apostrophes |
| Validation | Non-empty; min 2 chars; no special characters beyond the allowed set |
| Error copy | "Name must be at least 2 characters." / "Name contains invalid characters." |

The name entered here becomes `player.display_name` and is shown in all queue, leaderboard, and profile views. It is editable later from Profile Settings.

---

### Step 2 — Age

**Purpose:** Used for internal analytics and future age-bracket matching features. Age is stored privately and is never shown on the public profile.

| Property | Value |
|----------|-------|
| Input type | Scrollable integer picker |
| Range | 13–99 |
| Default | No pre-selection (player must actively choose) |
| Validation | Integer within range |
| Error copy | "Please select your age." |
| Privacy | Private — not shown on public profile, not shared with other players |

Age is editable later from Profile Settings.

---

### Step 3 — Playing Since

**Purpose:** Captures how long the player has been playing badminton. Shown publicly on their profile as context for their skill level and experience.

| Property | Value |
|----------|-------|
| Input type | Year picker + "Less than 1 year" option |
| Year range | 1960 – current year |
| Special option | "Less than 1 year" (stored as sentinel value `null` with `playing_since_less_than_one_year = true`) |
| Default | No pre-selection |
| Validation | Must select a year or the "Less than 1 year" option |
| Error copy | "Please tell us when you started playing." |
| Public display | "Playing since [YYYY]" or "Playing for less than a year" |

Playing since is editable later from Profile Settings.

---

### Step 4 — Court Position

**Purpose:** Captures the player's preferred doubles court position. Used by Que Masters when forming balanced teams and shown on the public profile.

| Option | Label | Internal Value |
|--------|-------|----------------|
| Front | Front Player | `front` |
| Back | Back Player | `back` |
| All-Around | All-Around Player | `all_around` |

| Property | Value |
|----------|-------|
| Input type | Single-select chip group (one active at a time) |
| Default | No pre-selection |
| Validation | Must select exactly one option |
| Error copy | "Please select your court position." |
| Public display | Shown in the Play Style section of the public profile |

The internal value `all_around` maps to the existing "Both" concept in `05_player_profile.md` and `06_skill_rating.md`. The label "All-Around" is used exclusively in the UI.

Court position is editable later from Profile Settings and the Play Style section of the own-profile screen.

---

### Step 5 — Tournament Wins Last Year

**Purpose:** Captures recent competitive achievement. Used to show a contextual badge on the public profile and to help seed initial skill matching.

| Option | Label | Internal Value |
|--------|-------|----------------|
| None | No wins | `none` |
| 1–3 | 1–3 tournament wins | `1_to_3` |
| 4 or more | 4+ tournament wins | `4_plus` |

| Property | Value |
|----------|-------|
| Input type | Single-select chip group |
| Default | No pre-selection |
| Validation | Must select exactly one option |
| Error copy | "Please select your recent tournament wins." |
| Public display | Shown as a badge on the public profile (omitted if `none`) |
| Time scope | "Last year" = rolling 12 months at time of registration |

#### Annual Reset

`tournament_wins_last_year` is a snapshot value taken at registration. It is **not automatically updated** by the system. Players may update it at any time from Profile Settings. A future notification (Phase 2+) will prompt players annually (at account anniversary) to refresh this value.

---

## 20.5 Validation Rules

- Every step must be completed before the "Next" button activates on that step.
- Inline validation fires on attempt to advance (not on every keystroke), except for the name field which validates on blur.
- The wizard cannot be submitted with any field in an invalid state.
- If the player navigates back to an earlier step and changes a value, that change is preserved in the wizard state and submitted as part of the final payload.

---

## 20.6 Data Submission

All five fields are submitted as a **single atomic API call** when the player taps "Finish" on step 5. No partial saves occur between steps — the wizard holds state client-side until final submission.

### Payload

```json
{
  "display_name": "string",
  "age": 25,
  "playing_since": 2015,
  "playing_since_less_than_one_year": false,
  "court_position": "front | back | all_around",
  "tournament_wins_last_year": "none | 1_to_3 | 4_plus"
}
```

### Server actions on receipt

1. Validate all fields server-side (same rules as client-side)
2. Update `players` record with all five fields
3. Set `player.onboarding_completed = true`
4. Return `200 OK` with updated player object
5. Client redirects to `/home`

### Error handling

If the API call fails, a toast error is shown ("Something went wrong. Please try again.") and the player remains on step 5. The "Finish" button returns to its active state. No data is partially saved.

---

## 20.7 Skip / Bypass Rules

| Scenario | Behaviour |
|----------|-----------|
| Player closes the app mid-wizard | On next open, returned to `/onboarding/profile` at step 1 (no partial state persisted server-side) |
| Player navigates to any other route | Server-side guard redirects back to `/onboarding/profile` |
| Player tries to access `/home` directly | Redirected to `/onboarding/profile` |
| Player completes wizard | `onboarding_completed = true`; guard permanently disabled for this account |
| Player registered before this feature | `onboarding_completed = true` by default (migration); new fields default to `null` |

---

## 20.8 Legacy Accounts (Pre-feature Migration)

Players who registered before the onboarding wizard is shipped are **not forced through the wizard**. Their records are set to `onboarding_completed = true` during the migration, and all new fields default to `null`.

Their public profile shows "Not set" where these fields would appear, with a contextual prompt: "Complete your profile" linking to Profile Settings where they can fill in the missing fields individually.

---

## 20.9 Field Editability After Onboarding

| Field | Editable After? | Location |
|-------|----------------|----------|
| Display name | Yes | Profile Settings |
| Age | Yes | Profile Settings (private) |
| Playing since | Yes | Profile Settings |
| Court position | Yes | Profile Settings / Play Style section |
| Tournament wins last year | Yes | Profile Settings |

---

## 20.10 Canonical Rules

| ID | Rule |
|----|------|
| RULE-050 | A player account with `onboarding_completed = false` must be redirected to `/onboarding/profile` on every authenticated request until the wizard is completed. |
| RULE-051 | The onboarding wizard payload must be submitted atomically; partial field saves during the wizard are not permitted. |
| RULE-052 | `player.age` is private and must never appear on the public profile, in leaderboard rows, or in any player comparison view. |
| RULE-053 | The `all_around` court position value is the canonical internal identifier; the UI label "All-Around" must not be persisted to the database. |
| RULE-054 | `tournament_wins_last_year` reflects the player's self-reported state at the time of submission and is not automatically recalculated by the system. |
