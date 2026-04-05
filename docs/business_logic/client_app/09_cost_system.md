# 09 — Cost System

## Overview

The Cost System gives Que Masters a transparent, formula-driven way to calculate and track session expenses. Each player's share is computed automatically based on the total cost and the number of accepted players. Payment is tracked manually by the Que Master.

---

## 9.1 Cost Inputs

The Que Master enters these values during session setup or during the session as costs become known:

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| Court cost | Number | Yes | Total rental cost for all courts for the full session duration |
| Shuttle cost per tube | Number | No | Cost per individual shuttle tube |
| Shuttles used | Integer | No | Updated during the session as shuttles are consumed |
| Optional markup | Number or % | No | Flat amount or percentage added on top of actual cost (e.g. for organizer convenience fee) |

### When Costs Are Entered

* **Court cost**: set during session setup (known in advance)
* **Shuttle cost**: can be set during setup or updated mid-session
* **Shuttles used**: updated in real-time as the session progresses
* **Markup**: set during setup; can be changed before payment collection closes

---

## 9.2 Per-Player Cost Calculation

```
total_cost = court_cost + (shuttles_used × shuttle_cost_per_tube)
base_per_player = ceil(total_cost / number_of_accepted_players)

if markup_type == "flat":
    per_player_cost = base_per_player + markup_flat_amount

if markup_type == "percentage":
    per_player_cost = ceil(base_per_player × (1 + markup_percentage / 100))

if no markup:
    per_player_cost = base_per_player
```

* `ceil()` rounds up to avoid fractional currency amounts
* The number of accepted players used is the count at the **time of calculation** — it updates if players exit or new players are promoted from the waitlist
* The Que Master can recalculate at any point during the session
* A cost preview is shown during session setup so the Que Master can validate before opening the session

---

## 9.3 Cost Preview & Transparency

* The calculated per-player cost is visible to all players in the session (in the Session Info panel)
* Players can see the breakdown: court cost, shuttle cost, player count, markup (if any)
* The cost updates in real-time as the Que Master adjusts shuttle count or markup
* This transparency is intentional — players can verify the calculation themselves

---

## 9.4 Player Payment Tracking

Each accepted player has a payment record in the session:

| Status | Meaning | Who Sets It |
|--------|---------|------------|
| Unpaid | Default when player joins | System |
| Paid | Player has settled the full amount | Que Master |
| Partial | Player has paid less than the required amount | Que Master |

* Payment is collected and tracked manually by the Que Master (cash, bank transfer, or any agreed method)
* The Que Master marks each player's status through the payment panel
* Payment status is visible only to Que Masters and Club Owners — players cannot see other players' payment status

### Payment Panel (Que Master View)

Displays a list of all accepted players with:

* Name + photo
* Amount due (computed per-player cost)
* Payment status (Unpaid / Partial / Paid)
* Amount received field (for partial payments)
* Quick action: "Mark as Paid"

Que Master can filter by payment status (e.g. show all Unpaid players).

---

## 9.5 Early Exit Payment Rule

When a player exits the session early:

1. Que Master opens the exit flow for that player
2. Payment status is checked:
   * If **Paid**: exit confirmed immediately
   * If **Unpaid or Partial**: Que Master must confirm that the player has settled before proceeding
3. Que Master taps "Confirm Payment & Exit"
4. Player status changes to Exited; slot opens

An early-exiting player pays the **full session cost**, not a pro-rated amount. They agreed to the full cost by joining.

---

## 9.6 Session Cost Summary

At session close, the Que Master sees a cost summary:

| Summary Item | Description |
|-------------|-------------|
| Total cost | court_cost + (shuttles_used × shuttle_cost_per_tube) |
| Collected | Sum of payments from all Paid + Partial players |
| Outstanding | Total owed by Unpaid and Partial players |
| Markup collected | Total markup amount included in payments |
| Player count | Accepted players at session close |

The summary is exportable as a simple text report (future: PDF or shareable image).

---

## 9.7 Future: Payment Platform Integration

Phase 3 plans integration with local payment platforms:

* GCash (Philippines)
* PayMaya / Maya (Philippines)
* Potentially: generic payment link generation (for other regions)

When integrated, players will be able to pay their session fee directly through the app. The Que Master will see payment confirmations automatically without manual entry.
