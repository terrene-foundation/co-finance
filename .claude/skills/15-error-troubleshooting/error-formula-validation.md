---
name: error-formula-validation
description: "Fix wrong calculation results by validating against benchmark values. Use when encountering 'wrong Sharpe ratio', 'NPV doesn't match', 'annualization error', 'day count convention', 'look-ahead bias', or 'formula validation' issues."
---

# Error: Formula Validation Errors

Fix incorrect financial calculations by comparing against published benchmark values and identifying common formula mistakes.

> **Skill Metadata**
> Category: `cross-cutting` (error-resolution)
> Priority: `HIGH`

## Symptoms

- Sharpe ratio much higher or lower than expected
- NPV/IRR doesn't match textbook answer
- Annualized return seems unreasonable
- Backtest results too good to be true (look-ahead bias)
- Bond yield doesn't match Bloomberg terminal

## Common Formula Mistakes

### Mistake 1: Wrong annualization factor

```python
# BAD: Using 365 for trading day annualization
annual_vol = daily_vol * np.sqrt(365)  # Wrong - includes weekends

# GOOD: Use 252 trading days
annual_vol = daily_vol * np.sqrt(252)

# BAD: Using 252 for monthly data
annual_return_monthly = monthly_return * 252  # Way too high!

# GOOD: Match factor to data frequency
annual_return_monthly = (1 + monthly_return) ** 12 - 1  # Compound monthly
annual_return_daily = (1 + daily_return) ** 252 - 1     # Compound daily
annual_vol_daily = daily_vol * np.sqrt(252)              # Scale vol by sqrt
annual_vol_monthly = monthly_vol * np.sqrt(12)           # Monthly data
```

### Mistake 2: Sharpe ratio calculation errors

```python
import numpy as np

# BAD: Forgetting to subtract risk-free rate
sharpe = returns.mean() / returns.std() * np.sqrt(252)

# BAD: Using annual rf directly on daily returns
sharpe = (returns.mean() - 0.04) / returns.std() * np.sqrt(252)

# GOOD: Convert rf to daily, use sample std
rf_daily = 0.04 / 252
excess = returns - rf_daily
sharpe = np.mean(excess) / np.std(excess, ddof=1) * np.sqrt(252)
```

### Mistake 3: Look-ahead bias in backtesting

```python
# BAD: Using today's data to make today's decision
for i in range(len(df)):
    if df["close"].iloc[i] > df["close"].rolling(20).mean().iloc[i]:
        # rolling(20).mean() at index i INCLUDES data at index i
        # This is fine for analysis but check for other look-ahead:
        pass

# BAD: Using future information
df["signal"] = df["close"].shift(-1) > df["close"]  # Uses tomorrow's price!

# GOOD: Only use past data for decisions
df["sma_20"] = df["close"].rolling(20).mean()
df["signal"] = df["close"].shift(1) > df["sma_20"].shift(1)  # Yesterday's data
df["return"] = df["close"].pct_change()
df["strategy_return"] = df["signal"] * df["return"]  # Trade based on yesterday
```

### Mistake 4: Wrong day count convention

```python
from datetime import date

# Different conventions for accrued interest / yield
start = date(2024, 1, 15)
end = date(2024, 7, 15)
actual_days = (end - start).days  # 182

# ACT/360 (money market)
fraction_act360 = actual_days / 360  # 0.5056

# ACT/365 (most bonds)
fraction_act365 = actual_days / 365  # 0.4986

# 30/360 (corporate bonds)
days_30_360 = 360 * (end.year - start.year) + 30 * (end.month - start.month) + (end.day - start.day)
fraction_30360 = days_30_360 / 360  # 0.5000

# Using the wrong convention causes yield/price mismatches!
```

### Mistake 5: Population vs sample standard deviation

```python
import numpy as np

returns = np.array([0.01, -0.005, 0.02, -0.01, 0.015])

# BAD for financial analysis: population std (biased)
vol_pop = np.std(returns)  # ddof=0 by default

# GOOD: sample std (unbiased) for financial risk
vol_sample = np.std(returns, ddof=1)  # Bessel's correction

# In pandas: ddof=1 is the default
vol_pandas = pd.Series(returns).std()  # Already uses ddof=1
```

### Mistake 6: Corporate actions not adjusted

```python
# BAD: Using unadjusted prices across a 2:1 stock split
# Day before split: $200, Day after split: $100
# Raw return: (100 - 200) / 200 = -50% (WRONG!)

# GOOD: Use adjusted close prices
# Adjusted: $100, $100 -> 0% return (CORRECT)

# GOOD: Detect and flag large moves
returns = df["close"].pct_change()
large_moves = returns.abs() > 0.20  # >20% in one day
if large_moves.any():
    import logging
    logging.warning(
        "Large daily moves detected. "
        "Check for stock splits or data errors: %s",
        df.loc[large_moves, "date"].tolist()
    )
```

## Benchmark Validation Checklist

When your calculation doesn't match a known value:

1. **Check units**: Is the result daily vs annual? Percent vs decimal?
2. **Check convention**: 252 vs 365 days? ACT/360 vs ACT/365?
3. **Check ddof**: Population (`ddof=0`) vs sample (`ddof=1`) std?
4. **Check risk-free rate**: Annual rate converted to matching period?
5. **Check look-ahead**: Are you using future data to make past decisions?
6. **Check adjusted prices**: Are stock splits/dividends accounted for?
7. **Check NaN**: Are missing values silently corrupting the result?

## Known Benchmark Values

| Calculation    | Known Input                          | Expected Result | Source        |
| -------------- | ------------------------------------ | --------------- | ------------- |
| **NPV**        | rate=10%, CF=[-1000,300,400,400,200] | 78.82           | CFA L1        |
| **IRR**        | CF=[-1000,400,400,400]               | 9.70%           | CFA L1        |
| **FV**         | PV=10000, r=5%, n=10                 | 16,288.95       | TVM formula   |
| **PMT**        | PV=400000, r=6.5%, n=30yr            | 2,528.27/mo     | Mortgage calc |
| **Log return** | 100->110                             | 9.531%          | ln(110/100)   |
| **Geo mean**   | [10%,-5%,8%,-3%,12%]                 | 4.178%          | CFA L1        |

## Quick Tips

- Always validate against at least one published benchmark
- Cite the source in test docstrings
- Use `pytest.approx()` with domain-appropriate tolerance
- When in doubt, use 252 trading days for equity annualization
- Check for look-ahead bias by shifting signals
- Use adjusted prices for return calculations across splits

<!-- Trigger Keywords: wrong Sharpe ratio, NPV doesn't match, annualization error, day count convention, look-ahead bias, formula validation, wrong calculation, benchmark mismatch, corporate actions, stock split error -->
