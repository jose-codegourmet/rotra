---
name: rotra-create-component
description: Scaffolds a new ROTRA component that follows docs/techstack/12_component_creation_guidelines.md. Use when the user runs /rotra-create-component, asks to "create a component", "scaffold a component", or names a component plus a target folder (and optionally a shadcn URL).
user-invocable: true
---

# rotra-create-component

Create a new ROTRA component that complies with [docs/techstack/12_component_creation_guidelines.md](../../../docs/techstack/12_component_creation_guidelines.md).

The guidelines doc is the single source of truth. This skill never disputes it; it only translates the user's inputs into a compliant set of files and stops at file creation.

## Quick Start

1. The user invokes `/rotra-create-component [componentName] [folder] [optional shadcn link] [optional instructions]`.
2. Parse the four parameters (see "Parameter contract" below).
3. Read [docs/techstack/12_component_creation_guidelines.md](../../../docs/techstack/12_component_creation_guidelines.md).
4. If a shadcn link is provided, `WebFetch` it for API + examples. Do **not** run any `npx shadcn@latest` CLI commands.
5. Read [references/templates.md](references/templates.md) and pick the blueprint that matches the component shape.
6. Write the kebab folder + the required files into the target folder.
7. Run `ReadLints` on every newly created file. Fix any lint introduced by the scaffold.
8. Tell the user the folder path and which files were created.

## Parameter contract

The slash command accepts four positional parameters:

| Param | Required | Shape | Example |
| --- | --- | --- | --- |
| `[componentName]` | yes | PascalCase | `PlayerRow` |
| `[folder]` | yes | path to the parent category folder (file-system or `@/`-aliased) | `apps/client/src/components/ui` |
| `[shadcn link]` | no | URL on `ui.shadcn.com` or any registry doc page | `https://ui.shadcn.com/docs/components/dialog` |
| `[instructions]` | no | free-form text | `needs default/destructive variants and asChild support` |

### Resolving inputs

- The skill derives the kebab folder from `componentName` (`PlayerRow` -> `player-row`). The kebab folder is appended to `[folder]`. Do not require the user to include it.
- `[folder]` may be passed as a relative path (`apps/client/src/components/ui`) or an absolute path. Both are valid. If it starts with `@/`, resolve it through the target app's `tsconfig` paths.
- If `[componentName]` or `[folder]` is missing, ask via `AskQuestion` (see "Decisions you must ask the user" below). Never invent a component name or pick a folder for the user.
- If the resolved folder already contains a subfolder with the same kebab name, stop and report it. Do not overwrite an existing component.

## Workflow

```text
[parse args] -> [validate name + folder] -> [read guidelines]
             -> [optional WebFetch of shadcn link]
             -> [decide variants / sub-components / asChild]
             -> [pick blueprint from templates.md]
             -> [Write files: .tsx, .stories.tsx, optional .variants.ts]
             -> [ReadLints + fix introduced lint]
             -> [report path + file list to user]
```

Steps:

1. **Parse args.** Capture `componentName`, `folder`, optional `shadcnLink`, optional `instructions`. Derive `kebabName` and `camelName` (`PlayerRow` -> `player-row`, `playerRow`).
2. **Validate.**
   - `componentName` must match `/^[A-Z][A-Za-z0-9]+$/`. If not, ask `component_name`.
   - `folder` must be an existing directory. If not, stop and report.
   - If `<folder>/<kebabName>/` already exists, stop and report.
3. **Read guidelines** at [docs/techstack/12_component_creation_guidelines.md](../../../docs/techstack/12_component_creation_guidelines.md). Treat the "Implementer and Agent Checklist (Pre-PR)" as the authoritative checklist for the output.
4. **Optional shadcn reference.** If `[shadcn link]` was provided, call `WebFetch` against the URL once. Use the returned API + examples to inform: which props to expose, whether the component is a single-element wrapper (`asChild` candidate), and which sub-components belong to its public composition. Never run `npx shadcn@latest` from this skill.
5. **Decide shape.** Combine `[instructions]` and the shadcn API (if any) to answer:
   - **Is the component shadcn-origin?** A `[shadcn link]` was provided, OR `[instructions]` says it is from shadcn / a registry. If yes, the component is treated as a single-file compound (see "shadcn-origin exception" below). Skip the `subcomponents` question — scaffold every sub-component shadcn ships with it, all in the same `<ComponentName>.tsx`.
   - Does the component need `cva` variants/sizes? -> if unclear, ask `has_variants`. For shadcn-origin components, mirror what shadcn ships (extracted into one shared `<ComponentName>.variants.ts`).
   - Is it a single interactive DOM element that should accept `asChild`? -> if unclear, ask `as_child`.
   - **Non-shadcn only:** Does it expose sub-components as part of its public API? -> if unclear, ask `subcomponents`.
   - Are there 3+ pure helpers needed? -> default to "no" unless the user said so explicitly. With 1-2 helpers, inline them.
6. **Pick a blueprint** from [references/templates.md](references/templates.md):
   - Shadcn-origin compound (e.g. `Pagination`, `Card`, `Select`, `Dialog`) -> "shadcn-origin compound" blueprint. **One** `<ComponentName>.tsx` exporting every sub-component, **one** optional `<ComponentName>.variants.ts` holding every cva recipe used by that file. Do NOT create nested kebab folders for the sub-parts.
   - Variant component (custom, non-shadcn, with variants/sizes) -> "Variant component" blueprint (`.tsx` + `.variants.ts`).
   - Non-variant component -> "Non-variant component" blueprint (`.tsx` only).
   - Always pair with the "Stories" blueprint for `<ComponentName>.stories.tsx`. Stories cover every exported sub-component in one file for shadcn-origin compounds.
   - If sub-components were chosen for a **non-shadcn** component, scaffold each sub-component using the same blueprint inside its own nested kebab folder per the guidelines doc, "Sub-Component Structure".
7. **Write the files.** Replace placeholders in the blueprint:
   - `<ComponentName>` -> the PascalCase name
   - `<componentName>` -> the camelCase name
   - `<component-name>` -> the kebab name
   - `<DOMElement>` -> the underlying HTML element type (e.g. `HTMLButtonElement`); ask `dom_element` if unclear.
   Apply `[instructions]` for variant lists, sizes, and any extra props. Keep classes on ROTRA design tokens only (no raw hex).
8. **Lint.** Run `ReadLints` on every newly written file. If a lint was introduced by the scaffold, fix it before finishing.
9. **Respond** with a one-line summary: the folder path that was created, the files inside it, and a note that the component is not yet imported anywhere.

## Hard rules (non-negotiable)

These mirror the "Non-Negotiable Standards" section of the guidelines and override anything in `[instructions]`:

- Component is a functional component. `React.forwardRef` wrapping a function component is the only allowed wrapper.
- Folder is kebab-case matching the component name. Files inside are PascalCase with dotted lowercase suffixes.
- Props type is `<ComponentName>Props` and lives in `<ComponentName>.tsx`, never in `.types.ts`.
- `cva` recipes live in `<ComponentName>.variants.ts`, exported as `<componentName>Variants` (recipe) and `<ComponentName>Variants` (type). Never inline `cva` in the `.tsx` for new components.
- No `index.ts` barrel files. Imports reference the full file path.
- Use `cn` from `@/lib/utils`. Use Tailwind utility classes mapped to ROTRA tokens. No hardcoded hex values.
- Helpers MUST be pure. With 1-2 helpers, inline at the top of the `.tsx`. With 3+, move all of them to `<ComponentName>.helpers.ts`.
- `<ComponentName>.types.ts` is created **only** for non-prop shared types referenced by more than one of `.tsx`, `.helpers.ts`, `.variants.ts`, `.stories.tsx`. If the only type is the props type, this file is not created.
- Stories file is always created. Story fixtures must come from `app/constants/`. If no mock exists yet, leave a `// TODO: import mock from app/constants/<file>.ts` comment instead of inlining fixtures.
- **Sub-component placement depends on origin.**
  - **shadcn-origin (the component came from a shadcn registry, including `[shadcn link]` or anything `npx shadcn@latest add` would produce):** keep every sub-component co-located in `<ComponentName>.tsx`. Do **not** create nested kebab folders for sub-parts (no `pagination-link/`, no `card-header/`). All cva recipes for the parent + every sub-component live in a single `<ComponentName>.variants.ts` (or stay absent if the upstream shadcn source has no cva). One stories file covers the whole compound. See "Shadcn-Origin Exception" in [docs/techstack/12_component_creation_guidelines.md](../../../docs/techstack/12_component_creation_guidelines.md) for the canonical rule.
  - **Non-shadcn (custom ROTRA component that exposes a public composition):** sub-components live in nested kebab folders and follow every other rule above. The parent folder does not re-export them.
- **Atomic / small components stay flat.** If the component is small enough to live in one file (a few dozen lines, no public sub-parts) and the user did not explicitly ask for sub-components, do not invent nesting. Pagination-style over-engineering is forbidden.

## Decisions you must ask the user

Use `AskQuestion` only for the cases below. Do not invent extra prompts.

| Decision id | When to ask | Prompt |
| --- | --- | --- |
| `component_name` | `componentName` is missing or fails the PascalCase regex | "What PascalCase name should this component use?" with no preset options (free-text via follow-up message instead of `AskQuestion`). |
| `target_folder` | `folder` is missing | Same as above; ask the user for the parent folder path. |
| `target_app` | `folder` is bare like `ui` or `modules/clubs` and could match more than one app under `apps/*/src/components/` | Options: each matching app (e.g. `apps/client`, `apps/admin`, `apps/umpire`). |
| `has_variants` | `[instructions]` and the optional shadcn link give no signal whether the component needs `cva` variants/sizes | Options: `yes - scaffold with .variants.ts`, `no - single style`. |
| `as_child` | The component clearly wraps a single interactive DOM element but `asChild` support is unstated | Options: `yes - support asChild via Slot`, `no - render fixed element`. |
| `subcomponents` | **Non-shadcn only.** Instructions suggest public sub-parts but the set is not specified. (For shadcn-origin components, scaffold every sub-component shadcn ships, all in the parent `.tsx` — never ask.) | Options: each candidate sub-component as a multi-select. |
| `dom_element` | The component wraps a single element and the underlying tag is ambiguous | Options: the small set of plausible tags (e.g. `button`, `a`, `div`). |

If `componentName` or `folder` requires free-text from the user, prefer plain follow-up messaging over `AskQuestion` (which is multiple choice only).

## Output rules

- Create exactly one component folder per invocation. If the user names multiple components, run the workflow per component, finishing each before starting the next.
- Never overwrite an existing kebab folder. If one exists at the target path, stop and report it.
- Never wire the new component into a page, parent, route, or barrel. The skill ends at file creation + lint.
- Never run `npx shadcn@latest` (per the docs-only choice for `[shadcn link]`). Use `WebFetch` to read shadcn docs only.
- Final response must include: full path of the new folder, the list of files written, and a one-line note that the component is not yet imported anywhere.

## Out of scope

- Running any `npx shadcn@latest` command, including `add`, `init`, `view`, or `docs`.
- Editing [docs/techstack/12_component_creation_guidelines.md](../../../docs/techstack/12_component_creation_guidelines.md) or any other doc under `docs/techstack/`.
- Multi-component scaffolds in a single invocation.
- Auto-importing or auto-rendering the new component anywhere in the app.
- Generating tests, MDX docs, or anything beyond the file set defined by the guidelines.
