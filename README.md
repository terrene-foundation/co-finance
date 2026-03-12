# FMI COC Claude (Python)

<p align="center">
  <img src="https://img.shields.io/badge/platform-Claude%20Code-7C3AED.svg" alt="Claude Code">
  <img src="https://img.shields.io/badge/architecture-COC%205--Layer-blue.svg" alt="COC 5-Layer">
  <img src="https://img.shields.io/badge/domain-Financial%20Markets-green.svg" alt="Financial Markets">
  <img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="Apache 2.0">
</p>

<p align="center">
  <strong>Cognitive Orchestration for Codegen (COC) — Financial Markets & Investments Edition</strong><br>
  A five-layer cognitive architecture for <a href="https://docs.anthropic.com/en/docs/claude-code">Claude Code</a> that makes AI your specialized partner for building financial education tools, market analysis applications, and investment research platforms.
</p>

---

> "The problem with vibe coding is not the AI model. It's the absence of institutional knowledge in the coding loop."

This COC setup encodes deep financial domain knowledge — market data APIs, portfolio theory, risk management, regulatory compliance, and Python finance libraries — directly into the AI's operating environment. The result: AI that understands finance, not just code.

---

## The Five Layers

```
Your Natural Language Request
         |
  1. Intent       25+ Agents         Who should handle this?
         |
  2. Context      20+ Skills         What does the AI need to know?
         |
  3. Guardrails   Rules + Hooks      What must the AI never do?
         |
  4. Instructions CLAUDE.md + Cmds   What should the AI prioritize?
         |
  5. Learning     Observe -> Evolve  How does the system improve?
         |
  Production-Ready Financial Software
```

### Layer 1: Intent -- Specialized Finance Agents

Each agent is a Markdown file in `.claude/agents/` with a defined role, tools, and model tier.

**Finance Specialists** `market-data-specialist` `quantitative-analyst` `financial-engineer` `regulatory-compliance` `curriculum-designer` `financial-literacy-expert`
**Analysis** `deep-analyst` `requirements-analyst` `finance-navigator` `library-advisor`
**Implementation** `tdd-implementer` `finance-pattern-expert` `gold-standards-validator`
**Testing** `testing-specialist` `documentation-validator` `learning-outcome-auditor`
**Frontend** `react-specialist` `uiux-designer` `frontend-developer`
**Operations** `deployment-specialist` `git-release-specialist` `security-reviewer` `todo-manager` `gh-manager`
**Standards** `coc-expert`

### Layer 2: Context -- Finance Knowledge Base

Progressive disclosure: quick patterns -> specific domains -> full reference. Located in `.claude/skills/`.

Domains include: Financial Instruments, Market Analysis, Portfolio Theory, Risk Management, Financial Data APIs, Python Finance Libraries, Regulatory Framework, Learning Design, Personal Finance, Behavioral Finance, plus general development guides, testing strategies, deployment, security patterns, and UI/UX design.

### Layer 3: Guardrails -- Defense in Depth

**Rules** (`.claude/rules/` -- soft enforcement via AI interpretation):
Financial accuracy (Decimal for currency, named constants). Disclaimer compliance (educational content rules). Data sourcing (cite providers, handle staleness). No hardcoded secrets. No stubs/TODOs in production. Conventional commits.

**Hooks** (`scripts/hooks/` -- hard enforcement, deterministic Node.js):

| Hook                               | What It Does                                            |
| ---------------------------------- | ------------------------------------------------------- |
| `session-start.js`                 | Validates `.env`, detects active workspace              |
| `user-prompt-rules-reminder.js`    | **Anti-amnesia**: re-injects rules per turn             |
| `validate-financial-code-style.js` | Checks Decimal usage, named constants, formula patterns |
| `validate-disclaimer.js`           | Ensures disclaimers on financial content                |
| `validate-workflow.js`             | Validates Python finance patterns, API key usage        |
| `validate-bash-command.js`         | Blocks destructive commands                             |
| `auto-format.js`                   | Runs `black`/`prettier` on every write                  |
| `pre-compact.js`                   | Saves state before context compression                  |
| `session-end.js`                   | Persists session stats for learning                     |

### Layer 4: Instructions -- CLAUDE.md + Slash Commands

`CLAUDE.md` is auto-loaded every session with finance context and directives.

**Finance**: `/finance` `/data` `/portfolio` `/backtest` `/curriculum`
**Quality**: `/test` `/validate` `/design` `/i-audit` `/i-harden`
**Workspace**: `/analyze` `/todos` `/implement` `/redteam` `/codify` `/ws` `/wrapup`

### Layer 5: Learning -- Closed Loop Evolution

The system discovers recurring patterns and generates new skills, commands, and agents. It gets smarter with every session.

---

## Quick Start

```bash
# Clone
git clone <your-repo-url>
cd fmi-agents

# Configure
cp .env.example .env   # Edit with your API keys (Polygon, FRED, etc.)

# Go
claude
```

The `session-start.js` hook validates your environment automatically. Then just describe what you want to build — COC handles agent selection, skill loading, pattern enforcement, and quality gates.

---

## Repository Structure

```
.claude/
  agents/          25+ specialist agents (Markdown + YAML frontmatter)
    finance/       6 finance domain experts
    frontend/      3 frontend specialists
    management/    3 operations agents
    standards/     1 methodology expert
  skills/          20+ domain knowledge directories
  rules/           13 behavioral constraint files
  commands/        20+ slash command definitions

scripts/
  hooks/           10+ Node.js lifecycle hooks (deterministic enforcement)
  learning/        Learning system scripts

workspaces/
  instructions/    5 phase templates (analyze, todos, implement, validate, codify)
  <project>/       Per-project workspace directories

CLAUDE.md          Root instructions (auto-loaded every session)
pyproject.toml     Python dependencies (pandas, numpy, yfinance, etc.)
.env.example       Environment template (market data API keys)
```

---

## Finance Stack

| Library             | Purpose                               | Install                       |
| ------------------- | ------------------------------------- | ----------------------------- |
| **pandas**          | Time series data manipulation         | `pip install pandas`          |
| **numpy**           | Numerical computation, portfolio math | `pip install numpy`           |
| **numpy-financial** | Time value of money (NPV, IRR, PMT)   | `pip install numpy-financial` |
| **yfinance**        | Yahoo Finance market data (free)      | `pip install yfinance`        |
| **fredapi**         | FRED economic data                    | `pip install fredapi`         |
| **scipy**           | Optimization, statistics              | `pip install scipy`           |
| **matplotlib**      | Static charts and plots               | `pip install matplotlib`      |
| **mplfinance**      | Candlestick and financial charts      | `pip install mplfinance`      |
| **plotly**          | Interactive charts and dashboards     | `pip install plotly`          |
| **backtrader**      | Strategy backtesting framework        | `pip install backtrader`      |
| **cvxpy**           | Portfolio optimization                | `pip install cvxpy`           |
| **QuantLib**        | Derivatives pricing and fixed income  | `pip install QuantLib`        |

---

## License

Apache License, Version 2.0. See [LICENSE](LICENSE).

<p align="center">
  <a href=".claude/guides/claude-code/README.md">Full Documentation</a>
</p>
