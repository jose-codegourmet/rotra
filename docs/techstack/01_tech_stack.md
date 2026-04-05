# Tech Stack — ROTRA

**Version:** 1.0 · **Updated:** March 2026

---

## Table of Contents

1. [Monorepo Overview](#1-monorepo-overview)
2. [App Architecture](#2-app-architecture)
3. [Tech Stack Reference](#3-tech-stack-reference)
4. [Coding Design System](#4-coding-design-system)
5. [File & Naming Conventions](#5-file--naming-conventions)
6. [State Layer Rules](#6-state-layer-rules)
7. [Data Fetching Conventions](#7-data-fetching-conventions)
8. [Real-Time Architecture](#8-real-time-architecture)
9. [Storybook](#39-component-development--storybook)

---

## 1. Monorepo Overview

ROTRA is a **Turborepo monorepo** with multiple apps sharing a common component library, database layer, and configuration packages.

### Directory Structure

```
rotra/
├── apps/
│   ├── client/          # Player-facing app (Next.js 15, SSR-first)
│   │   └── .storybook/  # App-local component stories (client-specific UI)
│   ├── admin/           # Internal platform dashboard (Next.js 15, SSR-first)
│   │   └── .storybook/  # App-local component stories (admin-specific UI)
│   └── umpire/          # Live scoring interface (Next.js 15, lightweight PWA)
├── packages/
│   ├── ui/              # Shared component library (shadcn + ROTRA design system)
│   │   └── .storybook/  # Primary design system Storybook (all shared components)
│   ├── db/              # Prisma schema, client, generated types, and role helpers
│   └── config/          # Shared tsconfig, tailwind base config
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

### Why Turborepo

- **Incremental builds** — only rebuilds what changed (critical as the codebase grows)
- **Shared packages** without publishing to npm — `@rotra/ui`, `@rotra/db` are first-class workspace packages
- **Parallel task execution** — `turbo build`, `turbo dev`, and `turbo lint` run across all apps simultaneously
- **Remote caching** — CI builds are dramatically faster; Vercel's Turborepo remote cache is supported natively

---

## 2. App Architecture

### 2.1 Client App — `apps/client`

The primary player-facing web application. Used by Players, Club Owners, and Que Masters.

| Property | Value |
|----------|-------|
| Framework | Next.js 15 (App Router) |
| Rendering | **SSR-first** — all public-facing pages are server-rendered |
| Auth | Supabase Auth (Facebook OAuth) |
| Real-time | Supabase Realtime (DB row subscriptions) for session events |
| PWA | Yes — installable on mobile via `next-pwa` |

**Why SSR-first:**
- Player profiles, club pages, and leaderboards are **shareable links** that require OG meta tags for rich previews (see `13_sharing.md`). These must be server-rendered to populate `<head>` correctly.
- Session views for the Que Master require hydrated initial state — SSR provides a populated page before Supabase Realtime subscriptions activate, preventing blank loading flickers.
- The gamified leaderboard and tier system should be indexed and SEO-visible.

**Key pages and their rendering strategy:**

| Page | Strategy | Reason |
|------|----------|--------|
| `/` Home / Dashboard | SSR | User-specific; shows live session data |
| `/club/[slug]` | SSR + ISR | Public club page; OG shareable |
| `/player/[id]` | SSR + ISR | Public profile; OG shareable |
| `/session/[id]` | SSR → live hydration | Initial state from server, then Supabase Realtime subscription |
| `/session/[id]/queue` | CSR after hydration | Real-time queue — full client interactivity after mount |
| `/leaderboard` | SSR + ISR | Revalidated on a schedule; SEO-visible |
| `/match/[id]` | SSR + ISR | Match result card; shareable OG |

---

### 2.2 Admin App — `apps/admin`

Internal platform dashboard for the platform team. Not publicly accessible.

| Property | Value |
|----------|-------|
| Framework | Next.js 15 (App Router) |
| Rendering | **SSR-first** — all pages are server-rendered for security |
| Auth | Supabase Auth (email + password + MFA/TOTP) |
| Access | IP-restricted; separate domain from client app |
| Real-time | Polling or lightweight Supabase subscription for live analytics |

**Why SSR-first:**
- All admin data is sensitive — server-rendering means data never touches the browser until the session is verified.
- Kill switch state, environment configs, and approval queues are fetched server-side and streamed to the page, preventing any flash of unprotected content.

**Key admin pages:**

| Page | Description |
|------|-------------|
| `/approvals` | Club Owner application queue (TanStack Table) |
| `/kill-switches` | Feature flag toggle board |
| `/environments` | Dev / Staging / Production config manager |
| `/moderation` | Flagged reviews and account suspensions |
| `/config/gamification` | EXP rates, tier thresholds, badge criteria |
| `/config/skill-dimensions` | Skill dimension manager |
| `/analytics` | Platform-wide metrics dashboard |
| `/audit-log` | Immutable admin action log (TanStack Table, read-only) |

---

### 2.3 Umpire App — `apps/umpire`

A **lightweight, mobile-first PWA** purpose-built for live match scoring. Accessed via one-time token URL — no account required.

| Property | Value |
|----------|-------|
| Framework | Next.js 15 (App Router, minimal pages) |
| Rendering | **Static shell + CSR** — the scoring interface is entirely client-side after token validation |
| Auth | Token-based only (no session/cookie auth required for guest) |
| Real-time | None — umpire scores locally; final score submitted via HTTP |
| PWA | Yes — installable, but no forced install prompt |
| Bundle size | Kept minimal — no heavy dashboard packages loaded |

**Why lightweight / CSR:**
- The Umpire App is a single-screen scoring tool accessed by guests who have never installed anything. A fast initial load is critical.
- No SEO requirement — the page is behind a one-time token and should not be indexed.
- All interaction is tap-based and local-first — scoring is entirely local state until submission.
- Heavy admin packages (`react-table`, Redux devtools, etc.) are **never imported** in this app — Turborepo's package isolation enforces this.

**Key behavior:**
- Token validated on page load (server-side, via Next.js middleware).
- Scoring state managed in Redux Toolkit (local source of truth; synced on submission only).
- Offline resilience: score state persisted locally; full score submitted on reconnect.
- No navigation away from the scoring screen is possible.

---

### 2.4 Shared Packages

#### `packages/ui` — ROTRA Component Library

Built on top of **shadcn/ui** with the ROTRA design system applied as a custom theme. All components in this package are used by all three apps.

- shadcn/ui provides the unstyled base (Radix UI primitives)
- ROTRA CSS variables override the default shadcn token set
- Custom components not in shadcn (e.g. `CourtCard`, `PlayerRow`, `ScoreDisplay`, `StatusBadge`) live here as first-class exports
- **Storybook** is the primary development environment for this package — every shared component has a story that demonstrates its variants, states, and dark-mode appearance

#### `packages/db` — Database Layer

- Prisma schema (`schema.prisma`) lives here — single source of truth for the entire DB
- Generates types exported as `@rotra/db`
- The Prisma client is instantiated once here and re-exported; apps import `db` from `@rotra/db`
- Supabase is the underlying Postgres host
- Role resolution helpers (`hasRole`, `isQueMaster`, `isClubOwner`, etc.) also live here — they are thin wrappers over user record fields and belong alongside the DB types

#### `packages/config` — Shared Config

- `tsconfig.base.json` — base TypeScript config extended by all apps
- `tailwind-config/` — shared Tailwind base config with ROTRA tokens

---

## 3. Tech Stack Reference

### 3.1 Core Framework

| Technology | Version | Used In | Reason |
|------------|---------|---------|--------|
| **Next.js** | 15 (App Router) | All apps | SSR, routing, middleware, image optimisation, edge functions |
| **TypeScript** | 5.x | All apps & packages | End-to-end type safety across monorepo; Prisma generated types flow into API and UI |
| **React** | 19 | All apps | Concurrent features, Server Components, Suspense streaming |

**Next.js 15 App Router** is used across all three apps because:
- Server Components allow sensitive data (DB queries, auth checks) to stay on the server with zero client bundle cost.
- Layouts handle role-based auth guards at the router level.
- Middleware handles token validation for the Umpire App before the page renders.
- Streaming with Suspense gives progressive loading on data-heavy pages (admin analytics, leaderboard).

---

### 3.2 State Management

| Technology | Used In | Scope |
|------------|---------|-------|
| **Redux Toolkit** | Client, Umpire | Client-side global state — session state, real-time queue, offline point queue |
| **React Query (TanStack Query v5)** | Client, Admin | Server state — data fetching, caching, mutations, background refetching |

**Redux Toolkit** manages state that is:
- Continuously updated via WebSocket (queue changes, player statuses, live scores)
- Needed across multiple unrelated components simultaneously (e.g. the session queue is read by the Court View, Queue View, and Player Pool simultaneously)
- Requiring offline resilience (Umpire App's local point queue during disconnection)

**React Query** manages state that is:
- Fetched from the API and cached (player profiles, match history, leaderboard data)
- Mutated with optimistic updates (marking a player as "I Am In", submitting a review)
- Invalidated after mutations (refetch leaderboard after match completion)

**They are complementary, not overlapping:**
- React Query owns *fetched server data* (async, cached, stale-while-revalidate)
- Redux Toolkit owns *live session state* (pushed from WebSocket, requires real-time consistency)

**Redux Toolkit is NOT used in the Admin App** — admin pages are SSR-first and use React Query + Next.js Server Actions for mutations. No persistent client state is needed.

---

### 3.3 Data Layer

| Technology | Version | Role |
|------------|---------|------|
| **Prisma** | 6.x | ORM + type generation |
| **Supabase** | Hosted Postgres | Primary database + Supabase Auth + Realtime |
| **Supabase Realtime** | — | DB row-change subscriptions for smart monitoring and score submission notifications |

**Prisma + Supabase** is used because:
- Prisma provides a fully typed query builder — the generated types from `schema.prisma` propagate through the entire codebase, preventing schema drift between DB and UI.
- Supabase provides managed Postgres with row-level security (RLS) for multi-tenant club data isolation.
- Supabase Realtime listens to Postgres row changes and pushes them to subscribed clients — no separate message broker or custom WebSocket server needed.
- Prisma handles all write operations; Supabase Realtime handles targeted push notifications (smart monitoring alerts, score submission) — clean separation of concerns.

**Row Level Security (RLS) strategy:**
- Club data is isolated per club — members can only read their own club's sessions.
- Umpire tokens are scoped to a single match row; token validation is enforced at the DB level.
- Admin App bypasses RLS using a service role key stored only on the server.

---

### 3.4 Styling

| Technology | Version | Used In |
|------------|---------|---------|
| **Tailwind CSS** | 4.x | All apps & `packages/ui` |
| **shadcn/ui** | Latest | `packages/ui` (base components) |
| **CSS Custom Properties** | — | ROTRA design tokens as CSS variables |

**Tailwind CSS 4** is used because:
- Utility-first classes map directly to the ROTRA spacing, color, and typography tokens.
- Tailwind's JIT mode produces minimal CSS — critical for the Umpire App's lightweight target.
- The shared `packages/config/tailwind-config` package ensures every app uses identical tokens.

**shadcn/ui** is used because:
- It generates unstyled, accessible component primitives (built on Radix UI) into the codebase — components are owned and modified, not installed as a black-box dependency.
- shadcn's theming system uses CSS custom properties, which maps cleanly to the ROTRA token system.
- Components are copied into `packages/ui` and customized to match the ROTRA dark-mode-only design.

> shadcn/ui components are **not installed as an npm package** — they are generated into `packages/ui/src/components/` and owned by this codebase.

---

### 3.5 Data Tables

| Technology | Used In | Reason |
|------------|---------|--------|
| **TanStack Table (react-table) v8** | Admin App | Kill switch tables, approval queues, audit logs, analytics grids |

TanStack Table is used exclusively in the Admin App for:
- Sortable, filterable kill switch registry
- Approval queue with row actions (approve / reject)
- Immutable audit log (read-only, virtualized for large datasets)
- Platform analytics breakdowns

The Client App does **not** use TanStack Table — player-facing lists (leaderboard, match history, queue) use custom `PlayerRow` and `MatchCard` components from `packages/ui` that are optimized for mobile dense layouts, not data grid patterns.

---

### 3.6 Authentication

| App | Method | Technology |
|-----|--------|------------|
| Client App | Facebook OAuth | Supabase Auth |
| Umpire App | One-time token (guest) or Supabase session (authenticated) | DB token lookup in Next.js middleware |
| Admin App | Email + password + TOTP MFA | Supabase Auth |

**Client App auth flow:**
- Facebook OAuth via Supabase Auth's built-in Facebook provider
- On first login: server creates a Player record seeded with Facebook name + photo
- Supabase issues JWTs; sessions managed via `@supabase/ssr` cookie helpers in Next.js App Router
- Role claims (`player`, `club_owner`, `que_master`) stored as custom claims in the Supabase Auth JWT via an Auth Hook and re-validated on sensitive mutations

**Umpire App auth:**
- Token URL (`/umpire/[token]`) — token is a DB row looked up in Next.js middleware before the page renders
- If the user is not logged in (no Supabase session cookie), they score as a guest — no rating capability
- If they are logged in (Supabase session present), their identity is attached to the score submission

**Admin App auth:**
- Email + password with TOTP MFA via Supabase Auth's built-in MFA support
- Sessions managed via `@supabase/ssr`; expire after 4 hours of inactivity (configured in Supabase Auth settings)
- Uses a separate Supabase Auth user pool scoped to the admin domain — no overlap with player accounts
- Admin App uses the Supabase service role key server-side to bypass RLS

---

### 3.7 Notifications

| Type | Technology | Used By |
|------|------------|---------|
| Push (in-app) | Supabase Realtime subscription | Queue updates, match assignments, waitlist promotion |
| Push (device) | Web Push API via service worker | Umpire assignment notification, no-show alerts |
| In-app toasts | `packages/ui` Toast component | Action confirmations, real-time event feedback |

---

### 3.8 Infrastructure & Tooling

| Tool | Purpose |
|------|---------|
| **pnpm** | Package manager (workspaces) |
| **Turborepo** | Monorepo build orchestration |
| **Vercel** | Deployment (all three Next.js apps deployed as separate Vercel projects) |
| **Supabase** | Hosted Postgres + Realtime + Storage (player photos) |
| **Prettier** | Code formatting (shared config in `packages/config`) |
| **Biome** | Linting (configured at workspace root via `biome.json`) |
| **Husky** | Git hooks (`pre-commit`: lint; `pre-push`: lint + build) |
| **commitlint** | Enforces Conventional Commits format on every commit message |

---

### 3.9 Component Development — Storybook

| Location | Scope | Who Uses It |
|----------|-------|-------------|
| `packages/ui/.storybook` | All shared components (`@rotra/ui`) — the ROTRA design system catalog | Entire team |
| `apps/client/.storybook` | Client-specific components not in `packages/ui` | Frontend dev working on the client app |
| `apps/admin/.storybook` | Admin-specific components (data tables, approval forms, kill switch toggles) | Frontend dev working on the admin app |

**Why Storybook in individual apps as well as `packages/ui`:**

Not all components belong in the shared library. App-local components (e.g. the Admin App's `KillSwitchRow`, `ApprovalCard`, or the Client App's `SessionSetupForm`) are too specific to a single app to justify being in `packages/ui`, but still benefit from isolated development and visual testing.

**Storybook conventions:**

- Every component in `packages/ui` must have a `.stories.tsx` file co-located with it
- Stories must cover: default state, all named variants, disabled/loading states, and dark-mode (always active)
- App-local components are encouraged but not required to have stories — prioritise complex or stateful components
- The shared Tailwind config and CSS variables from `packages/ui/src/styles/globals.css` are imported in all three Storybook instances so tokens render correctly

---

## 4. Coding Design System

This section defines how the ROTRA visual identity (`docs/branding.md`) maps to actual code. **All apps must use these conventions.** No app should define its own colors, spacing, or typography outside of this system.

---

### 4.1 Tailwind Custom Theme (`packages/config/tailwind-config/index.ts`)

The shared Tailwind config defines all ROTRA design tokens as Tailwind utilities:

```ts
// packages/config/tailwind-config/index.ts
import type { Config } from 'tailwindcss'

const config: Omit<Config, 'content'> = {
  darkMode: 'class', // Dark mode always active — class is added at root
  theme: {
    extend: {
      colors: {
        // Background scale
        'bg-base':     '#0B0B0C',
        'bg-surface':  '#1A1A1D',
        'bg-elevated': '#2A2A2E',
        'bg-overlay':  '#3A3A3F',

        // Text scale
        'text-primary':   '#F0F0F2',
        'text-secondary': '#9090A0',
        'text-disabled':  '#4A4A55',

        // Accent
        'accent':        '#00FF88',
        'accent-dim':    '#00CC6A',
        'accent-subtle': 'rgba(0, 255, 136, 0.13)',

        // Semantic
        'error':         '#FF4D4D',
        'warning':       '#FFB800',
        'border':        '#2A2A2E',
        'border-strong': '#404048',
      },

      fontFamily: {
        sans: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'display': ['28px', { lineHeight: '1.2', letterSpacing: '-0.5px', fontWeight: '700' }],
        'title':   ['22px', { lineHeight: '1.3', letterSpacing: '-0.3px', fontWeight: '600' }],
        'heading': ['18px', { lineHeight: '1.4', letterSpacing: '-0.2px', fontWeight: '600' }],
        'body':    ['15px', { lineHeight: '1.5', letterSpacing: '0px',    fontWeight: '400' }],
        'small':   ['13px', { lineHeight: '1.4', letterSpacing: '0.1px',  fontWeight: '400' }],
        'label':   ['12px', { lineHeight: '1.2', letterSpacing: '0.5px',  fontWeight: '500' }],
        'micro':   ['10px', { lineHeight: '1.2', letterSpacing: '0.8px',  fontWeight: '500' }],
      },

      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
      },

      borderRadius: {
        'sm':   '6px',
        'md':   '10px',
        'lg':   '14px',
        'xl':   '20px',
        'full': '9999px',
      },

      boxShadow: {
        'card':   '0 2px 12px rgba(0,0,0,0.4)',
        'modal':  '0 8px 32px rgba(0,0,0,0.6)',
        'accent': '0 0 16px rgba(0,255,136,0.25)',
      },

      transitionDuration: {
        'fast':    '100ms',
        'default': '200ms',
        'slow':    '350ms',
        'spring':  '400ms',
      },
    },
  },
}

export default config
```

Each app's `tailwind.config.ts` extends this base:

```ts
// apps/client/tailwind.config.ts
import baseConfig from '@rotra/config/tailwind'
import type { Config } from 'tailwindcss'

const config: Config = {
  ...baseConfig,
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
}

export default config
```

---

### 4.2 CSS Custom Properties (Root Variables)

Applied in the root `layout.tsx` of each app via a global stylesheet. These map shadcn's expected variable names to ROTRA values:

```css
/* packages/ui/src/styles/globals.css */
:root,
.dark {
  --background:    #0B0B0C;
  --foreground:    #F0F0F2;
  --card:          #1A1A1D;
  --card-foreground: #F0F0F2;
  --popover:       #1A1A1D;
  --popover-foreground: #F0F0F2;
  --primary:       #00FF88;
  --primary-foreground: #0B0B0C;
  --secondary:     #2A2A2E;
  --secondary-foreground: #F0F0F2;
  --muted:         #2A2A2E;
  --muted-foreground: #9090A0;
  --accent:        #2A2A2E;
  --accent-foreground: #F0F0F2;
  --destructive:   #FF4D4D;
  --destructive-foreground: #F0F0F2;
  --border:        #2A2A2E;
  --input:         #2A2A2E;
  --ring:          #00FF88;
  --radius:        10px;
}
```

> **Rule:** Dark mode is always active. The `dark` class is added unconditionally to `<html>` in every app's root layout. There is no light mode.

---

### 4.3 Component Conventions in `packages/ui`

#### Folder Structure

```
packages/ui/src/
├── components/
│   ├── shadcn/           # shadcn/ui generated components (Button, Input, Dialog, etc.)
│   ├── rotra/            # ROTRA-specific components
│   │   ├── PlayerRow/
│   │   ├── CourtCard/
│   │   ├── StatusBadge/
│   │   ├── ScoreDisplay/
│   │   ├── TierBadge/
│   │   └── QueueSlider/
│   └── layout/
│       ├── BottomNav/
│       └── PageShell/
├── styles/
│   └── globals.css
├── hooks/
│   └── use-toast.ts
└── index.ts              # Barrel export
```

#### Component File Structure

Every component follows the same file structure:

```
components/rotra/PlayerRow/
├── PlayerRow.tsx          # Component implementation
├── PlayerRow.types.ts     # Props interface
└── index.ts               # Re-export
```

#### Component Rules

1. **All components are dark-mode-only** — no light mode variants, no conditional color logic.
2. **No hardcoded hex values in components** — always use Tailwind utility classes mapped to the design token colors above.
3. **Interactive targets are minimum 44×44px** — enforced via `min-h-[44px] min-w-[44px]` on all interactive elements.
4. **One primary CTA per screen** — screens with an accent (`bg-accent`, `shadow-accent`) button must not have a second accent button.
5. **Real-time row updates use a pulse animation** — when a row updates (queue change, score update), apply the `animate-pulse-accent` utility once, then fade.
6. **`text-label` and `text-micro` are always uppercase** — enforced via `uppercase` class in the component itself, never left to the consumer.

#### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component files | PascalCase | `PlayerRow.tsx` |
| Component props interface | `[Name]Props` | `PlayerRowProps` |
| Hook files | `use-kebab-case.ts` | `use-session-state.ts` |
| Utility files | `kebab-case.ts` | `format-score.ts` |
| Type-only files | `[name].types.ts` | `session.types.ts` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_UNDO_DEPTH` |

---

### 4.4 shadcn/ui Component Overrides

The following shadcn components are generated into `packages/ui` and customized:

| shadcn Component | ROTRA Override |
|-----------------|----------------|
| `Button` | Variant `"default"` → accent green with `shadow-accent`; variant `"outline"` → `border-strong` border; variant `"destructive"` → `#FF4D4D20` fill with red border |
| `Input` | Height 48px; background `bg-elevated`; focus ring `ring-accent` |
| `Card` | Background `bg-surface`; border `border`; radius `lg` |
| `Dialog` / `Sheet` | Background `bg-surface`; shadow `shadow-modal`; slide-up animation `350ms` |
| `Badge` | Pill shape via `radius-full`; uses status-specific color tokens |
| `Toast` | Background `bg-overlay`; slide-down entrance; auto-dismiss 3 seconds |
| `Table` | Used only in Admin App — `bg-surface` rows; `bg-elevated` on hover |

---

### 4.5 Animation Utilities

Add to `globals.css`:

```css
@keyframes pulse-accent {
  0%   { background-color: rgba(0, 255, 136, 0.13); }
  100% { background-color: transparent; }
}

.animate-pulse-accent {
  animation: pulse-accent 400ms ease-out forwards;
}
```

Used when: a row in the queue updates in real-time (new player status, score change, position change).

---

## 5. File & Naming Conventions

### App Directory Structure (Next.js App Router)

```
apps/client/src/
├── app/
│   ├── (auth)/           # Route group — unauthenticated routes
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (app)/            # Route group — authenticated routes
│   │   ├── dashboard/
│   │   ├── club/[slug]/
│   │   ├── session/[id]/
│   │   ├── player/[id]/
│   │   ├── leaderboard/
│   │   └── layout.tsx    # Auth guard + bottom nav
│   ├── layout.tsx        # Root layout (dark class, fonts, providers)
│   └── globals.css
├── components/           # App-local components (not shared)
├── hooks/                # App-local hooks
├── lib/
│   ├── api/              # API call functions (used by React Query)
│   ├── store/            # Redux store, slices
│   └── utils/
├── server/               # Server-only code (Next.js Server Actions, DB queries)
│   ├── actions/
│   └── queries/
└── middleware.ts         # Auth middleware
```

### Naming Rules

| Rule | Example |
|------|---------|
| Route folders use `kebab-case` | `app/(app)/match-history/` |
| Page files are always `page.tsx` | `app/(app)/session/[id]/page.tsx` |
| Layout files are always `layout.tsx` | |
| Loading skeletons are always `loading.tsx` | |
| Error boundaries are always `error.tsx` | |
| Server Actions are in `server/actions/[feature].ts` | `server/actions/session.ts` |
| Redux slices in `lib/store/slices/[feature]Slice.ts` | `lib/store/slices/sessionSlice.ts` |
| React Query keys in `lib/api/keys.ts` (constants object) | `QUERY_KEYS.session(id)` |

---

## 6. State Layer Rules

### When to use React Query vs Redux Toolkit

| Use React Query for | Use Redux Toolkit for |
|---------------------|-----------------------|
| Fetching player profiles, match history, leaderboard | Live session queue state |
| Club membership lists | Live score updates from WebSocket |
| Paginated admin tables | Player status map in an active session |
| Mutation + optimistic updates (mark payment, submit review) | Offline point queue (Umpire App) |
| Background refetch after mutations | Real-time notification state |

### Redux Store Structure (Client App)

```ts
// lib/store/index.ts
{
  session: {
    id: string | null,
    status: SessionStatus,
    players: Record<string, PlayerSessionState>,
    queue: QueuedMatch[],
    courts: CourtState[],
    connectedAt: number | null,
  },
  ui: {
    activeTab: string,
    toasts: Toast[],
  }
}
```

### Redux Store Structure (Umpire App)

```ts
// lib/store/index.ts
{
  match: {
    token: string,
    matchId: string,
    teamA: Player[],
    teamB: Player[],
    sets: SetScore[],
    currentSet: number,
    connectionStatus: 'connected' | 'disconnected' | 'reconnecting',
  },
  pointQueue: {
    pending: PointEvent[],   // queued while offline
    flushing: boolean,
  }
}
```

### Slice Conventions

```ts
// lib/store/slices/sessionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// 1. All slice state is typed with explicit interfaces
// 2. Reducers handle WebSocket event payloads directly
// 3. No async thunks in slices — async is React Query's job
// 4. Selectors are co-located in the slice file (not separate selector files for small slices)
```

---

## 7. Data Fetching Conventions

### React Query Setup

```ts
// lib/api/keys.ts — centralized query key factory
export const QUERY_KEYS = {
  player: (id: string) => ['player', id] as const,
  playerMatches: (id: string) => ['player', id, 'matches'] as const,
  clubMembers: (clubId: string) => ['club', clubId, 'members'] as const,
  session: (id: string) => ['session', id] as const,
  leaderboard: (filter: LeaderboardFilter) => ['leaderboard', filter] as const,
} as const
```

```ts
// lib/api/player.ts — typed API call functions
export async function fetchPlayer(id: string): Promise<Player> {
  const res = await fetch(`/api/players/${id}`)
  if (!res.ok) throw new APIError(res)
  return res.json()
}
```

### Server Actions (mutations)

Server Actions are used for all write operations from the Client App. They are defined in `server/actions/` and called directly from client components:

```ts
// server/actions/session.ts
'use server'

export async function markPlayerReady(sessionId: string, playerId: string) {
  const session = await validateSession()   // auth check
  // DB mutation via Prisma
  // Supabase Realtime broadcast to session channel
}
```

React Query mutations call Server Actions and invalidate the relevant query keys on success:

```ts
const mutation = useMutation({
  mutationFn: (playerId: string) => markPlayerReady(sessionId, playerId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.session(sessionId) })
  },
})
```

### Admin App Data Fetching

The Admin App does **not** use Redux Toolkit. Data flow:

1. Server Component fetches data directly via Prisma (server-side, no API layer)
2. Client Components use React Query for interactive tables and mutations
3. Server Actions handle all mutations with re-validation

---

## 8. Real-Time Architecture

Supabase Realtime is used for two specific, high-value events only. There is no custom WebSocket server and no per-point event streaming. The umpire scores entirely in local state; the Que Master gets notified at the moments that operationally matter.

### What Uses Supabase Realtime

| Event | Trigger | Who receives it |
|-------|---------|----------------|
| Smart monitoring alert | `matches.score` row update crosses 90% of win condition (computed in a Postgres function on each score save) | Que Master — prompted to prepare the next match |
| Score submitted | `matches.status` row changes to `review_phase` | Que Master Court View card updates to final score; session leaderboard refreshes |

Everything else (queue position changes, player status updates, waitlist promotion) is handled via **React Query refetch** on mutation success — no persistent connection needed for these.

### Score Submission Flow

```
Umpire scores locally (Redux local state — no network calls per point)
    ↓
Umpire taps "Submit Final Score" → confirmation dialog
    ↓
Umpire confirms → single HTTP POST with complete final score
    ↓
Server writes match result to DB via Prisma
    ↓
Supabase Realtime broadcasts the matches row change to subscribers
    ↓
Que Master Court View updates: final score + match enters Review Phase
    ↓
Session leaderboard updates with result
```

### Smart Monitoring Flow

```
Umpire taps + POINT → Redux updates local score
    ↓
Score saved to DB (debounced or on each tap — lightweight single row update)
    ↓
Postgres function checks: score ≥ 90% of win condition?
    ↓
If yes → Supabase broadcasts to Que Master's session channel
    ↓
Que Master receives: "Match on Court [X] is nearing end" → prompted to prepare next match
```

### Offline Handling (Umpire App)

The umpire scores in local Redux state. If connection drops during a match, nothing is lost — the score exists on the umpire's device.

```
Connection drops
    ↓
Offline banner shown: "No connection — scoring saved locally"
    ↓
Umpire continues tapping points (local Redux state only)
    ↓
On reconnect: local score state is intact — umpire submits when ready
    ↓
Single HTTP POST with final score (same flow as normal submission)
```

No event queue, no flush logic, no partial sync — the complete score is always on the device.

### Kill Switch Integration

Kill switch state is fetched server-side on each page render (via the feature flag store in Supabase). Components wrap kill-switched features in a `<FeatureGate>` component:

```tsx
// packages/ui/src/components/rotra/FeatureGate/FeatureGate.tsx
export function FeatureGate({
  flag,
  fallback = null,
  children,
}: FeatureGateProps) {
  const enabled = useFeatureFlag(flag)
  return enabled ? <>{children}</> : <>{fallback}</>
}
```

Kill switch evaluation is always **server-authoritative**. Client-side `useFeatureFlag` reads from a context populated by the server — it never evaluates the flag independently.

---

## Summary Table

| Concern | Technology | Notes |
|---------|------------|-------|
| Monorepo | Turborepo + pnpm | Parallel builds, remote caching, workspace packages |
| Framework | Next.js 15 (App Router) | All three apps |
| Language | TypeScript 5 | Strict mode; shared types via `@rotra/db` |
| Styling | Tailwind CSS 4 + shadcn/ui | Dark mode only; ROTRA tokens in shared config |
| Component library | `@rotra/ui` (shadcn base + custom) | All apps consume this package |
| Server state | React Query v5 | Client + Admin apps |
| Client state | Redux Toolkit | Client app (session), Umpire app (local score) |
| Data tables | TanStack Table v8 | Admin app only |
| ORM | Prisma 6 | Shared via `@rotra/db` |
| Database | Supabase (Postgres) | RLS for multi-tenancy |
| Real-time | Supabase Realtime (DB row subscriptions) | Smart monitoring alert + score submission notification only |
| Auth (players + admin) | Supabase Auth | Facebook OAuth (players); email + MFA (admin) |
| Auth (umpire guest) | One-time DB token | Looked up in Next.js middleware |
| Deployment | Vercel (3 projects) | Separate deploys per app |
| Storage | Supabase Storage | Player profile photos |
| Component dev | Storybook | `packages/ui` (design system) + `apps/client` + `apps/admin` |
