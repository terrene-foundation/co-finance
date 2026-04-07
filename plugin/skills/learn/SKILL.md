---
name: learn
description: "Phase 05 — Extract knowledge from completed work into .claude/ artifacts"
---

# /learn - Knowledge Extraction (Phase 05)

## Purpose

After Phase 04 (Review) has produced finalized output, extract reusable knowledge — patterns, insights, techniques, and preferences — into `.claude/` artifacts so future sessions benefit from what was learned. This is the bridge between "work done" and "knowledge retained."

**Key principle**: Knowledge extraction output goes INTO `.claude/` artifacts (rules, skills, instincts), not into the workspace. Human approval is required before any artifact is created or modified.

## Arguments

`$ARGUMENTS` is parsed as the subcommand:

- No arguments → show learning status and suggest extraction candidates
- `stats` → show detailed observation statistics
- `analyze` → analyze the current workspace for extractable patterns
- `extract` → propose knowledge artifacts from the completed work (requires approval)
- `list` → list all learned artifacts from this project

## Quick Reference

| Command          | Action                                              |
| ---------------- | --------------------------------------------------- |
| `/learn`         | Show learning status and extraction candidates      |
| `/learn stats`   | Show detailed observation statistics                |
| `/learn analyze` | Analyze workspace for extractable patterns          |
| `/learn extract` | Propose knowledge artifacts (human approval needed) |
| `/learn list`    | List all learned artifacts from this project        |

## Workflow

### Step 1 — Review Completed Work

Read all finalized output from the workspace (drafts, analyses, feedback addressed). Identify:

- **Recurring patterns**: Research approaches, analytical frameworks, or citation styles that worked well
- **Error-fix pairs**: Mistakes caught during review and how they were corrected
- **Student preferences**: Formatting choices, argument styles, source preferences
- **Domain insights**: Finance concepts, formulas, or frameworks that were central to the work
- **Process improvements**: Workflow adjustments that made the project more efficient

### Step 2 — Propose Artifacts

For each extractable insight, propose a specific `.claude/` artifact:

- **Rule addition**: A new rule or rule refinement (e.g., "always include risk disclosures with portfolio analysis")
- **Skill enhancement**: Additional reference material for an existing skill directory
- **Command improvement**: Suggestions for improving existing commands based on how they were used

Present each proposal clearly:

- What was learned
- Where it would go (which file or directory)
- Why it matters for future work
- The specific content to add

### Step 3 — Human Approval Gate

**This step is mandatory.** Present all proposals to the student and ask:

- "Do you want to keep this insight for future sessions?"
- "Does this accurately reflect what you learned?"
- "Should anything be changed before saving?"

Only create or modify `.claude/` artifacts after explicit approval.

### Step 4 — Write Approved Artifacts

For each approved proposal:

1. Write the artifact to the appropriate `.claude/` location
2. Confirm what was created and where
3. Explain how it will help in future sessions

## What Gets Extracted (and Where)

| Learning Type       | Destination                           | Example                                |
| ------------------- | ------------------------------------- | -------------------------------------- |
| Research pattern    | `.claude/rules/research-style.md` (new or existing) | "Student prefers FRED for macro data" |
| Writing preference  | `.claude/rules/citation-style.md` (new or existing) | "Use APA 7th with specific formatting" |
| Error pattern       | New rule or skill section             | "Always verify formula citations"      |
| Domain knowledge    | `.claude/skills/` (relevant module)   | New formula reference or concept note  |
| Process improvement | `.claude/commands/` (suggestion only) | Workflow adjustment recommendation     |

## Critical Rules

1. **Human approval required** — Never write to `.claude/` without explicit student approval
2. **Output goes to .claude/, not workspace** — The learn phase produces artifacts, not deliverables
3. **Phase 04 must be complete** — Do not run `/learn` before review is finished
4. **Additive only** — Never delete existing artifacts; add to or refine them
5. **Explain in plain language** — The student decides what to keep based on understanding, not technical detail

## Related Commands

- `/challenge` / `/review` / `/redteam` — Phase 04 (Review) — must complete before Learn
- `/deliver` — Phase 06 (Deliver) — package and ship after learning is captured

## Skill Reference

This command uses: `scripts/learning/observation-logger.js`, `scripts/learning/digest-builder.js`
