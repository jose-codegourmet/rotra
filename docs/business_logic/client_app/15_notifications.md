# 15 — Notifications

## Overview

Notifications keep players, Que Masters, umpires, and Club Owners informed of relevant events without requiring them to have the app open. All notifications are in-app (push notifications where enabled). Email notifications are a future consideration.

---

## 15.1 Notification Categories

| Category | Audience | Timing |
|----------|---------|--------|
| Session reminders | Accepted players | Before session starts |
| Session status changes | Registered players (Accepted + Waitlisted) | On postpone or cancellation |
| In-session events | Players, Que Masters, Umpires | During active session |
| Post-session | All session participants | After session ends |
| Club events | Club members | As events occur |
| Review reminders | Match participants | Within 24-hour review window |
| System / account | Player | On account-level events (including level-up) |

---

## 15.2 Session Reminders

Sent to all **Accepted** players before the session's configured start time.

| Trigger | Message | Recipient |
|---------|---------|-----------|
| 2 hours before start | "Your session at [venue] starts in 2 hours. Get ready!" | Accepted players |
| 1 hour before start | "1 hour until your session at [venue]. See you on the court!" | Accepted players |
| 30 minutes before start | "Your session starts in 30 minutes. Head over to [venue]." | Accepted players |
| 5 minutes before start | "Your session is about to start. Head to the court!" | Accepted players |
| Session opens (start time) | "Your session at [venue] has started. Mark yourself as 'I Am In' when you arrive." | Accepted players |
| Session postponed | "The session at [venue] on [original date/time] has been moved to [new date/time]. Your spot is still reserved." | All registered players (Accepted + Waitlisted) |
| Session cancelled | "The session at [venue] on [date] has been cancelled by the host." | All registered players (Accepted + Waitlisted) |

* Reminders are sent based on session start time, not when the player arrives
* If a player exits (or is removed) before the session starts, their scheduled reminders are cancelled
* If a session is postponed or cancelled, all pending pre-session reminders are cancelled and the relevant notice is sent immediately

---

## 15.3 In-Session Notifications

Sent during an active queue session.

| Trigger | Recipient | Message |
|---------|-----------|---------|
| Player added to next queued match | Both players in the match | "You're up next on Court [X]. Get ready!" |
| Match starts (court becomes active) | All players in the match | "Your match on Court [X] has started." |
| Umpire assigned to a match | Umpire | "You've been assigned to umpire the next match on Court [X]." |
| Score reaches 90% threshold (smart monitoring) | Que Master | "Match on Court [X] is nearing its end. Prepare the next match." |
| Match ends (score submitted) | All match participants | "Your match is complete. Submit your review now." |
| Match completed (all reviews in or finalized) | All match participants | "Match finalized. Check the leaderboard." |
| Waitlisted player promoted to Accepted | Promoted player | "A spot opened up! You've been accepted into the session at [venue]." |
| Waitlisted player not promoted (session ended) | Waitlisted player | "The session at [venue] has ended. Unfortunately, a slot did not open up for you this time." |
| Player's status set to Suspended | Suspended player | "Your participation has been temporarily suspended by the Que Master." |
| Payment reminder — automatic (player has not paid and session is within 24 hours) | Unpaid player | "You have an outstanding fee for the session at [venue] on [date]. Please settle before the session." |
| Payment reminder — manual (Que Master triggers) | Specific player | "Please settle your session fee for today's session at [venue]." |
| No-show alert (Que Master's view only) | Que Master | "Player [name] has not checked in. Session started [X] minutes ago." |

---

## 15.4 Post-Session Notifications

Sent after the session is marked Completed.

| Trigger | Recipient | Message |
|---------|-----------|---------|
| Session ends / Que Master closes session | All session participants | "Session at [venue] has ended. View the final leaderboard." |
| Session leaderboard published | All session participants | "Final standings for [session date] at [venue] are live. See your rank." |
| Review window closing (2 hours remaining) | Players with unsubmitted reviews | "2 hours left to submit your match reviews. Don't miss your EXP bonus." |
| Review window closed | Players who did not submit | "The review window has closed." |
| EXP awarded | Player | "You earned [X] EXP from today's session." |

---

## 15.5 Club Event Notifications

Sent when club-level events occur.

| Trigger | Recipient | Message |
|---------|-----------|---------|
| New join request | Club Owner | "[Player name] has requested to join [club name]. Review their request." |
| Join request approved | Requesting player | "Your request to join [club name] has been approved. Welcome!" |
| Join request rejected | Requesting player | "Your request to join [club name] was not approved." |
| Direct invite received | Invited player | "[Club name] has invited you to join. Accept or decline." |
| Que Master role assigned | Assigned player | "You've been made a Que Master for [club name]. You can now host sessions." |
| Que Master role revoked | Player | "Your Que Master role for [club name] has been removed." |
| Removed from club | Removed player | "You have been removed from [club name]." |
| New session created | Club members | "[Que Master name] has created a new session at [venue] on [date]. Join now." |

---

## 15.6 Review & Rating Notifications

| Trigger | Recipient | Message |
|---------|-----------|---------|
| Review prompt (post-match) | All match participants | "How was your match? Submit your reviews and ratings now." |
| Received high rating (4 or 5 from opponent) | Player | "An opponent rated your performance highly. +5 EXP bonus." |
| Review window reminder | Participants with pending reviews | "2 hours left to submit your review for [match date] at [club]." |

---

## 15.7 System / Account Notifications

| Trigger | Recipient | Message |
|---------|-----------|---------|
| Club Owner request approved | Player | "Your request to become a Club Owner has been approved. Create your first club." |
| Club Owner request rejected | Player | "Your Club Owner request was not approved. Contact jose@codegourmet.io for details." |
| Player levels up (tier upgrade) | Player | "You've leveled up to [new tier]! Your rating has reached a new milestone." |
| Sandbagging flag applied | Player | "Your displayed playing level has been adjusted by the system based on match data." |
| Sandbagging flag cleared | Player | "Your playing level display has been restored to your self-declared level." |
| Account suspended (future) | Player | "Your account has been suspended. Contact support." |

---

## 15.8 Notification Preferences (Future — Phase 3)

Players will be able to configure:

| Setting | Options |
|---------|---------|
| Session reminders | All / 1 hour only / None |
| In-session match alerts | On / Off |
| Club event notifications | All / Join-related only / None |
| Review reminders | On / Off |
| EXP and tier updates | On / Off |

Until preference controls are available, all notifications are sent to all eligible recipients.

---

## 15.9 Notification Delivery

| Platform | Delivery Method |
|----------|----------------|
| iOS | Apple Push Notification Service (APNs) |
| Android | Firebase Cloud Messaging (FCM) |
| Web (future) | Web Push API |

* Notifications require the user to grant push notification permission on first launch
* If permission is denied, users receive in-app banners only (visible when the app is open)
* Notification state is tracked server-side — unread notifications are shown in an in-app notification center
