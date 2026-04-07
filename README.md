# COL for Finance (COL-F)

<p align="center">
  <img src="https://img.shields.io/badge/platform-Claude%20Code-7C3AED.svg" alt="Claude Code">
  <img src="https://img.shields.io/badge/CO-Finance%20(COL-F)-green.svg" alt="COL-F">
  <img src="https://img.shields.io/badge/audience-UG%2FPG%20Students-blue.svg" alt="UG/PG Students">
  <img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="Apache 2.0">
</p>

<p align="center">
  <strong>A domain application of Cognitive Orchestration (CO) for finance education</strong><br>
  An AI-powered academic companion for <a href="https://docs.anthropic.com/en/docs/claude-code">Claude Code</a> that helps finance students research, write, study, and present -- while keeping their judgment at the center.
</p>

---

> "The AI handles execution -- finding sources, formatting citations, structuring arguments. Your judgment remains visible -- choosing a thesis, evaluating evidence, making analytical conclusions."

COL-F gives Claude deep finance domain knowledge -- market theory, valuation methods, financial instruments, academic writing conventions, and citation standards -- so it can be a genuinely helpful academic partner for finance students.

**CO Specification**: v1.1 (CC BY 4.0, [Terrene Foundation](https://terrene.foundation))

---

## Three Failure Modes (CO Principle 3)

CO identifies three universal failure modes in human-AI collaboration. Here is how they manifest in finance education:

**Amnesia**: AI forgets course-specific conventions as sessions grow. Assignment constraints, disclaimer requirements, and rubric criteria established early are lost as context fills.

**Convention Drift**: AI follows generic financial conventions instead of course-specific ones. A FNCE101 assignment gets graduate-level formulas. Citation style drifts. Data sources default to the wrong provider.

**Safety Blindness**: AI presents historical returns without disclaimers. AI fabricates citations. AI provides investment-like recommendations without qualification. AI presents AI-generated analysis as the student's own work.

COL-F addresses all three through its five-layer architecture. See `docs/three-failure-modes.md` for detailed mitigations.

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

Then type `/start`. COL-F introduces itself, explains the workflow, and asks about your course.

### Option B: Claude Desktop Cowork (Plugin)

For students who prefer a desktop interface. No coding experience needed.

**What you need before starting:**
- Claude Desktop installed (version with Cowork support; your university may provide this)
- A Claude Pro, Max, or Team subscription
- About 10 minutes for one-time setup

> **Note:** Your professor or teaching assistant may have already set up a shared workspace for your course. Check with them before starting from scratch.

**Step 1: Download the workspace files**

You need a copy of the COL-F workspace on your computer. Choose one method:

**Method A (recommended for most students):** Go to [github.com/terrene-foundation/co-finance](https://github.com/terrene-foundation/co-finance). Click the green **"Code"** button, then click **"Download ZIP"**. Unzip the downloaded file and move the folder to your Documents.

**Method B (if you know git):**
```bash
git clone https://github.com/terrene-foundation/co-finance.git
```

**Step 2: Install the COL-F plugin in Claude Desktop**

1. Open Claude Desktop
2. Switch to the **"Cowork"** tab (at the top of the window)
3. In the left sidebar, click **"Customize"**
4. Click **"Browse plugins"**
5. Search for `co-finance` and click **"Install"**

If `co-finance` does not appear in the plugin browser, install it manually: click **"Load from folder"** and navigate to the `plugin` folder inside the folder you downloaded in Step 1.

**Step 3: Open your workspace and start**

1. In the Cowork tab, click **"Open folder"** (or drag the downloaded folder into the Cowork window)
2. Type `/co-finance:start` in the chat
3. COL-F will introduce itself, ask about your course, and suggest what to do first

**Quick entry points** (type these after setup):
- Have an assignment due? `/co-finance:assignment`
- Need to study a topic? `/co-finance:study`
- Preparing for an exam? `/co-finance:exam-prep`

**Troubleshooting:**
- **"Plugin not found" in the browser**: Use the manual "Load from folder" method in Step 2
- **The folder won't open in Cowork**: Make sure you are in the Cowork tab, not the regular Chat tab
- **Commands don't work**: Type the full name with prefix, e.g., `/co-finance:study` (not just `/study`)

### Limitations of the Cowork plugin (compared to CLI)

The Cowork plugin provides the same methodology and agents as the CLI version, with these differences:

| Feature | CLI (Claude Code) | Cowork Plugin |
|---------|-------------------|---------------|
| **Guardrail enforcement** | Hooks automatically enforce citation verification, disclaimer requirements, and academic integrity checks | Rules are advisory. COL-F follows them but cannot programmatically enforce them. Run `/co-finance:review` and `/co-finance:cite` manually before submitting work. |
| **Session memory** | `.session-notes` is read automatically on the next session start | Run `/co-finance:wrapup` before ending a session. The next session does not auto-read notes; tell COL-F to "read .session-notes" or run `/co-finance:start` which checks for them. |
| **Skill names** | `/study`, `/explain`, `/case`, etc. | `/co-finance:study`, `/co-finance:explain`, `/co-finance:case`, etc. (plugin prefix required) |
| **Agent permissions** | Agents can enforce permission modes and use hooks | Plugin agents cannot use hooks or override permission settings (Cowork security restriction). |
| **File system access** | Full access | Access limited to the folder you opened in Cowork. |
| **Course-specific tutors** | Pre-configured for specific courses (FNCE101, FNCE102, etc.) | Same tutors are available. If your course is not listed, COL-F still works using the general finance specialists. |

These limitations do not affect the core methodology. Study guides, practice problems, case analysis, research support, and academic writing assistance all work identically.

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
  co-for-finance.md       COL-F domain application specification
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
