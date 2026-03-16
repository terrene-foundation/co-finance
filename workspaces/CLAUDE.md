# Workspaces Scope

Workspaces are project records for academic work. The `briefs/` directory is the **only place students write** — everything else is agent output.

Read `.claude/` freely but never write to it except `.claude/agents/project/` and `.claude/skills/project/`.

## Phase Contract

Follow phases in order using slash commands. Each command is self-contained — it includes workspace detection, workflow steps, and agent teams.

Each phase has a human gate — do not proceed without student approval.

| Phase | Command      | Workspace Output                           | Gate              |
| ----- | ------------ | ------------------------------------------ | ----------------- |
| 01    | `/analyze`   | `01-research/`, `02-outline/`, `sources/`  | Student review    |
| 02    | `/todos`     | `todos/active/`                            | Student approval  |
| 03    | `/assignment`| `03-drafts/`, `todos/completed/`           | Draft review      |
| 04    | `/challenge` | `04-review/`                               | Student review    |
| 05    | Final        | `05-final/`                                | Student sign-off  |

Additional: `/ws` (status dashboard), `/wrapup` (save session notes before ending).

## Student Input Surface

`briefs/` is the only directory students write to. All commands read it for context. Students add numbered files over time:

- `01-assignment-brief.md` — assignment description, requirements, due date
- `02-additional-notes.md` — professor feedback, additional requirements
- `03-sources-found.md` — sources the student has already identified
- etc.

Copy `workspaces/_template/` to start a new workspace.

## What Lives Where

**Workspace** (`workspaces/<name>/`) — project record:

- `briefs/` — student input (the ONLY place students write)
- `01-research/` — research findings, literature summaries
- `02-outline/` — paper/project outline and structure
- `03-drafts/` — working drafts of sections
- `04-review/` — peer review feedback, argument analysis
- `05-final/` — final polished deliverables
- `sources/` — collected source materials and references
- `todos/` — task tracking (sections to write, sources to find)
