# COC Adaptation Requirements: From Kailash SDK to Finance Education

## Summary

Transform a Kailash SDK-focused COC setup (33 agents, 10 rules, 28 skill modules, 22 commands, 14 hooks) into a financial markets and investments learning/working environment.

The underlying COC architecture (five-layer model, workspace phase flow, learning system, hook enforcement) is domain-agnostic and should be preserved. The Kailash SDK-specific content is what changes.

---

## 1. AGENTS — Disposition Matrix

### KEEP AS-IS (14 agents)

| Agent                    | Rationale                                               |
| ------------------------ | ------------------------------------------------------- |
| deep-analyst             | Failure analysis — universal                            |
| requirements-analyst     | Requirements breakdown — universal                      |
| build-fix                | Fix build errors — universal                            |
| intermediate-reviewer    | Code review — universal                                 |
| tdd-implementer          | Test-first development — universal                      |
| testing-specialist       | 3-tier strategy — universal                             |
| security-reviewer        | Security audit — even more critical with financial data |
| deployment-specialist    | Deployment — universal                                  |
| todo-manager             | Task tracking — universal                               |
| gh-manager               | GitHub management — universal                           |
| git-release-specialist   | Git workflows — universal                               |
| e2e-runner               | Playwright E2E — universal                              |
| documentation-validator  | Test examples — universal                               |
| gold-standards-validator | Compliance checking — adapt scope                       |

### ADAPT (10 agents)

| Agent              | From                      | To                                                                  |
| ------------------ | ------------------------- | ------------------------------------------------------------------- |
| framework-advisor  | Choose Kailash framework  | Choose finance library (pandas, quantlib, backtrader, yfinance)     |
| pattern-expert     | Kailash workflow patterns | Python finance patterns (data pipelines, calculations, backtesting) |
| sdk-navigator      | Kailash SDK docs          | Finance skill modules, formulas, patterns                           |
| value-auditor      | Enterprise demo QA        | Learner outcome QA — does content actually teach?                   |
| coc-expert         | COC with Kailash examples | COC for finance education projects                                  |
| care-expert        | CARE governance           | Extend for financial data governance                                |
| eatp-expert        | EATP trust                | Extend for financial calculation auditability                       |
| frontend-developer | Generic UI                | Financial dashboards, chart components                              |
| react-specialist   | Generic React             | React for financial dashboards (recharts, d3, lightweight-charts)   |
| uiux-designer      | Enterprise UI/UX          | Financial application UX (data-dense displays, real-time data)      |

### REMOVE (9 agents)

| Agent               | Rationale                          |
| ------------------- | ---------------------------------- |
| dataflow-specialist | Kailash DataFlow — no equivalent   |
| nexus-specialist    | Kailash Nexus — no equivalent      |
| kaizen-specialist   | Kailash Kaizen — no equivalent     |
| mcp-specialist      | Kailash MCP — no equivalent        |
| flutter-specialist  | Unlikely for finance learning      |
| ai-ux-designer      | Remove unless building AI tutoring |

### ADD (8 new agents)

| Agent                         | Purpose                                                                           |
| ----------------------------- | --------------------------------------------------------------------------------- |
| **market-data-specialist**    | Market data API selection, integration, data cleaning, real-time vs historical    |
| **portfolio-analyst**         | Portfolio construction, optimization (Markowitz, Black-Litterman), rebalancing    |
| **risk-analyst**              | VaR, CVaR, Sharpe, Sortino, stress testing, Monte Carlo, correlation              |
| **regulatory-compliance**     | SEC/FINRA disclaimers, educational content rules, data licensing                  |
| **financial-modeling**        | DCF, comparable analysis, LBO, financial statement analysis                       |
| **quant-developer**           | Algorithmic trading, backtesting frameworks, signal generation                    |
| **curriculum-designer**       | Learning paths, Bloom's taxonomy, assessment design, gamification                 |
| **financial-literacy-expert** | Plain-language finance explanations, analogy generation, misconception correction |

---

## 2. RULES — Disposition Matrix

### KEEP AS-IS (7 rules)

communication.md, agents.md, git.md, no-stubs.md, security.md, deployment.md, e2e-god-mode.md

### ADAPT (3 rules)

| Rule          | Adaptation                                               |
| ------------- | -------------------------------------------------------- |
| patterns.md   | Replace Kailash patterns with Python finance patterns    |
| env-models.md | Replace Kailash API keys with finance data API keys      |
| testing.md    | Replace Kailash test examples with finance test examples |

### ADD (4 new rules)

| Rule                         | Purpose                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| **financial-accuracy.md**    | No incorrect formulas. Verify against standards. Numerical precision. Cite sources.  |
| **disclaimer-compliance.md** | Disclaimers on anything construable as financial advice. Label hypothetical results. |
| **data-sourcing.md**         | Cite data sources. Specify freshness. Note limitations. No simulated-as-real.        |
| **learning-pedagogy.md**     | Progressive difficulty. Build on prerequisites. Worked examples. Test understanding. |

---

## 3. SKILLS — Disposition Matrix

### KEEP (10 modules): 10-deployment-git, 12-testing, 13-architecture, 14-templates, 15-errors, 16-validation, 17-gold-standards, 18-security, 23-uiux-design, 28-coc-reference

### ADAPT (5 modules): 06-cheatsheets, 07-dev-guides, 09-workflow-patterns, 24-value-audit, 25-ai-interaction

### REMOVE (8 modules): 01-core-sdk, 02-dataflow, 03-nexus, 04-kaizen, 05-kailash-mcp, 08-nodes-reference, 11-frontend-integration, 19-flutter-patterns

### ADD (8 new modules)

| Module                       | Purpose                                                              |
| ---------------------------- | -------------------------------------------------------------------- |
| **01-financial-instruments** | Equities, bonds, derivatives, forex, ETFs                            |
| **02-market-analysis**       | Technical indicators, chart patterns, fundamental ratios, valuation  |
| **03-portfolio-theory**      | MPT, CAPM, efficient frontier, factor models                         |
| **04-risk-management**       | VaR, stress testing, hedging, options Greeks                         |
| **05-financial-data-apis**   | yfinance, Alpha Vantage, polygon.io, FRED integration                |
| **06-python-finance**        | pandas finance, numpy financial, backtrader, quantlib, visualization |
| **07-regulatory-framework**  | SEC rules, disclaimer templates, data licensing                      |
| **08-learning-design**       | Bloom's taxonomy, curriculum patterns, assessments, gamification     |

---

## 4. COMMANDS — Disposition Matrix

### KEEP (12): /start, /analyze, /todos, /implement, /redteam, /codify, /deploy, /ws, /wrapup, /learn, /evolve, /checkpoint

### ADAPT (7): /validate, /test, /design, /i-audit, /i-polish, /i-harden, /start

### REMOVE (4): /sdk, /db, /api, /ai

### ADD (5 new commands)

| Command         | Purpose                                                                |
| --------------- | ---------------------------------------------------------------------- |
| **/finance**    | Quick reference for financial calculations and Python finance patterns |
| **/data**       | Quick reference for market data API integration                        |
| **/portfolio**  | Quick reference for portfolio construction and risk metrics            |
| **/backtest**   | Quick reference for backtesting frameworks                             |
| **/curriculum** | Quick reference for learning design patterns                           |

---

## 5. HOOKS — Disposition Matrix

### KEEP (10): session-start, session-end, pre-compact, user-prompt-rules-reminder, stop, auto-format, validate-bash-command, validate-deployment, detect-package-manager, lib/workspace-utils

### ADAPT (4): validate-workflow.js → validate-financial-accuracy, lib/env-utils.js, lib/learning-utils.js, lib/instinct-renderer.js

### ADD (2 new hooks)

| Hook                               | Purpose                                                           |
| ---------------------------------- | ----------------------------------------------------------------- |
| **validate-financial-accuracy.js** | Check financial calculations, formula errors, hardcoded constants |
| **validate-disclaimer.js**         | Verify disclaimer blocks on content referencing financial returns |

---

## 6. CLAUDE.md — Complete Rewrite

| Section                               | Change                                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------- |
| Header                                | "FMI (Financial Markets & Investments) COC Claude"                                |
| Directive 1: Framework-First          | → "Library-First": check pandas, quantlib, backtrader before writing from scratch |
| Directive 2: .env                     | Keep, change examples to finance API keys                                         |
| Directive 3: Implement Don't Document | Keep as-is                                                                        |
| Directive 4: Reviews                  | Add financial accuracy review                                                     |
| Agents section                        | Complete rewrite                                                                  |
| Skills section                        | Rewrite for finance modules                                                       |
| Critical Execution Rules              | Replace with Python finance patterns                                              |
| Platform table                        | Replace with Finance Python Stack                                                 |

---

## Implementation Phases

| Phase                | Duration | Scope                                          |
| -------------------- | -------- | ---------------------------------------------- |
| 1: Foundation        | 5-7 days | CLAUDE.md, rules, hooks, settings.json         |
| 2: Agents & Skills   | 5-8 days | 8 new agents, adapt 10, create 8 skill modules |
| 3: Commands & Polish | 3-5 days | 5 new commands, adapt 7, cross-references      |
| 4: Validation        | 2-3 days | End-to-end test, red team                      |
