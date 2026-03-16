# FNCE CO Claude

<p align="center">
  <img src="https://img.shields.io/badge/platform-Claude%20Code-7C3AED.svg" alt="Claude Code">
  <img src="https://img.shields.io/badge/domain-Finance%20Education-green.svg" alt="Finance Education">
  <img src="https://img.shields.io/badge/audience-UG%2FPG%20Students-blue.svg" alt="UG/PG Students">
  <img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="Apache 2.0">
</p>

<p align="center">
  <strong>Cognitive Orchestration for Finance Education</strong><br>
  An AI-powered academic companion for <a href="https://docs.anthropic.com/en/docs/claude-code">Claude Code</a> that helps finance students research, write, study, and present — while keeping their judgment at the center.
</p>

---

> "The AI handles execution — finding sources, formatting citations, structuring arguments. Your judgment remains visible — choosing a thesis, evaluating evidence, making analytical conclusions."

This CO setup gives Claude deep finance domain knowledge — market theory, valuation methods, financial instruments, academic writing conventions, and citation standards — so it can be a genuinely helpful academic partner for finance students.

---

## What It Does

```
Your Question or Assignment
         |
  1. Agents       18+ Specialists      Who should help with this?
         |
  2. Skills       20+ Topic Modules    What does the AI need to know?
         |
  3. Rules        12 Guardrails        Academic integrity, accuracy, citations
         |
  4. Commands     20+ Slash Commands   What workflow to follow?
         |
  5. Hooks        Lifecycle Scripts    Anti-amnesia, citation checks
         |
  Better Research, Writing, and Analysis
```

### Agents — Specialized Help

**Academic** `academic-writer` `research-assistant` `thesis-advisor` `citation-specialist` `presentation-designer` `case-study-analyst` `exam-coach`

**Course Tutors** `fnce101-tutor` `corporate-finance-tutor` `international-finance-tutor` `fmi-tutor`

**Analysis** `deep-analyst` `assignment-analyst` `concept-explainer` `coursework-analyst` `valuation-specialist`

**Support** `peer-reviewer` `data-source-advisor` `regulatory-context` `finance-navigator` `todo-manager` `gh-manager`

### Skills — Finance Knowledge Base

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

### Commands — Academic Workflows

| Command | What It Does |
|---------|-------------|
| `/start` | Student orientation — how to use this system |
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

```bash
# Clone
git clone <your-repo-url>
cd fnce-agents

# Go
claude
```

Then type `/start` to see how it works, or just describe what you need help with.

---

## Repository Structure

```
.claude/
  agents/          18+ specialist agents
    academic/      7 academic specialists
    tutors/        4 course-specific tutors
    finance/       5 adapted finance experts
    management/    2 operations agents
    project/       2 project-specific agents
  skills/          20+ domain knowledge directories
  rules/           12 behavioral constraint files
  commands/        20+ slash command definitions

scripts/
  hooks/           Lifecycle hooks (session management, citation checks)
  learning/        Learning system scripts

workspaces/
  _template/       Academic workspace template
  <project>/       Per-project workspace directories

CLAUDE.md          Root instructions (auto-loaded every session)
```

---

## License

Apache License, Version 2.0. See [LICENSE](LICENSE).
