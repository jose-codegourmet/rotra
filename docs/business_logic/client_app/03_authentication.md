# 03 — Authentication

## Overview

Authentication is handled exclusively via **Facebook Login** for the MVP. This enforces single-account-per-person and eliminates the need for email/password management.

---

## Sign-In Method

| Property | Value |
|----------|-------|
| Provider | Facebook (Meta) |
| Protocol | OAuth 2.0 |
| Scope requested | `public_profile` (name, profile photo) |
| Email scope | Optional — used for contact only, not for identity |
| MVP support | Facebook only |
| Future providers | Google, Apple (Phase 2+) |

---

## Account Creation Flow

```
1. User taps "Continue with Facebook"
2. Facebook OAuth consent screen appears
3. User grants permission
4. App receives Facebook access token
5. Server exchanges token for Facebook user profile (ID, name, photo)
6. Server checks if a Player account with this Facebook ID already exists:
   a. If NO  → create new Player account (incomplete), seed name + photo from Facebook
              → App issues session token; redirects to /onboarding/phone
   b. If YES → log in to existing Player account
7. App issues session token (JWT or equivalent)
8. New accounts: redirects to /onboarding/phone (phone number collection)
9. After phone submission: redirects to /onboarding/profile (profile onboarding wizard)
10. After wizard completion: server sets onboarding_completed = true; redirects to /home
11. Returning accounts (step 6b): land on /home directly
```

---

## Phone Number Onboarding

Triggered exclusively on first login (new accounts). Returning users skip this step entirely.

| Property | Value |
|----------|-------|
| Route | `/onboarding/phone` |
| Access | Authenticated new accounts only; existing accounts are redirected to `/home` |
| Skip allowed | No — the screen cannot be dismissed or bypassed |

### Behavior

* A single required field collects the player's phone number
* Input is validated against E.164 format (country code + number); an inline error is shown for invalid input
* Submitting a valid number saves it to the player's profile and redirects to `/onboarding/profile`
* The phone number is stored privately — it is not displayed on the public profile
* The player can update their phone number later from the Profile settings screen

---

## Profile Onboarding Wizard

Triggered immediately after phone number collection for all new accounts. Returning users and legacy accounts skip this step entirely.

| Property | Value |
|----------|-------|
| Route | `/onboarding/profile` |
| Access | Authenticated accounts where `onboarding_completed === false` |
| Skip allowed | No — the screen cannot be dismissed or bypassed |
| Guard | Server-side; any authenticated request with `onboarding_completed === false` is redirected here |

### Behavior

* A 5-step linear wizard collects: display name (pre-filled from Facebook), age, playing since year, court position, and tournament wins in the past year
* All five fields are required; the wizard cannot be submitted until all steps are complete
* Data is submitted as a single atomic API call when the player completes step 5
* On success, the server sets `player.onboarding_completed = true` and the app redirects to `/home`
* All collected fields are editable later from Profile Settings
* Age is stored privately; all other collected fields are shown on the public profile

See [`20_onboarding.md`](./20_onboarding.md) for the full specification, including step-level validation rules, field definitions, data payload, legacy account handling, and canonical rules.

---

## Single Account Enforcement

* The unique key is the **Facebook user ID** (a numeric string unique to each Facebook account)
* This check is performed server-side on every login attempt
* If a second Facebook account tries to create an account using the same device, it will succeed — there is no device-level lock
* The lock is at the Facebook identity level: one Facebook account = one app account

### Duplicate Handling

* If a user tries to register with a Facebook account that is already linked to an existing player account, they are simply logged into the existing account (no duplicate is created)
* There is no "merge accounts" flow — accounts are permanently tied to their Facebook identity

---

## Profile Seeding

On first login, the player's profile is pre-populated with:

| Field | Source | Editable after? |
|-------|--------|-----------------|
| Display name | Facebook `name` field | Yes — pre-filled in onboarding wizard Step 1 for confirmation |
| Profile photo | Facebook profile photo URL | Yes (upload custom photo) |
| Joined date | Server timestamp at account creation | No |

Additional profile fields collected during the onboarding wizard (see `20_onboarding.md`):

| Field | Collected at | Editable after? |
|-------|-------------|-----------------|
| Age | `/onboarding/profile` Step 2 | Yes (private) |
| Playing since | `/onboarding/profile` Step 3 | Yes |
| Court position | `/onboarding/profile` Step 4 | Yes |
| Tournament wins last year | `/onboarding/profile` Step 5 | Yes |

All remaining profile fields (playing level, gear) must be filled in manually from Profile Settings after registration.

---

## Session Management

| Property | Behavior |
|----------|----------|
| Token type | JWT (JSON Web Token) |
| Token expiry | 7 days (access token) |
| Refresh | Silent refresh before expiry; user is not prompted |
| Logout | Clears local token; user must re-authenticate via Facebook |
| Revocation | Server-side token invalidation on explicit logout or account suspension |

---

## Security Considerations

| Concern | Handling |
|---------|----------|
| Token theft | Short expiry + refresh rotation |
| Fake Facebook accounts | Not in scope for MVP; trust Facebook's identity verification |
| Account suspension | Admin can flag an account; flagged accounts cannot log in |
| Rate limiting | Login endpoint rate-limited per IP (future) |

---

## Future Authentication (Phase 2+)

* Google Sign-In
* Apple Sign-In
* The account identity model will be extended to support multiple OAuth providers linked to a single player account
* A player could log in with Google or Facebook and reach the same account (if they have linked both)
