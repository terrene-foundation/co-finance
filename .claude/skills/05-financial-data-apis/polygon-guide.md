---
name: polygon-guide
description: "Polygon.io API guide covering REST and WebSocket APIs, real-time quotes, aggregates, options data, reference data, authentication, and pagination. Use when asking about 'Polygon', 'Polygon.io', 'polygon API', 'real-time quotes', 'WebSocket market data', 'polygon aggregates', 'polygon options', 'polygon reference data', 'polygon authentication', or 'polygon pagination'."
---

# Polygon.io API Guide

Complete reference for using the Polygon.io financial data API with Python.

## Setup and Authentication

```python
import os

# pip install polygon-api-client
from polygon import RESTClient

# API key must come from environment variables
api_key = os.environ["POLYGON_API_KEY"]
client = RESTClient(api_key=api_key)
```

## Aggregates (OHLCV Bars)

### Daily Bars

```python
from polygon import RESTClient
from datetime import datetime, timedelta
import pandas as pd
import os

client = RESTClient(api_key=os.environ["POLYGON_API_KEY"])

def get_daily_bars(ticker: str, start_date: str, end_date: str,
                    adjusted: bool = True) -> pd.DataFrame:
    """Fetch daily OHLCV bars from Polygon.

    Args:
        ticker: Stock ticker
        start_date: Start date (YYYY-MM-DD)
        end_date: End date (YYYY-MM-DD)
        adjusted: Whether to return split-adjusted data

    Returns:
        DataFrame with OHLCV data
    """
    aggs = client.get_aggs(
        ticker=ticker,
        multiplier=1,
        timespan="day",
        from_=start_date,
        to=end_date,
        adjusted=adjusted,
        limit=50000,
    )

    if not aggs:
        return pd.DataFrame()

    records = []
    for bar in aggs:
        records.append({
            "timestamp": pd.Timestamp(bar.timestamp, unit="ms", tz="UTC"),
            "open": bar.open,
            "high": bar.high,
            "low": bar.low,
            "close": bar.close,
            "volume": bar.volume,
            "vwap": bar.vwap,
            "transactions": bar.transactions,
        })

    df = pd.DataFrame(records)
    df.set_index("timestamp", inplace=True)
    return df

# Example
bars = get_daily_bars("AAPL", "2024-01-01", "2024-12-31")
print(f"Fetched {len(bars)} daily bars")
print(bars.head())
```

### Intraday Bars

```python
def get_intraday_bars(ticker: str, date: str,
                       interval_minutes: int = 5) -> pd.DataFrame:
    """Fetch intraday bars for a specific date.

    Args:
        ticker: Stock ticker
        date: Date string (YYYY-MM-DD)
        interval_minutes: Bar interval in minutes

    Returns:
        DataFrame with intraday bars
    """
    aggs = client.get_aggs(
        ticker=ticker,
        multiplier=interval_minutes,
        timespan="minute",
        from_=date,
        to=date,
        adjusted=True,
        limit=50000,
    )

    if not aggs:
        return pd.DataFrame()

    records = [{
        "timestamp": pd.Timestamp(bar.timestamp, unit="ms", tz="UTC"),
        "open": bar.open,
        "high": bar.high,
        "low": bar.low,
        "close": bar.close,
        "volume": bar.volume,
        "vwap": bar.vwap,
    } for bar in aggs]

    df = pd.DataFrame(records)
    df.set_index("timestamp", inplace=True)
    return df

intraday = get_intraday_bars("AAPL", "2024-06-15", interval_minutes=5)
print(f"Fetched {len(intraday)} intraday bars")
```

## Real-Time and Delayed Quotes

### Last Quote

```python
def get_last_quote(ticker: str) -> dict:
    """Get the last quote (bid/ask) for a ticker."""
    try:
        quote = client.get_last_quote(ticker)
        return {
            "ticker": ticker,
            "bid": quote.bid_price,
            "ask": quote.ask_price,
            "bid_size": quote.bid_size,
            "ask_size": quote.ask_size,
            "timestamp": quote.participant_timestamp,
        }
    except Exception as e:
        return {"error": str(e)}

quote = get_last_quote("AAPL")
print(f"AAPL: Bid=${quote.get('bid')}, Ask=${quote.get('ask')}")
```

### Last Trade

```python
def get_last_trade(ticker: str) -> dict:
    """Get the last trade for a ticker."""
    try:
        trade = client.get_last_trade(ticker)
        return {
            "ticker": ticker,
            "price": trade.price,
            "size": trade.size,
            "timestamp": trade.participant_timestamp,
        }
    except Exception as e:
        return {"error": str(e)}
```

### Snapshot (Current Market Data)

```python
def get_snapshot(ticker: str) -> dict:
    """Get a complete market data snapshot."""
    try:
        snapshot = client.get_snapshot_ticker("stocks", ticker)
        return {
            "ticker": ticker,
            "day_open": snapshot.day.open,
            "day_high": snapshot.day.high,
            "day_low": snapshot.day.low,
            "day_close": snapshot.day.close,
            "day_volume": snapshot.day.volume,
            "day_vwap": snapshot.day.vwap,
            "prev_close": snapshot.prev_day.close,
            "prev_volume": snapshot.prev_day.volume,
            "change": snapshot.todays_change,
            "change_pct": snapshot.todays_change_percent,
        }
    except Exception as e:
        return {"error": str(e)}
```

## WebSocket Streaming

```python
from polygon import WebSocketClient
import os

def stream_trades(tickers: list, on_message=None):
    """Stream real-time trades via WebSocket.

    Args:
        tickers: List of tickers to stream
        on_message: Callback function for trade messages

    Note: Requires paid Polygon plan for real-time data.
    """
    def default_handler(msgs):
        for msg in msgs:
            print(f"[{msg.symbol}] ${msg.price} x {msg.size} @ {msg.timestamp}")

    handler = on_message or default_handler

    ws = WebSocketClient(
        api_key=os.environ["POLYGON_API_KEY"],
        feed="delayed.polygon.io",  # Use "socket.polygon.io" for real-time
        market="stocks",
    )

    # Subscribe to trades for specified tickers
    for ticker in tickers:
        ws.subscribe(f"T.{ticker}")  # T = trades, Q = quotes, AM = aggregates

    ws.run(handle_msg=handler)

# Usage (blocking call):
# stream_trades(["AAPL", "MSFT"])
```

## Options Data

```python
def get_options_contracts(underlying: str, expiration_date: str = None,
                           contract_type: str = None) -> pd.DataFrame:
    """List available options contracts.

    Args:
        underlying: Underlying ticker
        expiration_date: Filter by expiration (YYYY-MM-DD)
        contract_type: 'call' or 'put'

    Returns:
        DataFrame of options contracts
    """
    params = {"underlying_ticker": underlying, "limit": 1000}
    if expiration_date:
        params["expiration_date"] = expiration_date
    if contract_type:
        params["contract_type"] = contract_type

    contracts = list(client.list_options_contracts(**params))

    records = [{
        "ticker": c.ticker,
        "underlying": c.underlying_ticker,
        "contract_type": c.contract_type,
        "strike": c.strike_price,
        "expiration": c.expiration_date,
        "style": c.exercise_style,
        "shares_per_contract": c.shares_per_contract,
    } for c in contracts]

    return pd.DataFrame(records)

# Example
contracts = get_options_contracts("AAPL", contract_type="call")
print(f"Found {len(contracts)} call contracts")
```

## Reference Data

### Ticker Details

```python
def get_ticker_details(ticker: str) -> dict:
    """Get detailed information about a ticker."""
    try:
        details = client.get_ticker_details(ticker)
        return {
            "ticker": details.ticker,
            "name": details.name,
            "market": details.market,
            "locale": details.locale,
            "type": details.type,
            "currency": details.currency_name,
            "market_cap": details.market_cap,
            "share_class_shares_outstanding": details.share_class_shares_outstanding,
            "sic_code": details.sic_code,
            "sic_description": details.sic_description,
        }
    except Exception as e:
        return {"error": str(e)}
```

### Ticker Search

```python
def search_tickers(query: str, market: str = "stocks",
                    limit: int = 10) -> pd.DataFrame:
    """Search for tickers by name or symbol.

    Args:
        query: Search query
        market: 'stocks', 'crypto', 'fx', 'otc'
        limit: Max results

    Returns:
        DataFrame of matching tickers
    """
    tickers = list(client.list_tickers(
        search=query,
        market=market,
        limit=limit,
        active=True,
    ))

    return pd.DataFrame([{
        "ticker": t.ticker,
        "name": t.name,
        "market": t.market,
        "type": t.type,
        "currency": t.currency_name,
    } for t in tickers])

results = search_tickers("Apple")
print(results.to_string(index=False))
```

## Pagination

```python
def get_all_bars_paginated(ticker: str, start_date: str, end_date: str,
                            timespan: str = "day") -> pd.DataFrame:
    """Fetch all bars with automatic pagination.

    Polygon limits results per request. This function handles pagination
    to fetch the complete date range.

    Args:
        ticker: Stock ticker
        start_date: Start date
        end_date: End date
        timespan: 'minute', 'hour', 'day', 'week', 'month'

    Returns:
        Complete DataFrame
    """
    all_records = []

    # list_aggs handles pagination automatically
    for bar in client.list_aggs(
        ticker=ticker,
        multiplier=1,
        timespan=timespan,
        from_=start_date,
        to=end_date,
        adjusted=True,
        limit=50000,
    ):
        all_records.append({
            "timestamp": pd.Timestamp(bar.timestamp, unit="ms", tz="UTC"),
            "open": bar.open,
            "high": bar.high,
            "low": bar.low,
            "close": bar.close,
            "volume": bar.volume,
        })

    df = pd.DataFrame(all_records)
    if not df.empty:
        df.set_index("timestamp", inplace=True)
    return df
```

## Error Handling

```python
import time
import logging

logger = logging.getLogger(__name__)

def polygon_request_with_retry(func, *args, max_retries: int = 3, **kwargs):
    """Execute a Polygon API call with retry logic.

    Handles rate limiting (HTTP 429) and transient errors.
    """
    for attempt in range(max_retries):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            error_str = str(e)

            if "429" in error_str:
                # Rate limited - wait with exponential backoff
                wait_time = 2 ** attempt * 5
                logger.warning(f"Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
            elif "403" in error_str:
                logger.error("Authentication failed. Check POLYGON_API_KEY.")
                raise
            elif "404" in error_str:
                logger.warning(f"Resource not found: {args}")
                return None
            else:
                logger.error(f"Attempt {attempt + 1}/{max_retries}: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)
                else:
                    raise

    return None
```

## Common Pitfalls

1. **Exceeding free tier limits**: The free Polygon plan is very limited (5 requests per minute). Batch requests and cache aggressively. Consider upgrading for any real development work.

2. **Timestamp handling**: Polygon returns timestamps in milliseconds since epoch (Unix timestamp \* 1000). Always convert explicitly: `pd.Timestamp(ts, unit='ms', tz='UTC')`.

3. **Not using `list_` methods for pagination**: Use `client.list_aggs()` instead of `client.get_aggs()` when you need automatic pagination over large date ranges.

4. **Forgetting adjusted vs unadjusted**: The `adjusted` parameter defaults may vary. Always explicitly set `adjusted=True` for price analysis.

5. **WebSocket connection management**: WebSocket connections can drop. Implement reconnection logic and heartbeat monitoring for production streaming applications.

6. **Options ticker format**: Polygon uses the OCC format for options tickers (e.g., `O:AAPL230120C00150000`). Use the `list_options_contracts` endpoint to discover valid tickers rather than constructing them manually.

## Cross-References

- **[api-comparison](api-comparison.md)** - How Polygon compares to other providers
- **[yfinance-guide](yfinance-guide.md)** - Alternative free data source
- **[caching-patterns](caching-patterns.md)** - Caching Polygon data locally
- **[01-financial-instruments/derivatives](../01-financial-instruments/derivatives.md)** - Understanding options data
- **[02-market-analysis/technical-indicators](../02-market-analysis/technical-indicators.md)** - Analysis on Polygon data
