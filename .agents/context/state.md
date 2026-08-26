# State management

> **Last verified:** 2026-08-26 · Query vs Redux split as it actually exists.

## TanStack Query owns server and live-session cache

Profiles, notifications, club applications, session discovery, **live session / roster / console**,
admin tables, and all mutations live in React Query.

Live session hooks (client):

| Hook | Query key shape |
|------|-----------------|
| `useSessionLive` | `["sessions", "live", sessionId]` |
| `useSessionRoster` | `["sessions", "roster", sessionId]` |
| `useSessionConsole` | `["sessions", "console", sessionId]` |
| `useActiveSession` / discovery / available / my | colocated `queryKey.ts` |

Mutations typically `invalidateQueries` after success. No widespread `onMutate` optimistic patches
found — do not invent a new optimistic pattern without matching a neighbor.

## Redux Toolkit — auth + UI chrome only

| Slice | App | Holds |
|-------|-----|-------|
| `authSlice.ts` | client, admin | Supabase `User \| null`, `initialized` |
| `uiSlice.ts` | client | Mobile drawer open, dashboard map/list view mode |

**There are no Redux slices** for live queue, live score, or player status map. Older docs that
assign those to Redux are wrong — see `known-drift.md`.

`createAsyncThunk`: **zero** usages. Keep it that way.

## Local state

Dropdown open, wizard step, ephemeral form UI → `useState` / RHF. Do not put chrome in Redux.

## Hook file layout (canonical)

```
hooks/useFeature/
  client.ts      # useQuery / useMutation
  server.ts      # typed fetch helpers (or api.ts in admin)
  queryKey.ts    # const keys
  index.ts       # optional re-export — debt; prefer importing from source
```

Some older hooks are a single `useThing.ts` file — match the nearest feature when adding new ones.
