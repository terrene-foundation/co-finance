---
name: cheatsheets
description: "Quick reference cheatsheets for financial Python development including common formulas, Python finance libraries, data API patterns, and calculation patterns. Use when asking about 'quick tips', 'cheat sheet', 'quick reference', 'common mistakes', 'financial formulas', 'finance library', 'data API reference', 'calculation patterns', 'pandas cheatsheet', 'numpy financial', 'returns calculation', 'risk metrics', 'portfolio math', or 'environment variables'."
---

# Finance Python - Quick Reference Cheatsheets

Comprehensive collection of quick reference guides for financial Python development.

## Overview

This skill provides quick access to:

- Common financial formulas and their Python implementations
- Python finance library quick reference (pandas, numpy-financial, scipy, etc.)
- Data API quick reference (yfinance, FRED, Alpha Vantage, etc.)
- Common calculation patterns for financial analysis

## Quick Reference Guides

### Essential Guides

- **[financial-formulas](financial-formulas.md)** - Common financial formulas cheatsheet
- **[python-finance-libraries](python-finance-libraries.md)** - Python finance library quick reference
- **[data-api-reference](data-api-reference.md)** - Data API quick reference
- **[calculation-patterns](calculation-patterns.md)** - Common calculation patterns
- **[README](README.md)** - Cheatsheets overview

## Quick Patterns

### Returns Calculation

```python
import pandas as pd

# Simple returns
df['returns'] = df['close'].pct_change()

# Log returns
import numpy as np
df['log_returns'] = np.log(df['close'] / df['close'].shift(1))

# Cumulative returns
df['cumulative'] = (1 + df['returns']).cumprod() - 1
```

### Risk Metrics

```python
# Annualized volatility
vol = df['returns'].std() * np.sqrt(252)

# Sharpe ratio
risk_free_rate = 0.05
sharpe = (df['returns'].mean() * 252 - risk_free_rate) / vol

# Maximum drawdown
cumulative = (1 + df['returns']).cumprod()
max_drawdown = (cumulative / cumulative.cummax() - 1).min()
```

### Data API Call

```python
import yfinance as yf

# Download price history
ticker = yf.Ticker("AAPL")
hist = ticker.history(period="1y")

# Get fundamentals
info = ticker.info
pe_ratio = info.get('trailingPE')
```

## CRITICAL Gotchas

| Rule                                    | Why                                  |
| --------------------------------------- | ------------------------------------ |
| Always use `.pct_change()` for returns  | Avoids off-by-one errors             |
| Annualize with sqrt(252) for daily data | 252 trading days per year            |
| Never hardcode API keys                 | Use environment variables via `.env` |
| Validate data before calculations       | Missing data causes silent errors    |

## When to Use This Skill

Use this skill when you need:

- Quick reference for common financial formulas
- Python library syntax for finance operations
- Data API usage patterns
- Calculation pattern templates
- Risk metric computations

## Related Skills

- **[06-python-finance](../06-python-finance/SKILL.md)** - Detailed Python finance library guide
- **[07-development-guides](../07-development-guides/SKILL.md)** - Development guides
- **[09-workflow-patterns](../09-workflow-patterns/SKILL.md)** - Application patterns
