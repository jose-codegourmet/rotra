# Report Template

Fill this template and write the result to the repo root as `./form-review-<form-kebab-name>.md`.

- `<form-kebab-name>` is the form folder name converted to kebab-case (e.g. `AdminLoginForm` -> `admin-login-form`).
- Overwrite any existing file with the same name.
- Every checklist item must appear, with `[x]` for pass or `[!]` for fail.
- For each failing item, add a matching `### <Rule name>` block under TODOs.
- When everything passes, the TODOs section stays but is empty under a single line `_All checks passed._`.

---

## Template

```markdown
# Form Review: <FormName>

- Module path: <relative path to the form folder>
- Form file: <relative path to <FormName>.tsx>
- Schema file: <relative path to schema.ts, or `(missing)`>
- Default file: <relative path to default.ts, or `(missing)`>
- Parent/container: <relative path to the file that renders <FormName />, or `(not found)`>
- Reviewed against: docs/techstack/11_form_engineering_guidelines.md
- Date: <YYYY-MM-DD>

## Summary

- Passed: <X> / 15
- Failing rules: <count>
- Verdict: <one of: "Compliant" | "Needs work">

## Checklist

- [<x|!>] Uses React Hook Form for registration/submission/field state
- [<x|!>] Uses Form + Controller pattern (no `register`-style core wiring)
- [<x|!>] Zod schema colocated at `<FormName>/schema.ts`
- [<x|!>] Default values colocated at `<FormName>/default.ts`
- [<x|!>] React Query `useMutation` used for writes
- [<x|!>] `onSuccess` / `onError` callback props exposed on the form component
- [<x|!>] RHF `Form` provider lives inside the form component (not the parent/container)
- [<x|!>] Mutation business logic lives on the server (server action / API route)
- [<x|!>] Submit controls have pending loading and disabled states
- [<x|!>] Double-submit is prevented while mutation is pending
- [<x|!>] Success toast is implemented
- [<x|!>] Error toast is implemented
- [<x|!>] Field-level validation errors are rendered where relevant
- [<x|!>] Uses app-local `components/ui` fields first
- [<x|!>] Native fallback fields include exact comment `TODO: please create field for this component`

## TODOs

For each failing rule above, include a section using this shape:

### <Rule name>

- Why it failed: <1-line evidence — `path/to/file.tsx:LINE` followed by the offending snippet>
- What to do: <concrete action that cites the relevant guideline section>

If no rules failed, replace the entire TODOs body with:

_All checks passed._
```

---

## Authoring rules

- Do not omit the checklist when everything passes; show it green.
- Do not invent rules outside [docs/techstack/11_form_engineering_guidelines.md](../../../../docs/techstack/11_form_engineering_guidelines.md). The 15 items above map 1:1 to the "Implementer and Agent Checklist (Pre-PR)" in that doc.
- Use repo-relative paths in every evidence line (e.g. `apps/admin/src/components/modules/login/AdminLoginForm/AdminLoginForm.tsx:42`).
- Keep `What to do` actions one sentence each. They should reference the guideline section name (e.g. "per `Submission Lifecycle Requirements`").
- The report file is for humans. Do not include raw tool output, JSON dumps, or stack traces.
