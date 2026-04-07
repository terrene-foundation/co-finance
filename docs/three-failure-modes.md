# Three Failure Modes in Finance Education

CO Principle 3 identifies three universal failure modes. Here is how they manifest in finance:

## Amnesia

AI forgets course-specific conventions as sessions grow. A student working on a corporate finance assignment finds the AI reverting to personal finance advice. Assignment-specific constraints (required frameworks, data sources, citation formats) are lost. Disclaimer requirements are forgotten mid-session. Rubric criteria established early are evicted from context.

**COL-F Mitigation**: `user-prompt-rules-reminder.js` re-injects critical rules (financial accuracy, disclaimer requirements, data source standards) on every user interaction. Session notes preserve context across sessions.

## Convention Drift

AI follows generic financial conventions instead of course-specific ones. A FNCE101 assignment gets graduate-level formulas. Citation style drifts from the required format. The AI defaults to Yahoo Finance when the assignment requires FRED or Bloomberg data. Nominal vs real, simple vs compound distinctions are inconsistently applied.

**COL-F Mitigation**: Course-specific tutor agents carry curriculum-appropriate knowledge. The `financial-accuracy.md` rule enforces precision standards. Skill modules provide authoritative reference material per course level.

## Safety Blindness

AI presents historical returns without required disclaimers. AI generates plausible-sounding data not from authoritative sources. AI fabricates citations. AI provides investment-like recommendations without qualification. AI presents AI-generated analysis as the student's own work.

**COL-F Mitigation**: `validate-disclaimer.js` hook catches missing disclaimers on performance data. `validate-citations.js` hook verifies citation format. `academic-integrity.md` rule requires AI assistance disclosure. `data-sourcing.md` rule mandates authoritative sources.
