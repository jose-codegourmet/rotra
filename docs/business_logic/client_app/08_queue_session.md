# 08 — Queue Session System

## Overview

A **Queue Session** is the core operational unit of the app. It is a bounded, time-limited badminton event **scoped to a club**, with a roster of admitted players and the same core mechanics (courts, queue, scoring, real-time sync).

Sessions differ by **who creates them** and whether the schedule is **competitive** for platform progression (EXP / MMR / ranked). See **Session origin & competitive scope** below.

A session handles:

* Court reservations and assignment
* Player admission and rotation
* Match queue management
* Live scoring via umpires
* Real-time sync across all participants

---

## Session origin & competitive scope

### Two ways a session is created

| Origin | Who creates it | Schedule type | Competitive progression |
|--------|----------------|----------------|-------------------------|
| **Player-organized** | Any registered **Player** (member of the club) | Fixed as **informal** — no MMR/Fun toggle | **No** — not ranked; **no EXP**; **no MMR** changes |
| **Club queue** | **Que Master** or **Club Owner** for that club | **Required** choice: **MMR (competitive)** or **Fun Games (no points)** | **MMR** schedule only: ranked-eligible; **EXP** and **MMR** can change. **Fun Games**: **no EXP / no MMR**; matches and standings still recorded |

Only **club queue** sessions can grant **EXP**, **MMR** movement, or **ranked** match credit. **Player-organized** sessions are for casual organization and history; they never count toward competitive progression.

### What still applies by session type

| Outcome / system | Player-organized | Club — Fun Games | Club — MMR (competitive) |
|------------------|------------------|------------------|---------------------------|
| Match record & score | Yes | Yes | Yes |
| Session standings (wins/losses) | Yes | Yes | Yes |
| Club match history & cumulative stats | Yes (within club) | Yes | Yes |
| Post-match **skill dimension** ratings (peer / QM / umpire) | Yes | Yes | Yes |
| **EXP** | No | No | Yes (see `14_gamification.md`) |
| **MMR** (competitive ladder rating) | No | No | Yes (see `14_gamification.md`) |
| Treated as **ranked** for progression | No | No | Yes |

**MMR** is the competitive ladder / matchmaking rating used for ranked club play. It is separate from **Skill Rating** (the six-dimension peer-assessed score in `06_skill_rating.md`).

### Host responsibilities

* **Player-organized**: the creating player is the **session host** for draft → open → active flow (queue management, payments, finalization) unless the product later allows transfer.
* **Club queue**: **Que Master** or **Club Owner** is the host; **Schedule type** is set at setup and defines Fun vs MMR for the whole schedule.

### Terminology note

In §8.3 onward, **Que Master** refers to the **session host** unless context says otherwise: **Que Master** or **Club Owner** on **club queue** sessions, or the creating **Player** on **player-organized** sessions. **Multi-Que Master** collaboration applies when multiple Que Masters co-manage the same **club queue** session.

---

## 8.1 Session Lifecycle

```
Draft (setup)
    ↓
Open (players join, queue fills)
    ↓
Active (matches are being played)
    ↓
Closed (no new matches; existing in review)
    ↓
Completed (all matches finalized)
```

| State | Who Can Act | Player Can Join |
|-------|------------|----------------|
| Draft | Session host only (player-organized: creator; club queue: Que Master or Club Owner) | No |
| Open | Session host + Players | Yes |
| Active | Session host + Players + Umpires | Yes (waitlisted) |
| Closed | Session host only | No |
| Completed | Read-only | No |

---

## 8.2 Session Setup

The **session host** configures the session before opening it (Que Master or Club Owner for **club queue**; creating **Player** for **player-organized**).

| Setting | Type | Required | Notes |
|---------|------|----------|-------|
| **Schedule type** | Select | **Yes for club queue only** | **MMR (competitive)** — EXP/MMR/ranked eligible; **Fun Games (no points)** — no EXP/MMR; matches and standings still recorded. Omitted / N/A for **player-organized** (always informal). |
| Location / Venue | Text | Yes | Venue name + optional address |
| Date | Date | Yes | |
| Start time | Time | Yes | |
| End time | Time | No | Used for notifications only |
| Number of courts | Integer | Yes | How many courts are reserved |
| Players per court | Integer | Yes | Typically 4 (doubles) or 2 (singles) |
| Shuttle type | Select | No | Feather / Plastic; brand is optional text |
| Shuttle cost per tube | Number | No | Used in per-player cost calculation |
| Court cost (total) | Number | Yes | Total rental for all courts |
| Match format | Select | Yes | Best of 1 / Best of 3 |
| Score limit | Integer | Yes | e.g. 21 points |
| Session visibility | Select | Yes | Club Members Only / Open via Link |
| Smart monitoring threshold | % | No | Default: 90% of win condition |

### Slot Formula

```
total_slots = players_per_court × number_of_courts
```

This is the maximum number of **Accepted** players. Any additional registrations are **Waitlisted**.

---

## 8.3 Player Admission

### Admission States

| State | Meaning | Who Sets It |
|-------|---------|------------|
| Accepted | Within capacity; confirmed spot | System (auto) or Que Master |
| Waitlisted | Over capacity; waiting for a slot | System (auto) |
| Reserved | Slot held manually for a specific player | Que Master only |

### Waitlist Rules

* Waitlist is managed **FIFO** (first waitlisted = first promoted) by default
* Que Master can manually reorder the waitlist
* When an Accepted player's slot opens (via early exit or removal):
  1. Top Waitlisted player is automatically promoted to Accepted
  2. Promoted player receives an in-app notification immediately

### Join Methods

| Method | Description |
|--------|-------------|
| App | Player registers via the session's in-app listing under the club |
| QR | Player scans a session-specific QR code at the venue |

Both methods respect the slot limit and admission state logic.

---

## 8.4 Player Status (In-Session)

Player status is the real-time indicator of a player's current state within an active session.

| Status | Set By | Meaning | In Rotation? |
|--------|--------|---------|-------------|
| Not Arrived | System (default) | Registered but not at venue | No |
| I Am In | Player (self) | Arrived at venue | No |
| I Am Prepared | Player (self) or Que Master | Ready to play; warmed up | Yes |
| Playing | System (auto) | Currently in an active match | No (already playing) |
| Waiting | System (auto) | Queued; next match coming | Yes |
| Resting | Player or Que Master | Taking a break; skip rotation | No (unless Que Master includes) |
| Eating | Player or Que Master | Meal break; skip rotation | No |
| Suspended | Que Master only | Temporarily removed from rotation | No |
| Exited | Player or Que Master | Left the session | No |

**Rotation-eligible statuses**: I Am Prepared, Waiting. Resting / Eating can be included by Que Master if the player requests it.

### Status Transition Rules

* A player cannot set themselves to Playing, Waiting, Suspended, or Exited — those are controlled by the system or Que Master
* A player can toggle between I Am In → I Am Prepared, and between active statuses (Resting, Eating) themselves
* Que Master can set any player to any status except the reverse: Que Master cannot un-Suspend a player and auto-add them to a match — they must set them back to I Am Prepared manually

---

## 8.5 Attendance Confirmation

Attendance is a two-step self-declaration:

1. **"I Am In"** — player has arrived at the venue; visible to Que Master
2. **"I Am Prepared"** — player is warmed up and ready to be queued for a match

The Que Master can override either status at any time.

### No-Show Handling

* If an Accepted player has not marked "I Am In" within **15 minutes of session start** (configurable):
  * Que Master receives a no-show alert for that player
  * Que Master can manually move the player to Not Arrived or release their slot to the waitlist
  * No automatic action — Que Master decides

---

## 8.6 Queue Flow

The queue is the ordered list of upcoming matches. The Que Master manages it; all participants can view it.

### Queue Displays

| Element | Description |
|---------|-------------|
| Active matches | Courts in use, team composition, live score, elapsed time |
| Next matches | Ordered upcoming matches (Team A vs Team B) |
| Estimated wait time | `matches_ahead × average_match_duration` |

Average match duration:
* Initially uses a Que Master-configured estimate (default: 15 minutes)
* Updates dynamically as matches complete during the session (rolling average of completed match durations)

### Queue Priority

Default queue building recommendation (by Waiting Time, longest first). The Que Master has full override control — all suggestions are advisory only.

---

## 8.7 Smart Monitoring

When a Umpire is live-scoring, the system monitors the score in real-time.

| Trigger | Recipient | Action |
|---------|-----------|--------|
| Score reaches 90% of win condition (e.g. 19/21) | Que Master | Notification: "Match on Court [X] is nearing end" |
| 90% threshold hit | Que Master | Prompt to prepare the next match for that court |
| Match point reached (e.g. 20/21) | Que Master | Secondary alert: "Match point on Court [X]" |
| Match ends (final point scored) | Umpire | Prompt to submit final score |
| No umpire / no live score | Que Master | Timer-based reminder at configurable intervals (default: every 20 minutes) |

The 90% threshold is configurable per session (e.g. 80% for short games).

---

## 8.8 Exit System

A player may exit the session early at any time.

### Early Exit Process

```
1. Player or Que Master initiates early exit
2. Que Master confirms the player has settled their payment
3. Que Master taps "Confirm Exit"
4. Player status set to Exited
5. Their slot opens
6. Top Waitlisted player auto-promoted and notified
```

### Rules

* Early exit is **always allowed** — no player can be forced to stay
* **Full session payment must be confirmed** by the Que Master before the slot is released
* An exited player cannot re-enter the session queue
* An exited player retains read-only access to the session view
* If the player has an active match when they exit, the Que Master must handle the mid-match situation manually (e.g. replace the player, void the match, or record a walkover)

---

## 8.9 Umpire System

### Assignment

Two ways an umpire can be assigned to a match:

| Method | How | Who |
|--------|-----|-----|
| Assigned Umpire | Que Master picks a logged-in session participant not playing in the match | Any session member |
| Quick Umpire | Que Master generates a one-time token/URL/QR — anyone who opens it becomes the umpire | Anyone (login optional) |

* Assignment is per-match, not for the entire session
* Umpire role is optional — matches can be scored by the Que Master instead
* When an Assigned Umpire is selected, they receive an immediate in-app notification

---

### Umpire View

The Umpire View is a dedicated, mobile-optimized scoring interface. It is designed for one-handed, fast tap interaction — large targets, minimal UI.

#### Layout

```
┌─────────────────────────────────────┐
│         COURT 1  •  SET 1           │
├───────────────────┬─────────────────┤
│    TEAM A         │    TEAM B       │
│  [Player names]   │  [Player names] │
│                   │                 │
│       18          │       15        │  ← Live score (large)
│                   │                 │
│   [ + POINT ]     │  [ + POINT ]    │  ← Large tap buttons
├───────────────────┴─────────────────┤
│         [ ↩ UNDO LAST POINT ]       │
│         [ ● SET TRACKER: 1-0 ]      │
│         [ ✓ SUBMIT FINAL SCORE ]    │
└─────────────────────────────────────┘
```

#### Interface Elements

| Element | Behavior |
|---------|----------|
| Team labels | Player names (and photos for logged-in umpires) |
| Score display | Large live point count per team, per set |
| `+ POINT` button | Tap to award a point to the corresponding team |
| Undo | Removes the last awarded point (1-level undo only) |
| Set tracker | Shows current set score (e.g. 1–0); advances automatically on set win |
| Submit Final Score | Locks the score and triggers match completion |

> The `+ POINT` buttons are intentionally large to prevent mis-taps during live play.

#### Live Broadcast

The score is broadcast in real-time to:
* The Que Master interface (Court View)
* The Player View (Courts tab)

---

### Score Submission Flow

```
1. Umpire taps "Submit Final Score"
2. Confirmation dialog: "Are you sure? Final: Team A [X] – Team B [Y]"
3. Umpire confirms
4. Score is locked; cannot be modified after submission
5. Que Master receives notification: "Score submitted for Court [X]"
6. Match enters review phase
7. Leaderboard updates with result
```

---

### Quick Umpire

Quick Umpire allows the Que Master to instantly assign scoring duty to **anyone** — including non-members and unauthenticated visitors — by sharing a one-time access link.

#### Generating a Quick Umpire Token

```
1. Que Master opens the match detail for a court
2. Taps "Quick Umpire"
3. System generates a one-time, time-limited token tied to that match
4. A shareable URL and QR code are displayed
5. Que Master shares the QR/link with the intended person (e.g. shows their phone)
```

#### Token Properties

| Property | Value |
|----------|-------|
| Scope | Single match only |
| Expiry | Token expires when the match is submitted or the session ends (whichever comes first) |
| One-use | Once a session is opened via the token, the QR/URL is considered claimed |
| Revocable | Que Master can invalidate the token and generate a new one at any time |

#### Quick Umpire Access Flow

```
1. Person opens the URL / scans the QR code
2. App/browser opens directly to the Umpire View for that match
3. No login required to score the match
4. After scoring is complete:
   a. If user is logged in → they are prompted to optionally rate players (see §7.4)
   b. If user is not logged in → score is submitted directly to the Que Master; no review prompt
```

#### Restrictions

* Quick Umpire can only score the assigned match — they cannot navigate the rest of the session
* They cannot modify player statuses, queue order, or any session data
* Score broadcast behavior is identical to an Assigned Umpire (live updates to Que Master and players)
* Score disputes follow the same override process (Que Master intervention)

---

### Score Disputes

* If a score is disputed after submission, the Que Master must intervene manually
* The Que Master can void a match result (marks it as Unscored) or override the score (Que Master-entered score)
* All score overrides are logged with the Que Master's identity and timestamp

---

## 8.10 Queue Master Interface

The Que Master interface has three primary views, accessible via tabs or a bottom navigation:

---

### Court View

Displays all courts in the session as cards:

| Element | Details |
|---------|---------|
| Court number / name | e.g. "Court 1", "Main Court" |
| Match status | Active / Empty / On Hold |
| Players | Team A and Team B names + photos |
| Live score | Shown if umpire is active |
| Elapsed time | How long the current match has been running |
| Quick action | "End Match" / "Add Match" depending on court status |

Empty courts are visually highlighted as available.

---

### Queue View

A horizontally scrollable slider of upcoming matches:

| Element | Details |
|---------|---------|
| Match card | Shows Team A vs Team B, player levels, estimated start time |
| Drag handle | Reorder matches in the queue |
| Swipe to delete | Remove a queued match |
| Tap to edit | Modify team composition |

---

### Add Match Interface

Que Master selects players from the **Player Pool** to build a new match:

| Column | Description |
|--------|-------------|
| Player photo + name | Visual identification |
| Playing level | Self-declared level (Beginner / Intermediate / Advanced) |
| Skill rating | Computed 1–5 rating |
| Waiting time | Time since the player last played (or session start if no match yet) |
| Games played | Total matches played in this session |
| Status badge | I Am Prepared / Waiting / Resting |

**Default sort**: Waiting Time (longest wait first)

Additional sort options: Name (A–Z), Level, Skill rating, Games played (ascending)

Real-time name search filters the player pool as the Que Master types.

Team composition is advisory — the Que Master has full control over who plays who.

---

### Multi-Que Master Collaboration

When multiple Que Masters are assigned to the same club, they can manage the same session simultaneously:

| Feature | Behavior |
|---------|----------|
| Shared state | All Que Masters see the same queue in real-time |
| Conflict resolution | Last-write-wins for concurrent edits |
| Change attribution | Each change shows which Que Master made it (audit trail visible to Club Owner) |
| Disconnect handling | Queue state is preserved; other Que Masters continue without interruption |

---

## 8.11 Player View (Read-Only)

Players see a simplified version of the session with three tabs:

| Tab | Content |
|-----|---------|
| Courts | Active matches, court status, live scores (if umpire scoring) |
| Queue | Upcoming matches in order; estimated wait time for player's next match |
| Standings | Session leaderboard: rank, name, wins, games played |

Players **cannot**:
* Modify the queue or any match
* Change other players' statuses
* View payment or cost information
* Access Que Master tools

---

## 8.12 Real-Time System

All session data is synchronized in real-time via WebSocket connections (long-polling fallback for poor connections).

| Actor | Receives Live Updates On |
|-------|--------------------------|
| Que Master | Queue changes, score updates, player status changes, payment status |
| Players | Queue position, match assignment, live scores, wait time estimates |
| Umpires | Match assignment, score confirmation from Que Master |

### Reconnection Behavior

* Auto-reconnect on connection drop (exponential backoff)
* While disconnected: an offline banner is shown; the last known state is preserved
* On reconnect: full state sync is performed; missed changes are applied
* No data loss from temporary disconnections (server is the source of truth)
