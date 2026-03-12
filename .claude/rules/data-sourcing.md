# Data Sourcing Rules

## Scope

These rules apply to all code that fetches, processes, or stores market data, financial time series, economic indicators, or pricing information (`**/*.py`, `**/*.ts`, `**/*.js`).

## MUST Rules

### 1. Cite Data Provider

All data-fetching code MUST document the data provider and any licensing constraints.

**Correct**:

```python
def fetch_prices(ticker: str, start: str, end: str):
    """
    Fetch adjusted close prices from Yahoo Finance via yfinance.

    Data provider: Yahoo Finance (yfinance library)
    License: Yahoo Finance terms of service — free for personal/educational use
    Limitations: 15-minute delay for real-time quotes; adjusted for splits and dividends
    """
    import yfinance as yf
    data = yf.download(ticker, start=start, end=end)
    return data["Adj Close"]
```

**Incorrect**:

```
def fetch_prices(ticker, start, end):
    import yfinance as yf
    return yf.download(ticker, start=start, end=end)["Adj Close"]  # No attribution
```

**Common Providers** (document which you use):

- **Yahoo Finance** (`yfinance`) — Free, educational use, 15-min delayed quotes
- **FRED** (`fredapi`) — Free, public domain economic data from Federal Reserve
- **Polygon.io** — Paid tiers, real-time and historical equities/options/crypto
- **Alpha Vantage** — Free tier with rate limits, requires API key
- **IEX Cloud** — Paid, real-time and historical US equities
- **Quandl/Nasdaq Data Link** — Various free and paid datasets

**Enforced by**: intermediate-reviewer
**Violation**: HIGH priority fix

### 2. Specify Data Freshness and Staleness

All data responses MUST include metadata indicating when the data was fetched and its expected freshness.

**Correct**:

```python
from datetime import datetime, timezone

def get_market_data(ticker: str):
    data = fetch_from_provider(ticker)
    return {
        "ticker": ticker,
        "price": data.price,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "data_delay": "15 minutes",  # Provider-specific delay
        "market_status": "closed" if is_market_closed() else "open",
        "source": "Yahoo Finance",
    }
```

**Incorrect**:

```
def get_market_data(ticker):
    return {"ticker": ticker, "price": fetch_price(ticker)}  # When? How stale?
```

**Enforced by**: intermediate-reviewer
**Violation**: HIGH priority fix

### 3. Handle Market Holidays and Data Gaps

Code processing time-series data MUST account for:

- Market holidays (no trading data on those days)
- Weekends (no data for Saturday/Sunday)
- Half-day trading sessions
- Data gaps from provider outages

**Correct**:

```python
import pandas as pd
from pandas.tseries.holiday import USFederalHolidayCalendar

def fill_market_gaps(prices: pd.Series) -> pd.Series:
    """
    Forward-fill missing values caused by market holidays and weekends.
    Uses business day frequency aligned to NYSE trading calendar.

    Missing data handling:
    - Weekends/holidays: forward-fill from last trading day
    - Provider gaps (>3 consecutive missing days): raise DataQualityError
    """
    # Detect suspicious gaps (more than a long weekend)
    max_gap = prices.isna().astype(int).groupby(prices.notna().cumsum()).sum().max()
    if max_gap > 3:
        raise DataQualityError(f"Suspicious gap of {max_gap} consecutive missing values")

    return prices.ffill()
```

**Incorrect**:

```
prices = prices.dropna()  # Silently removes holidays — changes return calculations
prices = prices.fillna(0)  # Zero price is worse than missing
```

**Enforced by**: intermediate-reviewer
**Violation**: HIGH priority fix

### 4. Validate Data Quality

All ingested market data MUST be validated for:

- **Missing values**: Detect and handle NaN/None
- **Outliers**: Flag price changes exceeding reasonable thresholds (e.g., >50% single-day move)
- **Stock splits**: Verify that adjusted prices are used or splits are handled
- **Negative or zero prices**: Reject unless the instrument allows it (e.g., oil futures)
- **Duplicate timestamps**: Detect and deduplicate

**Correct**:

```python
def validate_price_series(prices: pd.Series, ticker: str) -> pd.Series:
    """Validate price data quality before use in calculations."""

    # Check for missing values
    missing_pct = prices.isna().mean()
    if missing_pct > 0.05:
        raise DataQualityError(f"{ticker}: {missing_pct:.1%} missing values exceeds 5% threshold")

    # Check for suspicious single-day moves (potential split not adjusted)
    returns = prices.pct_change().dropna()
    extreme_moves = returns[returns.abs() > 0.50]
    if not extreme_moves.empty:
        logger.warning(f"{ticker}: {len(extreme_moves)} days with >50% moves — verify split adjustment: {extreme_moves.index.tolist()}")

    # Check for non-positive prices
    if (prices <= 0).any():
        raise DataQualityError(f"{ticker}: Non-positive prices detected")

    # Check for duplicate timestamps
    if prices.index.duplicated().any():
        logger.warning(f"{ticker}: Duplicate timestamps detected — keeping last")
        prices = prices[~prices.index.duplicated(keep="last")]

    return prices
```

**Enforced by**: intermediate-reviewer, testing-specialist
**Violation**: HIGH priority fix

### 5. Cache Data Appropriately

Market data requests MUST implement caching to:

- Avoid redundant API calls (respect rate limits)
- Speed up repeated analyses
- Reduce costs for paid data providers

**Correct**:

```python
import hashlib
import json
from pathlib import Path
from datetime import datetime, timedelta

CACHE_DIR = Path(".cache/market_data")
CACHE_TTL = timedelta(hours=1)  # For intraday data
HISTORICAL_CACHE_TTL = timedelta(days=7)  # For historical data that won't change

def fetch_with_cache(ticker: str, start: str, end: str):
    """Fetch prices with file-based caching. Historical data cached longer than intraday."""
    cache_key = hashlib.md5(f"{ticker}_{start}_{end}".encode()).hexdigest()
    cache_path = CACHE_DIR / f"{cache_key}.json"

    if cache_path.exists():
        cached = json.loads(cache_path.read_text())
        cached_at = datetime.fromisoformat(cached["fetched_at"])
        ttl = HISTORICAL_CACHE_TTL if end < datetime.now().strftime("%Y-%m-%d") else CACHE_TTL
        if datetime.now() - cached_at < ttl:
            return cached["data"]

    data = fetch_from_provider(ticker, start, end)
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_path.write_text(json.dumps({
        "data": data,
        "fetched_at": datetime.now().isoformat(),
        "source": "Yahoo Finance",
    }))
    return data
```

**Enforced by**: intermediate-reviewer
**Violation**: HIGH priority fix

## MUST NOT Rules

### 1. No Hardcoded Price Data in Production

MUST NOT use hardcoded price data in production code. Prices change constantly; hardcoded values become stale immediately.

**Detection Patterns**:

```
AAPL_PRICE = 150.00
prices = {"AAPL": 189.50, "GOOGL": 141.80}  # Hardcoded — will be wrong tomorrow
DEFAULT_RISK_FREE_RATE = 0.05  # Hardcoded — changes with Fed policy
```

**Correct Alternative**:

```python
# Fetch current risk-free rate from FRED
def get_risk_free_rate():
    """Fetch 3-month Treasury bill rate from FRED as risk-free rate proxy."""
    import fredapi
    fred = fredapi.Fred(api_key=os.environ["FRED_API_KEY"])
    return fred.get_series("DTB3").iloc[-1] / 100  # Convert percentage to decimal
```

**Exception**: Hardcoded data is acceptable in test files for deterministic testing.

**Consequence**: BLOCK commit

### 2. No Assumption of Continuous Trading Hours

MUST NOT write code that assumes markets trade 24/7 or ignores trading session boundaries.

**Detection Patterns**:

```
# Assumes data exists for every calendar day
expected_days = (end_date - start_date).days
if len(prices) != expected_days:
    raise Error("Missing data")  # Will always fire — weekends exist

# Assumes 365 trading days
annualized = daily_return * 365  # Wrong — use 252 for equities
```

**Correct Alternative**:

```python
from pandas.tseries.offsets import BDay

expected_business_days = len(pd.bdate_range(start_date, end_date))
# Or use exchange-specific calendar for accuracy
```

**Consequence**: HIGH priority fix

### 3. No Ignoring Timezone Differences

MUST NOT process market data without explicit timezone handling. Different exchanges operate in different timezones, and conflating them corrupts multi-market analyses.

**Detection Patterns**:

```
timestamp = datetime.now()  # Naive datetime — which timezone?
prices_ny = fetch("AAPL")
prices_tokyo = fetch("7203.T")
combined = pd.concat([prices_ny, prices_tokyo])  # Timezone mismatch
```

**Correct Alternative**:

```python
from datetime import timezone
import pytz

# Always use timezone-aware datetimes
now_utc = datetime.now(timezone.utc)
now_eastern = datetime.now(pytz.timezone("US/Eastern"))

# Normalize to UTC before combining cross-market data
prices_ny.index = prices_ny.index.tz_localize("US/Eastern").tz_convert("UTC")
prices_tokyo.index = prices_tokyo.index.tz_localize("Asia/Tokyo").tz_convert("UTC")
combined = pd.concat([prices_ny, prices_tokyo])
```

**Consequence**: HIGH priority fix

## Exceptions

Data sourcing exceptions require:

1. Documentation of why the exception is needed (e.g., offline demo mode)
2. Clear labeling when hardcoded/sample data is used
3. Approval from intermediate-reviewer
4. A tracked follow-up to replace with live data
