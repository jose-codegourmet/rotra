# Admin — Places (`/places`)

## Overview

The Places module lets platform admins view all custom venue locations — both admin-created (confirmed) and player-submitted (unreviewed). CRUD dialogs and audit logging are planned for Phase 3b.

**Access:** `admin` and `super_admin` roles (behind the `(protected)` layout).

**Navigation:** Sidebar → **Places** (`MapPin` icon), positioned after **Customers**.

---

## List page (`/places`)

### Header

- Title: **Places**
- **Add Place** button — disabled in Phase 3a; wired in Phase 3b

### Tabs

Client-side filters over the loaded list:

| Tab | Shows |
|-----|-------|
| All | Every place |
| Confirmed | `status = confirmed` |
| Unreviewed | `status = unreviewed` (badge shows pending count) |

### Table columns

| Column | Notes |
|--------|-------|
| Name | Truncated at 60 characters |
| Address | Truncated at 80 characters |
| Status | Badge — confirmed (accent) / unreviewed (warning) |
| Submitted by | Player display name, or **Admin** when `submittedBy` is null |
| Created at | `dd MMM yyyy` format |
| Actions | Disabled icon stubs in Phase 3a (edit, confirm, delete) |

---

## Data flow

1. **Server prefetch** — `page.tsx` calls Prisma directly (`db.place.findMany`) and hydrates TanStack Query via `HydrationBoundary`.
2. **Client refetch** — `usePlacesQuery` calls `GET /api/places` for background refresh after future mutations (Phase 3b).

---

## API

### `GET /api/places`

- Requires admin session
- Optional query: `?status=confirmed` or `?status=unreviewed`
- Returns `{ places: PlaceRow[] }`
