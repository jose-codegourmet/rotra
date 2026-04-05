# Admin App — 04 Approvals & Moderation

## Overview

The Admin App handles two categories of human review: **Club Owner applications** (before Phase 3, handled via email) and **platform moderation** (flagged reviews, account actions, content removal).

---

## Part A: Club Owner Approvals

### Background

Players who want to create clubs must apply for Club Owner status. Until the Admin App is live (Phase 3), this is handled manually via email to `jose@codegourmet.io`. The Admin App replaces this process with a structured queue.

Reference: [`../client_app/02_user_roles.md`](../client_app/02_user_roles.md) — Section 2.2

---

### Application Queue

The Admin App shows all pending Club Owner applications in a table:

| Column | Description |
|--------|-------------|
| Player name | Applicant's display name and profile link |
| Facebook account | Linked Facebook identity |
| Submission date | When the application was submitted |
| Club name (requested) | The name they want for their club |
| Description | Their stated purpose/context for the club |
| Player stats | Sessions attended, matches played, clubs joined |
| Status | Pending / Approved / Rejected |

Applications are sorted by submission date (oldest first) by default.

---

### Review Flow

```
Admin opens an application
    ↓
Reviews player profile, stated purpose, and activity history
    ↓
Approves → player gains Club Owner role
    or
Rejects → admin adds optional rejection note
    ↓
Player receives in-app notification with outcome
    (rejection note is shown to the player if provided)
```

### Rules

- An Admin cannot approve their own application (not applicable since Admins are internal)
- Approval is immediate — the player gains Club Owner capability the moment the Admin confirms
- Rejected applicants can re-apply after 30 days (configurable)
- All decisions are logged with the Admin's identity and timestamp
- The current manual email fallback (`jose@codegourmet.io`) is deprecated once the Admin App is live

---

## Part B: Platform Moderation

### Flagged Reviews

Players can flag reviews they believe violate the content policy. Flagged reviews land in the Admin moderation queue.

Reference: [`../client_app/07_review_system.md`](../client_app/07_review_system.md)

#### Moderation Queue

| Column | Description |
|--------|-------------|
| Review content | The flagged text |
| Reviewer | Who wrote the review (non-anonymous to Admins) |
| Subject | Who the review is about |
| Match | The match the review is attached to |
| Flag reason | Selected by the flagger (Offensive / False / Harassment / Other) |
| Flagged by | Who flagged it (and their relationship to the review) |
| Flagged at | Timestamp |
| Status | Pending / Dismissed / Removed |

#### Actions

| Action | Effect |
|--------|--------|
| **Dismiss flag** | Review remains visible; flag is closed; flagger is notified |
| **Remove review** | Review is deleted from the match record and all views; reviewer is notified |
| **Remove + warn reviewer** | Review removed; reviewer receives a platform warning |
| **Remove + suspend reviewer** | Review removed; account suspended (see Account Actions below) |

All moderation decisions are logged with the Admin's identity and the stated reason.

---

### Account Actions

Admins can take the following actions on any player account:

| Action | Effect | Reversible? |
|--------|--------|-------------|
| **Warn** | Sends an in-app warning message to the player | N/A |
| **Suspend (temporary)** | Player cannot log in for the suspension period | Yes — Admin can lift early |
| **Suspend (permanent)** | Player account is permanently disabled | Yes — Super Admin only |
| **Delete account** | Account and all PII removed; match records anonymized | No |

#### Suspension Behavior

- Suspended players are logged out immediately on all devices
- During suspension, their profile shows as inactive but their historical match records remain
- Club Owners and Que Masters are notified if a suspended player was a member of their club
- A suspended Que Master's role is temporarily paused — Club Owner can reassign sessions manually
- A suspended Club Owner's clubs remain active; the platform assigns a grace period before clubs are affected (configurable; default: 7 days)

---

### Content Policy Reference

Reviews are removed if they contain:
- Personal attacks or harassment
- Discriminatory language
- False factual claims presented as fact (e.g. "this player cheated")
- Promotional or spam content
- PII (phone numbers, addresses, etc.)

The profanity filter catches obvious violations automatically (see [`../client_app/07_review_system.md`](../client_app/07_review_system.md)). The moderation queue handles edge cases that require human judgment.

---

## Moderation Audit Trail

Every moderation action produces an immutable log entry:

| Field | Value |
|-------|-------|
| Timestamp | UTC |
| Admin | Account that performed the action |
| Action type | `review_removed`, `account_suspended`, `flag_dismissed`, etc. |
| Target | Affected entity (review ID, player ID, etc.) |
| Reason | Admin-selected reason code |
| Notes | Optional free-text explanation |
