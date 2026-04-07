# Journal Rules

## Scope

These rules apply to ALL workspace operations. The journal is the primary knowledge trail for every finance project — it tracks your analytical decisions, research findings, and reasoning so nothing gets lost between sessions.

## MUST Rules

### 1. Journal Every Insight

Every COL-F command that produces insights, decisions, or discoveries MUST create corresponding journal entries in the workspace's `journal/` directory. No insight should be lost between sessions. This includes analytical choices (which valuation method, which data source), research findings (correlations, anomalies, key literature), and identified risks (data quality issues, methodological concerns).

### 2. Sequential Naming

Journal entries MUST use sequential naming: `NNNN-TYPE-topic.md` (e.g., `0001-DECISION-chose-dcf-over-comparables.md`, `0002-DISCOVERY-correlation-gdp-interest-rates.md`). Before creating a new entry, MUST check the highest existing number in the journal directory.

### 3. Frontmatter Required

Journal entries MUST include YAML frontmatter with these fields:

```yaml
---
type: DECISION | DISCOVERY | TRADE-OFF | RISK | CONNECTION | GAP
date: YYYY-MM-DD
created_at: [ISO-8601 timestamp]
author: human | agent | co-authored
session_id: [session ID if available]
session_turn: [conversation turn number]
project: [project name]
topic: [brief description]
phase: analyze | plan | execute | review | learn | deliver
tags: [list of relevant tags]
---
```

- `created_at`: precise creation timestamp for temporal analysis
- `author`: who drove the insight, determined by decision tree:
  - `human` — user stated the conclusion before the AI elaborated. Test: would this insight exist without the AI?
  - `agent` — AI surfaced this unprompted. Test: did the user know this before the AI said it?
  - `co-authored` — insight evolved through exchange; neither party alone reached it. When uncertain, prefer `co-authored` over `human`.
- `session_id`: links the entry to the session that produced it
- `session_turn`: approximate conversation turn number; creates temporal fingerprint (entries within a session should show increasing turns)

### 4. Use Correct Entry Types

Six entry types exist. Use the right one:

| Type | Purpose | When Created |
|------|---------|-------------|
| **DECISION** | Record an analytical or methodological choice with rationale and alternatives | When choosing a valuation method, data source, theoretical framework, or scope |
| **DISCOVERY** | Capture something learned — a finding, pattern, correlation, or insight | When research, data analysis, or literature review reveals new understanding |
| **TRADE-OFF** | Document a trade-off evaluation — what was gained and what was sacrificed | When balancing competing concerns (model simplicity vs. accuracy, data recency vs. coverage) |
| **RISK** | Record an identified risk, data quality issue, or methodological concern | When analysis reveals survivorship bias, missing data, questionable assumptions, or weak evidence |
| **CONNECTION** | Note a relationship between theories, markets, or findings | When cross-referencing reveals links that matter (e.g., Modigliani-Miller connecting to CAPM) |
| **GAP** | Flag something missing that needs attention | When analysis reveals missing data, untested assumptions, or sources still needed |

### 5. For Discussion Section

Every journal entry MUST include a `## For Discussion` section with 2-3 questions that probe the reasoning behind the entry. Requirements:
- At least one question must reference specific data, sources, or constraints from the entry
- At least one must be a counterfactual ("If X had been different...")
- Question structures must vary across entries (compare, challenge assumption, extend, invert, ask for evidence)
- Questions must be answerable only by someone who genuinely engaged with the decision

### 6. Self-Contained Entries

Each journal entry MUST be self-contained — readable without requiring other context. Include enough background that a future session (or a study partner) can understand the entry on its own. For finance entries, this means specifying the financial context: which company, which time period, which market, which course assignment.

## SHOULD Rules

### 1. Decision Rationale

DECISION entries SHOULD include alternatives considered and the rationale for the choice, not just the decision itself. For example, if choosing DCF over comparables, explain why comparables were less suitable for this particular analysis.

### 2. Consequences and Follow-Up

Entries SHOULD include consequences, follow-up actions, or next steps where applicable. A GAP entry should note how you plan to resolve it. A RISK entry should note what mitigation is possible.

## MUST NOT Rules

### 1. No Overwriting

MUST NOT overwrite existing journal entries. Each entry is immutable once created. If a decision changes (e.g., switching from DCF to comparables after finding better data), create a new entry that references the original.

### 2. No Entries Without Frontmatter

MUST NOT create journal entries without proper YAML frontmatter. The frontmatter enables searching, filtering, and cross-referencing across your project.
