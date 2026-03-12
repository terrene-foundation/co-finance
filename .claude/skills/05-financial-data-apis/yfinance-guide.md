---
name: yfinance-guide
description: "Complete yfinance usage guide covering historical data, fundamentals, options chains, earnings, dividends, multiple tickers, error handling, and rate limiting. Use when asking about 'yfinance', 'Yahoo Finance', 'yf.download', 'yf.Ticker', 'historical data', 'stock data Python', 'options chain', 'earnings data', 'dividend history', 'financial statements', 'yfinance error', or 'yfinance rate limit'."
---

# yfinance Complete Guide

Comprehensive reference for using yfinance to retrieve financial data in Python.

## Installation and Setup

```python
# pip install yfinance
import yfinance as yf
import pandas as pd
```

No API key is required. yfinance scrapes data from Yahoo Finance.

## Historical Price Data

### Single Ticker

```python
# Method 1: Using yf.download (recommended for price data)
data = yf.download("AAPL", start="2023-01-01", end="2024-01-01", auto_adjust=True)

# Method 2: Using period instead of dates
data = yf.download("AAPL", period="1y", auto_adjust=True)

# Method 3: Using Ticker object
ticker = yf.Ticker("AAPL")
data = ticker.history(period="1y")

# Available periods: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
# Available intervals: 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo

print(data.columns.tolist())
# ['Open', 'High', 'Low', 'Close', 'Volume'] (with auto_adjust=True)
# ['Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume'] (with auto_adjust=False)
```

### Multiple Tickers

```python
tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "META"]

# Download all at once (more efficient than individual calls)
data = yf.download(tickers, period="1y", auto_adjust=True)

# Access specific columns
close_prices = data["Close"]
volumes = data["Volume"]

# Access specific ticker
aapl_close = data["Close"]["AAPL"]

# Note: with multiple tickers, columns are MultiIndex: (field, ticker)
print(data.columns[:5])
```

### Intraday Data

```python
# Intraday data (limited history depending on interval)
# 1m: last 7 days
# 5m, 15m, 30m: last 60 days
# 1h: last 730 days

intraday = yf.download("AAPL", period="5d", interval="5m", auto_adjust=True)
print(f"Intraday data shape: {intraday.shape}")
print(f"Date range: {intraday.index[0]} to {intraday.index[-1]}")
```

## Fundamental Data

### Company Information

```python
ticker = yf.Ticker("AAPL")
info = ticker.info

# Key fields
fields = [
    "longName", "sector", "industry", "country", "website",
    "marketCap", "enterpriseValue", "trailingPE", "forwardPE",
    "priceToBook", "priceToSalesTrailing12Months",
    "dividendRate", "dividendYield", "payoutRatio",
    "returnOnEquity", "returnOnAssets", "profitMargins",
    "revenueGrowth", "earningsGrowth",
    "totalRevenue", "totalDebt", "totalCash",
    "freeCashflow", "operatingCashflow",
    "currentRatio", "quickRatio", "debtToEquity",
    "beta", "fiftyTwoWeekHigh", "fiftyTwoWeekLow",
]

for field in fields:
    val = info.get(field, "N/A")
    if isinstance(val, (int, float)) and val > 1e6:
        print(f"  {field}: ${val/1e9:.2f}B" if val > 1e9 else f"  {field}: ${val/1e6:.2f}M")
    elif isinstance(val, float) and val < 100:
        print(f"  {field}: {val:.4f}")
    else:
        print(f"  {field}: {val}")
```

### Financial Statements

```python
ticker = yf.Ticker("AAPL")

# Income Statement (annual and quarterly)
income_stmt = ticker.income_stmt          # Annual
quarterly_income = ticker.quarterly_income_stmt  # Quarterly

print("Annual Income Statement:")
print(income_stmt.to_string())

# Balance Sheet
balance_sheet = ticker.balance_sheet
quarterly_bs = ticker.quarterly_balance_sheet

# Cash Flow Statement
cashflow = ticker.cashflow
quarterly_cf = ticker.quarterly_cashflow

# Key income statement items
if not income_stmt.empty:
    latest = income_stmt.iloc[:, 0]  # Most recent year
    print(f"\nTotal Revenue: ${latest.get('Total Revenue', 0)/1e9:.1f}B")
    print(f"Net Income: ${latest.get('Net Income', 0)/1e9:.1f}B")
    print(f"EBITDA: ${latest.get('EBITDA', 0)/1e9:.1f}B")
```

### Earnings

```python
ticker = yf.Ticker("AAPL")

# Earnings history
earnings = ticker.earnings_history
if earnings is not None and not earnings.empty:
    print("Recent Earnings:")
    print(earnings[["epsEstimate", "epsActual", "epsDifference", "surprisePercent"]].tail())

# Earnings dates (upcoming and past)
earnings_dates = ticker.earnings_dates
if earnings_dates is not None:
    print("\nEarnings Dates:")
    print(earnings_dates.head())

# Analyst recommendations
recs = ticker.recommendations
if recs is not None and not recs.empty:
    print("\nAnalyst Recommendations:")
    print(recs.tail(5))
```

## Dividends and Splits

```python
ticker = yf.Ticker("JNJ")

# Dividend history
dividends = ticker.dividends
print(f"Dividend payments: {len(dividends)}")
print(f"Latest dividend: ${dividends.iloc[-1]:.2f}")
print(f"Annual dividend (last 4): ${dividends.tail(4).sum():.2f}")

# Stock splits
splits = ticker.splits
if not splits.empty:
    print(f"\nStock Splits:")
    print(splits.to_string())

# Actions (combined dividends and splits)
actions = ticker.actions
print(f"\nRecent Corporate Actions:")
print(actions.tail(5))
```

## Options Data

```python
ticker = yf.Ticker("AAPL")

# Available expiration dates
expirations = ticker.options
print(f"Available expirations: {len(expirations)}")
print(f"Next 5: {expirations[:5]}")

# Get options chain for a specific expiration
if expirations:
    chain = ticker.option_chain(expirations[0])

    calls = chain.calls
    puts = chain.puts

    print(f"\nCalls for {expirations[0]}:")
    print(calls[["strike", "lastPrice", "bid", "ask", "volume",
                  "openInterest", "impliedVolatility"]].head(10))

    print(f"\nPuts for {expirations[0]}:")
    print(puts[["strike", "lastPrice", "bid", "ask", "volume",
                 "openInterest", "impliedVolatility"]].head(10))
```

### Options Chain Analysis

```python
def options_summary(ticker_symbol: str, expiration_idx: int = 0) -> dict:
    """Summarize options chain data.

    Args:
        ticker_symbol: Stock ticker
        expiration_idx: Index of expiration date to use

    Returns:
        Options chain summary
    """
    ticker = yf.Ticker(ticker_symbol)
    expirations = ticker.options

    if not expirations:
        return {"error": "No options available"}

    exp = expirations[expiration_idx]
    chain = ticker.option_chain(exp)
    spot = ticker.info.get("currentPrice", 0)

    # Find ATM strike
    atm_strike = chain.calls.iloc[
        (chain.calls["strike"] - spot).abs().argsort()[:1]
    ]["strike"].values[0]

    # ATM implied volatility
    atm_call = chain.calls[chain.calls["strike"] == atm_strike].iloc[0]
    atm_put = chain.puts[chain.puts["strike"] == atm_strike].iloc[0]

    # Put-call ratio
    total_call_oi = chain.calls["openInterest"].sum()
    total_put_oi = chain.puts["openInterest"].sum()
    pc_ratio = total_put_oi / total_call_oi if total_call_oi > 0 else 0

    return {
        "ticker": ticker_symbol,
        "expiration": exp,
        "spot_price": spot,
        "atm_strike": atm_strike,
        "atm_call_iv": atm_call["impliedVolatility"],
        "atm_put_iv": atm_put["impliedVolatility"],
        "put_call_ratio": pc_ratio,
        "total_call_volume": chain.calls["volume"].sum(),
        "total_put_volume": chain.puts["volume"].sum(),
        "n_strikes": len(chain.calls),
    }

summary = options_summary("AAPL")
for k, v in summary.items():
    if isinstance(v, float):
        print(f"{k}: {v:.4f}")
    else:
        print(f"{k}: {v}")
```

## Error Handling

```python
import time
import logging

logger = logging.getLogger(__name__)

def safe_download(tickers, **kwargs) -> pd.DataFrame:
    """Download data with retry logic and error handling.

    Args:
        tickers: Ticker(s) to download
        **kwargs: Arguments passed to yf.download

    Returns:
        Downloaded DataFrame (may be empty on failure)
    """
    max_retries = 3
    retry_delay = 5  # seconds

    for attempt in range(max_retries):
        try:
            data = yf.download(tickers, **kwargs, progress=False)

            if data.empty:
                logger.warning(f"Empty data returned for {tickers}")
                return pd.DataFrame()

            # Check for all-NaN columns (bad tickers)
            if isinstance(tickers, list):
                for t in tickers:
                    if data["Close"][t].isna().all():
                        logger.warning(f"All NaN data for {t}")

            return data

        except Exception as e:
            logger.error(f"Attempt {attempt + 1}/{max_retries} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay * (attempt + 1))

    logger.error(f"All {max_retries} attempts failed for {tickers}")
    return pd.DataFrame()

def safe_ticker_info(ticker_symbol: str) -> dict:
    """Get ticker info with error handling.

    Args:
        ticker_symbol: Ticker symbol

    Returns:
        Info dict (may be empty on failure)
    """
    try:
        ticker = yf.Ticker(ticker_symbol)
        info = ticker.info

        # Verify data is valid (not an error page)
        if not info or info.get("regularMarketPrice") is None:
            if info.get("quoteType") is None:
                logger.warning(f"Invalid ticker or no data: {ticker_symbol}")
                return {}

        return info
    except Exception as e:
        logger.error(f"Error fetching info for {ticker_symbol}: {e}")
        return {}
```

## Rate Limiting Best Practices

```python
import time

class YFinanceThrottle:
    """Simple rate limiter for yfinance calls."""

    def __init__(self, calls_per_second: float = 2.0):
        self.min_interval = 1.0 / calls_per_second
        self.last_call = 0

    def wait(self):
        """Wait if needed to stay within rate limits."""
        elapsed = time.time() - self.last_call
        if elapsed < self.min_interval:
            time.sleep(self.min_interval - elapsed)
        self.last_call = time.time()

throttle = YFinanceThrottle(calls_per_second=2.0)

def throttled_download(tickers: list, **kwargs) -> dict:
    """Download data for multiple tickers with throttling.

    Downloads in batches to avoid rate limiting.
    """
    batch_size = 10  # yfinance handles multiple tickers efficiently
    results = {}

    for i in range(0, len(tickers), batch_size):
        batch = tickers[i : i + batch_size]
        throttle.wait()

        data = safe_download(batch, **kwargs)
        if not data.empty:
            results[tuple(batch)] = data

    return results
```

## Common Pitfalls

1. **Using `auto_adjust=False` for calculations**: Always use `auto_adjust=True` for return calculations. The unadjusted "Close" column does not account for splits and dividends.

2. **Assuming `info` dictionary keys always exist**: Many fields in `.info` are optional and may return `None`. Always use `.get()` with defaults.

3. **Not handling timezone-aware vs naive datetimes**: yfinance returns timezone-aware DatetimeIndex. Mixing with timezone-naive dates causes errors.

4. **Downloading too frequently**: yfinance has undocumented rate limits. Cache data locally and only re-download when stale.

5. **Trusting `info` values blindly**: The `info` dictionary can contain cached or stale values. For critical applications, verify against the exchange or a paid provider.

6. **Not checking for empty DataFrames**: `yf.download()` returns an empty DataFrame for invalid tickers without raising an error. Always check `data.empty` before processing.

## Cross-References

- **[api-comparison](api-comparison.md)** - How yfinance compares to other providers
- **[caching-patterns](caching-patterns.md)** - Caching yfinance data locally
- **[01-financial-instruments/equities](../01-financial-instruments/equities.md)** - Equity data available through yfinance
- **[02-market-analysis/technical-indicators](../02-market-analysis/technical-indicators.md)** - Technical analysis on yfinance data
- **[02-market-analysis/fundamental-ratios](../02-market-analysis/fundamental-ratios.md)** - Fundamental ratios from yfinance
