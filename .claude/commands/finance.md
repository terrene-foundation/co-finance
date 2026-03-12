# /finance - Financial Calculations Quick Reference

## Purpose

Quick reference for core financial calculations and formulas. Loads the financial instruments skill module so you can immediately work with compound interest, present value, future value, annuity calculations, and key ratios.

## Quick Reference

| Command                         | Action                             |
| ------------------------------- | ---------------------------------- |
| `compound_interest(P, r, n, t)` | Calculate compound interest        |
| `present_value(FV, r, n)`       | Discount future cash flow to today |
| `future_value(PV, r, n)`        | Project current value forward      |
| `annuity_pv(PMT, r, n)`         | Present value of payment stream    |
| `annuity_fv(PMT, r, n)`         | Future value of payment stream     |
| `cagr(begin, end, periods)`     | Compound annual growth rate        |
| `sharpe_ratio(Rp, Rf, sigma)`   | Risk-adjusted return               |
| `capm(Rf, beta, Rm)`            | Expected return via CAPM           |

## What You Get

- Core time-value-of-money formulas with Python implementations
- Risk-adjusted performance metrics (Sharpe, Sortino, Treynor)
- CAPM expected return calculations
- Compound annual growth rate (CAGR) computation
- Annuity and perpetuity valuation
- Bond pricing and yield-to-maturity basics

## Quick Pattern

```python
import numpy_financial as npf

# Present value of $10,000 received in 5 years at 8% discount rate
pv = npf.pv(rate=0.08, nper=5, pmt=0, fv=10000)
# Returns: -6805.83 (negative = cash outflow today)

# Future value of $1,000/month for 30 years at 7% annual return
fv = npf.fv(rate=0.07/12, nper=30*12, pmt=-1000, pv=0)
# Returns: ~1,219,970.95

# CAGR calculation
def cagr(beginning_value, ending_value, num_years):
    return (ending_value / beginning_value) ** (1 / num_years) - 1

# Sharpe ratio
def sharpe_ratio(portfolio_return, risk_free_rate, portfolio_std):
    return (portfolio_return - risk_free_rate) / portfolio_std

# CAPM expected return
def capm_expected_return(risk_free, beta, market_return):
    return risk_free + beta * (market_return - risk_free)
```

## Agent Teams

| Agent                         | Role                                                            |
| ----------------------------- | --------------------------------------------------------------- |
| **quantitative-analyst**      | Numerical computation, statistical analysis, formula validation |
| **financial-engineer**        | Pricing models, derivatives math, structured product design     |
| **financial-literacy-expert** | Plain-language explanations, educational framing of concepts    |

## Related Commands

- `/data` - Fetch market data to feed into calculations
- `/portfolio` - Portfolio construction and risk metrics
- `/backtest` - Test strategies using historical data

## Skill Reference

Loads `.claude/skills/01-financial-instruments/SKILL.md` for comprehensive financial instruments reference including equities, fixed income, derivatives, forex/crypto, and ETFs/funds.
