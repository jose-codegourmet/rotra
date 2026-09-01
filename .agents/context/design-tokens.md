# Design tokens

> **Last verified:** 2026-08-26 · Both themes ship. Hex in components breaks light mode.

## Source of truth

| Layer | Location |
|-------|----------|
| Tailwind theme extension | `packages/config/tailwind-config/index.ts` (`@rotra/config/tailwind`) |
| Color **values** | Per-app `src/app/globals.css` — `:root` (light) + `.dark` (dark) |
| App config | `apps/<app>/tailwind.config.ts` spreads base + sets `content` |

`darkMode: 'class'`. Client: `ThemeProvider` (`next-themes`, `defaultTheme="dark"`, `enableSystem`)
+ `ThemeToggle`. Admin/landing often hardcode `className="dark"` on `<html>` — still define both
token sets so shared UI does not bake dark-only colors.

## Token names (use these classes)

**Background:** `bg-bg-base`, `bg-bg-surface`, `bg-bg-elevated`, `bg-bg-overlay`  
**Text:** `text-text-primary`, `text-text-secondary`, `text-text-disabled`  
**Accent:** `bg-accent`, `text-accent`, `accent-dim`, `accent-subtle`  
**Semantic:** `error`, `warning`, `border`, `border-strong`

**Type scale:** `text-display` · `title` · `heading` · `body` · `small` · `label` · `micro`  
**Font:** Satoshi via `font-sans` / `--font-satoshi`  
**Spacing:** 4px grid — Tailwind spacing keys `1`–`6`, `8`, `10` (4–40px)

## Why “no hardcoded hex”

Light and dark use different CSS variable values. A component with
`className="bg-[#0B0B0C]"` or `const ACCENT = "#00ff88"` **ignores the toggle** and fails in light
mode. Prefer `bg-bg-base`, `text-accent`, etc.

Hex **inside** `globals.css` variable definitions is expected. Hex in Mapbox paint props may be
unavoidable — isolate and comment.

## A11y / UI habits

- One primary green CTA per view
- Touch targets ~44×44 where interactive
- Status-first hierarchy; toast voice is short and operational

Debt leftover: Mapbox paint, Facebook brand, Logo.stories light canvases — see `docs/tech-debt.md` §1.
