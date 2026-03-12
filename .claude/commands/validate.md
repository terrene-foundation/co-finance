# /validate - Project Compliance Validation

## Purpose

Run compliance checks against the project's applicable standards. Automatically detects project type and applies the right validation rules.

## Step 1: Detect Project Type

Before validating, determine what the project involves:

1. **Check for financial calculations**: Look for currency handling, portfolio math, returns calculations, pricing models in Python files
2. **Check for data pipelines**: Look for market data ingestion, time series processing, data transformations
3. **Check for educational content**: Look for learning modules, quizzes, curriculum content, explanatory text
4. **Generic project**: If none detected, apply universal standards only

Report what you detected before proceeding.

## Step 2: Universal Checks (ALL projects)

These always apply regardless of project type:

| Check          | Rule Source           | What It Validates                                                              |
| -------------- | --------------------- | ------------------------------------------------------------------------------ |
| Security       | `rules/security.md`   | No hardcoded secrets, parameterized queries, input validation, output encoding |
| No Stubs       | `rules/no-stubs.md`   | No TODOs, placeholders, NotImplementedError, simulated data in production code |
| Env Variables  | `rules/env-models.md` | API keys and model names from `.env` only, never hardcoded                     |
| Testing Policy | `rules/testing.md`    | NO MOCKING in Tier 2-3 tests, real infrastructure required                     |
| Git Hygiene    | `rules/git.md`        | Conventional commits, no secrets in history, atomic commits                    |

### Universal Validation Checklist

- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] No SQL/code injection vulnerabilities
- [ ] All user input validated at system boundaries
- [ ] No TODOs, stubs, or placeholder code in production files
- [ ] API keys and model names sourced from `.env`
- [ ] No mocking in integration/E2E tests
- [ ] Error handling present (no silent `except: pass`)
- [ ] No secrets in git history

## Step 3: Finance-Specific Checks (ONLY when financial code detected)

If Step 1 detected financial calculations or data handling, ALSO run these checks:

| Check                   | What It Validates                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| Decimal for Currency    | All currency values use `Decimal` (never `float`) to avoid rounding errors               |
| Named Constants         | Magic numbers replaced with named constants (e.g., `TRADING_DAYS_PER_YEAR = 252`)        |
| Disclaimer Presence     | Financial disclaimers present on pages showing calculations, returns, or recommendations |
| Data Source Citations   | Market data, benchmarks, and statistics cite their source and date                       |
| Percentage Precision    | Percentages displayed with consistent decimal places and clear formatting                |
| Negative Value Handling | Losses and negative returns are clearly indicated (color, sign, parentheses)             |
| Date/Time Handling      | Financial dates use proper business day calendars and timezone awareness                 |

### Finance Validation Checklist

- [ ] Currency calculations use `Decimal`, not `float`
- [ ] No magic numbers — named constants for financial parameters
- [ ] Disclaimers present where required (educational content, backtested results, hypothetical performance)
- [ ] Data sources cited with date of retrieval
- [ ] Percentages formatted consistently
- [ ] Negative values clearly distinguished from positive
- [ ] Business day logic uses proper calendars (not naive weekday checks)

## Quick Subcommands

```
/validate                → Full check (auto-detects project type)
/validate security       → Secrets, injection, input validation (universal)
/validate testing        → Mocking policy, test organization (universal)
/validate stubs          → TODOs, placeholders, fake data (universal)
/validate env            → Hardcoded API keys, model names (universal)
/validate finance        → Decimal usage, constants, disclaimers, citations (finance only)
/validate disclaimers    → Financial disclaimer presence and completeness (finance only)
/validate precision      → Currency and percentage precision checks (finance only)
```

## Agent Teams

Deploy these agents for validation:

- **security-reviewer** — Security audit (MANDATORY)
- **gold-standards-validator** — Compliance check against project standards
- **testing-specialist** — Verify NO MOCKING policy, test organization
- **regulatory-compliance** — Financial disclaimer and regulatory requirement validation
- **financial-engineer** — Numerical precision and calculation correctness

## Related Commands

- `/test` - Testing strategies
- `/finance` - Financial calculation patterns
- `/data` - Market data API patterns
- `/portfolio` - Portfolio construction and risk
- `/backtest` - Backtesting strategies
- `/i-audit` - Frontend design quality audit

## Skill References

- Always: Project rules (`rules/security.md`, `rules/testing.md`, `rules/no-stubs.md`, `rules/env-models.md`)
- When finance detected: `.claude/skills/07-regulatory-framework/SKILL.md`, `.claude/skills/01-financial-instruments/SKILL.md`
