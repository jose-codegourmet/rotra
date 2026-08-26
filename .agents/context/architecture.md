# Architecture

> **Last verified:** 2026-08-26 · Loaded for page/route work. Prefer neighboring `page.tsx` after this.

## Rendering model

| App | Page layer | Reality |
|-----|------------|---------|
| Client | SSR-first | 39/40 `page.tsx` are Server Components; 1 client page (`/clubs/apply`). ~177 `"use client"` files as islands. |
| Admin | SSR-first | 26/26 server pages; ~120 client component files. |
| Landing | Sync Server Components | 4 pages, no ISR/`force-static`/`generateStaticParams`. Waitlist API is dynamic. |
| Umpire | Stub | 1 server page (“coming soon”). No scoring CSR. |

Protected layouts (client/admin) prefetch + dehydrate React Query on the server.

## Next.js 15 contract

- Dynamic routes: `params` and `searchParams` are `Promise<...>` — always `await`. Zero violations found under `apps/**/src/app`.
- Sync `export default function` pages **without** dynamic props are valid and common (~half of client pages).
- `generateMetadata` (where used) is `async` with Promise params.

## Boundaries

```
page.tsx (Server Component)
  → optional SSR data / React Query dehydrate
  → *Client.tsx or modules (Client Component)
       → hooks (useQuery / useMutation)
       → app/api/.../route.ts
       → @rotra/db (service or inline Prisma)
```

**Do not** put DB writes in Server Actions. The only `'use server'` file is Facebook OAuth:
`apps/client/src/lib/auth/login-actions.ts`.

## Mapbox

- Maps and pin pickers: `next/dynamic({ ssr: false })` or `"use client"`.
- Geocoding: server HTTP to Mapbox (`lib/geo/geocode.ts` in client/admin).
- **No Google Maps / Places** in code.

## Realtime

**Not built.** Zero `.channel(`, `postgres_changes`, or `.subscribe(` in application TS/TSX.
OpenSpecs describe two future cases (smart monitoring ~90% win; score → review phase). Do not
implement channels without a spec change. Default update path: React Query `invalidateQueries`.

## Auth sketch

| App | Mechanism |
|-----|-----------|
| Client | Middleware session refresh; Facebook OAuth; also tester password + admin-gate paths |
| Admin | Middleware requires admin role (`app_metadata` or `user_metadata`); email+password primary; OTP for invite/recovery (not wired into main login card) |
| Landing / Umpire | No middleware; public |

Details: `.agents/context/commands.md` (env vars), nested `apps/*/AGENTS.md`.
