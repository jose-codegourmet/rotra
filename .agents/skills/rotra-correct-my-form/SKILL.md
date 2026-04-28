---
name: rotra-correct-my-form
description: Applies the TODOs from a `rotra-is-my-form-valid` report to bring a ROTRA form module into compliance with the Form Engineering Guidelines, then re-runs the audit and deletes the report when fully compliant. Use when the user runs /rotra-correct-my-form, asks "fix my form", "correct my form", or passes a form-review-*.md report at the repo root.
user-invocable: true
---

# rotra-correct-my-form

Take a `form-review-<form-kebab-name>.md` report (the output of [rotra-is-my-form-valid](../rotra-is-my-form-valid/SKILL.md)) and execute every action under its `## TODOs` section against the target form module, using [docs/techstack/11_form_engineering_guidelines.md](../../../docs/techstack/11_form_engineering_guidelines.md) as the single source of truth.

After applying fixes, re-run the audit. If the form is fully compliant on the second pass, delete the original report. If failures remain, the audit overwrites the report and the file stays in place.

This skill never edits the guidelines doc and never disputes the audit. It only converts a report into code edits and verifies.

## Quick Start

1. The user invokes `/rotra-correct-my-form <path-to-report>` (or names a report in their message).
2. Resolve the report file (see "Resolving the report" below).
3. Parse the report header + checklist + TODOs.
4. Read the guidelines and the fix playbook in [references/fix-playbook.md](references/fix-playbook.md).
5. For each failing rule (`[!]`), apply the matching recipe from the playbook. Use [references/decision-prompts.md](references/decision-prompts.md) (`AskQuestion`) whenever a recipe hits a "Decision points" entry.
6. Run `ReadLints` on every edited file and fix any new lint introduced by the edits.
7. Re-run the [rotra-is-my-form-valid](../rotra-is-my-form-valid/SKILL.md) workflow against the same form folder. The audit overwrites `./form-review-<form-kebab-name>.md` per its own rules.
8. If the new audit reports `Failing rules: 0` and `Verdict: Compliant`, delete the report file.
9. Tell the user the outcome with a one-line summary.

## Parameter contract

- **Required input**: a path to a `form-review-<form-kebab-name>.md` report at the repo root.
- Acceptable forms:
  - explicit path: `./form-review-admin-login-form.md`
  - bare filename: `form-review-admin-login-form.md`
  - reference inside the user's message text
- If the path was not provided, list `./form-review-*.md` at the repo root:
  - 0 matches: tell the user to run `/rotra-is-my-form-valid` first and stop.
  - 1 match: use it.
  - 2+ matches: ask the user which one to fix using `AskQuestion`.
- If the named file does not exist, stop and tell the user. Do not synthesize a fake report.

## Resolving the report

Parse the report header (shape is fixed by [rotra-is-my-form-valid report-template](../rotra-is-my-form-valid/references/report-template.md)) and capture:

- `Module path`: the form folder (`<repo>/.../<FormName>/`)
- `Form file`: `<FormName>/<FormName>.tsx`
- `Schema file`: `<FormName>/schema.ts` (or `(missing)`)
- `Default file`: `<FormName>/default.ts` (or `(missing)`)
- `Parent/container`: the file that renders `<FormName />`
- `Passed: X / 15` line for the baseline count.

Then parse:

- `## Checklist` — note every item marked `[!]`.
- `## TODOs` — for each failing item, capture the `### <Rule name>` block (`Why it failed` + `What to do`).

Map rule names from the report 1:1 to entries in [references/fix-playbook.md](references/fix-playbook.md).

## Workflow

```
[report path] -> resolve report -> parse header + failing rules
              -> read guidelines + fix playbook
              -> for each failing rule:
                   -> read recipe
                   -> AskQuestion (only if recipe has decision points)
                   -> apply edits (Read + StrReplace + Write)
                   -> ReadLints + fix new lint
              -> re-run rotra-is-my-form-valid against form folder
              -> if Compliant: Delete original report
              -> respond to user with summary
```

Steps:

1. **Parse report** as described in "Resolving the report".
2. **Read context once**:
   - [docs/techstack/11_form_engineering_guidelines.md](../../../docs/techstack/11_form_engineering_guidelines.md)
   - [references/fix-playbook.md](references/fix-playbook.md)
   - the form folder (form `*.tsx`, `schema.ts`, `default.ts` if any, `defaults.ts` if any)
   - the parent/container file
3. **Apply fixes in playbook order** (structural moves first, then mutation wiring, then UX polish). Skip rules that are already passing in the report. For each failing rule:
   - Look up the recipe.
   - If the recipe lists a `Decision points` entry, call `AskQuestion` using the canonical payload in [references/decision-prompts.md](references/decision-prompts.md). Never invent prompt phrasing ad-hoc.
   - Apply the edits with `Read` + `StrReplace` (preferred) or `Write` (only when creating new files or fully rewriting an existing one).
   - Run `ReadLints` on every file you touched. If a lint was introduced by your edit, fix it before moving on.
4. **Re-run the audit** by reading [../rotra-is-my-form-valid/SKILL.md](../rotra-is-my-form-valid/SKILL.md) and executing its workflow against the same form folder. The audit will overwrite `./form-review-<form-kebab-name>.md` at the repo root.
5. **Decide on deletion**:
   - If the new audit reports `Failing rules: 0` and `Verdict: Compliant`, delete the report file with the `Delete` tool.
   - Otherwise, leave the (now overwritten) report in place.
6. **Respond to the user** with a one-line summary:
   - On full pass: `Form is now compliant. Removed ./form-review-<form-kebab-name>.md.`
   - On partial pass: `Fixed N of M rules. <K> still failing. See ./form-review-<form-kebab-name>.md.`

## Edit ordering

The fix playbook is grouped to avoid churn. Apply groups in this order:

1. **Structure** — colocated files (`schema.ts`, `default.ts`), folder layout. (Audit rules 3, 4)
2. **Form scaffolding** — `useForm`, `Form` + `Controller`, RHF provider lives in form. (Audit rules 1, 2, 7)
3. **Mutation wiring** — `useMutation`, `onSuccess` / `onError` props, server-side mutation target. (Audit rules 5, 6, 8)
4. **Submit UX** — pending + disabled, double-submit prevention. (Audit rules 9, 10)
5. **Feedback** — success toast, error toast, field-level errors. (Audit rules 11, 12, 13)
6. **Field components** — `components/ui` first, native fallback comment. (Audit rules 14, 15)

Within a group, apply rules in the numeric order above.

## Decisions you must ask the user

Use `AskQuestion` with the canonical payloads in [references/decision-prompts.md](references/decision-prompts.md) when:

- Multiple report files match and the user did not specify one (`select_report`).
- The form needs a new mutation and the path is not obvious (`mutation_path`: server action vs API route).
- The mutation target file location is ambiguous (`mutation_target`).
- The parent currently owns form state and removing it would change other parent behaviour (`parent_cleanup`).
- The app already imports more than one toast library and the choice is not obvious (`toast_source`).

Never ask outside this list without first checking the playbook recipe's `Decision points` field.

## Re-audit handoff

The audit skill is the only authority on pass/fail. To re-audit:

1. Read [../rotra-is-my-form-valid/SKILL.md](../rotra-is-my-form-valid/SKILL.md) and follow it as if the user just invoked it with the form folder path.
2. The audit writes/overwrites `./form-review-<form-kebab-name>.md` at the repo root.
3. Read that file and look at the `Summary` block:
   - `Verdict: Compliant` and `Failing rules: 0` -> delete the report.
   - Anything else -> keep the report in place.

Do **not** hand-roll a verdict. The audit's output is the source of truth.

## Output rules

- Always run the re-audit. Never skip it, even when you believe every fix landed.
- Only delete the report after the re-audit confirms compliance.
- Never delete unrelated files. Delete is scoped to the exact `./form-review-<form-kebab-name>.md` you started with.
- Never edit the audit skill, the guidelines doc, or unrelated form modules.
- If a fix requires creating a new file (e.g. `schema.ts`, `default.ts`, server action), keep it inside the form module folder unless the recipe explicitly says otherwise.

## Out of scope

- Editing [docs/techstack/11_form_engineering_guidelines.md](../../../docs/techstack/11_form_engineering_guidelines.md).
- Editing [../rotra-is-my-form-valid/SKILL.md](../rotra-is-my-form-valid/SKILL.md) or its references.
- Multi-form runs per invocation. If the user passes multiple reports, process them one at a time, finishing the full workflow (apply -> audit -> delete-or-keep) for each before starting the next.
- Refactoring code unrelated to the failing rules in the report.
