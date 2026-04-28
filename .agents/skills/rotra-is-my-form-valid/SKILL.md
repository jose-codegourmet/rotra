---
name: rotra-is-my-form-valid
description: Audits a ROTRA form module against the Form Engineering Guidelines and writes a markdown checklist report at the repo root listing what still needs to be done. Use when the user runs /rotra-is-my-form-valid, asks "is my form valid", asks to validate/audit a form module, or asks whether a form follows the form engineering guidelines.
user-invocable: true
---

# rotra-is-my-form-valid

Audit a ROTRA form module against [docs/techstack/11_form_engineering_guidelines.md](../../../docs/techstack/11_form_engineering_guidelines.md) and write a full-checklist markdown report at the repo root.

The guidelines doc is the single source of truth. This skill never disputes it; it only checks compliance and emits a report.

## Quick Start

1. The user invokes `/rotra-is-my-form-valid` (optionally with a path).
2. Resolve the target form module (see "Resolving the target" below).
3. Read [docs/techstack/11_form_engineering_guidelines.md](../../../docs/techstack/11_form_engineering_guidelines.md).
4. Run every check in [references/audit-checks.md](references/audit-checks.md).
5. Fill in [references/report-template.md](references/report-template.md).
6. Write the report at the repo root as `./form-review-<form-kebab-name>.md` (overwrite if it exists).
7. Tell the user the report path and a one-line pass/fail summary.

A report is **always written**, even when the form passes everything. When everything passes, the TODOs section is empty and the summary states full compliance.

## Resolving the target

The target is a single form module folder following the guideline structure:

- `SomeForm/SomeForm.tsx`
- `SomeForm/schema.ts`
- `SomeForm/default.ts`

Resolution order:

1. If the user passed an explicit path (file or folder), use it. If a file, walk up to the nearest enclosing `*Form/` folder.
2. Otherwise use the user's currently focused file and walk up to the nearest enclosing `*Form/` folder.
3. If still ambiguous, ask the user for the form folder path before continuing.

The "form kebab name" used in the report filename is the folder name converted to kebab-case (e.g. `AdminLoginForm` -> `admin-login-form`).

## Workflow

```
[input path] -> resolve form folder -> read guidelines -> run audit checks
            -> fill report template -> write ./form-review-<form-kebab-name>.md
            -> report path + summary back to user
```

Steps:

1. **Resolve form folder** as described above. Capture: folder path, form component file (`<FormName>.tsx`), sibling `schema.ts`, sibling `default.ts`.
2. **Read the guidelines** at [docs/techstack/11_form_engineering_guidelines.md](../../../docs/techstack/11_form_engineering_guidelines.md). Treat the "Implementer and Agent Checklist (Pre-PR)" as the authoritative checklist.
3. **Run audit checks** from [references/audit-checks.md](references/audit-checks.md). For each rule, record `pass | fail` plus 1-line evidence (file:line snippet) when failing.
4. **Identify the parent/container** that renders the form component. The container is needed for the rules about RHF `Form` provider placement and whether the parent owns large inline form markup.
5. **Fill the report** using [references/report-template.md](references/report-template.md). Every checklist item must appear with a pass/fail marker. For each failing item, add a `### <Rule name>` block under TODOs with concrete next actions and the relevant guideline section.
6. **Write the report** at repo root: `./form-review-<form-kebab-name>.md`. Overwrite any existing file with the same name.
7. **Respond to the user** with the report path and a one-line summary like `Passed 13/15. See ./form-review-admin-login-form.md`.

## Audit rules at a glance

A short map. Use [references/audit-checks.md](references/audit-checks.md) for the actual detection hints.

| Guideline rule | Code-level signal |
|---|---|
| Uses React Hook Form | `useForm(` import from `react-hook-form` in form `*.tsx` |
| `Form` + `Controller` pattern (no `register` style) | `Controller` used for fields; no `{...register(` on inputs |
| Colocated Zod schema | sibling `schema.ts` exporting a Zod schema and inferred type |
| Colocated default values | sibling `default.ts` exporting typed defaults |
| React Query `useMutation` for writes | `useMutation(` with `mutationFn` in form `*.tsx` |
| `onSuccess` / `onError` props | both names appear in the form component's prop type |
| RHF `Form` provider lives inside form component | `<Form ...>` (or `FormProvider`) wrapper inside `<FormName>.tsx`, not in parent/container |
| Server-side mutation business logic | `mutationFn` calls a server action or `/api/...` route, not inline domain logic |
| Pending + disabled states | submit button consumes `isPending` to disable + show spinner |
| Double-submit prevention | submit handler is gated by mutation pending state |
| Success toast | `toast.success` (or sonner `toast(`) on success path |
| Error toast | `toast.error` on error path |
| Field-level validation errors | inline error rendered for each field with `errors.<name>` |
| Uses `components/ui` fields first | imports from `@/components/ui/...` for field controls |
| Native fallback comment | every native HTML input/select/textarea has the exact preceding comment `TODO: please create field for this component` |

## Output rules

- Report is **always full-checklist**: every rule above appears with a pass or fail marker, even when nothing fails.
- Failing rules **must** include 1-line evidence (`file:line` plus the offending snippet) and a concrete `What to do` action that cites the guideline section name.
- Filename: `./form-review-<form-kebab-name>.md` at the repo root. Lowercase. Overwrite on repeat runs.
- Do not modify the form module itself. This skill only audits and writes the report.

## Out of scope

- Auto-fixing violations.
- Editing the guidelines doc.
- Auditing more than one form per invocation. If the user names multiple forms, run the workflow per form, one report per form.
