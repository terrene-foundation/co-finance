# CO for Finance (COF)

<p align="center">
  <img src="https://img.shields.io/badge/platform-Claude%20Code-7C3AED.svg" alt="Claude Code">
  <img src="https://img.shields.io/badge/CO-Finance%20(COF)-green.svg" alt="COF">
  <img src="https://img.shields.io/badge/audience-UG%2FPG%20Students-blue.svg" alt="UG/PG Students">
  <img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="Apache 2.0">
</p>

<p align="center">
  <strong>A domain application of Cognitive Orchestration (CO) for finance education</strong><br>
  An AI-powered academic companion for <a href="https://docs.anthropic.com/en/docs/claude-code">Claude Code</a> that helps finance students research, write, study, and present -- while keeping their judgment at the center.
</p>

---

> "The AI handles execution -- finding sources, formatting citations, structuring arguments. Your judgment remains visible -- choosing a thesis, evaluating evidence, making analytical conclusions."

COF gives Claude deep finance domain knowledge -- market theory, valuation methods, financial instruments, academic writing conventions, and citation standards -- so it can be a genuinely helpful academic partner for finance students.

**CO Specification**: v1.1 (CC BY 4.0, [Terrene Foundation](https://terrene.foundation))

---

## Three Failure Modes (CO Principle 3)

CO identifies three universal failure modes in human-AI collaboration. Here is how they manifest in finance education:

**Amnesia**: AI forgets course-specific conventions as sessions grow. Assignment constraints, disclaimer requirements, and rubric criteria established early are lost as context fills.

**Convention Drift**: AI follows generic financial conventions instead of course-specific ones. A FNCE101 assignment gets graduate-level formulas. Citation style drifts. Data sources default to the wrong provider.

**Safety Blindness**: AI presents historical returns without disclaimers. AI fabricates citations. AI provides investment-like recommendations without qualification. AI presents AI-generated analysis as the student's own work.

COF addresses all three through its five-layer architecture. See `docs/three-failure-modes.md` for detailed mitigations.

## Authentic Voice (CO Principle 8)

All academic output must reflect genuine human intellectual direction. The student makes the analytical decisions; the AI assists with research and structure.

- Disclose AI assistance according to your institution's academic integrity policy
- The workspace progression (research -> analysis -> drafting -> review) creates an auditable trail of student engagement
- Writing style rules exist to produce high-quality academic prose, not to conceal AI involvement

See `rules/academic-integrity.md` for disclosure requirements.

---

## What It Does

```
Your Question or Assignment
         |
  1. Agents       24 Specialists       Who should help with this?
         |
  2. Skills       20 Topic Modules     What does the AI need to know?
         |
  3. Rules        13 Guardrails        Academic integrity, accuracy, citations
         |
  4. Commands     21 Slash Commands    What workflow to follow?
         |
  5. Hooks        5 Lifecycle Scripts  Anti-amnesia, citation checks
         |
  Better Research, Writing, and Analysis
```

### Agents -- Specialized Help

**Academic** `academic-writer` `research-assistant` `thesis-advisor` `citation-specialist` `presentation-designer` `case-study-analyst` `exam-coach`

**Course Tutors** `fnce101-tutor` `corporate-finance-tutor` `international-finance-tutor` `fmi-tutor`

**Analysis** `deep-analyst` `assignment-analyst` `concept-explainer` `coursework-analyst` `valuation-specialist`

**Support** `peer-reviewer` `data-source-advisor` `regulatory-context` `finance-navigator` `todo-manager` `gh-manager`

### Skills -- Finance Knowledge Base

| Module | Topic |
|--------|-------|
| Financial Instruments | Equities, fixed income, derivatives, forex, ETFs |
| Market Analysis | Technical indicators, fundamental ratios, valuation |
| Portfolio Theory | MPT, CAPM, efficient frontier, optimization |
| Risk Management | VaR, stress testing, hedging, options Greeks |
| Corporate Finance | Capital structure, WACC, M&A, capital budgeting |
| International Finance | Exchange rates, BOP, parity conditions, crises |
| FNCE 101 Foundations | TVM, stock/bond valuation, financial statements |
| Academic Writing | Thesis structure, arguments, literature review |
| Research Methods | Source evaluation, data collection, econometrics |
| Citation Guide | APA 7th, Chicago, Harvard formatting |
| Presentation Skills | Slide design, data visualization, storytelling |
| Exam Preparation | Study strategies, problem types, formula sheets |
| Case Study Framework | Harvard method, frameworks, DCF walkthrough |
| Formula Reference | All key formulas by course |

### Commands -- Academic Workflows

| Command | What It Does |
|---------|-------------|
| `/start` | Student orientation -- how to use this system |
| `/study` | Study guide for any finance topic |
| `/research` | Structured literature search and synthesis |
| `/thesis` | Plan a thesis or research paper |
| `/assignment` | Work through a course assignment |
| `/present` | Create a presentation |
| `/explain` | Get a clear concept explanation |
| `/practice` | Practice problems with solutions |
| `/cite` | Format citations in any style |
| `/exam-prep` | Comprehensive exam preparation |
| `/case` | Analyze a business case |
| `/formula` | Quick formula reference |
| `/review` | Peer review of your writing |
| `/challenge` | Stress-test your arguments |
| `/ws` | Check project status |
| `/wrapup` | Save progress before ending |

---

## Quick Start

### Option A: Claude Code (CLI)

For technical users. Full CO enforcement via hooks.

```bash
git clone https://github.com/terrene-foundation/co-finance.git
cd co-finance
claude
```

Then type `/start`. COF introduces itself, explains the workflow, and asks about your course.

### Option B: Claude Desktop Cowork (Plugin)

For students who prefer a desktop interface. Same methodology, broader accessibility.

1. Clone the template (you need the workspace structure):
   ```bash
   git clone https://github.com/terrene-foundation/co-finance.git
   ```
2. Install the COF plugin in Claude Desktop: open Cowork, click "Customize", install `co-finance` (or load from the `plugin/` folder in this repo)
3. Open the cloned folder in Cowork and type `/co-finance:start`

All skills are available as `/co-finance:study`, `/co-finance:explain`, `/co-finance:case`, etc.

**What's different from CLI**: Hooks (automated validation) are advisory in Cowork, not enforced. All other functionality (skills, agents, tutors) works identically.

---

## Repository Structure

```
.claude/
  agents/          24 specialist agents
    academic/      7 academic specialists
    tutors/        4 course-specific tutors
    finance/       5 adapted finance experts
    management/    2 operations agents
    project/       2 project-specific agents
  skills/          20 domain knowledge directories
  rules/           13 behavioral constraint files
  commands/        21 slash command definitions

scripts/
  hooks/           Lifecycle hooks (session management, citation checks)
  learning/        Learning system scripts

docs/
  co-for-finance.md       COF domain application specification
  three-failure-modes.md  Three failure modes in finance education
  eatp-constraint-mapping.md  EATP constraint dimension mapping
  co-conformance.md       CO conformance checklist

workspaces/
  _template/       Academic workspace template
  <project>/       Per-project workspace directories

CLAUDE.md          Root instructions (auto-loaded every session)
```

---

## License

Apache License, Version 2.0. See [LICENSE](LICENSE).

Copyright 2026 Terrene Foundation.
