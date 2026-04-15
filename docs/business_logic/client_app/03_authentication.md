# 03 — Authentication

## Overview

Authentication is handled via two entry paths: **Facebook Login** (managed by Supabase OAuth) and **Email Invitation**. Facebook is the identity anchor for every account — regardless of which path a user enters through, a Facebook account must ultimately be connected before the user is considered verified.

New users are **unverified by default** upon first sign-in. Verified status is a composite of three independently tracked conditions and unlocks full platform access.

---

## 03.1 Sign-In / Registration Paths

### Path A — Facebook Login (direct)

| Property | Value |
|---|---|
| Provider | Facebook (Meta) via Supabase Auth |
| Protocol | OAuth 2.0 |
| Scopes requested | `public_profile` (name, profile photo); `email` (optional, for linking) |
| Trigger | User taps "Continue with Facebook" on the login screen |

**Flow:**

```
1. User taps "Continue with Facebook"
2. Supabase initiates Facebook OAuth consent screen
3. User grants permission
4. Supabase receives Facebook access token and exchanges it for user profile (ID, name, photo)
5. Supabase checks auth.users for an existing record:
   a. NEW user → auth.users row created; handle_new_user() trigger fires; profiles row seeded
              → Session issued; redirect to /onboarding (wizard)
   b. EXISTING user → session issued; redirect to /home
6. Returning user who has not completed onboarding → redirected to /onboarding on every app open
```

---

### Path B — Email Invitation

| Property | Value |
|---|---|
| Trigger | An admin or club owner sends a tokenized invite to a target email address |
| Token TTL | 7 days from issue |
| Result | Recipient's email is pre-linked to their account upon Facebook login |

**Flow:**

```
1. Inviter (admin or club owner) issues an invitation to an email address
   → An email_invitations row is created with status = 'pending'
   → A tokenized invite link is emailed to the recipient
2. Recipient clicks the link
   → App validates the invite token (must be pending and not expired)
   → Recipient is shown a landing page with a "Connect with Facebook" prompt
3. Recipient taps "Continue with Facebook"
   → Supabase Facebook OAuth runs (same as Path A)
4. On Facebook auth success:
   a. NEW user → profiles row created; invite email populated into profiles.email
   b. EXISTING user → invite email linked to their existing profiles.email (if not already set)
   → email_invitations row updated: status = 'accepted', accepted_by = profile.id
5. Supabase sends an email verification link to the linked email address
6. Recipient clicks the verification link in that email
   → profiles.email_verified = true; profiles.email_verified_at = now()
7. Redirect to /onboarding (if not completed) or /home
```

**Notes:**
- If the invite token has expired, the user sees an error screen with a prompt to request a new invite.
- A user who already has a linked + verified email cannot have it replaced by a new invitation unless their current email is unverified.
- The inviter is recorded in `email_invitations.invited_by` for audit purposes.

---

## 03.2 Account Verification Model

New accounts are **unverified immediately after Facebook login**. An account becomes **verified** only when all three of the following conditions are simultaneously satisfied:

| # | Condition | How it's set |
|---|---|---|
| 1 | Linked Facebook account | `profiles.facebook_id IS NOT NULL` — set automatically on any Facebook login |
| 2 | Linked and verified email | `profiles.email IS NOT NULL AND profiles.email_verified = true` — set when email invitation accepted + email verification link clicked |
| 3 | Onboarding wizard completed | `profiles.onboarding_completed = true` — set when the wizard is finished |

The composite flag `profiles.is_verified` is a **generated column**:
```sql
is_verified BOOLEAN GENERATED ALWAYS AS (
  facebook_id IS NOT NULL
  AND email_verified
  AND onboarding_completed
) STORED
```

### Verified vs. Unverified Access

| Feature | Unverified | Verified |
|---|---|---|
| View the app / explore | Yes | Yes |
| Join a queue session | No | Yes |
| Submit match reviews | No | Yes |
| Appear on leaderboards | No | Yes |
| Create a club | No | Yes |
| Verified badge on profile | No | Yes |
| Onboarding wizard blocked | Shown on every open | Hidden (completed) |

Unverified users who try to take a restricted action are shown an inline prompt explaining which condition(s) remain unsatisfied.

---

## 03.3 Single Account Enforcement

- The identity key is the **Facebook user ID** (`profiles.facebook_id`), a globally unique numeric string from Meta.
- This check is performed server-side by Supabase on every OAuth login.
- One Facebook account = one ROTRA account. Duplicate creation is blocked at the DB level (`UNIQUE` constraint on `profiles.facebook_id`).
- If a second login attempt uses a Facebook account already in `profiles`, the existing session is returned — no duplicate is created.
- There is no "merge accounts" flow; accounts are permanently tied to their Facebook identity.

---

## 03.4 Profile Seeding on First Login

When `handle_new_user()` fires (first login via either path), the profile is seeded as follows:

| Field | Source | Editable after? |
|---|---|---|
| `id` | `auth.users.id` | No |
| `facebook_id` | `auth.users.raw_user_meta_data->>'provider_id'` | No |
| `name` | `auth.users.raw_user_meta_data->>'full_name'` | Yes (wizard Step 1) |
| `avatar_url` | `auth.users.raw_user_meta_data->>'avatar_url'` | Yes |
| `email` | `auth.users.email` (if present, e.g. from invitation path) | Yes |
| `onboarding_completed` | `false` | Becomes `true` on wizard completion |
| `email_verified` | `false` | Becomes `true` on email link click |
| `is_verified` | `false` (generated) | Becomes `true` once all 3 conditions met |

---

## 03.5 Onboarding Redirect Guard

Any authenticated user with `onboarding_completed = false` is redirected to `/onboarding` on every app open. The onboarding wizard is non-closeable and cannot be bypassed. See [`20_onboarding.md`](./20_onboarding.md) for the full wizard specification.

| State | Redirect destination |
|---|---|
| Unauthenticated | `/login` |
| Authenticated + `onboarding_completed = false` | `/onboarding` |
| Authenticated + `onboarding_completed = true` | `/home` |

---

## 03.6 Session Management

| Property | Behaviour |
|---|---|
| Token type | JWT (managed by Supabase Auth) |
| Access token expiry | 1 hour |
| Refresh token expiry | 7 days |
| Refresh behaviour | Silent; user is not prompted |
| Logout | Clears local token; next login requires Facebook OAuth |
| Revocation | Server-side via Supabase Admin API on explicit logout or account suspension |

---

## 03.7 Security Considerations

| Concern | Handling |
|---|---|
| Token theft | Short access token + refresh rotation |
| Invite token abuse | Tokens expire after 7 days; single-use (accepted status blocks reuse) |
| Fake Facebook accounts | Not in scope for MVP; trust Meta's identity verification |
| Account suspension | Admin can flag an account; flagged accounts cannot log in |
| Email spoofing | Supabase email verification link required before `email_verified = true` |

---

## 03.8 Canonical Rules

| ID | Rule |
|----|------|
| RULE-001 | A ROTRA account must have a linked Facebook account. Facebook OAuth is always required, regardless of entry path. |
| RULE-002 | New accounts are unverified by default. No explicit "verify me" action is available; verification is the result of completing all three conditions. |
| RULE-003 | `is_verified` is a server-computed value. Clients must never compute or cache this flag independently. |
| RULE-004 | Invite tokens are single-use. Once `email_invitations.status = 'accepted'`, the token cannot be reused. |
| RULE-005 | Email verification requires Supabase email confirmation. Linking an email to a profile alone does not set `email_verified = true`. |
| RULE-006 | Any authenticated user with `onboarding_completed = false` must be redirected to `/onboarding` on every app open. See also RULE-050. |

---

## 03.9 Future Authentication (Phase 2+)

- Google Sign-In support (Supabase Google OAuth provider)
- Apple Sign-In support
- Multi-provider linking: a player could log in with Google or Facebook and reach the same account
- The identity model will be extended so that `facebook_id` becomes one of several linked provider identifiers
