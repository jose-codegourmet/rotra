# Commands, ports, CI, env

> **Last verified:** 2026-08-26 · Tooling as wired in the repo.

## Versions

- Node **24** (`.nvmrc`)
- pnpm **11.0.8** (`packageManager` field)

## Scripts (root)

```bash
nvm use && pnpm install
pnpm approve-builds          # first install: prisma, sharp, …

pnpm dev / make dev          # all apps; ngrok → client unless SKIP_NGROK=1
make dev-client | dev-admin | dev-umpire | dev-landing

pnpm lint                    # biome
pnpm type-check              # tsc — NOT in CI
pnpm build                   # NOT in CI; pre-push runs it
make check-fix               # biome autofix

pnpm db:generate | db:push | db:migrate | db:studio | db:seed
```

Context metrics: `scripts/refresh-context.sh` → `.agents/context/metrics.md`.

## Ports

| Surface | Port |
|---------|------|
| Client | 3000 |
| Admin | 3001 |
| Umpire | 3002 |
| Landing | 3003 |
| Storybook client / admin / umpire | 6006 / 6007 / 6008 |

Optional ngrok: `https://rotra-local.ngrok.dev` → `:3000` (Makefile `dev` / `dev-client`).

## Git hooks

| Hook | Runs |
|------|------|
| `pre-commit` | `pnpm lint` |
| `pre-push` | `pnpm lint && pnpm build` |
| `commit-msg` | commitlint (Conventional Commits) |

Do not `--no-verify` to skip the build gate.

## CI

`.github/workflows/biome.yml` — **pull_request** only:

- Matrix: `client`, `admin`, `umpire` (landing **excluded**)
- Job: `pnpm --filter @rotra/<app> lint`
- **No** `type-check`, **no** `build` in CI

## Environment variables

Only `apps/client/.env.example` exists (Mapbox). Others are tribal — do not invent secrets.

| Variable | Used by |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | client, admin |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client, admin |
| `SUPABASE_SERVICE_ROLE_KEY` | client, admin (admin client) |
| `DATABASE_URL` | `@rotra/db` |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | client, admin maps |
| `NEXT_PUBLIC_MAPBOX_STYLE_URL` | client dashboard |
| `MAPBOX_SECRET_TOKEN` | server geocode |
| `CLIENT_ADMIN_LOGIN_GATE_PASSWORD` | client admin-gate |
| `ROTRA_DEV_PROFILE_ID` | client local profile override |
| `NEXT_PUBLIC_ADMIN_APP_URL` | admin invites |
| `NEXT_PUBLIC_CLIENT_APP_ORIGIN` | admin → client links |
| `FOUNDING_SUPER_ADMIN_ID` | admin user guards |
| `NODE_ENV` | all |

## Verification stub

`verification-recipes.md` is **not written** yet (needs human tribal knowledge: seed club, admin OTP, Facebook test users). Until then: use `docs/ways-of-working.md` §6 verification block and `pnpm db:studio`.
