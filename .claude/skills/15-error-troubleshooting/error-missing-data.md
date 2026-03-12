---
name: error-missing-data
description: "Fix NaN propagation and missing data issues in financial calculations. Use when encountering 'NaN in results', 'missing data', 'NaN propagation', 'silent wrong results', 'empty DataFrame', or unexpected calculation results."
---

# Error: Missing Data and NaN Propagation

Fix NaN values silently corrupting financial calculations, missing market data handling, and data gap strategies.

> **Skill Metadata**
> Category: `cross-cutting` (error-resolution)
> Priority: `HIGH` (Silent data corruption risk)

## Symptoms

- NaN appears in calculation results
- Sharpe ratio or volatility returns NaN
- Portfolio value suddenly drops to NaN
- Calculations produce unexpected results
- DataFrame operations silently skip rows

## Root Cause

NaN values propagate through arithmetic operations silently:

```python
import numpy as np

# NaN propagation is silent
result = 5.0 + np.nan  # nan
result = 5.0 * np.nan  # nan
result = np.mean([1, 2, np.nan, 4])  # nan (not 2.33!)
```

## Quick Fixes

### BAD: Ignoring NaN

```python
import pandas as pd

# BAD: pct_change() produces NaN at index 0
returns = prices.pct_change()  # First row is NaN
sharpe = returns.mean() / returns.std()  # NaN contaminates result
```

### GOOD: Handle NaN explicitly

```python
import pandas as pd
import numpy as np

# GOOD: Drop NaN from pct_change
returns = prices.pct_change().dropna()

# GOOD: Validate before calculation
if returns.isna().any():
    raise ValueError(f"NaN values found in returns: {returns.isna().sum()} missing")

sharpe = returns.mean() / returns.std(ddof=1)
```

### GOOD: Check data quality upfront

```python
def validate_price_series(prices: pd.Series, symbol: str = "") -> pd.Series:
    """Validate and clean a price series.

    Args:
        prices: Price series to validate
        symbol: Symbol name for error messages

    Returns:
        Cleaned price series

    Raises:
        ValueError: If data quality is unacceptable
    """
    if prices.empty:
        raise ValueError(f"Empty price series for {symbol}")

    nan_count = prices.isna().sum()
    nan_pct = nan_count / len(prices) * 100

    if nan_pct > 10:
        raise ValueError(
            f"{symbol}: {nan_pct:.1f}% missing data ({nan_count}/{len(prices)}). "
            "Too many gaps for reliable analysis."
        )

    if nan_count > 0:
        import logging
        logger = logging.getLogger(__name__)
        logger.warning(
            "%s: %d missing values (%.1f%%). Forward-filling.",
            symbol, nan_count, nan_pct,
        )
        prices = prices.ffill()

    # Check for remaining NaN (at start of series)
    if prices.isna().any():
        prices = prices.dropna()

    return prices
```

## Common Sources of NaN

### 1. pct_change() first row

```python
prices = pd.Series([100, 102, 104])
returns = prices.pct_change()
# 0     NaN       <-- always NaN
# 1    0.02
# 2    0.0196

# FIX: dropna()
returns = prices.pct_change().dropna()
```

### 2. Market holidays and weekends

```python
# Daily data may have gaps
dates = pd.date_range("2024-01-01", "2024-01-10", freq="B")  # Business days
# Jan 1 is a holiday - no data for that day

# FIX: Use business day frequency and forward-fill
df = df.set_index("date").asfreq("B").ffill()
```

### 3. Rolling window insufficient data

```python
# BAD: First 19 values are NaN for a 20-period window
ma_20 = prices.rolling(20).mean()

# GOOD: Account for warmup period
ma_20 = prices.rolling(20, min_periods=1).mean()  # Uses available data
# or
ma_20 = prices.rolling(20).mean().dropna()  # Drop warmup NaN
```

### 4. Division by zero in calculations

```python
# BAD: Zero std gives inf or NaN
sharpe = mean_excess / std_excess  # NaN if std is 0

# GOOD: Guard against zero division
if np.std(excess, ddof=1) == 0:
    sharpe = 0.0  # No variability means no risk-adjusted return
else:
    sharpe = np.mean(excess) / np.std(excess, ddof=1) * np.sqrt(252)
```

### 5. Merging DataFrames with different date ranges

```python
# BAD: Merge introduces NaN for non-overlapping dates
merged = df_aapl.merge(df_msft, on="date", how="outer")

# GOOD: Inner join keeps only overlapping dates
merged = df_aapl.merge(df_msft, on="date", how="inner")
# or validate after merge
assert not merged.isna().any().any(), "NaN after merge - date mismatch"
```

## Fill Strategies for Financial Data

| Strategy         | When to Use                      | Code                        |
| ---------------- | -------------------------------- | --------------------------- |
| **Forward fill** | Prices (carry last known price)  | `prices.ffill()`            |
| **Drop NaN**     | Returns (can't interpolate)      | `returns.dropna()`          |
| **Zero fill**    | Volume (no trades = zero volume) | `volume.fillna(0)`          |
| **Interpolate**  | Smooth series (bond yields)      | `yields.interpolate()`      |
| **Raise error**  | Critical data (trade execution)  | `if df.isna().any(): raise` |

## Prevention Checklist

- [ ] Check for NaN immediately after loading data
- [ ] Drop NaN from `pct_change()` before calculations
- [ ] Validate DataFrame before merge/join operations
- [ ] Guard against zero division in risk metrics
- [ ] Log warning when forward-filling missing prices
- [ ] Set threshold for acceptable missing data percentage
- [ ] Use `min_periods` in rolling window calculations

## Quick Tips

- `df.isna().sum()` shows NaN count per column
- `df.info()` shows non-null counts at a glance
- `returns.dropna()` is safer than `returns.fillna(0)` for returns
- Forward-fill is appropriate for prices but not for returns
- Always validate data shape after joins and merges

<!-- Trigger Keywords: NaN in results, missing data, NaN propagation, silent wrong results, empty DataFrame, NaN values, missing values, data gaps, forward fill, dropna -->
