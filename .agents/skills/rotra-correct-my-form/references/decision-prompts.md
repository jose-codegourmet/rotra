# Decision Prompts

Canonical `AskQuestion` payloads the agent uses while running [../SKILL.md](../SKILL.md). Reuse these verbatim instead of inventing prompt text.

Each entry includes:

- **id** — referenced by the playbook recipe `Decision points` field.
- **When to ask** — the exact trigger from the workflow.
- **Payload** — the JSON-shaped argument to `AskQuestion`.

If a recipe says `Decision points: none`, do **not** ask — apply mechanically.

---

## select_report

- **When to ask**: the user did not pass a path and `./form-review-*.md` matches more than one file at the repo root.
- **Payload**:

```json
{
  "questions": [
    {
      "id": "select_report",
      "prompt": "Multiple form review reports exist at the repo root. Which one should I correct?",
      "options": [
        { "id": "<report-filename-1>", "label": "<report-filename-1>" },
        { "id": "<report-filename-2>", "label": "<report-filename-2>" }
      ]
    }
  ]
}
```

Populate `options` from the actual matches. If the user passed a path, skip this prompt.

---

## mutation_path

- **When to ask**: rule 8 (server-side mutation) requires a new mutation target and the recipe asks for path A vs path B.
- **Payload**:

```json
{
  "questions": [
    {
      "id": "mutation_path",
      "prompt": "How should the form's write call reach the server?",
      "options": [
        { "id": "server_action", "label": "Server action (Path A) — internal to this Next.js app, no public HTTP contract." },
        { "id": "api_route", "label": "API route (Path B) — exposes a stable HTTP boundary, consumable across apps/external clients." }
      ]
    }
  ]
}
```

The recipe in rule 8 follows whichever path the user picks.

---

## mutation_target

- **When to ask**: after `mutation_path`, when the suggested file location is not obvious or several reasonable locations exist.
- **Payload**:

```json
{
  "questions": [
    {
      "id": "mutation_target",
      "prompt": "Where should I create the new mutation target file?",
      "options": [
        { "id": "colocated", "label": "Inside the form folder (e.g. <FormFolder>/<actionName>.ts)" },
        { "id": "feature_actions", "label": "Under the feature route's _actions folder (e.g. apps/<app>/src/app/.../_actions/<actionName>.ts)" },
        { "id": "api_route_default", "label": "Under apps/<app>/src/app/api/<resource>/route.ts" },
        { "id": "custom", "label": "Other — I'll provide a path next." }
      ]
    }
  ]
}
```

If the user picks `custom`, follow up with a free-form ask (still using `AskQuestion` with a 2-option choice between provided suggestion and "let me type"), or accept a path the user gives in chat. Do not ship `custom` paths without confirmation.

Match `options` to the chosen `mutation_path`:

- For `server_action`: include `colocated` and `feature_actions`. Drop `api_route_default`.
- For `api_route`: include `api_route_default`. Drop the server-action options.

---

## parent_cleanup

- **When to ask**: rule 7 (RHF `Form` provider lives inside the form component) requires removing parent-side state, AND that state is read or mutated by other parent logic outside the form scope.
- **Payload**:

```json
{
  "questions": [
    {
      "id": "parent_cleanup",
      "prompt": "Moving the RHF `Form` provider into the form component will remove parent-owned form state used elsewhere in the parent. How should I handle the parent's existing usage?",
      "options": [
        { "id": "lift_via_callbacks", "label": "Forward the values up via the new `onSuccess` / `onError` callbacks; remove parent-owned form state." },
        { "id": "keep_parent_state", "label": "Keep an independent piece of parent state for non-form concerns; remove only the RHF/`<form>` orchestration." },
        { "id": "ask_again_with_specifics", "label": "I want to see the specific parent code before deciding — show me the diff plan first." }
      ]
    }
  ]
}
```

If the user picks `ask_again_with_specifics`, show them the parent file regions you intend to change (with line numbers) and re-ask with the first two options only.

---

## toast_source

- **When to ask**: rules 11/12 (success/error toast) require a toast import AND the app already imports more than one toast library (e.g. `sonner` and a legacy in-house toast util).
- **Payload**:

```json
{
  "questions": [
    {
      "id": "toast_source",
      "prompt": "This app imports more than one toast library. Which one should I use for this form?",
      "options": [
        { "id": "sonner", "label": "`sonner` (default for new code in this repo)" },
        { "id": "app_toast", "label": "The app's existing toast utility (preserve consistency with neighbouring forms)" }
      ]
    }
  ]
}
```

If the app only imports one toast library, skip this prompt and use that one without asking.

---

## Rules of engagement

- One question batch per decision point. Do not chain unrelated questions in a single `AskQuestion` call.
- Never invent options outside the canonical sets above.
- If the user gives a clear answer in their original message ("use a server action under `_actions/`"), honour it without re-asking.
- If a decision is logically forced (e.g. only one toast library exists), skip the prompt entirely and document the choice in your turn message instead.
