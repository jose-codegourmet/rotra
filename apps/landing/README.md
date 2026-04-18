# ROTRA landing (`@rotra/landing`)

Standalone Next.js app for the **public coming soon / waitlist** site. Kept separate from [`apps/client`](../client) so marketing can ship and iterate on its own deploy target.

## Run locally

From the monorepo root:

```bash
pnpm dev:landing
# or
make dev-landing
# or
pnpm --filter @rotra/landing dev
```

Open [http://localhost:3003](http://localhost:3003).

## Spec and assets

- Story spec: [`docs/marketing/coming_soon_landing_page.md`](../../docs/marketing/coming_soon_landing_page.md)
- Hero graphic (replaceable): [`public/images/coming-soon-hero.svg`](public/images/coming-soon-hero.svg)
- Waitlist: stub server action in [`src/server/actions/waitlist.ts`](src/server/actions/waitlist.ts)
