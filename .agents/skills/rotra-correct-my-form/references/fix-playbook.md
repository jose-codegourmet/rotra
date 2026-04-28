# Fix Playbook

One recipe per rule, mirroring [../../rotra-is-my-form-valid/references/audit-checks.md](../../rotra-is-my-form-valid/references/audit-checks.md) 1:1. The single source of truth for what each rule means is [docs/techstack/11_form_engineering_guidelines.md](../../../../docs/techstack/11_form_engineering_guidelines.md).

Recipe shape:

```
## <Rule N>. <Rule name>

- Trigger: <how the rule appears in the report>
- Edit target: <files to touch>
- Recipe:
  - <step>
- Decision points: <id from decision-prompts.md, or "none">
- Verification: <what the audit will check next round>
```

Apply groups in this order: Structure (3, 4) -> Form scaffolding (1, 2, 7) -> Mutation wiring (5, 6, 8) -> Submit UX (9, 10) -> Feedback (11, 12, 13) -> Field components (14, 15).

---

## 3. Colocated Zod schema

- Trigger: `Default file: (missing)` or report says schema lives outside the form folder, or schema is inlined in `<FormName>.tsx`.
- Edit target: `<FormFolder>/schema.ts` (create or move).
- Recipe:
  - Create `<FormFolder>/schema.ts` if missing.
  - Export a Zod schema (`export const <FormName>Schema = z.object({...})`) covering every field the form renders today.
  - Export the inferred type: `export type <FormName>Values = z.infer<typeof <FormName>Schema>;`.
  - If a schema currently lives inside `<FormName>.tsx`, move the literal into `schema.ts` and import the schema + type back into the form file.
  - If a schema lives elsewhere (e.g. `apps/.../schemas/`), move it into the form folder and update imports.
- Decision points: none.
- Verification: audit rule 3 looks for sibling `schema.ts` exporting a Zod schema and an inferred type.

## 4. Colocated default values

- Trigger: `Default file: (missing)`, or defaults live in `defaults.ts` (plural) instead of `default.ts`, or defaults are inlined in `defaultValues: { ... }` inside the form.
- Edit target: `<FormFolder>/default.ts` (create or rename).
- Recipe:
  - Create `<FormFolder>/default.ts`.
  - Export typed defaults compatible with the schema: `export const <FormName>Default: <FormName>Values = { ... };`.
  - If a sibling `defaults.ts` exists, copy its values into `default.ts` typed via the schema's inferred type, update all imports across the repo to point at `default.ts`, then delete the old `defaults.ts`.
  - If defaults are inlined inside `<FormName>.tsx`, move the literal into `default.ts` and import it via `defaultValues: <FormName>Default`.
- Decision points: none.
- Verification: audit rule 4 looks for sibling `default.ts` exporting a typed default object compatible with the schema's inferred type.

---

## 1. Uses React Hook Form

- Trigger: `useForm` is missing from `<FormName>.tsx`, or form state is hand-rolled.
- Edit target: `<FormFolder>/<FormName>.tsx`.
- Recipe:
  - Add `import { useForm } from "react-hook-form";`.
  - Add `import { zodResolver } from "@hookform/resolvers/zod";`.
  - Add `import { <FormName>Schema, type <FormName>Values } from "./schema";` and `import { <FormName>Default } from "./default";`.
  - Inside the component, instantiate the form: `const form = useForm<<FormName>Values>({ resolver: zodResolver(<FormName>Schema), defaultValues: <FormName>Default });`.
  - Replace any `useState` field state with the RHF form instance.
- Decision points: none.
- Verification: audit rule 1 looks for `useForm` imported from `react-hook-form` and called inside the component.

## 2. Form + Controller pattern (no `register` style)

- Trigger: any `{...register("...")}` usage on inputs, or fields rendered without `Controller` / shadcn `FormField`.
- Edit target: `<FormFolder>/<FormName>.tsx`.
- Recipe:
  - Prefer the shadcn wrappers from `@/components/ui/form` (`Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`) when the app already exposes them.
  - For each field, replace `{...register("name")}` with:
    ```tsx
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>...</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    ```
  - If shadcn `Form` wrappers are not available in the app, fall back to plain RHF `Controller`:
    ```tsx
    <Controller name="name" control={form.control} render={({ field, fieldState }) => (...)} />
    ```
  - Remove the `register` import once no `register(` calls remain.
- Decision points: none.
- Verification: audit rule 2 looks for `Controller` JSX usage and the absence of `{...register(` spread on inputs.

## 7. RHF `Form` provider lives inside the form component

- Trigger: parent/container owns `<form ...>` markup, `useForm`, or a `<Form ...>` provider for this form.
- Edit target: `<FormFolder>/<FormName>.tsx` and the parent/container file.
- Recipe:
  - In `<FormName>.tsx`, wrap the rendered fields with the shadcn provider: `<Form {...form}> <form onSubmit={form.handleSubmit(onSubmit)}> ... </form> </Form>`.
  - Move all field markup, submit button, and `<form>` element from the parent into `<FormName>.tsx`.
  - Strip the parent down to a thin container that imports and renders `<<FormName> onSuccess={...} onError={...} />`. The parent should not call `useForm`, render `<form>`, or own `<Form>` for this form.
  - Forward any context props the parent legitimately owns (e.g. `clubApplicationId`) by passing them as props on `<FormName>`.
- Decision points: `parent_cleanup` if the parent currently owns state used elsewhere.
- Verification: audit rule 7 looks for `<Form ...>` / `<FormProvider ...>` inside `<FormName>.tsx` and confirms the parent does not own it.

---

## 5. React Query `useMutation` for writes

- Trigger: form submits via raw `fetch` / inline server call without `useMutation`, or there is no submit write path at all.
- Edit target: `<FormFolder>/<FormName>.tsx`.
- Recipe:
  - Add `import { useMutation, useQueryClient } from "@tanstack/react-query";`.
  - Inside the component, wire the mutation:
    ```tsx
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: <serverTarget>,
      onSuccess: (data) => {
        toast.success("...");
        queryClient.invalidateQueries({ queryKey: [...] });
        onSuccess?.(data);
      },
      onError: (error) => {
        toast.error(getUserFacingMessage(error));
        onError?.(error);
      },
    });
    ```
  - Submit handler: `const onSubmit = form.handleSubmit((values) => mutation.mutate(values));`. Submit handler must early-return / no-op while `mutation.isPending`.
- Decision points: `mutation_path`, `mutation_target` (used together with rule 8).
- Verification: audit rule 5 looks for `useMutation(` with a `mutationFn` wired to the submit path.

## 6. `onSuccess` / `onError` props

- Trigger: form prop type does not include both `onSuccess` and `onError`.
- Edit target: `<FormFolder>/<FormName>.tsx`.
- Recipe:
  - Extend the prop type:
    ```ts
    type <FormName>Props = {
      onSuccess?: (data: <ResultType>) => void;
      onError?: (error: unknown) => void;
      // ...other existing props
    };
    ```
  - Destructure `onSuccess` and `onError` in the component signature.
  - Invoke them inside the mutation's `onSuccess` and `onError` callbacks (after the toast + invalidation steps from rule 5).
  - Update the parent/container to pass concrete handlers (e.g. close the modal on success).
- Decision points: none.
- Verification: audit rule 6 looks for both keys on the public prop type and invocation in the submit lifecycle.

## 8. Server-side mutation business logic

- Trigger: domain logic (auth checks, multi-step writes, business rules) lives inline in `mutationFn` or `onSubmit`, OR there is no server target at all.
- Edit target: a new server action file or API route, plus `<FormName>.tsx` to call it.
- Recipe:
  - Pick the path with the user (see decision points). Default suggestion follows the form's app boundary.
  - **Path A — server action**:
    - Create `<FormFolder>/<actionName>.ts` (or under `apps/<app>/src/app/.../_actions/`) with a top-level `"use server";` directive.
    - Export an async function that accepts the schema's inferred values, performs auth/authorization, and writes via the canonical data layer.
    - Import the function into `<FormName>.tsx` and use it as the `mutationFn`.
  - **Path B — API route**:
    - Create `apps/<app>/src/app/api/<resource>/route.ts` with a `POST` handler that validates input via the schema and writes via the canonical data layer.
    - In `<FormName>.tsx`, set `mutationFn` to a thin client wrapper that `fetch`es the route and throws on non-2xx.
  - In both paths, keep `<FormName>.tsx` thin: input validation, mutation call, query invalidation, toasts, callbacks. No domain logic.
- Decision points: `mutation_path`, `mutation_target`.
- Verification: audit rule 8 confirms `mutationFn` calls a server action, an API route, or a thin wrapper around one.

---

## 9. Pending + disabled states

- Trigger: submit button does not consume `mutation.isPending` for `disabled` or for a spinner.
- Edit target: `<FormFolder>/<FormName>.tsx`.
- Recipe:
  - Bind the submit `Button`: `<Button type="submit" disabled={mutation.isPending}>...`.
  - Render a spinner during pending, e.g. `{mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}` (or the app's existing loader convention).
  - If other mutation-sensitive controls exist (e.g. cancel during pending), disable them too.
- Decision points: none.
- Verification: audit rule 9 looks for `disabled={...isPending}` and a visible pending indicator.

## 10. Double-submit prevention

- Trigger: submit handler can re-fire while a previous mutation is in flight.
- Edit target: `<FormFolder>/<FormName>.tsx`.
- Recipe:
  - Either:
    - rely on rule 9's `disabled={mutation.isPending}` on the submit button, or
    - guard the submit handler explicitly:
      ```ts
      const onSubmit = form.handleSubmit((values) => {
        if (mutation.isPending) return;
        mutation.mutate(values);
      });
      ```
  - Both is fine. At least one MUST be present.
- Decision points: none.
- Verification: audit rule 10 confirms one of the two guards above.

---

## 11. Success toast

- Trigger: nothing notifies the user on the success path.
- Edit target: `<FormFolder>/<FormName>.tsx`.
- Recipe:
  - In `useMutation`'s `onSuccess`, call `toast.success("<user-facing message>")`.
  - Use the existing app toast import (typically `import { toast } from "sonner";`).
- Decision points: `toast_source` only when more than one toast library is in play in the app.
- Verification: audit rule 11 looks for `toast.success(` (or sonner `toast(`) on the success path.

## 12. Error toast

- Trigger: nothing notifies the user on the error path, or errors are only logged.
- Edit target: `<FormFolder>/<FormName>.tsx`.
- Recipe:
  - In `useMutation`'s `onError`, call `toast.error("<user-safe message>")`.
  - Centralize fallback messaging: `const message = error instanceof Error ? error.message : "Something went wrong. Please try again."`.
  - Avoid leaking internal stack/error JSON into the toast.
- Decision points: `toast_source` (same as rule 11).
- Verification: audit rule 12 looks for `toast.error(` (or sonner `toast(` with error shape) on the error path.

## 13. Field-level validation errors

- Trigger: one or more controlled fields render no inline error.
- Edit target: `<FormFolder>/<FormName>.tsx`.
- Recipe:
  - When using shadcn `Form`/`FormField`, render `<FormMessage />` inside each `<FormItem>`.
  - When using bare RHF `Controller`, render the message inline:
    ```tsx
    {form.formState.errors.<name> && <p role="alert">{form.formState.errors.<name>.message}</p>}
    ```
  - Ensure every controlled field has a paired error renderer.
- Decision points: none.
- Verification: audit rule 13 looks for `errors.<name>` or `FormMessage` per controlled field.

---

## 14. Uses `components/ui` fields first

- Trigger: form uses raw HTML (`<input>`, `<select>`, `<textarea>`) while a `@/components/ui/...` equivalent exists in the app.
- Edit target: `<FormFolder>/<FormName>.tsx`.
- Recipe:
  - Inspect `apps/<app>/src/components/ui/` for existing field components (`Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, etc.).
  - Replace native equivalents with the local UI component, preserving `value`/`onChange` via RHF's `field` from `<FormField>` / `<Controller>`.
  - Keep imports relative to the app root (e.g. `@/components/ui/input`).
- Decision points: none.
- Verification: audit rule 14 confirms field controls come from `@/components/ui/...`.

## 15. Native fallback comment

- Trigger: native `<input>`, `<select>`, or `<textarea>` is used (no `components/ui` equivalent yet) and the line above is missing the exact comment.
- Edit target: `<FormFolder>/<FormName>.tsx`.
- Recipe:
  - For each unavoidable native fallback, add the exact comment immediately above the element opening tag:
    ```tsx
    {/* TODO: please create field for this component */}
    <input ... />
    ```
  - The string must match exactly (case + punctuation). Do not paraphrase.
  - If a `components/ui` equivalent exists for the field, prefer rule 14's recipe instead.
- Decision points: none.
- Verification: audit rule 15 confirms the exact comment immediately precedes every native fallback.

---

## After all recipes are applied

1. Run `ReadLints` on every touched file. Fix any new lint introduced by edits.
2. Hand off to the re-audit step in [../SKILL.md](../SKILL.md). Do not declare success here; the audit decides.
