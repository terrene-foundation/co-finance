# CO for Finance (COF) — Domain Application

**Specification**: Cognitive Orchestration v1.1 — Domain Application
**Status**: Production
**License**: CC BY 4.0 — Terrene Foundation
**Repository**: [terrene-foundation/co-finance](https://github.com/terrene-foundation/co-finance)
**Reference Implementation**: `co-finance` (finance education CO deployment)

---

## Application Identity

```
Application Name:    CO for Finance
Short Name:          COF
Target Domain:       Finance education, financial analysis, academic research in finance
Target Practitioners: Finance students, instructors, researchers, analysts
Status:              Production (first deployment: undergraduate/graduate finance education)
```

---

## Step 1: Domain Analysis

### Three Failure Modes in Finance

**Amnesia in Finance**:

AI forgets course-specific conventions as sessions grow. A student working on a corporate finance assignment finds the AI reverting to personal finance advice. Assignment-specific constraints (required frameworks, data sources, citation formats) are lost. Disclaimer requirements are forgotten mid-session: historical performance data is presented without required disclaimers. Rubric criteria established early are evicted from context as calculations fill the window.

**Convention Drift in Finance**:

AI follows generic financial conventions instead of course-specific ones. A FNCE101 assignment gets graduate-level formulas. An international finance analysis uses US-centric terminology. The AI applies textbook CAPM without mentioning the course instructor's required modifications. Citation style drifts from the required format (APA 7th vs Chicago). The AI defaults to Yahoo Finance when the assignment requires FRED or Bloomberg data. Nominal vs real, simple vs compound, gross vs net distinctions are inconsistently applied.

**Safety Blindness in Finance**:

AI presents historical returns without required disclaimers ("past performance does not guarantee future results"). AI generates plausible-sounding financial data that isn't sourced from authoritative databases. AI provides investment-like recommendations without qualification. AI fabricates citations to academic finance journals. AI skips the disclaimer compliance that regulatory frameworks require on any content showing performance data or hypothetical results. AI presents AI-generated analysis as the student's own work without disclosure.

### Institutional Knowledge Inventory

| Knowledge Category                              | Documented?  | Machine-Readable? | Critical? |
| ----------------------------------------------- | ------------ | ----------------- | --------- |
| Course-specific conventions (4 courses)         | Yes (tutors) | Yes               | Yes       |
| Financial instrument knowledge (20 skill files) | Yes (skills) | Yes               | Yes       |
| Disclaimer requirements                         | Yes (rules)  | Yes               | Yes       |
| Citation standards (APA, Chicago, Harvard)      | Yes (skills) | Yes               | Yes       |
| Data source hierarchy                           | Yes (rules)  | Yes               | Yes       |
| Academic integrity requirements                 | Yes (rules)  | Yes               | Yes       |
| Formula reference (4 course areas)              | Yes (skills) | Yes               | Medium    |
| Research methodology standards                  | Yes (rules)  | Yes               | Yes       |

---

## Step 2: Layer 1 — Intent (Agent Specializations)

### Agent Definitions

COF implements 24 specialized agents across five categories:

**Course Tutors** (4 agents):

```
Agent: fnce101-tutor
Specialty: Foundations — TVM, NPV, IRR, stock/bond valuation, financial statements
Knowledge: FNCE101 curriculum, prerequisite concepts, progressive difficulty
Tools: Read, Glob, Grep, calculation verification
Model Tier: Balanced (Sonnet-class)
```

```
Agent: corporate-finance-tutor
Specialty: Capital structure, WACC, M&A, capital budgeting, dividends
Knowledge: Corporate finance curriculum, DCF methodology, real options
Tools: Read, Glob, Grep
Model Tier: Balanced (Sonnet-class)
```

```
Agent: international-finance-tutor
Specialty: Exchange rates, BOP, parity conditions, currency crises
Knowledge: International finance curriculum, current events, FX conventions
Tools: Read, Glob, Grep, WebSearch
Model Tier: Balanced (Sonnet-class)
```

```
Agent: fmi-tutor
Specialty: Financial markets and institutions — structure, instruments, trading, efficiency
Knowledge: FMI curriculum, market microstructure, regulatory landscape
Tools: Read, Glob, Grep
Model Tier: Balanced (Sonnet-class)
```

**Academic Specialists** (7 agents):

- `academic-writer` — Thesis/paper construction, argument structure, evidence integration
- `research-assistant` — Literature search, source evaluation, synthesis
- `thesis-advisor` — Thesis structure, methodology, defense preparation
- `citation-specialist` — APA/Chicago/Harvard formatting, bibliography management
- `presentation-designer` — Slide structure, data visualization, storytelling
- `case-study-analyst` — Harvard case method, framework application (DCF, SWOT, Porter)
- `exam-coach` — Practice problems, study guides, spaced repetition

**Finance Analysis** (6 agents):

- `concept-explainer` — Plain-language explanations with real-world analogies
- `coursework-analyst` — Quantitative analysis for problem sets and research
- `valuation-specialist` — DCF, comparables, LBO analysis for case studies
- `data-source-advisor` — Guide to financial data sources (FRED, Bloomberg, yfinance)
- `regulatory-context` — SEC, FINRA, MAS, international regulatory frameworks
- `finance-navigator` — Navigate the 20-module skill knowledge base

**Review & Quality** (3 agents):

- `deep-analyst` — Argument strength analysis, logical consistency
- `assignment-analyst` — Assignment requirements breakdown, deliverable planning
- `peer-reviewer` — Academic review for argument quality and citations

**Management** (2 agents):

- `todo-manager` — Task tracking
- `gh-manager` — GitHub issue/project management

**Project-Specific** (2 agents):

- `international-finance-analyst` — Current events analysis for class discussion
- `educational-deep-dive-creator` — Educational deep-dive materials

### Routing Rules

| Task Type                | Routed To             | Rationale                                  |
| ------------------------ | --------------------- | ------------------------------------------ |
| Course concept questions | Relevant course tutor | Course-specific knowledge and conventions  |
| "Explain X" (general)    | concept-explainer     | Plain-language with analogies              |
| Literature search        | research-assistant    | Systematic source evaluation               |
| Paper/thesis writing     | academic-writer       | Argument construction expertise            |
| Citation formatting      | citation-specialist   | Format-specific rules (APA, Chicago, etc.) |
| Case study analysis      | case-study-analyst    | Framework application (DCF, Porter, SWOT)  |
| Valuation tasks          | valuation-specialist  | DCF, comparables, LBO methodology          |
| Data source guidance     | data-source-advisor   | FRED, Bloomberg, yfinance selection        |
| Assignment breakdown     | assignment-analyst    | Requirements parsing, deliverable planning |
| Exam preparation         | exam-coach            | Practice problems, study strategy          |
| Regulatory questions     | regulatory-context    | SEC, FINRA, international regulations      |
| Draft review             | peer-reviewer         | Academic quality, argument strength        |
| Presentation creation    | presentation-designer | Slide design, data visualization           |

### Reference: COC Example

COC defines 29 agents across seven development phases. COF defines 24 agents across five categories. The key difference: COF agents must _teach_ as they work (like COR), not just execute. Every interaction follows progressive difficulty: intuition first, then formula, then worked example.

---

## Step 3: Layer 2 — Context (Institutional Knowledge)

### Master Directive

`CLAUDE.md` serves as the master directive, loaded at every session start. It establishes:

- Academic integrity as absolute directive
- Student judgment visibility requirement
- Financial accuracy standards
- Disclaimer compliance obligations
- Agent routing and skill navigation

### Knowledge Hierarchy

```
CLAUDE.md (loaded every session)
├── Rules (13 files — enforcement boundaries)
│   ├── academic-integrity.md — No fabrication, proper disclosure
│   ├── financial-accuracy.md — Precision, nominal/real, source verification
│   ├── disclaimer-compliance.md — Performance disclaimers, regulatory compliance
│   ├── data-sourcing.md — Authoritative data sources, hierarchy
│   ├── citation-standards.md — APA/Chicago/Harvard formatting
│   ├── academic-writing.md — Structure, argument quality
│   ├── research-standards.md — Methodology, evidence requirements
│   ├── learning-pedagogy.md — Progressive difficulty, Bloom's taxonomy
│   └── [5 more operational rules]
├── Skills (20 directories — deep reference)
│   ├── 01-financial-instruments through 05-financial-data-apis
│   ├── 07-regulatory-framework through 12-fnce101-foundations
│   ├── 13-academic-writing through 19-formula-reference
│   └── project/ (workspace-specific)
└── Workspace context (per assignment/course)
    ├── briefs/ — Assignment requirements
    ├── 01-analysis/ — Research and data
    ├── 03-drafts/ — Work in progress
    └── todos/ — Task tracking
```

### Framework-First Inventory

| Building Block     | What It Does                         | When to Use                 |
| ------------------ | ------------------------------------ | --------------------------- |
| Formula reference  | Standard finance formulas by course  | Any calculation task        |
| Case study method  | Structured case analysis framework   | Case study assignments      |
| Citation templates | Pre-formatted citation patterns      | Any academic writing        |
| Data source guide  | Ranked data providers by reliability | Any data-dependent analysis |
| Exam prep patterns | Study strategies by question type    | Exam preparation            |

### Reference: COC Example

COC structures knowledge in 25 skill directories with 100+ files. COF structures knowledge in 20 skill directories covering 19 finance topics plus project-specific context. Both use progressive disclosure: CLAUDE.md → skill index → topic files → full reference.

---

## Step 4: Layer 3 — Guardrails (Enforcement)

### Rule Classification

| Rule                                         | Classification | Enforcement | Rationale                                    |
| -------------------------------------------- | -------------- | ----------- | -------------------------------------------- |
| No fabricated citations                      | Critical       | Hard        | Academic integrity; career-ending if caught  |
| Disclaimer on performance data               | Critical       | Hard        | Regulatory requirement; legal liability      |
| Data from authoritative sources only         | Critical       | Hard        | Financial accuracy depends on source quality |
| No investment recommendations without caveat | Critical       | Hard        | Regulatory compliance                        |
| Academic integrity disclosure                | Critical       | Hard        | Institutional requirement                    |
| Citation formatting consistency              | Advisory       | Soft        | Quality issue, not integrity issue           |
| Progressive difficulty in explanations       | Advisory       | Soft        | Pedagogical best practice                    |
| Nominal/real distinction in calculations     | Advisory       | Soft+       | Financial accuracy, but context-dependent    |

### Anti-Amnesia Design

```
Anti-amnesia injection (fires every user interaction via user-prompt-rules-reminder.js):
- Academic integrity: no fabricated sources, proper AI disclosure
- Financial accuracy: nominal vs real, simple vs compound, cite data sources
- Disclaimers required on performance data and hypothetical results
- Use authoritative data sources (FRED, Bloomberg, peer-reviewed journals)
- Current workspace context: [course, assignment, requirements]
```

### Hard Enforcement Hooks

| Hook                            | What It Enforces                                   |
| ------------------------------- | -------------------------------------------------- |
| `validate-citations.js`         | Citations must be real and properly formatted      |
| `validate-disclaimer.js`        | Performance data must include required disclaimers |
| `user-prompt-rules-reminder.js` | Re-injects critical rules every interaction        |
| `session-start.js`              | Loads workspace context and rules at session start |
| `session-end.js`                | Captures learning observations                     |

### Defense in Depth (Disclaimer Compliance — Highest Risk)

```
Rule: Performance data must include disclaimers
Enforcement layers:
1. CLAUDE.md mentions disclaimer requirement
2. disclaimer-compliance.md rule file with examples
3. user-prompt-rules-reminder.js re-injects every interaction
4. validate-disclaimer.js hook checks output for performance data
5. peer-reviewer agent checks during review
```

### EATP Constraint Mapping

| EATP Dimension | Finance Education Guardrails                                           |
| -------------- | ---------------------------------------------------------------------- |
| Financial      | No investment recommendations; disclaimers on performance data         |
| Operational    | Allowed data sources, required frameworks per course, scope boundaries |
| Temporal       | Assignment deadlines, exam schedules, semester boundaries              |
| Data Access    | Authoritative sources only; FRED/Bloomberg preferred over web scraping |
| Communication  | Academic integrity disclosure; no presenting AI analysis as student's  |

### Reference: COC Example

COC classifies 9 rule files (soft) and 9 hook scripts (hard). COF classifies 13 rule files with 5 hard enforcement hooks. The anti-amnesia hook fires on every user message, re-injecting financial accuracy and disclaimer rules. Defense in depth follows the COC pattern: critical rules have 5+ independent enforcement layers.

---

## Step 5: Layer 4 — Instructions (Workflow)

### Workflow Phases

| Phase | Command       | Inputs              | Outputs                       | Evidence Required            |
| ----- | ------------- | ------------------- | ----------------------------- | ---------------------------- |
| 1     | `/start`      | Course context      | Workspace initialized         | Student orientation complete |
| 2     | `/analyze`    | Topic or assignment | Research notes, data gathered | Sources cited and verified   |
| 3     | `/todos`      | Analysis outputs    | Prioritized task list         | Student approves plan        |
| 4     | `/assignment` | One task from plan  | Draft deliverable             | Evidence-based completion    |
| 5     | `/review`     | Draft               | Peer review with feedback     | Review agent assessment      |
| 6     | `/wrapup`     | Session state       | Session notes for continuity  | Key decisions documented     |

### Specialty Commands

| Command       | Purpose                                | Gate                           |
| ------------- | -------------------------------------- | ------------------------------ |
| `/study`      | Study guide for a finance topic        | Progressive difficulty applied |
| `/research`   | Structured literature search           | Sources verified               |
| `/thesis`     | Thesis/paper planning and writing      | Methodology approved           |
| `/present`    | Presentation creation                  | Content accuracy check         |
| `/explain`    | Concept explanation at student's level | None (teaching)                |
| `/practice`   | Practice problems with solutions       | Difficulty appropriate         |
| `/cite`       | Citation formatting                    | Format compliance              |
| `/exam-prep`  | Exam preparation plan                  | Coverage verification          |
| `/case`       | Case study analysis                    | Framework application check    |
| `/formula`    | Formula quick reference                | None (reference)               |
| `/challenge`  | Stress-test arguments                  | Weaknesses identified          |
| `/checkpoint` | Review learning progress               | Knowledge assessment           |

### Approval Gates

| Gate   | Between Phases       | Human Judges                    | Criteria                        |
| ------ | -------------------- | ------------------------------- | ------------------------------- |
| Gate 1 | Analysis → Planning  | Is the research scope correct?  | Student reviews analysis        |
| Gate 2 | Planning → Execution | Is the task plan appropriate?   | **Student explicitly approves** |
| Gate 3 | Execution → Review   | Is the deliverable substantive? | Completeness check              |
| Gate 4 | Review → Submission  | Are review findings addressed?  | Student decides on each finding |

### Reference: COC Example

COC defines a 7-phase workflow with 4 quality gates and 20 slash commands. COF defines a 6-phase workflow with 4 gates and 21 commands (12 specialty). The principles are identical: evidence-based completion, mandatory review before submission, structured approval.

---

## Step 6: Layer 5 — Learning (Knowledge Growth)

### Observation Targets

| Observable                     | What It Reveals                        | Capture Method              |
| ------------------------------ | -------------------------------------- | --------------------------- |
| Concept difficulty patterns    | Which topics students struggle with    | Session observation (JSONL) |
| Citation error frequency       | Common formatting mistakes by style    | Hook enforcement logs       |
| Data source selection          | Which sources students default to      | validate-citations.js logs  |
| Disclaimer compliance rate     | How often disclaimers are missed       | validate-disclaimer.js logs |
| Study strategy effectiveness   | Which approaches improve understanding | Checkpoint assessments      |
| Assignment completion patterns | Where students get stuck               | Workspace progress tracking |

### Confidence Thresholds

| Artifact Type                 | Confidence Threshold | Minimum Observations | Requires      |
| ----------------------------- | -------------------- | -------------------- | ------------- |
| New skill module              | 0.7                  | 5+ topic requests    | User approval |
| New rule file                 | 0.7                  | 5+ violations        | User approval |
| Tutor agent refinement        | 0.8                  | 10+ sessions         | User approval |
| New formula reference         | 0.6                  | 3+ lookups           | User approval |
| New practice problem template | 0.6                  | 3+ requests          | User approval |

**Note**: Confidence thresholds are RECOMMENDED targets. The L5 pipeline captures observations via `session-end.js` and proposes patterns; the user approves or rejects during `/checkpoint`.

### Knowledge Curation

- **Curator role assigned to**: Course instructor (or self-directed student)
- **Review frequency**: End of each semester or course module
- **Pruning criteria**: Remove patterns not confirmed across 2+ course instances

### Reference: COC Example

COC observes tool usage, workflow patterns, error-fix pairs, and framework selection. COF observes concept difficulty, citation errors, data source selection, and study effectiveness. Both require human approval before pattern formalization.

---

## Principle 8 (Authentic Voice)

COF implements Principle 8 with a focus on academic integrity:

**Disclosure**: Students MUST disclose AI assistance according to institutional academic integrity policies. The `academic-integrity.md` rule enforces this. AI-generated analysis must be properly attributed.

**Student Judgment Visible**: The absolute directive "Student Judgment Stays Visible" ensures the student makes analytical decisions: choosing thesis positions, evaluating evidence strength, forming conclusions. The AI assists with research and structure; the student provides the analytical judgment.

**Audit Trail**: Session notes, workspace progress, and hook enforcement logs demonstrate the student's engagement over time. Assignment workspaces preserve the research → analysis → drafting → review progression.

**Detection Bias**: Less relevant in finance education than in humanities (financial analysis involves formulas and data), but academic writing rules still apply to thesis and paper components.

---

## Honest Limitations

1. **Financial data is not real-time**: The AI does not have live market data access. Historical data references require verification against authoritative sources (FRED, Bloomberg).

2. **The AI is not a financial advisor**: It teaches finance concepts and assists with academic work. It does not provide investment advice, portfolio recommendations, or fiduciary guidance.

3. **Model limitations with calculations**: LLMs can make arithmetic errors. All calculations should be verified, particularly multi-step DCF analyses, options pricing, and portfolio optimization.

4. **Regulatory context is jurisdiction-specific**: SEC/FINRA rules apply to US markets. MAS rules apply to Singapore. The AI may conflate jurisdictions. Students must verify regulatory context.

5. **Teaching quality varies by topic maturity**: Well-established topics (TVM, CAPM, capital structure) are reliably taught. Emerging topics (DeFi, AI in finance) may have inaccurate or outdated coverage.

6. **L5 thresholds are aspirational**: Observation pipeline captures patterns, but confidence scoring is approximate. Thresholds are targets, not calibrated values.

---

## What This Application Proves

The structural mapping from COC to COF is complete:

| CO Concept           | COC (Codegen)                 | COF (Finance)                         |
| -------------------- | ----------------------------- | ------------------------------------- |
| Amnesia              | AI forgets coding conventions | AI forgets course/assignment context  |
| Convention Drift     | Follows internet patterns     | Follows generic finance conventions   |
| Safety Blindness     | Skips security checks         | Skips disclaimers, fabricates sources |
| Layer 1 Agents       | 29 development specialists    | 24 finance/academic specialists       |
| Layer 2 Context      | CLAUDE.md + 25 skill dirs     | CLAUDE.md + 20 skill dirs             |
| Layer 3 Guardrails   | 8 rules + 8 hooks             | 13 rules + 5 hooks                    |
| Layer 4 Instructions | 7-phase dev workflow          | 6-phase academic workflow + 12 cmds   |
| Layer 5 Learning     | Code pattern evolution        | Concept difficulty + study evolution  |

Unlike CO for Compliance (a structural sketch), COF is a running implementation with 24 agents, 20 skill directories, 13 rules, 5 hooks, and 21 commands deployed for active use in finance education.

---

## Validation Checklist

### Layer 1 (Intent)

- [x] At least 2 agent specializations defined (24 agents across 5 categories)
- [x] Each agent carries domain-specific institutional knowledge
- [x] Routing rules documented and explicit

### Layer 2 (Context)

- [x] Master directive written (CLAUDE.md)
- [x] Master directive loaded at start of every session
- [x] Progressive disclosure hierarchy implemented (CLAUDE.md → rules → skills → workspace)
- [x] Single Source of Truth maintained

### Layer 3 (Guardrails)

- [x] Rules classified as critical vs advisory (13 rules)
- [x] Hard enforcement implemented for critical rules (5 hooks)
- [x] Anti-amnesia mechanism fires every interaction (user-prompt-rules-reminder.js)
- [x] Defense in depth for highest-risk rules (disclaimer compliance has 5 layers)

### Layer 4 (Instructions)

- [x] Structured workflow with at least 2 phases (6 phases + 12 specialty commands)
- [x] At least 1 approval gate requiring human judgment (4 gates)
- [x] Evidence requirements defined for completion claims

### Layer 5 (Learning)

- [x] Observation mechanism capturing patterns (session-end.js, JSONL logging)
- [x] Human approval required before pattern formalization
- [x] Knowledge base management capabilities available (checkpoint, evolve commands)

### Principle 8 (Authentic Voice)

- [x] AI assistance disclosure policy defined (academic-integrity.md)
- [x] Output reflects genuine human intellectual direction (student judgment stays visible)
- [x] Auditable trail of human engagement exists (workspace progression, session notes)
- [ ] Writing style constraints for academic output (covered by academic-writing.md, but not detection-bias-specific)

---

_Published under CC BY 4.0 by the Terrene Foundation._
