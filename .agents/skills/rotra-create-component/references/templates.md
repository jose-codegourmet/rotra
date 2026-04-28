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

## Blueprint E — Sub-component scaffold

Only when sub-components are part of the parent's public composition (e.g. `Card` + `CardHeader`). Each sub-component lives in its own nested kebab folder under the parent and follows blueprints A or B for its own files.

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

## Pre-write checklist

Before calling `Write` for any file, confirm:

- [ ] Folder name is kebab-case and matches `<componentName>` exactly.
- [ ] All filenames are `<ComponentName>.<suffix>` (PascalCase + dotted lowercase suffix).
- [ ] Props type is named `<ComponentName>Props` and lives in `<ComponentName>.tsx`.
- [ ] `cva` recipe (if any) lives in `<ComponentName>.variants.ts`, not inline in the `.tsx`.
- [ ] No `index.ts` is being created.
- [ ] No raw hex values appear in any class string.
- [ ] `cn` is imported from `@/lib/utils`.
- [ ] Stories file references mock data via `app/constants/` (or carries the `TODO` placeholder comment).
- [ ] `<ComponentName>.types.ts` is being created **only** for non-prop shared types.
- [ ] `<ComponentName>.helpers.ts` is being created **only** with 3+ pure helpers.
