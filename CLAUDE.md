# FMI COC Claude (Python)

This repository is the **COC (Cognitive Orchestration for Codegen) setup** for building Financial Markets & Investments (FMI) applications — providing agents, skills, rules, and hooks that make Claude Code a specialized development partner for finance education and professional financial software.

## Absolute Directives

These override ALL other instructions. They govern behavior before any rule file is consulted.

### 1. Library-First

Never write financial calculations from scratch before checking whether established Python finance libraries already handle it.

- Instead of manual present value calculations → use **numpy-financial** (`npf.npv`, `npf.irr`, `npf.pmt`)
- Instead of custom technical indicators → use **ta** or **pandas-ta**
- Instead of custom backtesting engine → use **backtrader** or **bt**
- Instead of custom portfolio optimization → use **cvxpy** or **scipy.optimize**
- Instead of custom derivatives pricing → use **QuantLib**

### 2. .env Is the Single Source of Truth

All API keys MUST come from `.env`. Never hardcode API keys for Polygon, Alpha Vantage, FRED, or any other data provider. Root `conftest.py` auto-loads `.env` for pytest.

See `rules/env-models.md` for full details.

### 3. Implement, Don't Document

When you discover a missing feature, endpoint, or calculation — **implement or create it**. Do not note it as a gap and move on. The only acceptable skip is explicit user instruction.

See `rules/no-stubs.md` for details.

### 4. Financial Accuracy First

All financial calculations MUST use proper numerical methods:

- `Decimal` for currency/monetary values (never `float`)
- Named constants for financial parameters (`TRADING_DAYS_PER_YEAR = 252`)
- Cite formulas with sources
- Include disclaimers on content showing returns/performance

See `rules/financial-accuracy.md` and `rules/disclaimer-compliance.md` for details.

### 5. Recommended Reviews

- **Code review** (intermediate-reviewer) after file changes — see `rules/agents.md` Rule 1
- **Security review** (security-reviewer) before commits — strongly encouraged — see `rules/agents.md` Rule 2
- **Real infrastructure** in integration/E2E tests is recommended — see `rules/testing.md`

## Workspace Commands

Phase commands replace the manual copy-paste workflow. Each loads the corresponding instruction template and checks workspace state.

| Command      | Phase | Purpose                                         |
| ------------ | ----- | ----------------------------------------------- |
| `/start`     | —     | New user orientation; explains the workflow     |
| `/analyze`   | 01    | Research and validate the project idea          |
| `/todos`     | 02    | Create project roadmap; stops for your approval |
| `/implement` | 03    | Build the project one task at a time; repeat    |
| `/redteam`   | 04    | Test everything from a real user's perspective  |
| `/codify`    | 05    | Capture knowledge for future sessions           |
| `/deploy`    | —     | Get the project live (standalone)               |
| `/ws`        | —     | Check project status anytime                    |
| `/wrapup`    | —     | Save progress before ending a session           |

**Finance Quick References:**

| Command       | Purpose                                |
| ------------- | -------------------------------------- |
| `/finance`    | Financial calculations quick reference |
| `/data`       | Market data APIs quick reference       |
| `/portfolio`  | Portfolio construction & risk          |
| `/backtest`   | Backtesting frameworks quick reference |
| `/curriculum` | Learning design quick reference        |

**Workspace detection**: Hooks automatically detect the active workspace and inject context. `session-start.js` shows workspace status on session start (human-facing). `user-prompt-rules-reminder.js` injects a 1-line `[WORKSPACE]` summary into Claude's context every turn (survives context compression).

**Session continuity**: Run `/wrapup` before ending a session to write `.session-notes`. The next session's startup reads these notes and shows workspace progress automatically.

## Rules Index

| Concern                        | Rule File                        | Scope                                               |
| ------------------------------ | -------------------------------- | --------------------------------------------------- |
| Plain-language communication   | `rules/communication.md`         | Global                                              |
| Agent orchestration & reviews  | `rules/agents.md`                | Global                                              |
| Financial accuracy & precision | `rules/financial-accuracy.md`    | `**/*.py`                                           |
| Disclaimer compliance          | `rules/disclaimer-compliance.md` | Global                                              |
| Data sourcing & freshness      | `rules/data-sourcing.md`         | `**/*.py`                                           |
| Learning pedagogy              | `rules/learning-pedagogy.md`     | Global                                              |
| E2E god-mode testing           | `rules/e2e-god-mode.md`          | `tests/e2e/**`, `**/*e2e*`, `**/*playwright*`       |
| API keys & environment         | `rules/env-models.md`            | `**/*.py`, `**/*.ts`, `**/*.js`, `.env*`            |
| Deployment operations          | `rules/deployment.md`            | Global                                              |
| Git commits, branches, PRs     | `rules/git.md`                   | Global                                              |
| No stubs or placeholders       | `rules/no-stubs.md`              | Global                                              |
| Python finance patterns        | `rules/patterns.md`              | `**/*.py`, `**/*.ts`, `**/*.js`                     |
| Security (secrets, injection)  | `rules/security.md`              | Global                                              |
| 3-tier testing strategy        | `rules/testing.md`               | `tests/**`, `**/*test*`, `**/*spec*`, `conftest.py` |

**Note**: Rules with path scoping are loaded only when editing matching files. Global rules load every session.

## Agents

### Finance Specialists (`agents/finance/`)

- **market-data-specialist** — Market data APIs, data quality, caching, normalization
- **quantitative-analyst** — Portfolio theory, risk metrics, optimization, factor models
- **financial-engineer** — DCF, backtesting, algorithmic strategies, derivatives pricing
- **regulatory-compliance** — SEC/FINRA disclaimers, educational content rules, data licensing
- **curriculum-designer** — Learning paths, Bloom's taxonomy, assessments, gamification
- **financial-literacy-expert** — Plain-language explanations, analogies, misconception correction

### Analysis & Planning

- **deep-analyst** — Failure analysis, complexity assessment
- **requirements-analyst** — Requirements breakdown, ADR creation
- **finance-navigator** — Navigate finance skill modules
- **library-advisor** — Choose pandas vs numpy-financial vs backtrader vs QuantLib

### Core Implementation

- **finance-pattern-expert** — Python finance patterns, numerical accuracy
- **tdd-implementer** — Test-first development
- **intermediate-reviewer** — Code review after changes
- **gold-standards-validator** — Compliance checking
- **build-fix** — Fix build/type errors with minimal changes
- **security-reviewer** — Security audit before commits

### Frontend & Design (`agents/frontend/`)

- **react-specialist** — React/Next.js frontends with finance charting
- **frontend-developer** — Responsive UI components with finance dashboards
- **uiux-designer** — Enterprise UI/UX with financial data-dense displays

### Testing & QA

- **testing-specialist** — 3-tier strategy with real infrastructure
- **documentation-validator** — Test code examples
- **e2e-runner** — Playwright E2E test generation
- **learning-outcome-auditor** — Financial education content QA

### Release & Operations (`agents/management/`)

- **git-release-specialist** — Git workflows, CI, releases
- **deployment-specialist** — Deployment onboarding, Docker/K8s
- **todo-manager** — Project task tracking
- **gh-manager** — GitHub issue/project management

### Standards (`agents/standards/`)

- **coc-expert** — COC development methodology

## Skills Navigation

For finance domain knowledge, see `.claude/skills/` — organized by topic:

| Module                     | Topic                                                               |
| -------------------------- | ------------------------------------------------------------------- |
| `01-financial-instruments` | Equities, fixed income, derivatives, forex, ETFs                    |
| `02-market-analysis`       | Technical indicators, chart patterns, fundamental ratios, valuation |
| `03-portfolio-theory`      | MPT, CAPM, efficient frontier, portfolio optimization               |
| `04-risk-management`       | VaR, stress testing, hedging, options Greeks                        |
| `05-financial-data-apis`   | yfinance, Polygon, FRED, caching patterns                           |
| `06-python-finance`        | pandas, numpy-financial, backtrader, QuantLib, visualization        |
| `07-regulatory-framework`  | SEC rules, disclaimers, data licensing, hypothetical performance    |
| `08-learning-design`       | Bloom's taxonomy, curriculum patterns, assessments, gamification    |
| `09-personal-finance`      | Budgeting, tax-advantaged accounts, saving vs investing             |
| `10-behavioral-finance`    | Cognitive biases, loss aversion, debiasing strategies               |

Additional skill modules cover cheatsheets, development guides, workflow patterns, deployment, testing strategies, architecture decisions, code templates, troubleshooting, validation patterns, development standards, security patterns, UI/UX design, and more.

## Critical Patterns

```python
# ALWAYS: Use Decimal for monetary values
from decimal import Decimal
price = Decimal("29.99")

# ALWAYS: Named constants for financial parameters
TRADING_DAYS_PER_YEAR = 252
MONTHS_PER_YEAR = 12

# ALWAYS: Cite data sources
# Data source: Yahoo Finance via yfinance
prices = yf.download("AAPL", start="2023-01-01", end="2024-01-01")

# ALWAYS: Include disclaimers on performance content
DISCLAIMER = (
    "This is for educational purposes only and does not constitute "
    "financial advice. Past performance does not guarantee future results."
)
```

## Finance Stack

| Library             | Purpose                               | Install                       |
| ------------------- | ------------------------------------- | ----------------------------- |
| **pandas**          | Time series data manipulation         | `pip install pandas`          |
| **numpy**           | Numerical computation, portfolio math | `pip install numpy`           |
| **numpy-financial** | Time value of money (NPV, IRR, PMT)   | `pip install numpy-financial` |
| **yfinance**        | Yahoo Finance market data (free)      | `pip install yfinance`        |
| **fredapi**         | FRED economic data                    | `pip install fredapi`         |
| **scipy**           | Optimization, statistics              | `pip install scipy`           |
| **backtrader**      | Strategy backtesting framework        | `pip install backtrader`      |
| **cvxpy**           | Portfolio optimization                | `pip install cvxpy`           |
| **QuantLib**        | Derivatives pricing and fixed income  | `pip install QuantLib`        |
| **matplotlib**      | Static charts and plots               | `pip install matplotlib`      |
| **mplfinance**      | Candlestick and financial charts      | `pip install mplfinance`      |
| **plotly**          | Interactive charts and dashboards     | `pip install plotly`          |
