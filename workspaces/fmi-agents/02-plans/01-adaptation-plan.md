# FMI COC Adaptation Plan

## Vision

Transform this COC setup from a Kailash SDK development partner into a **Financial Markets & Investments (FMI) development partner** — an AI-powered environment that helps build financial education tools, investment analysis software, and market learning platforms.

---

## Phase 1: Foundation (CLAUDE.md, Rules, Hooks)

### 1.1 Rewrite CLAUDE.md

Replace all Kailash SDK references with finance domain equivalents:

**Absolute Directives:**

1. **Library-First** → Before writing from scratch, check:
   - Instead of custom financial calculations → check `numpy-financial`, `scipy`, `quantlib`
   - Instead of custom data pipelines → check `pandas`, `yfinance`, `polygon.io`
   - Instead of custom backtesting → check `backtrader`, `vectorbt`, `zipline-reloaded`
   - Instead of custom charting → check `plotly`, `mplfinance`, `lightweight-charts`

2. **.env Single Source** → All API keys (ALPHA_VANTAGE_KEY, POLYGON_API_KEY, FRED_API_KEY) and model names from `.env`

3. **Implement, Don't Document** → Keep as-is

4. **Reviews** → Add:
   - Financial accuracy review (financial-modeling) after calculations
   - Disclaimer compliance review (regulatory-compliance) before content publish
   - Curriculum review (curriculum-designer) for educational content

**Agent Categories (rewrite):**

- Analysis & Planning (keep)
- Finance Domain Specialists (new)
- Core Implementation (adapt)
- Frontend & Design (adapt for finance dashboards)
- Testing & QA (adapt)
- Release & Operations (keep)

**Critical Execution Patterns (replace):**

```python
# Financial data: always use pandas with proper index
import pandas as pd
df = pd.read_csv('data.csv', parse_dates=['date'], index_col='date')

# Calculations: use numpy-financial, not manual formulas
import numpy_financial as npf
npv = npf.npv(rate, cashflows)

# API data: always cache, always cite source
from functools import lru_cache
```

**Finance Python Stack (replace Kailash table):**
| Library | Purpose | Install |
|---------|---------|---------|
| pandas | Data manipulation & time series | `pip install pandas` |
| numpy / numpy-financial | Numerical computation | `pip install numpy numpy-financial` |
| scipy | Optimization & statistics | `pip install scipy` |
| yfinance | Yahoo Finance data | `pip install yfinance` |
| quantlib | Advanced pricing | `pip install QuantLib` |
| backtrader | Backtesting | `pip install backtrader` |
| plotly | Interactive charts | `pip install plotly` |
| ta | Technical indicators | `pip install ta` |
| empyrical | Performance metrics | `pip install empyrical` |

### 1.2 Create 4 New Rules

1. **financial-accuracy.md** — Scope: `**/*.py`
   - All financial formulas must match textbook definitions
   - Use `Decimal` or appropriate precision for currency
   - Cite formula sources (CFA Institute, Hull, Bodie/Kane/Marcus)
   - Validate: annualization uses sqrt(252) for daily, sqrt(12) for monthly
   - Never use simple interest where compound is required

2. **disclaimer-compliance.md** — Scope: Global
   - Any content showing returns/performance: include disclaimer
   - Backtested results: "Past performance does not guarantee future results"
   - Never provide personalized investment recommendations
   - Label all simulated data clearly

3. **data-sourcing.md** — Scope: `**/*.py`, `**/*.ts`, `**/*.js`
   - All market data must cite source and freshness
   - Specify: real-time, delayed (15-min), or historical
   - Note API limitations and rate limits in comments
   - Never present simulated data as real market data

4. **learning-pedagogy.md** — Scope: Global
   - Progressive difficulty: foundational before advanced
   - Every concept needs at least one worked example
   - Build on prerequisites explicitly
   - Assessments test understanding, not memorization

### 1.3 Adapt 3 Existing Rules

- **patterns.md** → Python finance patterns (pandas conventions, calculation patterns)
- **env-models.md** → Finance API keys (ALPHA_VANTAGE_KEY, POLYGON_API_KEY, etc.)
- **testing.md** → Finance test examples (calculation accuracy, data pipeline, backtesting)

### 1.4 Create/Adapt Hooks

- **validate-financial-accuracy.js** (new) — PostToolUse on Edit|Write for .py files
- **validate-disclaimer.js** (new) — PostToolUse on Edit|Write for content files
- **validate-workflow.js** → adapt to check finance patterns instead of Kailash patterns
- **lib/env-utils.js** → replace Kailash key validation with finance API key validation

---

## Phase 2: Agents & Skills

### 2.1 Create 8 New Agents

Each agent needs: agent definition (.md), system prompt, tool permissions, model assignment.

1. **market-data-specialist** — APIs, data quality, caching, real-time vs historical
2. **portfolio-analyst** — MPT, optimization, allocation, rebalancing
3. **risk-analyst** — VaR, stress testing, Monte Carlo, correlation
4. **regulatory-compliance** — SEC/FINRA disclaimers, educational content rules
5. **financial-modeling** — DCF, comparables, LBO, statement analysis
6. **quant-developer** — Algorithmic strategies, backtesting, signals
7. **curriculum-designer** — Learning paths, Bloom's taxonomy, assessments
8. **financial-literacy-expert** — Plain-language explanations, analogies

### 2.2 Adapt 10 Existing Agents

Rewrite system prompts and expertise domains for finance context.

### 2.3 Remove 9 Kailash-Specific Agents

Delete: dataflow-specialist, nexus-specialist, kaizen-specialist, mcp-specialist, flutter-specialist, ai-ux-designer (and related READMEs)

### 2.4 Create 8 New Skill Modules

Each module needs: SKILL.md (index), individual topic files.

1. **01-financial-instruments/** — 6 files covering equities, bonds, derivatives, forex, ETFs
2. **02-market-analysis/** — 5 files covering technical, fundamental, sentiment analysis
3. **03-portfolio-theory/** — 5 files covering MPT, CAPM, efficient frontier, optimization
4. **04-risk-management/** — 5 files covering VaR, stress testing, hedging, Greeks
5. **05-financial-data-apis/** — 6 files covering major API providers and integration
6. **06-python-finance/** — 6 files covering pandas, numpy, backtesting, visualization
7. **07-regulatory-framework/** — 5 files covering SEC, disclaimers, data licensing
8. **08-learning-design/** — 5 files covering curriculum patterns, assessments, gamification

### 2.5 Adapt 5 Existing Skill Modules

- 06-cheatsheets → Python finance cheatsheets
- 07-development-guides → Finance project development guides
- 09-workflow-patterns → Financial analysis workflow patterns
- 24-value-audit → Learning outcome audit
- 25-ai-interaction → Financial assistant patterns

### 2.6 Remove 8 Kailash-Specific Skill Modules

Delete: 01-core-sdk, 02-dataflow, 03-nexus, 04-kaizen, 05-kailash-mcp, 08-nodes-reference, 11-frontend-integration, 19-flutter-patterns

---

## Phase 3: Commands & Polish

### 3.1 Create 5 New Commands

1. **/finance** — Load financial calculation patterns and formulas
2. **/data** — Load market data API integration guide
3. **/portfolio** — Load portfolio construction and risk metrics
4. **/backtest** — Load backtesting framework reference
5. **/curriculum** — Load learning design patterns

### 3.2 Adapt 7 Commands

/validate, /test, /design, /i-audit, /i-polish, /i-harden, /start — update agent teams, examples, and validation checks for finance context.

### 3.3 Remove 4 Commands

Delete: /sdk, /db, /api, /ai

### 3.4 Cross-Reference Verification

- All agent references in commands resolve to existing agents
- All skill references in agents resolve to existing skills
- All rule references in CLAUDE.md resolve to existing rules
- Hook configuration in settings.json matches actual hook files

---

## Phase 4: Validation

### 4.1 Smoke Test

Run `/start` through `/codify` on a sample finance learning project to verify the adapted COC works end-to-end.

### 4.2 Red Team

- Financial accuracy: do generated examples use correct formulas?
- Disclaimer compliance: are disclaimers present where required?
- Pedagogical quality: does content progression make sense?
- Agent routing: do finance questions reach finance specialists?

### 4.3 Cleanup

- Remove any remaining Kailash SDK references
- Update product brief template for finance projects
- Verify .env.example has finance-relevant API keys
- Update README.md and CONTRIBUTING.md

---

## Execution Order

The plan executes strictly in order: Foundation → Agents & Skills → Commands → Validation. Each phase has a human review gate before proceeding.
