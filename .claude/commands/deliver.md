---
name: deliver
description: "Phase 06 — Package and ship the final deliverable for submission"
---

# /deliver - Delivery (Phase 06)

## Purpose

Package the finalized output from Phase 04 (Review) into the format required for submission. This is the last phase of the 6-phase workflow — after review has produced finalized output and learning has been extracted.

## Input

`$ARGUMENTS` may specify a project name or deliverable type. Examples: "deliver my thesis chapter", "deliver the macro-policy-paper", "deliver as PDF".

If `$ARGUMENTS` is empty, ask the student: "Which project are you ready to deliver? And what format does your professor expect (Word document, PDF, LaTeX, presentation slides)?"

## Workspace Resolution

1. If `$ARGUMENTS` specifies a project name, use `workspaces/$ARGUMENTS/`
2. Otherwise, use the most recently modified directory under `workspaces/` (excluding `instructions/`)
3. If no workspace exists, ask the student to create one first
4. Read all files in `workspaces/<project>/briefs/` for submission requirements

## Phase Check

Before proceeding, verify:
- Phase 04 (Review) has been completed — `04-feedback/` exists and feedback has been addressed
- Finalized drafts exist in the workspace
- If Phase 05 (Learn) was skipped, mention it: "You can still run `/learn` to capture insights from this project for future sessions."

## Workflow

### Step 1 — Gather Submission Requirements

From the brief and student input, confirm:
- **Format**: What format is required? (Word, PDF, LaTeX, plain text, slides)
- **Components**: What needs to be included? (title page, abstract, table of contents, appendices, bibliography)
- **Naming**: Any specific file naming conventions?
- **Submission method**: How will it be submitted? (email, LMS upload, printed)
- **Deadline**: When is it due?

### Step 2 — Pre-Submission Checklist

Run through this checklist with the student:

**Content completeness:**
- [ ] All required sections are present and substantive
- [ ] Thesis statement is clear and supported by the analysis
- [ ] All claims are supported by cited evidence
- [ ] Counterarguments are addressed
- [ ] Conclusion synthesizes findings and restates thesis

**Citations and references:**
- [ ] Every in-text citation has a corresponding reference list entry
- [ ] Every reference list entry is cited in the text
- [ ] Citation format is consistent (APA, Chicago, Harvard — as required)
- [ ] Data sources are properly cited with retrieval dates

**Formatting:**
- [ ] Correct font, spacing, and margins
- [ ] Page numbers present
- [ ] Title page includes all required information
- [ ] Headings are consistent with the required style
- [ ] Tables and figures are labeled and referenced in text

**Compliance:**
- [ ] Disclaimers included where required (performance data, hypothetical results)
- [ ] AI disclosure statement present (per institutional policy)
- [ ] Word count within range (if specified)

**Finance-specific:**
- [ ] Financial calculations show methodology
- [ ] Nominal vs. real values clearly distinguished
- [ ] Risk disclosures included with investment analysis
- [ ] Historical performance in past tense

### Step 3 — Package the Deliverable

Based on the requirements:
1. Assemble all components in the correct order
2. Apply final formatting
3. Generate the output in the required format
4. Place the final deliverable in `workspaces/<project>/05-output/`

### Step 4 — Final Confirmation

Present the packaged deliverable to the student:
- Summary of what is included
- Format and location of the final file
- Any last items to check before submission
- Reminder of the deadline if one was stated

Ask: "Does everything look ready to submit? Is there anything you want to change before this goes to your professor?"

## Agent Team

- **peer-reviewer** — Final pass for any remaining issues
- **citation-specialist** — Final citation format verification
- Appropriate **course tutor** — Domain accuracy spot-check

## Output Location

Final deliverables go to: `workspaces/<project>/05-output/`

## Critical Rules

1. **Phase 04 must be complete** — Do not package work that has not been through review
2. **Student confirms before submission** — Never declare something "submitted" without explicit approval
3. **Include all required components** — Check the brief for what the professor expects
4. **Match the required format exactly** — Wrong format can lose marks before content is even read

## Related Commands

- `/challenge` / `/review` / `/redteam` — Phase 04 (Review) — must complete before Deliver
- `/learn` — Phase 05 (Learn) — extract knowledge before or after delivery
- `/ws` — Check project status
- `/wrapup` — Save session progress
