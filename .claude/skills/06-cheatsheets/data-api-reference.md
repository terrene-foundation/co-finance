# Data API Quick Reference

Quick reference for financial data APIs and their Python usage.

## Free Data Sources

### yfinance (Yahoo Finance)

```python
import yfinance as yf

# Price history
ticker = yf.Ticker("AAPL")
hist = ticker.history(period="1y")           # 1 day, 5 days, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
hist = ticker.history(start="2023-01-01", end="2024-01-01")

# Multiple tickers
data = yf.download(["AAPL", "MSFT", "GOOGL"], period="1y")
closes = data['Close']

# Intervals: 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo
intraday = ticker.history(period="5d", interval="1h")

# Fundamentals
info = ticker.info                    # Company info dict
bs = ticker.balance_sheet             # Balance sheet
is_ = ticker.income_stmt              # Income statement
cf = ticker.cashflow                  # Cash flow
divs = ticker.dividends               # Dividend history
splits = ticker.splits                 # Stock splits

# Options
expirations = ticker.options           # Expiration dates
chain = ticker.option_chain("2026-06-19")
calls = chain.calls
puts = chain.puts
```

**Rate limits**: Unofficial API, no guaranteed limits. Use delays between bulk requests.
**Cost**: Free

### FRED (Federal Reserve Economic Data)

```python
import pandas_datareader as pdr

# Key series codes
gdp = pdr.get_data_fred('GDP')                    # Gross Domestic Product
cpi = pdr.get_data_fred('CPIAUCSL')                # Consumer Price Index
unrate = pdr.get_data_fred('UNRATE')               # Unemployment Rate
fedfunds = pdr.get_data_fred('DFF')                # Fed Funds Rate
t10y = pdr.get_data_fred('DGS10')                  # 10-Year Treasury
t2y = pdr.get_data_fred('DGS2')                    # 2-Year Treasury
sp500 = pdr.get_data_fred('SP500')                 # S&P 500
vix = pdr.get_data_fred('VIXCLS')                  # VIX
m2 = pdr.get_data_fred('M2SL')                     # M2 Money Supply
housing = pdr.get_data_fred('CSUSHPINSA')          # Case-Shiller Home Price

# Multiple series
data = pdr.get_data_fred(['GDP', 'UNRATE', 'CPIAUCSL'], start='2020-01-01')

# With FRED API key (higher limits)
import os
from fredapi import Fred
fred = Fred(api_key=os.environ["FRED_API_KEY"])
gdp = fred.get_series('GDP')
```

**Rate limits**: 120 requests/minute with API key
**Cost**: Free (API key from https://fred.stlouisfed.org/docs/api/api_key.html)

## Paid / Freemium Data Sources

### Alpha Vantage

```python
import os
import requests

API_KEY = os.environ["ALPHA_VANTAGE_KEY"]
BASE = "https://www.alphavantage.co/query"

# Daily prices
params = {"function": "TIME_SERIES_DAILY", "symbol": "AAPL", "apikey": API_KEY, "outputsize": "full"}
data = requests.get(BASE, params=params).json()

# Intraday
params = {"function": "TIME_SERIES_INTRADAY", "symbol": "AAPL", "interval": "5min", "apikey": API_KEY}

# Forex
params = {"function": "FX_DAILY", "from_symbol": "EUR", "to_symbol": "USD", "apikey": API_KEY}

# Crypto
params = {"function": "DIGITAL_CURRENCY_DAILY", "symbol": "BTC", "market": "USD", "apikey": API_KEY}

# Fundamentals
params = {"function": "INCOME_STATEMENT", "symbol": "AAPL", "apikey": API_KEY}
params = {"function": "BALANCE_SHEET", "symbol": "AAPL", "apikey": API_KEY}
```

**Rate limits**: 25 requests/day (free), 75-1200/minute (paid)
**Cost**: Free tier available, paid from $49.99/month

### Polygon.io

```python
import os
import requests

API_KEY = os.environ["POLYGON_API_KEY"]

# Aggregates (OHLCV bars)
url = f"https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-01/2024-01-01?apiKey={API_KEY}"
data = requests.get(url).json()

# Real-time quotes
url = f"https://api.polygon.io/v3/quotes/AAPL?apiKey={API_KEY}"

# Options contracts
url = f"https://api.polygon.io/v3/reference/options/contracts?underlying_ticker=AAPL&apiKey={API_KEY}"
```

**Rate limits**: 5 requests/minute (free), unlimited (paid)
**Cost**: Free tier, paid from $29/month

### Tiingo

```python
import os
import requests

API_KEY = os.environ["TIINGO_API_KEY"]
HEADERS = {"Content-Type": "application/json", "Authorization": f"Token {API_KEY}"}

# Daily prices
url = "https://api.tiingo.com/tiingo/daily/AAPL/prices?startDate=2023-01-01"
data = requests.get(url, headers=HEADERS).json()

# IEX real-time
url = "https://api.tiingo.com/iex/?tickers=AAPL"
data = requests.get(url, headers=HEADERS).json()
```

**Rate limits**: 1000 requests/hour (free)
**Cost**: Free tier, paid from $10/month

## Common Data Patterns

### Download and Cache

```python
import os
import pandas as pd
from pathlib import Path

CACHE_DIR = Path("data/cache")
CACHE_DIR.mkdir(parents=True, exist_ok=True)

def get_prices(ticker: str, period: str = "1y") -> pd.DataFrame:
    cache_file = CACHE_DIR / f"{ticker}_{period}.parquet"
    if cache_file.exists():
        return pd.read_parquet(cache_file)

    import yfinance as yf
    df = yf.Ticker(ticker).history(period=period)
    df.to_parquet(cache_file)
    return df
```

### Rate Limiting

```python
import time

def rate_limited_download(tickers: list, delay: float = 0.5):
    results = {}
    for ticker in tickers:
        results[ticker] = yf.Ticker(ticker).history(period="1y")
        time.sleep(delay)
    return results
```

### Error Handling

```python
def safe_download(ticker: str) -> pd.DataFrame | None:
    try:
        df = yf.Ticker(ticker).history(period="1y")
        if df.empty:
            print(f"No data for {ticker}")
            return None
        return df
    except Exception as e:
        print(f"Error downloading {ticker}: {e}")
        return None
```

### Multi-Source Fallback

```python
def get_price_data(ticker: str) -> pd.DataFrame:
    """Try multiple sources with fallback."""
    # Try yfinance first
    try:
        df = yf.Ticker(ticker).history(period="1y")
        if not df.empty:
            return df
    except Exception:
        pass

    # Fallback to Alpha Vantage
    try:
        api_key = os.environ.get("ALPHA_VANTAGE_KEY")
        if api_key:
            # ... Alpha Vantage download
            pass
    except Exception:
        pass

    raise ValueError(f"Could not download data for {ticker}")
```

## API Key Management

```python
# .env file (never commit this)
# ALPHA_VANTAGE_KEY=your_key_here
# FRED_API_KEY=your_key_here
# POLYGON_API_KEY=your_key_here
# TIINGO_API_KEY=your_key_here

# Load in application
from dotenv import load_dotenv
load_dotenv()

api_key = os.environ["ALPHA_VANTAGE_KEY"]  # Raises if missing
api_key = os.environ.get("ALPHA_VANTAGE_KEY")  # Returns None if missing
```

## Data Source Comparison

| Source        | Price    | Real-time | Fundamentals | Options | Crypto | Free Tier   |
| ------------- | -------- | --------- | ------------ | ------- | ------ | ----------- |
| yfinance      | Free     | Delayed   | Yes          | Yes     | Yes    | Unlimited\* |
| FRED          | Free     | N/A       | Economic     | No      | No     | 120/min     |
| Alpha Vantage | Freemium | Paid      | Yes          | No      | Yes    | 25/day      |
| Polygon       | Freemium | Paid      | Yes          | Yes     | Yes    | 5/min       |
| Tiingo        | Freemium | IEX       | No           | No      | Yes    | 1000/hr     |

\*yfinance uses unofficial Yahoo Finance API; availability not guaranteed.
