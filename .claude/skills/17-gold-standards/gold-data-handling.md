---
name: gold-data-handling
description: "Data handling standards for financial Python code including timezone management, split/dividend adjustments, NaN handling, Decimal for money, and data caching. Use when asking 'data handling', 'timezone handling', 'split adjustment', 'NaN handling', 'data standards', or 'cache strategy'."
---

# Gold Standard: Data Handling

> **Skill Metadata**
> Category: `gold-standards`
> Priority: `HIGH`

## Core Rules

1. All dates must be timezone-aware (use UTC or exchange local time)
2. Use adjusted close prices (split and dividend adjusted)
3. Handle NaN explicitly (never ignore silently)
4. Use Decimal for monetary amounts, float64 for returns
5. Cache API responses to avoid rate limits

## Timezone Management

```python
import pandas as pd
from datetime import datetime
import pytz

# CORRECT: Timezone-aware dates
def parse_dates(date_strings: list[str], tz: str = "America/New_York") -> pd.DatetimeIndex:
    """Parse date strings to timezone-aware DatetimeIndex.

    Args:
        date_strings: Dates in YYYY-MM-DD format.
        tz: Timezone name (default: NYSE timezone).
    """
    dates = pd.to_datetime(date_strings)
    return dates.tz_localize(tz)


# CORRECT: Compare dates in same timezone
def is_market_open(dt: datetime, exchange_tz: str = "America/New_York") -> bool:
    """Check if given datetime falls within market hours."""
    tz = pytz.timezone(exchange_tz)
    local = dt.astimezone(tz)
    return 9 <= local.hour < 16 and local.weekday() < 5


# WRONG: Naive datetimes
# dates = pd.to_datetime(["2024-01-02", "2024-01-03"])  # No timezone!
# if datetime.now() > some_date:  # Comparing naive and aware!
```

## Adjusted Prices

```python
import yfinance as yf
import logging

logger = logging.getLogger(__name__)

# CORRECT: Use adjusted close
def fetch_adjusted_prices(symbol: str, period: str = "1y") -> pd.DataFrame:
    """Fetch split- and dividend-adjusted prices."""
    ticker = yf.Ticker(symbol)
    df = ticker.history(period=period)

    # yfinance 'Close' is already adjusted
    # Use 'Close' (adjusted), not raw close
    return df[["Close", "Volume"]].rename(
        columns={"Close": "close", "Volume": "volume"}
    )


# CORRECT: Detect unadjusted data
def check_for_splits(prices: pd.Series, threshold: float = 0.40) -> list:
    """Detect potential stock splits in price data."""
    returns = prices.pct_change()
    large_moves = returns.abs() > threshold
    if large_moves.any():
        split_dates = prices.index[large_moves].tolist()
        logger.warning(
            "Potential splits detected on %s. Use adjusted prices.", split_dates
        )
        return split_dates
    return []


# WRONG: Using raw close without adjustment
# df = yf.download("AAPL")
# returns = df["Close"].pct_change()  # May include split discontinuities!
```

## NaN Handling

```python
import numpy as np

# CORRECT: Explicit NaN handling
def safe_returns(prices: pd.Series) -> pd.Series:
    """Calculate returns with explicit NaN handling."""
    returns = prices.pct_change()

    # First value is always NaN from pct_change
    returns = returns.iloc[1:]  # or .dropna()

    # Check for unexpected NaN
    nan_count = returns.isna().sum()
    if nan_count > 0:
        logger.warning(
            "%d NaN values in returns (%.1f%%). Forward-filling.",
            nan_count, nan_count / len(returns) * 100,
        )
        returns = returns.fillna(0.0)  # or .ffill() depending on context

    return returns


# CORRECT: Validate before calculation
def safe_sharpe(returns: pd.Series) -> float:
    """Calculate Sharpe with NaN protection."""
    clean = returns.dropna()
    if len(clean) < 30:
        raise ValueError(
            f"Only {len(clean)} non-NaN observations (need 30)"
        )
    if clean.std() == 0:
        return 0.0
    return float(clean.mean() / clean.std() * np.sqrt(252))


# WRONG: Ignoring NaN
# sharpe = returns.mean() / returns.std()  # NaN propagates silently!
# total_return = (1 + returns).prod() - 1  # NaN -> NaN result!
```

## Decimal for Money

```python
from decimal import Decimal, ROUND_HALF_UP

# CORRECT: Monetary calculations with Decimal
def portfolio_value(holdings: list[dict]) -> Decimal:
    """Calculate portfolio value using Decimal for precision.

    Args:
        holdings: [{"symbol": "AAPL", "shares": 100, "price": "150.25"}, ...]
    """
    total = Decimal("0.00")
    for h in holdings:
        price = Decimal(str(h["price"]))
        shares = Decimal(str(h["shares"]))
        value = (price * shares).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        total += value
    return total


# CORRECT: Float for returns (numpy/pandas compatible)
def calculate_returns(prices: pd.Series) -> pd.Series:
    """Returns use float64 for numpy/pandas compatibility."""
    return prices.pct_change().dropna().astype(np.float64)


# WRONG: Float for money
# total = 149.99 * 100  # 14998.999999999998 (not 14999.00!)
# fee = 0.1 + 0.2       # 0.30000000000000004
```

## Data Caching

```python
import json
import hashlib
from pathlib import Path
from datetime import datetime, timedelta

CACHE_DIR = Path(".cache/market_data")
CACHE_MAX_AGE = timedelta(hours=4)  # Stale after 4 hours


def cached_fetch(
    symbol: str,
    fetch_func,
    max_age: timedelta = CACHE_MAX_AGE,
) -> pd.DataFrame:
    """Fetch data with file-based caching.

    Args:
        symbol: Ticker symbol.
        fetch_func: Function that fetches fresh data.
        max_age: Maximum cache age before refetch.
    """
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_path = CACHE_DIR / f"{symbol.upper()}.csv"
    meta_path = CACHE_DIR / f"{symbol.upper()}.meta.json"

    # Check cache freshness
    if cache_path.exists() and meta_path.exists():
        meta = json.loads(meta_path.read_text())
        cached_at = datetime.fromisoformat(meta["cached_at"])
        if datetime.now() - cached_at < max_age:
            return pd.read_csv(cache_path, parse_dates=["date"])

    # Fetch fresh data
    df = fetch_func(symbol)
    df.to_csv(cache_path, index=False)
    meta_path.write_text(json.dumps({
        "symbol": symbol,
        "cached_at": datetime.now().isoformat(),
        "rows": len(df),
    }))
    return df
```

## OHLCV Validation

```python
def validate_ohlcv(df: pd.DataFrame, symbol: str = "") -> list[str]:
    """Validate OHLCV DataFrame structure and values."""
    issues = []

    # Required columns
    required = {"date", "open", "high", "low", "close", "volume"}
    missing = required - set(df.columns.str.lower())
    if missing:
        issues.append(f"Missing columns: {missing}")
        return issues  # Cannot continue without required columns

    # Normalize column names
    df.columns = df.columns.str.lower()

    # Price sanity
    for col in ["open", "high", "low", "close"]:
        if (df[col] <= 0).any():
            issues.append(f"{symbol}: Non-positive {col} prices")
        if df[col].isna().any():
            issues.append(f"{symbol}: NaN in {col}")

    # OHLC relationship
    if (df["high"] < df["low"]).any():
        issues.append(f"{symbol}: high < low on some days")

    # Volume
    if (df["volume"] < 0).any():
        issues.append(f"{symbol}: Negative volume values")

    # Date ordering
    dates = pd.to_datetime(df["date"])
    if not dates.is_monotonic_increasing:
        issues.append(f"{symbol}: Dates not sorted ascending")

    return issues
```

## Checklist

- [ ] All dates are timezone-aware
- [ ] Using adjusted close prices (not raw close)
- [ ] NaN handled explicitly (not ignored)
- [ ] Monetary amounts use Decimal
- [ ] Returns use float64
- [ ] API responses cached to avoid rate limits
- [ ] OHLCV data validated before use
- [ ] High >= Low enforced
- [ ] All prices positive
- [ ] Volume non-negative
- [ ] Dates sorted ascending
- [ ] Data source documented

<!-- Trigger Keywords: data handling, timezone handling, split adjustment, NaN handling, data standards, cache strategy, adjusted prices, OHLCV validation, Decimal for money -->
