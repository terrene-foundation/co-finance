---
name: gold-function-signatures
description: "Function signature standards for financial Python code including type hints, named parameters, return types, and default values. Use when asking 'function signatures', 'type hints', 'parameter types', 'function design', or 'typed functions'."
---

# Gold Standard: Function Signatures

> **Skill Metadata**
> Category: `gold-standards`
> Priority: `HIGH`

## Core Rules

1. ALL functions must have type hints for parameters AND return type
2. Use explicit named parameters with sensible defaults
3. Return typed results (dict, NamedTuple, or dataclass)
4. Never use `**kwargs` as the only interface
5. Document units in parameter names or docstrings

## Correct Patterns

```python
import pandas as pd
import numpy as np
from dataclasses import dataclass
from typing import Optional

TRADING_DAYS_PER_YEAR = 252


# Pattern 1: Simple function with typed signature
def annualized_return(
    daily_returns: pd.Series,
    trading_days: int = TRADING_DAYS_PER_YEAR,
) -> float:
    """Calculate annualized return from daily returns."""
    mean_daily = daily_returns.mean()
    return float((1 + mean_daily) ** trading_days - 1)


# Pattern 2: Dataclass return type
@dataclass
class RiskReport:
    sharpe_ratio: float
    annualized_volatility: float
    max_drawdown: float
    observations: int


def calculate_risk(
    returns: pd.Series,
    risk_free_rate: float = 0.04,
    periods_per_year: int = TRADING_DAYS_PER_YEAR,
) -> RiskReport:
    """Calculate risk metrics from return series."""
    daily_rf = (1 + risk_free_rate) ** (1 / periods_per_year) - 1
    excess = returns - daily_rf
    sharpe = float(excess.mean() / excess.std() * np.sqrt(periods_per_year))
    vol = float(returns.std() * np.sqrt(periods_per_year))
    cumulative = (1 + returns).cumprod()
    drawdown = (cumulative / cumulative.cummax() - 1).min()

    return RiskReport(
        sharpe_ratio=sharpe,
        annualized_volatility=vol,
        max_drawdown=float(drawdown),
        observations=len(returns),
    )


# Pattern 3: Optional parameters with None default
def load_prices(
    symbol: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    source: str = "yfinance",
) -> pd.DataFrame:
    """Load price data for a symbol.

    Args:
        symbol: Ticker symbol (e.g., "AAPL").
        start_date: Start date in YYYY-MM-DD format (default: 1 year ago).
        end_date: End date in YYYY-MM-DD format (default: today).
        source: Data provider name.

    Returns:
        DataFrame with columns: date, open, high, low, close, volume.
    """
    ...
```

## Wrong Patterns

```python
# WRONG: No type hints
def calc(data, n=252):
    return (1 + data.mean()) ** n - 1

# WRONG: **kwargs hiding the interface
def risk_metrics(**kwargs):
    returns = kwargs.get("returns")
    rf = kwargs.get("rf", 0.04)
    ...

# WRONG: Ambiguous parameter names
def analyze(d, r, n):  # What are d, r, n?
    return d.mean() / d.std() * r ** n

# WRONG: Returning different types
def sharpe(returns):
    if returns is None:
        return None  # Sometimes None
    if len(returns) < 2:
        return "insufficient data"  # Sometimes string
    return returns.mean() / returns.std()  # Sometimes float
```

## Parameter Naming Conventions

```python
# Use descriptive names that include units or context
def calculate_var(
    returns: pd.Series,          # "returns" not "data" or "x"
    confidence_level: float = 0.95,  # Not "cl" or "alpha"
    holding_period_days: int = 1,    # Explicit units in name
    method: str = "historical",      # Enum-like with known values
) -> float:
    ...

# Name boolean parameters as questions
def validate_prices(
    df: pd.DataFrame,
    check_splits: bool = True,       # Is this a yes/no?
    allow_zero_volume: bool = False,  # Clear what True means
) -> list[str]:
    ...
```

## Return Type Guidelines

```python
from typing import NamedTuple

# For 2-3 related values: use NamedTuple
class ReturnStats(NamedTuple):
    arithmetic_mean: float
    geometric_mean: float
    standard_deviation: float

def return_statistics(returns: pd.Series) -> ReturnStats:
    arith = float(returns.mean())
    geo = float((1 + returns).prod() ** (1 / len(returns)) - 1)
    std = float(returns.std())
    return ReturnStats(arith, geo, std)


# For complex results: use dataclass
@dataclass
class BacktestResult:
    total_return: float
    sharpe_ratio: float
    max_drawdown: float
    trade_count: int
    win_rate: float
    equity_curve: pd.Series


# For simple values: return the primitive type
def simple_return(price_start: float, price_end: float) -> float:
    return (price_end - price_start) / price_start
```

## Checklist

- [ ] All parameters have type hints
- [ ] Return type is annotated
- [ ] Default values are sensible for finance (e.g., 252 trading days)
- [ ] Parameter names are descriptive (not single letters)
- [ ] Units are clear from name or docstring
- [ ] Optional parameters use `Optional[T]` with `None` default
- [ ] Boolean parameters are named as questions
- [ ] Return type is consistent (never sometimes-None-sometimes-float)
- [ ] Complex returns use dataclass or NamedTuple
- [ ] `**kwargs` is never the primary interface

<!-- Trigger Keywords: function signatures, type hints, parameter types, function design, typed functions, return types, parameter naming -->
