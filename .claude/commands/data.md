# /data - Market Data APIs Quick Reference

## Purpose

Quick reference for fetching, caching, and managing market data from public and commercial APIs. Loads the financial data APIs skill module so you can immediately pull prices, fundamentals, economic indicators, and alternative data.

## Quick Reference

| Command                           | Action                                       |
| --------------------------------- | -------------------------------------------- |
| `yf.download(ticker, start, end)` | Download historical OHLCV from Yahoo Finance |
| `yf.Ticker(ticker).info`          | Get company fundamentals and metadata        |
| `fred.get_series(series_id)`      | Pull economic indicator from FRED            |
| `polygon.get_aggs(ticker, ...)`   | Fetch aggregated bars from Polygon.io        |
| `cache_with_ttl(func, ttl)`       | Cache API responses with time-to-live        |

## What You Get

- Yahoo Finance (yfinance) patterns for price history, fundamentals, and options chains
- FRED API patterns for economic indicators (GDP, CPI, unemployment, yield curves)
- Polygon.io setup for real-time and historical market data
- Caching strategies to minimize API calls and respect rate limits
- Data normalization patterns for consistent downstream processing
- Error handling for flaky financial data endpoints

## Quick Pattern

```python
import yfinance as yf
import pandas as pd

# Download historical prices
data = yf.download("AAPL", start="2020-01-01", end="2024-01-01")
returns = data["Adj Close"].pct_change().dropna()

# Get company fundamentals
ticker = yf.Ticker("AAPL")
pe_ratio = ticker.info.get("trailingPE")
market_cap = ticker.info.get("marketCap")

# Multiple tickers at once
portfolio = yf.download(["AAPL", "GOOGL", "MSFT"], start="2023-01-01")

# FRED data retrieval
from fredapi import Fred
import os

fred = Fred(api_key=os.environ["FRED_API_KEY"])
gdp = fred.get_series("GDP")
cpi = fred.get_series("CPIAUCSL")
ten_year = fred.get_series("DGS10")

# Simple caching pattern
from functools import lru_cache
from datetime import datetime

@lru_cache(maxsize=128)
def get_price_data(ticker: str, date_key: str) -> pd.DataFrame:
    """Cache by date_key to bust cache daily."""
    return yf.download(ticker, period="1y")

today_key = datetime.now().strftime("%Y-%m-%d")
prices = get_price_data("AAPL", today_key)
```

## Rate Limiting Patterns

```python
import time
from functools import wraps

def rate_limit(calls_per_second: float):
    """Decorator to enforce rate limits on API calls."""
    min_interval = 1.0 / calls_per_second
    last_called = [0.0]

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            elapsed = time.time() - last_called[0]
            if elapsed < min_interval:
                time.sleep(min_interval - elapsed)
            last_called[0] = time.time()
            return func(*args, **kwargs)
        return wrapper
    return decorator

@rate_limit(calls_per_second=5)
def fetch_ticker_data(ticker: str):
    return yf.Ticker(ticker).info
```

## Agent Teams

| Agent                      | Role                                                                         |
| -------------------------- | ---------------------------------------------------------------------------- |
| **market-data-specialist** | API selection, data sourcing, rate limit management, data quality validation |

## Related Commands

- `/finance` - Financial calculations using the fetched data
- `/portfolio` - Portfolio construction from market data

## Skill Reference

Loads `.claude/skills/05-financial-data-apis/SKILL.md` for comprehensive coverage of financial data providers, API patterns, data licensing considerations, and caching strategies.
