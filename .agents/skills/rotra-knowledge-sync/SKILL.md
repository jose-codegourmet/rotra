---
name: rotra-knowledge-sync
description: Capture what was learned in a work session into the repo's long-term knowledge — .agents/context/ slices, docs/adr/, known-drift.md, tech-debt.md, and OpenSpec change drafts — on a knowledge/ branch. Use whenever the user gives bullet points of things learned, decisions made, gotchas discovered, or says anything like "save this", "write this down", "update the docs", "persist this knowledge", "record what we figured out", or names OpenSpec capabilities that were affected by a discussion. Also use it at the end of a substantial work session before context is lost.
user-invocable: true
---

# rotra-knowledge-sync

Turn loose session knowledge into durable, correctly-routed repo content.

The user hands you bullet points. Some of them belong in the repo forever. Most
of them don't. Your job is to be a strict filter first and a writer second — a
knowledge base full of restated obvious facts is worse than no knowledge base,
because future agents burn context reading it and start trusting noise.

**Hard constraint:** never grow `AGENTS.md`. It sits near a 290-line hard cap
and is a routing map, not a dump. Standing rules go into `.agents/context/`
slices. See Step 4.

## Inputs

The user provides:

1. **Knowledge bullets** — free-form lines of what was learned or decided.
2. **Affected OpenSpec capabilities** (optional) — names of specs the discussion
   touched, e.g. `auth-flow`, `queue-session`.

If the bullets are missing, ask for them. If the affected capabilities are
missing, don't ask — infer them in Step 3 and confirm your inference in the
final report.

## Step 1 — Preflight

Run these checks before writing anything. Stop and report if any fail.

```bash
git status --porcelain          # must be empty; refuse on a dirty tree
git fetch origin
git rev-parse --verify origin/main
```

A dirty tree means uncommitted user work. Never stash it, never commit it,
never write on top of it. Tell the user to commit or stash, then stop.

Then create the working branch off a fresh `origin/main`:

```bash
git checkout -b knowledge/<slug> origin/main
```

Use `-b`, **not** `-B`. Never force-reset an existing branch. If the branch
name already exists, pick a new slug or stop and ask.

`<slug>` is a short kebab-case summary of the batch plus the date, e.g.
`knowledge/session-cache-invalidation-2026-08-30`. Branching off `origin/main`
rather than the local branch avoids inheriting whatever half-finished state the
user's working branch is in.

## Step 2 — Delegate the classification

Classification is the part where quality actually matters, so run it with a
clean context window when possible. Spawn a subagent with the **inherited**
model (do not request a specific Opus tier — that model is not available as a
subagent here) and give it the bullets plus Step 3 of this file.

If spawning a subagent is unavailable or fails, classify inline and say so in
the final report. Do not fabricate a model call, and do not use an API key.

## Step 3 — Classify every bullet

Sort each bullet into exactly one bucket. Quote the original bullet as evidence
for each classification so the user can audit your reasoning.

| Bucket | What belongs here | Test |
|---|---|---|
| `rule` | Standing instructions that change how an agent works in this repo | "Would this apply on every future task?" |
| `decision` | A choice made, with a reason | "Does this answer a *why* that someone will ask again?" |
| `gotcha` | Non-obvious behavior discovered the hard way | "Would someone waste an hour rediscovering this?" |
| `spec` | A statement about what the system *shall do* | "Is this a requirement, not an explanation?" |
| `noise` | Everything else | Default. |

**`noise` should be the biggest bucket.** If it isn't, you're being too
permissive. These are all noise: status updates, restatements of what the code
already plainly says, things discussed but not decided, opinions with no action
attached, and anything you'd have to guess to write down.

Emit the classification as a table before writing any files:

```
BUCKET    | STATEMENT                                    | SOURCE BULLET
rule      | Run migrations before the test suite         | "tests fail unless you migrate first"
noise     | —                                            | "we looked at the auth module"
```

## Step 4 — Route and write

### `rule` → `.agents/context/<slice>.md` (never AGENTS.md)

**Do not write to `AGENTS.md` under any circumstances.** It is a routing map
with a hard line cap. Standing rules are edited **in place** inside the matching
context slice. Git history is the archive; the file holds only what is true
right now. Two contradictory rules about the same subject is the failure this
whole skill exists to prevent.

Subject → slice map (pick exactly one; if none fit, stop and ask):

| Subject | Slice |
|---|---|
| Rendering, Next 15 params, realtime, app boundaries | `.agents/context/architecture.md` |
| Scripts, ports, env, hooks, CI | `.agents/context/commands.md` |
| Component anatomy, naming, stories, barrels | `.agents/context/components.md` |
| Write path, Prisma, services, RLS | `.agents/context/data-layer.md` |
| Tokens, type scale, spacing, themes | `.agents/context/design-tokens.md` |
| RHF + Zod + Controller, form audit | `.agents/context/forms.md` |
| Domain vocabulary | `.agents/context/glossary.md` |
| Query vs Redux, slices | `.agents/context/state.md` |
| How to manually verify a domain | `.agents/context/verification-recipes.md` |

Also check `openspec/config.yaml`. Short, universal conventions that belong in
every OpenSpec planning request may go in its `context:` block instead of a
slice — but keep it tight.

If a rule about the same subject already exists in the chosen slice, replace it.
Do not append a duplicate.

### `decision` → `docs/adr/`

One file per decision, never appended to a running log:

```
docs/adr/NNNN-short-title.md
```

Numbered sequentially from the highest existing `NNNN-` prefix. If no numbered
files exist yet, start at `0001`. **Always skip `0002`** — it is reserved for
`0002-mapbox-over-google-places.md` (see `docs/CONTEXT-OPTIMIZATION.md` §4).
The unnumbered `superseded-google-places-chatgpt-note.md` does not count toward
the sequence.

Template:

```markdown
# NNNN. <Title>

- Date: YYYY-MM-DD
- Status: accepted

## Context
<What forced a choice.>

## Decision
<What was chosen.>

## Consequences
<What this now commits us to, and what it rules out.>
```

Superseding an old decision means writing a new record with
`Status: supersedes NNNN` and editing the old one to `Status: superseded by
NNNN`. Never delete a decision record.

### `gotcha` → known-drift or tech-debt (no `docs/gotchas.md`)

Split by kind. Do **not** create `docs/gotchas.md`.

| Kind | Destination |
|---|---|
| Docs that lie or lag behind code; docs-vs-code disagreements | `.agents/context/known-drift.md` |
| Shortcuts, deferred work, patterns that are debt not precedent | `docs/tech-debt.md` |

Append under an existing `##` heading when one matches the subsystem; otherwise
add a short new `##` section. One or two sentences each: the symptom, then the
cause. If a gotcha gets fixed, delete the entry in the same commit as the fix.

### `spec` → a draft proposal, never a direct spec edit

**Do not write to `openspec/specs/` under any circumstances.** That directory is
maintained by OpenSpec's propose → apply → sync → archive cycle. Hand-editing it
desyncs the specs from any in-flight `changes/` folder and silently breaks the
delta mechanism.

Instead, draft a change folder matching the shape of existing changes (see
`openspec/changes/player-email-password-auth/`):

```
openspec/changes/<change-id>/
  proposal.md
  design.md          # if the change needs design notes
  tasks.md
  specs/             # delta specs only, if requirements are clear enough
```

Write the requirement in the format the rest of the repo's specs use —
SHALL/MUST + Given/When/Then; read a neighboring `spec.md` first if unsure.
Then tell the user, in the final report, to run **`/opsx-propose`** (hyphen,
not colon) to take it through validation properly.

If the user supplied affected capability names, use them for the change id and
scope. If they didn't, infer from the bullets and flag the inference.

### `noise` → dropped

List them in the report so the user can object, but write nothing.

## Step 5 — Guardrails

Verify all of these before committing. Any failure means stop and report, not
work around:

```bash
# nothing staged under openspec/specs/
git diff --cached --name-only | grep -q '^openspec/specs/' && echo "VIOLATION"

# AGENTS.md must be unmodified
git diff --cached --name-only | grep -q '^AGENTS\.md$' && echo "VIOLATION"

# not on main
[ "$(git rev-parse --abbrev-ref HEAD)" = "main" ] && echo "VIOLATION"

# branch is correctly named
git rev-parse --abbrev-ref HEAD | grep -q '^knowledge/' || echo "VIOLATION"
```

If every bullet came back `noise`, that's a valid outcome. Delete the branch,
write nothing, and tell the user there was nothing durable in the batch.

## Step 6 — Commit and push

One commit. Use a conventional `docs:` prefix so commitlint
(`@commitlint/config-conventional` via `.husky/commit-msg`) accepts it.
Message body lists every statement written and where it went:

```
docs: knowledge sync — <short summary>

rule      .agents/context/data-layer.md           <statement>
decision  docs/adr/0003-cache-ttl.md              <statement>
gotcha    .agents/context/known-drift.md          <statement>
spec      openspec/changes/cache-ttl/             <statement> (needs /opsx-propose)
```

Then:

```bash
git push -u origin knowledge/<slug>
```

**Warn the user before push (and again in the report):** `.husky/pre-push` runs
`pnpm lint && pnpm build` across all four apps. A docs-only knowledge branch
still pays the full build cost and can fail for unrelated reasons. Never
`--force`. Never push to `main`. Never merge. The branch is a proposal for the
user to review — this content gets pulled into the context of every future
session, so one bad extraction merged unreviewed compounds across every task
that follows.

## Step 7 — Report

Tell the user:

1. The branch name and the PR URL if the push output printed one.
2. The bucket table from Step 3, including what was dropped as noise.
3. Any `spec` items that still need `/opsx-propose` run on them.
4. Whether classification ran via an inherited-model subagent or fell back
   inline.
5. That pre-push will (or did) build all four apps — expect minutes.

Keep it short. The diff is the real output.
