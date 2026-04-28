# Audit Checks

Concrete detection hints for each rule in [docs/techstack/11_form_engineering_guidelines.md](../../../../docs/techstack/11_form_engineering_guidelines.md).

For every rule, capture:

- `pass` or `fail`
- if fail: 1-line evidence formatted as `path/to/file.tsx:LINE` with the offending snippet

Use ripgrep-style searches (the agent's Grep tool) scoped to the form folder unless noted otherwise.

## 1. Uses React Hook Form

- Pattern: `from ["']react-hook-form["']`
- File: `<FormName>.tsx`
- Pass when: `useForm` is imported from `react-hook-form` and called inside the component.
- Fail when: form state is hand-rolled (`useState` for every field with no `useForm`).

## 2. Form + Controller pattern (no `register` style)

- Pattern A (must exist): `Controller` import from `react-hook-form` AND `<Controller` JSX usage.
- Pattern B (must NOT exist for primary wiring): `\{\.\.\.register\(` spread onto inputs.
- File: `<FormName>.tsx`
- Pass when: fields are rendered via `<Controller name="..." render={...} />`.
- Fail when: any input is wired with `{...register("...")}` as the primary wiring. Note the line.

Reference: guidelines section "Non-Negotiable Standards".

## 3. Colocated Zod schema

- Path: sibling `schema.ts` next to `<FormName>.tsx`.
- File contents must include `from ["']zod["']` and an exported schema (e.g. `export const ...Schema = z.object(...)`).
- Pass when the file exists and exports a Zod schema plus an inferred type (`z.infer<...>`).
- Fail when the file is missing, or the schema lives in `<FormName>.tsx`, or it lives outside the form folder.

## 4. Colocated default values

- Path: sibling `default.ts` next to `<FormName>.tsx`.
- File contents must export a typed default object compatible with the schema's inferred type.
- Pass when the file exists and is typed via the schema's inferred type.
- Fail when the file is missing, or defaults are inlined in `defaultValues: { ... }` literal in `<FormName>.tsx`.

## 5. React Query `useMutation` for writes

- Pattern: `useMutation\(` with a `mutationFn`.
- File: `<FormName>.tsx`.
- Pass when a `useMutation` is wired to the submit path.
- Fail when submit calls `fetch`/server action directly without `useMutation`, or there is no mutation at all for a write form.

## 6. `onSuccess` / `onError` props

- Pattern: the form component's prop type contains both `onSuccess` and `onError`.
- File: `<FormName>.tsx` (look at `type ...Props = { ... }` or inline prop type).
- Pass when both keys are present and invoked from the submit lifecycle (typically inside `useMutation`'s callbacks).
- Fail when either prop is missing from the public prop type.

## 7. RHF `Form` provider lives inside the form component

- Pattern: `<Form `, `<FormProvider`, or RHF's `Form` shadcn wrapper rendered inside `<FormName>.tsx`.
- Also inspect the parent/container that renders `<FormName />`. The provider must NOT live in the parent.
- Pass when the provider wrapper is inside `<FormName>.tsx`.
- Fail when the parent owns the provider or renders large inline form markup itself.

How to find the parent: search the repo for `<FormName ` JSX usage and inspect the call site.

## 8. Server-side mutation business logic

- Inspect what `mutationFn` points to.
- Pass when `mutationFn` calls one of:
  - a server action (`"use server"` function imported from a server-only module)
  - an API route (e.g. `fetch("/api/...")`)
  - a thin client wrapper that itself calls one of the above
- Fail when the form component contains domain logic (auth checks, multi-step writes, business rules) inline in `mutationFn` or `onSubmit`.

## 9. Pending + disabled states

- Pattern: submit-side `Button` consumes `isPending` (or equivalent) for `disabled` and shows a spinner.
- File: `<FormName>.tsx`.
- Pass when the submit button is `disabled={mutation.isPending}` (or equivalent) and renders a spinner/Loader during pending.
- Fail when neither disabled state nor visual pending indicator is wired.

## 10. Double-submit prevention

- Pattern: submit handler short-circuits while pending, OR the submit button is disabled while pending.
- Pass when at least one of those is in place.
- Fail when the form can be submitted again while a mutation is in flight.

This rule typically passes together with rule 9; record them independently.

## 11. Success toast

- Pattern: `toast\.success\(` OR `toast\(` from `sonner` on the success path (`onSuccess` of `useMutation`).
- Pass when present.
- Fail when nothing notifies the user on success.

## 12. Error toast

- Pattern: `toast\.error\(` OR `toast\(` with an error-shaped message on the error path (`onError` of `useMutation`).
- Pass when present.
- Fail when errors are silent or only logged.

## 13. Field-level validation errors

- Pattern: per-field, the JSX renders `errors.<name>` (or RHF `FormMessage`/equivalent) when the field is invalid.
- Pass when every controlled field has a paired error renderer.
- Fail when one or more fields have no inline error output.

## 14. Uses `components/ui` fields first

- Pattern: imports for field controls come from `@/components/ui/...` (e.g. `@/components/ui/input/Input`, `@/components/ui/field`, etc.).
- Pass when all rendered field controls come from `@/components/ui/*`.
- Fail when raw HTML `<input>`, `<select>`, `<textarea>` are used while a `components/ui` equivalent exists in the app.

When a `components/ui` equivalent does NOT exist, native fallback is allowed but rule 15 still applies.

## 15. Native fallback comment

- For every native `<input>`, `<select>`, `<textarea>` rendered by the form, the line immediately above must contain the exact comment:
  - `TODO: please create field for this component`
- Pass when every native fallback has this exact preceding comment.
- Fail when any native fallback is missing the exact comment.

The string must match exactly (case + punctuation). Do not accept paraphrases.

---

## Recording template (per rule)

Use this shape internally before filling the report:

```
- rule: <rule id from this file>
  status: pass | fail
  evidence: <relative path>:<line> — <snippet>   # only when fail
  fix: <one-line concrete action>                # only when fail
```
