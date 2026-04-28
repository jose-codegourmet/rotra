# Component Templates

Placeholder-driven blueprints for `/rotra-create-component`. These mirror the worked Button example in [docs/techstack/12_component_creation_guidelines.md](../../../../docs/techstack/12_component_creation_guidelines.md).

Replace these placeholders verbatim before writing any file:

- `<ComponentName>` — PascalCase name (e.g. `PlayerRow`)
- `<componentName>` — camelCase name (e.g. `playerRow`)
- `<component-name>` — kebab name (e.g. `player-row`)
- `<DOMElement>` — the underlying HTML element type (e.g. `HTMLButtonElement`, `HTMLDivElement`, `HTMLAnchorElement`)
- `<dom-tag>` — the underlying HTML tag string (e.g. `"button"`, `"div"`, `"a"`)

If the component name or folder gives no clue what `<DOMElement>` should be, ask via `AskQuestion` (`dom_element`).

---

## Blueprint A — Variant component (with `cva`)

Use this blueprint when the user wants variants/sizes, or when the shadcn primitive being wrapped exposes them. It produces two files: `<ComponentName>.variants.ts` and `<ComponentName>.tsx`.

### `<ComponentName>.variants.ts`

```ts
import { cva, type VariantProps } from "class-variance-authority";

export const <componentName>Variants = cva(
  // Base classes that always apply. Use ROTRA tokens only — no raw hex.
  "inline-flex items-center justify-center transition-colors duration-default",
  {
    variants: {
      variant: {
        default: "bg-accent text-bg-base hover:bg-accent-dim",
        // Add more variants from the user's [instructions] / shadcn API here.
      },
      size: {
        default: "h-9 px-4 py-2 text-small",
        sm: "h-8 px-3 text-label",
        lg: "h-10 px-6 text-body",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type <ComponentName>Variants = VariantProps<typeof <componentName>Variants>;
```

### `<ComponentName>.tsx` (variant version, with optional `asChild`)

```tsx
"use client";

import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  <componentName>Variants,
  type <ComponentName>Variants,
} from "./<ComponentName>.variants";

export type <ComponentName>Props = React.HTMLAttributes<<DOMElement>> &
  <ComponentName>Variants & {
    asChild?: boolean;
  };

export const <ComponentName> = React.forwardRef<<DOMElement>, <ComponentName>Props>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : <dom-tag>;
    return (
      <Comp
        ref={ref}
        className={cn(<componentName>Variants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
<ComponentName>.displayName = "<ComponentName>";
```

If `asChild` is **not** required, drop the `Slot` import, the `asChild` prop, and the `Comp` indirection — render `<dom-tag>` directly.

If the props type extends a more specific DOM attribute interface (e.g. `React.ButtonHTMLAttributes<HTMLButtonElement>`), substitute that for `React.HTMLAttributes<<DOMElement>>`.

---

## Blueprint B — Non-variant component (no `cva`)

Use this blueprint when the component has a single visual treatment. Produces one file: `<ComponentName>.tsx`. Do **not** create `<ComponentName>.variants.ts` for this case.

### `<ComponentName>.tsx` (non-variant version)

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type <ComponentName>Props = React.HTMLAttributes<<DOMElement>> & {
  // Add component-specific props here, derived from [instructions].
};

export const <ComponentName> = React.forwardRef<<DOMElement>, <ComponentName>Props>(
  ({ className, ...props }, ref) => {
    return (
      <<dom-tag>
        ref={ref}
        className={cn(
          // Base classes using ROTRA tokens. No raw hex.
          "flex items-center gap-2 rounded-md bg-bg-surface text-text-primary",
          className,
        )}
        {...props}
      />
    );
  },
);
<ComponentName>.displayName = "<ComponentName>";
```

If the component is a pure presentational wrapper that does not need a forwarded ref, use a plain function component instead of `React.forwardRef`.

---

## Blueprint C — Inline helpers (1-2 helpers)

When the component needs 1 or 2 small pure helpers, place them at the top of `<ComponentName>.tsx` between the imports and the props type. Do **not** create `<ComponentName>.helpers.ts`.

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function format<ComponentName>Label(value: number): string {
  return value.toString().padStart(2, "0");
}

export type <ComponentName>Props = {
  value: number;
};

// ... component body uses format<ComponentName>Label(value)
```

If a third helper appears later, move all helpers into `<ComponentName>.helpers.ts` at the same time. The guidelines forbid splitting helpers between inline and file.

---

## Blueprint D — Stories file (always required)

Every component ships a `<ComponentName>.stories.tsx`. Cover the default state and one story per `cva` variant.

### `<ComponentName>.stories.tsx`

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { <ComponentName> } from "./<ComponentName>";

// TODO: import mock fixtures from app/constants/<file>.ts when this component
// renders data. Inline fixtures are not allowed by the guidelines.

const meta: Meta<typeof <ComponentName>> = {
  title: "<category>/<ComponentName>",
  component: <ComponentName>,
};

export default meta;

type Story = StoryObj<typeof <ComponentName>>;

export const Default: Story = {
  args: {},
};

// Add one Story per variant exposed via cva.
// export const Destructive: Story = { args: { variant: "destructive" } };
```

Replace `<category>` with the category folder the component lives in (e.g. `UI`, `Modules/ClubProfile`, `Layout`).

---

## Blueprint E — Non-shadcn sub-component scaffold

**Use this only for custom ROTRA components that expose a public composition. Never use this for shadcn-origin components — those use Blueprint F.**

When sub-components are part of a custom component's public composition (e.g. a bespoke `PlayerRow` exposing `PlayerRowAvatar` + `PlayerRowMeta`), each sub-component lives in its own nested kebab folder under the parent and follows blueprints A or B for its own files.

```text
<component-name>/
├── <ComponentName>.tsx
├── <ComponentName>.stories.tsx
├── <ComponentName>.variants.ts          # if parent has variants
└── <sub-component-name>/
    ├── <SubComponentName>.tsx
    ├── <SubComponentName>.stories.tsx
    └── <SubComponentName>.variants.ts   # if sub has variants
```

The parent folder does not re-export sub-components. Consumers import each sub-component directly from its own file.

---

## Blueprint F — shadcn-origin compound (single file, no sub-folders)

**Use this whenever the component came from a shadcn registry** — i.e. the user passed a `[shadcn link]`, said it is a shadcn primitive in `[instructions]`, or named a component that `npx shadcn@latest add` would produce (e.g. `Pagination`, `Card`, `Select`, `Dialog`, `DropdownMenu`, `Tabs`, `AlertDialog`, `Sheet`, `Drawer`, `Form`, `InputOTP`, `Breadcrumb`, `NavigationMenu`).

Mirror shadcn's source layout: **one** `.tsx` file with every sub-component co-located. **No** nested kebab folders. **One** `.variants.ts` containing every cva recipe used by that file (if cva is needed at all). **One** stories file covering the whole compound.

```text
<component-name>/
├── <ComponentName>.tsx              # parent + every sub-component, all exported
├── <ComponentName>.stories.tsx      # one file covering the compound
└── <ComponentName>.variants.ts      # only if any sub-part uses cva; one file for all
```

### `<ComponentName>.tsx` (shadcn-origin compound)

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
// Import every cva recipe from the single .variants.ts (only if cva is used).
// import { <componentName>LinkVariants } from "./<ComponentName>.variants";

export type <ComponentName>Props = React.ComponentProps<"nav">;

export const <ComponentName> = ({ className, ...props }: <ComponentName>Props) => (
  <nav
    aria-label="<aria-label>"
    className={cn("...rotra-tokens...", className)}
    {...props}
  />
);

export type <ComponentName>ContentProps = React.ComponentProps<"ul">;

export const <ComponentName>Content = ({
  className,
  ...props
}: <ComponentName>ContentProps) => (
  <ul className={cn("...rotra-tokens...", className)} {...props} />
);

export type <ComponentName>ItemProps = React.ComponentProps<"li">;

export const <ComponentName>Item = ({
  className,
  ...props
}: <ComponentName>ItemProps) => (
  <li className={cn("...rotra-tokens...", className)} {...props} />
);

// ...repeat for every sub-component shadcn ships with this primitive.
// All exports live in this single file. No nested folders.
```

Hard rules for this blueprint:

- All sub-components are **named exports** in the same file. Do not split them.
- If the upstream shadcn source uses cva, extract every recipe into `<ComponentName>.variants.ts` and import them here. Do not inline cva in the `.tsx` (this matches the rest of the skill).
- If shadcn's source has no cva, skip the `.variants.ts` file entirely.
- Each sub-component still uses `cn` and ROTRA tokens. Replace any raw hex / shadcn theme classes (`bg-background`, `text-muted-foreground`, etc.) with ROTRA tokens (`bg-bg-base`, `text-text-secondary`, etc.) per [docs/techstack/05_coding_design_system.md §4.4](../../../../docs/techstack/05_coding_design_system.md#44-shadcnui-component-overrides).
- Stories file ([Blueprint D](#blueprint-d--stories-file-always-required)) covers the whole compound. Add at least one story that renders the realistic composition (parent + sub-parts together), not one story per sub-component.

This blueprint implements the "Shadcn-Origin Exception" in [docs/techstack/12_component_creation_guidelines.md](../../../../docs/techstack/12_component_creation_guidelines.md). The guidelines doc remains authoritative.

### Concrete reference

The current [apps/client/src/components/ui/pagination/](../../../../apps/client/src/components/ui/pagination/) folder is an **anti-example** of this blueprint — it splits each shadcn sub-part into its own folder. New shadcn-origin components must collapse that layout into a single `.tsx` per this blueprint.

---

## Pre-write checklist

Before calling `Write` for any file, confirm:

- [ ] Folder name is kebab-case and matches `<componentName>` exactly.
- [ ] All filenames are `<ComponentName>.<suffix>` (PascalCase + dotted lowercase suffix).
- [ ] Props type is named `<ComponentName>Props` and lives in `<ComponentName>.tsx`.
- [ ] `cva` recipe (if any) lives in `<ComponentName>.variants.ts`, not inline in the `.tsx`.
- [ ] **For shadcn-origin compounds:** every sub-component is co-located in `<ComponentName>.tsx`. No nested kebab folders for sub-parts.
- [ ] **For non-shadcn compounds:** sub-components live in nested kebab folders per Blueprint E.
- [ ] No `index.ts` is being created.
- [ ] No raw hex values appear in any class string.
- [ ] `cn` is imported from `@/lib/utils`.
- [ ] Stories file references mock data via `app/constants/` (or carries the `TODO` placeholder comment).
- [ ] `<ComponentName>.types.ts` is being created **only** for non-prop shared types.
- [ ] `<ComponentName>.helpers.ts` is being created **only** with 3+ pure helpers.
