# Financial Data Manipulation with pandas

pandas is the foundational library for financial data analysis in Python. Its time series capabilities, flexible indexing, and vectorized operations make it the standard tool for working with market data.

## DatetimeIndex and Time Series Fundamentals

Financial data is inherently time-indexed. Always use `DatetimeIndex` for market data to unlock pandas' time series methods.

```python
import pandas as pd
import numpy as np

# Create a DatetimeIndex from date strings
dates = pd.to_datetime(["2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05"])
prices = pd.Series([150.0, 152.5, 151.0, 153.0], index=dates, name="AAPL")

# From a CSV (typical market data format)
df = pd.read_csv(
    "prices.csv",
    parse_dates=["Date"],
    index_col="Date"
)

# Ensure the index is sorted (critical for time series operations)
df = df.sort_index()

# Slice by date range
jan_data = df["2024-01"]              # All of January 2024
q1_data = df["2024-01":"2024-03"]     # Q1 2024
recent = df.last("30D")              # Last 30 calendar days
```

### Common Pitfall: Timezone Handling

Market data often comes without timezone information but represents a specific exchange's local time.

```python
# Localize naive timestamps
df.index = df.index.tz_localize("America/New_York")

# Convert between timezones
df.index = df.index.tz_convert("UTC")

# Remove timezone (if needed for merging with naive data)
df.index = df.index.tz_localize(None)
```

## Resampling: Changing Frequency

Convert between time frequencies (daily to weekly, daily to monthly, etc.) using `.resample()`.

```python
# Daily OHLCV data
daily = pd.DataFrame({
    "Open":   [100, 101, 102, 103, 104, 105, 106, 107, 108, 109],
    "High":   [102, 103, 104, 105, 106, 107, 108, 109, 110, 111],
    "Low":    [99,  100, 101, 102, 103, 104, 105, 106, 107, 108],
    "Close":  [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],
    "Volume": [1e6, 1.1e6, 9e5, 1.2e6, 1e6, 8e5, 1.3e6, 1.1e6, 9e5, 1e6],
}, index=pd.bdate_range("2024-01-02", periods=10))

# Daily -> Weekly OHLCV (proper aggregation for each column)
weekly = daily.resample("W").agg({
    "Open": "first",
    "High": "max",
    "Low": "min",
    "Close": "last",
    "Volume": "sum"
})

# Daily -> Monthly
monthly = daily.resample("ME").agg({
    "Open": "first",
    "High": "max",
    "Low": "min",
    "Close": "last",
    "Volume": "sum"
})

# Business-day frequency resampling (skip weekends)
weekly_bday = daily.resample("W-FRI").last()
```

### Common Pitfall: Resampling Direction

Resampling to a _higher_ frequency (e.g., weekly to daily) requires `.resample().asfreq()` or `.resample().ffill()` to handle the new intermediate rows.

```python
# Upsampling: weekly -> daily (forward-fill prices)
daily_from_weekly = weekly["Close"].resample("B").ffill()
```

## Rolling Windows

Rolling calculations are essential for moving averages, volatility, and other technical indicators.

```python
prices = pd.Series(
    [100, 102, 101, 104, 103, 106, 105, 108, 107, 110],
    index=pd.bdate_range("2024-01-02", periods=10),
    name="Close"
)

# Simple Moving Average (SMA)
sma_20 = prices.rolling(window=20).mean()
sma_50 = prices.rolling(window=50).mean()

# Exponential Moving Average (EMA) — gives more weight to recent data
ema_12 = prices.ewm(span=12, adjust=False).mean()
ema_26 = prices.ewm(span=26, adjust=False).mean()

# Rolling volatility (annualized standard deviation of returns)
daily_returns = prices.pct_change()
rolling_vol = daily_returns.rolling(window=21).std() * np.sqrt(252)

# Rolling Sharpe Ratio (assuming risk-free rate of 4%)
risk_free_daily = 0.04 / 252
excess_returns = daily_returns - risk_free_daily
rolling_sharpe = (
    excess_returns.rolling(window=252).mean()
    / excess_returns.rolling(window=252).std()
) * np.sqrt(252)

# Rolling maximum and drawdown
rolling_max = prices.rolling(window=252, min_periods=1).max()
drawdown = (prices - rolling_max) / rolling_max
```

### Common Pitfall: min_periods

By default, `rolling()` returns NaN until the window is full. Use `min_periods` to get partial-window results.

```python
# Start calculating after just 5 observations instead of waiting for 20
sma_early = prices.rolling(window=20, min_periods=5).mean()
```

## Returns Calculation

### Simple (Arithmetic) Returns

```python
# Single-period simple returns
simple_returns = prices.pct_change()

# Cumulative returns from simple returns
cumulative = (1 + simple_returns).cumprod() - 1

# Total return over the full period
total_return = (prices.iloc[-1] / prices.iloc[0]) - 1
```

### Log (Continuously Compounded) Returns

```python
# Log returns — additive across time (useful for statistical analysis)
log_returns = np.log(prices / prices.shift(1))

# Cumulative log return
cumulative_log = log_returns.cumsum()

# Convert log return back to simple return
simple_from_log = np.exp(log_returns) - 1
```

### When to Use Which

| Property                 | Simple Returns  | Log Returns                 |
| ------------------------ | --------------- | --------------------------- |
| Additivity across time   | No              | Yes                         |
| Additivity across assets | Yes             | No                          |
| Portfolio aggregation    | Use simple      | Do not use log              |
| Statistical modeling     | Less convenient | More convenient (symmetric) |
| Multi-period compounding | Multiply (1+r)  | Sum log returns             |

### Annualizing Returns and Volatility

```python
# Annualize daily returns
annual_return = (1 + daily_returns.mean()) ** 252 - 1

# Annualize daily volatility
annual_vol = daily_returns.std() * np.sqrt(252)

# Annualize monthly returns
monthly_returns = prices.resample("ME").last().pct_change()
annual_from_monthly = (1 + monthly_returns.mean()) ** 12 - 1
```

## Handling Missing Data

Financial data frequently has gaps: holidays, halted trading, delisted tickers.

```python
# Detect missing data
print(df.isnull().sum())

# Forward-fill (carry last known price) — most common for prices
df_filled = df.fillna(method="ffill")

# Forward-fill with a limit (don't fill more than 5 days of gaps)
df_filled = df.fillna(method="ffill", limit=5)

# Interpolate (for smoother filling — use cautiously with prices)
df_interp = df.interpolate(method="time")

# Drop rows where all columns are NaN
df_clean = df.dropna(how="all")

# Drop rows where any column is NaN (strict)
df_strict = df.dropna(how="any")

# Reindex to a full business-day calendar to reveal hidden gaps
full_index = pd.bdate_range(df.index.min(), df.index.max())
df_reindexed = df.reindex(full_index)
gaps = df_reindexed[df_reindexed.isnull().any(axis=1)]
```

### Common Pitfall: Filling Before Calculating Returns

Always calculate returns _before_ filling missing data, or you will create artificial zero-return days.

```python
# WRONG: fill then calculate returns (creates false zero returns)
# bad_returns = df.fillna(method="ffill").pct_change()

# CORRECT: calculate returns on raw data, then handle NaNs in returns
returns = df.pct_change()
returns_clean = returns.dropna()
```

## Multi-Index for Multiple Tickers

When working with multiple securities, use MultiIndex or wide-format DataFrames.

```python
# Wide format (columns = tickers) — most common for price data
import yfinance as yf

tickers = ["AAPL", "MSFT", "GOOGL", "AMZN"]
# Each column is a ticker's adjusted close
prices_wide = pd.DataFrame({
    ticker: [100 + i + j for j in range(10)]
    for i, ticker in enumerate(tickers)
}, index=pd.bdate_range("2024-01-02", periods=10))

# Calculate returns for all tickers at once
returns_wide = prices_wide.pct_change()

# Correlation matrix
corr_matrix = returns_wide.corr()

# Covariance matrix (annualized)
cov_matrix = returns_wide.cov() * 252

# Long format (stacked) — useful for groupby operations
prices_long = prices_wide.stack()
prices_long.index.names = ["Date", "Ticker"]

# Per-ticker statistics using groupby
ticker_stats = returns_wide.agg(["mean", "std", "min", "max"]).T
ticker_stats.columns = ["Mean Daily Return", "Std Dev", "Worst Day", "Best Day"]
ticker_stats["Annualized Return"] = (1 + ticker_stats["Mean Daily Return"]) ** 252 - 1
ticker_stats["Annualized Vol"] = ticker_stats["Std Dev"] * np.sqrt(252)
```

## Merging and Joining Market Data

Combining data from different sources (prices, fundamentals, economic indicators).

```python
# Merge two price DataFrames on their date index
prices_a = pd.DataFrame({"AAPL": [150, 152, 151]},
                         index=pd.to_datetime(["2024-01-02", "2024-01-03", "2024-01-04"]))
prices_b = pd.DataFrame({"MSFT": [370, 372, 371]},
                         index=pd.to_datetime(["2024-01-02", "2024-01-03", "2024-01-04"]))

combined = prices_a.join(prices_b, how="outer")

# Merge daily prices with monthly fundamentals
# Use merge_asof to match each daily row to the most recent monthly value
daily_prices = pd.DataFrame({
    "Date": pd.bdate_range("2024-01-02", periods=60),
    "Close": np.random.uniform(140, 160, 60)
})
monthly_pe = pd.DataFrame({
    "Date": pd.to_datetime(["2024-01-31", "2024-02-29", "2024-03-31"]),
    "PE_Ratio": [28.5, 29.1, 27.8]
})

merged = pd.merge_asof(
    daily_prices.sort_values("Date"),
    monthly_pe.sort_values("Date"),
    on="Date",
    direction="backward"  # Use the most recent available PE ratio
)

# Align two series with different trading calendars (e.g., US and UK markets)
us_prices = pd.Series([100, 101, 102], index=pd.to_datetime(["2024-01-02", "2024-01-03", "2024-01-04"]))
uk_prices = pd.Series([200, 201, 202], index=pd.to_datetime(["2024-01-02", "2024-01-03", "2024-01-04"]))
aligned_us, aligned_uk = us_prices.align(uk_prices, join="inner")
```

## Performance Tips

```python
# Use categorical dtype for ticker columns in long-format data
df["Ticker"] = df["Ticker"].astype("category")

# Use float32 instead of float64 when precision is not critical
df = df.astype("float32")

# Avoid iterating rows — use vectorized operations
# SLOW:  for i in range(len(df)): df.iloc[i]["Return"] = ...
# FAST:  df["Return"] = df["Close"].pct_change()

# For very large datasets, consider chunked reading
chunks = pd.read_csv("huge_file.csv", chunksize=100_000)
result = pd.concat(chunk.groupby("Ticker")["Close"].mean() for chunk in chunks)
```

## Cross-References

- See **[numpy-financial](numpy-financial.md)** for matrix operations on returns data
- See **[visualization](visualization.md)** for plotting pandas time series
- See **[05-financial-data-apis](../05-financial-data-apis/SKILL.md)** for fetching data into pandas DataFrames
- See **[02-market-analysis](../02-market-analysis/SKILL.md)** for technical indicators built on rolling windows
