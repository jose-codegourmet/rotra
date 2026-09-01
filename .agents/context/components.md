# Components

> **Last verified:** 2026-08-26 · UI primitives and feature modules.

## Folder layout

| Location | Purpose |
|----------|---------|
| `apps/<app>/src/components/ui/<kebab-name>/` | Primitives (Button, Field, Switch, …) |
| `apps/<app>/src/components/modules/<feature>/` | Feature UI (client + admin) |

**Do not use** `components/shadcn/` or `components/rotra/` — those dirs do not exist.

### App-specific extras

| App | Extra top-level dirs |
|-----|----------------------|
| Admin | `admin-ui/`, `layout/`, `custom/`, `providers/` |
| Landing | `coming-soon/` (feature UI — not `modules/`), `providers/` |
| Client | `providers/`; empty `coming-soon/` stub |
| Umpire | `providers/`, `ui/` only |

## Typical anatomy

```
ui/button/
  Button.tsx
  Button.stories.tsx

ui/switch/
  Switch.tsx
  Switch.stories.tsx
  Switch.variants.ts     # optional CVA split

modules/settings/update-player-name-form/
  UpdatePlayerNameForm.tsx
  schema.ts
  default.ts
```

## Naming

| Kind | Convention | Reality note |
|------|------------|--------------|
| UI folders | kebab-case | Dominant for `ui/` |
| Module folders | kebab or PascalCase | Mixed (`filter-panel/` vs `PlayStyleCard/`) |
| Component files | `PascalCase.tsx` | Always |
| Hooks | camelCase `useThing` / `useThing/` | **Not** `use-kebab-case.ts` |
| Redux slices | `[feature]Slice.ts` | `authSlice`, `uiSlice` |
| Constants | `SCREAMING_SNAKE_CASE` | Especially `MOCK_*` |
| Props | `ComponentNameProps` in the `.tsx` | Prefer no `.types.ts`; a few large modules have sibling `.types.ts` |

## Storybook

- ~181 `.stories.tsx` files (client ~108, admin ~57, landing ~13, umpire ~3).
- Fixtures: prefer `apps/<app>/src/constants/` imported as `@/constants/...`.
- Landing marketing copy: `apps/landing/src/app/constants/coming-soon.ts`.
- Many primitive stories use inlined `args` only — acceptable for pure UI.
- Data-heavy module stories should import shared mocks, not invent parallel fixtures.

## Import style

Import from the source file (`.../Button/Button`). Do not add new app-level `index.ts` barrels.
Listed debt barrels were removed (#91); see `docs/tech-debt.md` §2.
