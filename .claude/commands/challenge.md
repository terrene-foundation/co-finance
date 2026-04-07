---
name: challenge
description: Phase 04 — Stress-test your work. Find every weakness before your grader does. Produces finalized output.
argument-hint: "[assignment or topic]"
---

# /challenge $ARGUMENTS

Adversarial review of your work. The goal is to find problems, not confirm quality.

## Workspace Resolution

1. If `$ARGUMENTS` specifies a project, use `workspaces/$ARGUMENTS/`
2. Otherwise, use most recently modified under `workspaces/` (excluding `_template/`)

## Protocol

1. **Read your work** from `03-drafts/`
2. **Challenge every claim** — is it supported? Is the evidence strong enough?
3. **Check citations** — delegate to citation-specialist for verification
4. **Find structural weaknesses** — gaps in logic, missing counterarguments, weak transitions
5. **Grade against the rubric** if one exists in `briefs/`
6. **Never say "this is fine"** — always find at least one improvement
7. **Iterate** — after the student addresses findings, review again
8. **Finalize** — once quality passes, save the finalized work to `05-output/`

## Output

Save review findings to `04-review/challenge-[topic-slug].md`:

- **Critical Issues** (must fix before submission)
- **Major Issues** (should fix)
- **Minor Issues** (worth fixing if time allows)
- **Strengths** (what works well)

Once critical and major issues are resolved, save finalized work to `05-output/`.

## Next Steps

After /challenge produces finalized output:

- `/learn` — reflect on what you learned
- `/deliver` — package and format for submission

## Journal Entry

Record risks, gaps, or discoveries found during review in `journal/`.
