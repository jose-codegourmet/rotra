---
name: rotra-knowledge-load
description: Load the repo's current accumulated knowledge from main — AGENTS.md rules, OpenSpec specs and in-flight changes, ADRs, known-drift, and tech-debt — and produce a short briefing before non-trivial work. Use when the user says "catch up", "where are we", "what's the current state", "load context", "what do we know about X", "get up to speed", or asks about past decisions, project conventions, or work already in flight. Also use before implementing anything non-trivial so the work does not contradict a decision already made. Do not use for typo fixes or single-file edits that AGENTS.md §2 already routes.
user-invocable: true
---

# rotra-knowledge-load

Reconstruct project state from the repo instead of guessing or asking.

The trap here is reading everything. A knowledge base is useful in proportion to
how selectively you read it — dumping every spec and context slice into
context leaves no room to actually do the work, and buries the three facts that
mattered. Read titles first, then open only what the current task needs.

This skill is **read-only**. It does not write, create branches, commit, or
modify any file. If loading surfaces something that should be recorded, say so
and let the user invoke `rotra-knowledge-sync`.

## Step 1 — Get a clean view of main

```bash
git fetch origin
git log --oneline -1 origin/main
```

Read knowledge from `origin/main`, not the working tree, so a half-finished
local branch doesn't get mistaken for settled truth. If the working tree differs
from `origin/main` in the knowledge files, note it in the briefing rather than
silently picking one.

If recent commits on `origin/main` are prefixed `docs: knowledge`, those are
freshly captured — read their diffs first, since they're the most likely to be
relevant and the least likely to already be known.

## Step 2 — Read the index layer

Read these in full. They're small and they're the map:

- `AGENTS.md` — specifically §0 (non-negotiables), §2 (context routing),
  §3 (authority order), and §7 (reality-check traps). Do **not** invent a
  `<!-- KNOWLEDGE:START -->` block; this repo does not use one.
- `openspec/config.yaml` — project context and conventions injected into every
  OpenSpec planning request.

Then read **names / headings only**, not contents:

```bash
# Capabilities with built/partial/unbuilt flags — better than bare ls
# Read .agents/context/spec-index.md (table only; do not open every spec)

ls openspec/changes/                  # what work is in flight
ls docs/adr/                          # decision titles
rg '^## ' .agents/context/known-drift.md docs/tech-debt.md
```

Stop here and assess. You now know what exists without having read any of it.

## Step 3 — Read selectively

Pick what to open based on the task the user described. If they didn't describe
one, ask what they're working on rather than opening files at random — a
briefing with no task to serve is just noise.

Budget roughly:

- **Every** in-flight change in `openspec/changes/` — read `proposal.md` and
  `tasks.md`. Work already underway is the highest-value context and there are
  usually few of them. Unfinished tasks are the single most important thing to
  surface.
- **At most 3** spec files under `openspec/specs/<domain>/spec.md`, chosen by
  name-match to the task (use `spec-index.md` status to prefer built/partial
  over unbuilt unless the task is about the unbuilt domain).
- **At most 5** ADRs under `docs/adr/`, chosen by title-match to the task.
- The `known-drift.md` / `tech-debt.md` sections whose headings match subsystems
  the task touches.
- The matching `.agents/context/` slice(s) from AGENTS.md §2 for the task type
  (architecture, data-layer, forms, etc.) — at most 2 unless the task spans
  clearly distinct areas.

If more than that looks relevant, say so in the briefing and let the user point
you at what matters. Guessing wide is worse than asking narrow.

## Step 4 — Brief

Output this structure, and keep the whole thing under roughly 300 words. It's a
briefing, not a report — the user knows their own project.

```markdown
## State of main
<commit sha + date, and whether the local tree diverges on knowledge files>

## Rules in force
<bullets from AGENTS.md §0 / §3 and openspec/config.yaml, verbatim-ish;
 only those that bind the current task>

## In flight
<each active change: id, one-line intent, tasks done / tasks total>

## Relevant prior decisions
<title + the decision itself in one line each, with docs/adr/ path>

## Gotchas that apply
<one line each from known-drift.md / tech-debt.md>

## Reality check
<one or two mock-vs-real traps from AGENTS.md §7 that the task could hit —
 e.g. /sessions/* is mock theatre; real live stack is /find-sessions>

## Not loaded
<what you skipped and where it lives, so the user can ask for it>
```

The **Not loaded** section is not filler. It's what makes selective reading safe
— it tells the user what you deliberately didn't read so they can correct you
before you start work on a false picture.

## Step 5 — Flag new contradictions only

Before flagging a contradiction, check:

1. `AGENTS.md` §3 authority order (code > OpenSpec > known-drift > AGENTS.md >
   business_logic > techstack).
2. `.agents/context/known-drift.md` — catalogued docs-vs-code disagreements are
  already resolved there; do **not** stop on those.

Only stop for a **genuinely new** contradiction (e.g. an ADR that conflicts with
a rule in a context slice, or an in-flight change that contradicts a shipped
spec and is not already noted in known-drift). Surface both sides with file
paths and stop. Do not pick a winner.

Contradictions are the normal decay mode of a knowledge base, and they're also
the highest-value thing this skill can catch. Silently choosing the one that
suits the current task is how a knowledge base becomes actively harmful.

## What this skill does not do

It does not write. It does not create branches, commit, or modify any file. If
loading the context surfaces something that should be recorded, say so and let
the user invoke `rotra-knowledge-sync` — keeping read and write separate is what
makes it safe to run this before non-trivial work without thinking about it.
