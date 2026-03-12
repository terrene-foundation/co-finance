# Red Team Findings: FMI COC Adaptation

## Critical Findings

### 1. Kailash Contamination in "KEEP" Artifacts

The adaptation plan claims 10 skill modules and 14 agents can be kept as-is. This is wrong. Evidence from file inspection:

| "KEEP" Skill Module       | Kailash References      | Actual Verdict               |
| ------------------------- | ----------------------- | ---------------------------- |
| 13-architecture-decisions | 29 refs across 6 files  | Needs full rewrite           |
| 17-gold-standards         | 51 refs across 10 files | Needs full rewrite           |
| 14-code-templates         | 56 refs across 8 files  | Needs full rewrite           |
| 15-error-troubleshooting  | 33 refs across 9 files  | Needs full rewrite           |
| 16-validation-patterns    | 28 refs across 5 files  | Needs full rewrite           |
| 10-deployment-git         | 38 refs across 5 files  | Needs significant adaptation |
| 12-testing-strategies     | 18 refs across 2 files  | Needs adaptation             |
| 23-uiux-design-principles | 0 refs                  | Actually KEEP-able           |

**Only 1 of 10 "KEEP" modules is genuinely domain-agnostic.** Timeline underestimated by ~60-80 files.

Similarly, "KEEP" agents like `pattern-expert` reference removed agents (`dataflow-specialist`, `nexus-specialist`).

### 2. Five Skill Modules Missing from Disposition

The plan accounts for 23 of 28 modules. Missing:

- 20-interactive-widgets
- 21-enterprise-ai-ux
- 22-conversation-ux
- 26-eatp-reference
- 27-care-reference

### 3. Scope Ambiguity: "Learning" vs "Working"

The user said "learning AND working with finance." The plan leans heavily toward education. "Working with finance" (building professional financial tools) needs equal treatment. The agent design, skills, and rules differ.

### 4. Hook Technical Feasibility

`validate-financial-accuracy.js` claims to check financial formulas. A PostToolUse JavaScript hook can only:

- Regex-match anti-patterns
- Flag magic numbers without comments
- Check floating-point currency without Decimal

It CANNOT verify formula correctness. This catches maybe 5% of accuracy issues. The remaining 95% needs agent review.

Also: the existing `validate-workflow.js` is Rust-first (line 12), not Python. New hook must be built from scratch.

---

## Gaps

### G1. No Personal Finance Coverage

Persona 1 (Beginner) wants to "understand investing basics" but skill modules jump straight to financial instruments and portfolio theory. Missing: budgeting, tax-advantaged accounts (401k/IRA), insurance, debt management.

### G2. No Behavioral Finance Module

Cognitive biases (loss aversion, herding, overconfidence) are essential for responsible financial education. No agent, skill, or rule addresses this.

### G3. No Data Quality Agent

`market-data-specialist` handles API selection but nobody owns: survivorship bias, lookahead bias, corporate actions, delisted securities, data cleaning.

### G4. Product Brief Template Still References Kailash

`briefs/01-product-brief.md` still has "e.g. Kailash Core SDK + DataFlow + Nexus" in template placeholders.

---

## Contradictions

### C1. "Accessible to Non-Coders" vs Python Stack

Value proposition says "accessible to non-programmers." Implementation is entirely Python (pandas, numpy, quantlib). Communication rule says "Never Ask Non-Coders to Read Code." But the educational model is "learn by building in Python."

### C2. "KEEP" Agents Reference Removed Agents

`pattern-expert` references `dataflow-specialist` and `nexus-specialist` (being removed).

### C3. CARE/EATP Agents Have No Clear Adaptation Path

"Extend for financial data governance" is hand-waving. These are proprietary frameworks with specific philosophical commitments. Either they're useful for financial AI governance (explain why) or they should be removed.

---

## Risks

### R1. "Learning by Building" Thesis is Unvalidated

No systematic evidence that building tools teaches finance concepts. Some concepts (behavioral finance, macro, market microstructure) don't decompose into buildable tools.

### R2. Agent Explosion (32 total)

Routing ambiguity: Black-Scholes question → risk-analyst? quant-developer? financial-modeling? portfolio-analyst?

### R3. Library Maintenance Risk

yfinance (unofficial, breaks), empyrical (last release 2020), pyfolio (unmaintained since Quantopian shutdown). Skills will embed examples using fragile libraries.

---

## Recommendations

### Critical

1. **Re-audit all "KEEP" artifacts** for Kailash contamination. Reclassify honestly.
2. **Resolve scope**: COC for building financial education platforms? Or for working professionals building financial software? Or both? Define explicitly.
3. **Build hooks from scratch** rather than adapting the Rust-first validate-workflow.js.

### Major

4. **Add personal finance + behavioral finance** skill modules.
5. **Consolidate agents**: portfolio-analyst + risk-analyst → quantitative-analyst; financial-modeling + quant-developer → financial-engineer. (6 agents instead of 8.)
6. **Define agent routing rules** — decision tree for finance domain questions.
7. **Decide on CARE/EATP**: remove or justify with clear rationale.

### Significant

8. Add library health warnings (flag yfinance, empyrical, pyfolio risks).
9. Rename hook to `validate-financial-code-style.js` — set accurate expectations.
10. Update product brief template to remove Kailash references.
11. Create concept-to-tool mapping: which concepts are teach-by-building, which need traditional approaches.
