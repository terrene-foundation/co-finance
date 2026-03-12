---
paths:
  - "**/*.py"
  - "**/*.ts"
  - "**/*.js"
---

# Python Finance Pattern Rules

## Scope

These rules apply to all Python code with financial calculations.

## MUST Rules

### 1. Use Decimal for Currency/Monetary Values

MUST use `Decimal` for all currency and monetary calculations. Floating-point arithmetic introduces rounding errors that compound across financial operations.

**Correct**:

```python
from decimal import Decimal, ROUND_HALF_UP

price = Decimal("149.99")
quantity = Decimal("100")
total = price * quantity  # Decimal("14999.00") — exact

# Rounding to cents
fee = (total * Decimal("0.001")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
```

**Incorrect**:

```python
❌ price = 149.99              # float — rounding errors
❌ total = 149.99 * 100        # 14998.999999999998
❌ fee = round(total * 0.001, 2)  # Compounds float error
```

**Enforced by**: Code review
**Violation**: Code review flag — monetary calculations with float are rejected

### 2. Named Constants for Financial Parameters

MUST define named constants for standard financial parameters. Magic numbers in financial code are unacceptable.

**Correct**:

```python
TRADING_DAYS_PER_YEAR = 252
MONTHS_PER_YEAR = 12
QUARTERS_PER_YEAR = 4
RISK_FREE_RATE_DEFAULT = 0.05  # Update annually or pull from FRED
BASIS_POINTS_PER_PERCENT = 100
```

**Incorrect**:

```python
❌ annualized = daily_vol * np.sqrt(252)   # What is 252?
❌ monthly_return = annual / 12             # Magic number
❌ sharpe = (ret - 0.05) / vol             # Hardcoded risk-free rate
```

**Enforced by**: Code review
**Violation**: Code review flag

### 3. Annualization Conventions

MUST use correct annualization factors for volatility and returns.

**Correct**:

```python
import numpy as np

TRADING_DAYS_PER_YEAR = 252
MONTHS_PER_YEAR = 12

# Annualizing volatility (standard deviation scales with sqrt of time)
annual_vol_from_daily = daily_vol * np.sqrt(TRADING_DAYS_PER_YEAR)
annual_vol_from_monthly = monthly_vol * np.sqrt(MONTHS_PER_YEAR)

# Annualizing returns (compound, not multiply)
annual_return_from_daily = (1 + daily_return) ** TRADING_DAYS_PER_YEAR - 1
annual_return_from_monthly = (1 + monthly_return) ** MONTHS_PER_YEAR - 1
```

**Incorrect**:

```python
❌ annual_vol = daily_vol * 252          # Must use sqrt(252) for volatility
❌ annual_ret = daily_ret * 252          # Must compound, not multiply
❌ annual_vol = monthly_vol * np.sqrt(365)  # Wrong period count
```

**Enforced by**: Code review
**Violation**: Code review flag — incorrect annualization produces misleading risk metrics

### 4. Return Calculation Specification

MUST always specify whether simple (arithmetic) or log (continuous) returns are being calculated. Never leave ambiguous.

**Correct**:

```python
import numpy as np
import pandas as pd

# Simple (arithmetic) returns
simple_returns = prices.pct_change()  # (P1 - P0) / P0

# Log (continuous) returns
log_returns = np.log(prices / prices.shift(1))

# Document which is used
def calculate_portfolio_returns(prices: pd.DataFrame, method: str = "simple") -> pd.Series:
    """Calculate portfolio returns.

    Args:
        method: 'simple' for arithmetic returns, 'log' for continuous returns.
    """
    if method == "simple":
        return prices.pct_change()
    elif method == "log":
        return np.log(prices / prices.shift(1))
    else:
        raise ValueError(f"Unknown return method: {method}. Use 'simple' or 'log'.")
```

**Incorrect**:

```python
❌ returns = prices.pct_change()  # Which type? Undocumented.
❌ def get_returns(prices):       # No method parameter, no docstring
❌     return prices.diff() / prices.shift(1)
```

**Enforced by**: Code review
**Violation**: Code review flag

### 5. Data Validation Before Calculations

MUST validate financial data before performing calculations. Raw market data contains NaN values, zero prices, stock splits, and other anomalies that silently corrupt results.

**Correct**:

```python
import pandas as pd
import numpy as np

def validate_price_data(prices: pd.Series, ticker: str = "") -> pd.Series:
    """Validate and clean price data before calculations."""
    label = f" for {ticker}" if ticker else ""

    # Check for NaN/missing values
    nan_count = prices.isna().sum()
    if nan_count > 0:
        print(f"Warning: {nan_count} missing values{label}. Forward-filling.")
        prices = prices.ffill()

    # Check for zero or negative prices
    bad_prices = prices[prices <= 0]
    if len(bad_prices) > 0:
        raise ValueError(f"Found {len(bad_prices)} zero/negative prices{label}: {bad_prices.index.tolist()}")

    # Check for suspicious jumps (possible stock splits)
    returns = prices.pct_change().abs()
    splits = returns[returns > 0.5]  # >50% single-day move
    if len(splits) > 0:
        print(f"Warning: {len(splits)} large price moves{label} (possible splits): {splits.index.tolist()}")

    # Check for sufficient data
    if len(prices) < 30:
        raise ValueError(f"Insufficient data{label}: {len(prices)} points (need at least 30)")

    return prices
```

**Incorrect**:

```python
❌ sharpe = returns.mean() / returns.std()          # NaN in returns → NaN result, no warning
❌ vol = prices.pct_change().std()                    # Zero prices → inf returns
❌ corr = returns_a.corr(returns_b)                   # Misaligned dates → wrong correlation
```

**Enforced by**: Code review
**Violation**: Code review flag

### 6. Use numpy-financial for Time Value of Money

MUST use `numpy-financial` for TVM calculations. Do not implement NPV, IRR, or PMT from scratch.

**Correct**:

```python
import numpy_financial as npf

# Net Present Value
npv = npf.npv(rate=0.10, values=[-1000, 300, 400, 500])

# Internal Rate of Return
irr = npf.irr(values=[-1000, 300, 400, 500])

# Payment calculation (mortgage/loan)
monthly_payment = npf.pmt(
    rate=0.05 / 12,    # Monthly rate
    nper=30 * 12,       # Total periods
    pv=-300000          # Loan amount (negative = outflow)
)

# Future Value
fv = npf.fv(rate=0.07, nper=30, pmt=-500, pv=-10000)
```

**Incorrect**:

```python
❌ def npv(rate, cashflows):              # Don't reimplement
❌     return sum(cf/(1+rate)**i for i, cf in enumerate(cashflows))
❌
❌ # Manual IRR with bisection — use npf.irr instead
❌ def irr(cashflows, guess=0.1):
❌     ...
```

**Enforced by**: Code review
**Violation**: Code review flag — custom TVM implementations are error-prone and untested

### 7. Timezone Awareness for Market Data

MUST handle timezones explicitly for all market data. Store in UTC, display in market-local time.

**Correct**:

```python
import pandas as pd
from zoneinfo import ZoneInfo

# US markets operate in Eastern time
NYSE_TZ = ZoneInfo("America/New_York")
UTC_TZ = ZoneInfo("UTC")

# Convert market timestamps to UTC for storage
def to_utc(dt: pd.Timestamp, market_tz: ZoneInfo = NYSE_TZ) -> pd.Timestamp:
    if dt.tzinfo is None:
        dt = dt.tz_localize(market_tz)
    return dt.tz_convert(UTC_TZ)

# Convert UTC to market time for display
def to_market_time(dt: pd.Timestamp, market_tz: ZoneInfo = NYSE_TZ) -> pd.Timestamp:
    return dt.tz_convert(market_tz)

# Timezone-aware date ranges
trading_dates = pd.bdate_range(
    start="2024-01-01",
    end="2024-12-31",
    tz=NYSE_TZ
)
```

**Incorrect**:

```python
❌ prices.index = pd.to_datetime(prices.index)        # Naive — no timezone
❌ now = datetime.now()                                 # Local system time, not market time
❌ market_close = datetime(2024, 1, 15, 16, 0)          # No timezone — 4pm where?
```

**Enforced by**: Code review
**Violation**: Code review flag

## Python Finance Libraries

### pandas Patterns

```python
import pandas as pd

# MUST use proper datetime indexing
prices = pd.read_csv("prices.csv", parse_dates=["date"], index_col="date")
prices.index = pd.DatetimeIndex(prices.index)  # Ensure DatetimeIndex

# MUST use .pct_change() for return calculations
returns = prices["close"].pct_change().dropna()

# MUST use .rolling() for moving averages and rolling statistics
sma_20 = prices["close"].rolling(window=20).mean()
rolling_vol = returns.rolling(window=60).std() * np.sqrt(TRADING_DAYS_PER_YEAR)

# Resampling: daily → monthly
monthly_prices = prices["close"].resample("ME").last()
monthly_returns = monthly_prices.pct_change()

# CORRECT: Align multiple time series before operations
aligned = pd.concat([returns_a, returns_b], axis=1, join="inner")
correlation = aligned.corr()

# INCORRECT:
# ❌ prices["returns"] = prices["close"].diff()  # Not returns — this is price changes
# ❌ sma = prices["close"].mean()                 # This is the grand mean, not moving average
# ❌ correlation = returns_a.corr(returns_b)       # May have misaligned dates
```

### numpy Patterns

```python
import numpy as np

# Vectorized portfolio math
weights = np.array([0.4, 0.3, 0.2, 0.1])
assert np.isclose(weights.sum(), 1.0), "Portfolio weights must sum to 1"

# Covariance matrix for portfolio optimization
cov_matrix = returns_df.cov().values * TRADING_DAYS_PER_YEAR  # Annualized
portfolio_vol = np.sqrt(weights @ cov_matrix @ weights)

# Expected portfolio return
expected_returns = returns_df.mean().values * TRADING_DAYS_PER_YEAR
portfolio_return = weights @ expected_returns

# Sharpe ratio
RISK_FREE_RATE = 0.05
sharpe = (portfolio_return - RISK_FREE_RATE) / portfolio_vol

# CORRECT: Use vectorized operations for efficiency
# ❌ portfolio_vol = 0
# ❌ for i in range(n):
# ❌     for j in range(n):
# ❌         portfolio_vol += weights[i] * weights[j] * cov_matrix[i][j]
# ❌ portfolio_vol = np.sqrt(portfolio_vol)  # Loops are slow — use matrix multiplication
```

### backtrader Patterns

```python
import backtrader as bt

# MUST extend bt.Strategy with proper structure
class MovingAverageCrossover(bt.Strategy):
    params = (
        ("fast_period", 10),
        ("slow_period", 30),
    )

    def __init__(self):
        self.fast_ma = bt.indicators.SMA(period=self.params.fast_period)
        self.slow_ma = bt.indicators.SMA(period=self.params.slow_period)
        self.crossover = bt.indicators.CrossOver(self.fast_ma, self.slow_ma)

    def next(self):
        if self.crossover > 0:
            self.buy()
        elif self.crossover < 0:
            self.sell()

# MUST use analyzers for performance metrics — don't calculate manually
cerebro = bt.Cerebro()
cerebro.addstrategy(MovingAverageCrossover)
cerebro.addanalyzer(bt.analyzers.SharpeRatio, riskfreerate=0.05)
cerebro.addanalyzer(bt.analyzers.DrawDown)
cerebro.addanalyzer(bt.analyzers.Returns)

# Load data properly
data = bt.feeds.PandasData(dataname=price_df)
cerebro.adddata(data)

results = cerebro.run()
strat = results[0]
sharpe = strat.analyzers.sharperatio.get_analysis()

# INCORRECT:
# ❌ class MyStrategy(bt.Strategy):
# ❌     def next(self):
# ❌         if price > sma:  # Don't access raw data — use indicators
# ❌             self.buy()
# ❌
# ❌ # Don't manually compute Sharpe from trade log — use analyzers
```

## Exceptions

Pattern exceptions require:

1. Written justification
2. Approval from code reviewer
3. Documentation in code comments
