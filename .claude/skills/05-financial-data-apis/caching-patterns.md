---
name: caching-patterns
description: "Data caching patterns for financial data covering SQLite, pickle, parquet, cache invalidation, market hours handling, tiered caching, and rate limit management. Use when asking about 'data caching', 'cache invalidation', 'SQLite cache', 'parquet cache', 'pickle cache', 'market hours', 'data staleness', 'tiered caching', 'rate limit management', 'local cache', 'data pipeline', or 'data freshness'."
---

# Caching Patterns for Financial Data

Reference for implementing efficient local caching strategies for financial market data.

## Why Cache Financial Data

- **Rate limit compliance**: Most APIs limit request frequency. Caching avoids redundant calls.
- **Performance**: Local reads are orders of magnitude faster than API calls.
- **Cost reduction**: Paid APIs charge per request. Caching minimizes spend.
- **Reliability**: Cached data is available even when APIs are down.
- **Reproducibility**: Cached data ensures consistent results across runs.

## Storage Format Comparison

| Format  | Read Speed | Write Speed | File Size | Query Support | Schema            |
| ------- | ---------- | ----------- | --------- | ------------- | ----------------- |
| SQLite  | Fast       | Fast        | Medium    | Full SQL      | Structured        |
| Parquet | Very fast  | Fast        | Small     | Column-based  | Structured        |
| Pickle  | Fast       | Fast        | Large     | None          | Any Python object |
| CSV     | Slow       | Slow        | Large     | None          | Text only         |
| HDF5    | Fast       | Fast        | Medium    | Limited       | Structured        |

## SQLite Cache

Best for structured data with query needs and multi-table relationships.

```python
import sqlite3
import pandas as pd
import json
from datetime import datetime, timedelta
from pathlib import Path

class SQLiteCache:
    """SQLite-based cache for financial data."""

    def __init__(self, db_path: str = "market_data_cache.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        """Create cache tables if they don't exist."""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS price_cache (
                    ticker TEXT,
                    date TEXT,
                    open REAL,
                    high REAL,
                    low REAL,
                    close REAL,
                    volume INTEGER,
                    fetched_at TEXT,
                    PRIMARY KEY (ticker, date)
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS metadata_cache (
                    key TEXT PRIMARY KEY,
                    value TEXT,
                    fetched_at TEXT,
                    ttl_seconds INTEGER
                )
            """)
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_price_ticker
                ON price_cache (ticker, date)
            """)

    def store_prices(self, ticker: str, df: pd.DataFrame):
        """Store price data in cache."""
        with sqlite3.connect(self.db_path) as conn:
            now = datetime.utcnow().isoformat()
            for date, row in df.iterrows():
                conn.execute(
                    """INSERT OR REPLACE INTO price_cache
                       (ticker, date, open, high, low, close, volume, fetched_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                    (ticker, str(date.date()) if hasattr(date, 'date') else str(date),
                     row.get("Open"), row.get("High"), row.get("Low"),
                     row.get("Close"), row.get("Volume"), now),
                )

    def get_prices(self, ticker: str, start_date: str = None,
                    end_date: str = None) -> pd.DataFrame:
        """Retrieve cached price data."""
        query = "SELECT date, open, high, low, close, volume FROM price_cache WHERE ticker = ?"
        params = [ticker]

        if start_date:
            query += " AND date >= ?"
            params.append(start_date)
        if end_date:
            query += " AND date <= ?"
            params.append(end_date)

        query += " ORDER BY date"

        with sqlite3.connect(self.db_path) as conn:
            df = pd.read_sql_query(query, conn, params=params)

        if not df.empty:
            df["date"] = pd.to_datetime(df["date"])
            df.set_index("date", inplace=True)
            df.columns = ["Open", "High", "Low", "Close", "Volume"]

        return df

    def store_metadata(self, key: str, value: dict, ttl_seconds: int = 3600):
        """Store metadata with TTL."""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """INSERT OR REPLACE INTO metadata_cache (key, value, fetched_at, ttl_seconds)
                   VALUES (?, ?, ?, ?)""",
                (key, json.dumps(value), datetime.utcnow().isoformat(), ttl_seconds),
            )

    def get_metadata(self, key: str) -> dict:
        """Retrieve metadata if not expired."""
        with sqlite3.connect(self.db_path) as conn:
            result = conn.execute(
                "SELECT value, fetched_at, ttl_seconds FROM metadata_cache WHERE key = ?",
                (key,),
            ).fetchone()

        if result is None:
            return None

        value, fetched_at, ttl = result
        fetched_time = datetime.fromisoformat(fetched_at)

        if datetime.utcnow() - fetched_time > timedelta(seconds=ttl):
            return None  # Expired

        return json.loads(value)

    def cache_stats(self) -> dict:
        """Get cache statistics."""
        with sqlite3.connect(self.db_path) as conn:
            price_count = conn.execute("SELECT COUNT(*) FROM price_cache").fetchone()[0]
            ticker_count = conn.execute(
                "SELECT COUNT(DISTINCT ticker) FROM price_cache"
            ).fetchone()[0]
            meta_count = conn.execute("SELECT COUNT(*) FROM metadata_cache").fetchone()[0]
            db_size = Path(self.db_path).stat().st_size / 1024 / 1024

        return {
            "price_records": price_count,
            "tickers_cached": ticker_count,
            "metadata_records": meta_count,
            "db_size_mb": f"{db_size:.2f}",
        }
```

## Parquet Cache

Best for large datasets and columnar analysis. Excellent compression.

```python
from pathlib import Path
import pandas as pd
from datetime import datetime, timedelta

class ParquetCache:
    """Parquet-based cache for time series data."""

    def __init__(self, cache_dir: str = ".cache/market_data"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)

    def _file_path(self, ticker: str) -> Path:
        return self.cache_dir / f"{ticker.replace('/', '_')}.parquet"

    def store(self, ticker: str, df: pd.DataFrame):
        """Store DataFrame as parquet file.

        Merges with existing data if present.
        """
        path = self._file_path(ticker)

        if path.exists():
            existing = pd.read_parquet(path)
            df = pd.concat([existing, df])
            df = df[~df.index.duplicated(keep="last")]
            df.sort_index(inplace=True)

        df.to_parquet(path, engine="pyarrow", compression="snappy")

    def get(self, ticker: str, start_date: str = None,
             end_date: str = None) -> pd.DataFrame:
        """Retrieve cached data with optional date filtering."""
        path = self._file_path(ticker)

        if not path.exists():
            return pd.DataFrame()

        df = pd.read_parquet(path)

        if start_date:
            df = df[df.index >= start_date]
        if end_date:
            df = df[df.index <= end_date]

        return df

    def is_stale(self, ticker: str, max_age_hours: float = 24) -> bool:
        """Check if cached data is stale."""
        path = self._file_path(ticker)

        if not path.exists():
            return True

        modified_time = datetime.fromtimestamp(path.stat().st_mtime)
        age = datetime.now() - modified_time

        return age > timedelta(hours=max_age_hours)

    def get_last_date(self, ticker: str) -> str:
        """Get the last date in the cache for a ticker."""
        path = self._file_path(ticker)
        if not path.exists():
            return None

        df = pd.read_parquet(path)
        if df.empty:
            return None

        return str(df.index[-1].date()) if hasattr(df.index[-1], 'date') else str(df.index[-1])

    def clear(self, ticker: str = None):
        """Clear cache for a specific ticker or all tickers."""
        if ticker:
            path = self._file_path(ticker)
            if path.exists():
                path.unlink()
        else:
            for f in self.cache_dir.glob("*.parquet"):
                f.unlink()
```

## Cache-Aware Data Fetcher

Combines caching with API calls for a seamless data retrieval layer.

```python
import yfinance as yf
import logging

logger = logging.getLogger(__name__)

class CachedDataFetcher:
    """Data fetcher with automatic caching and staleness detection."""

    def __init__(self, cache_dir: str = ".cache/market_data"):
        self.cache = ParquetCache(cache_dir)

    def get_prices(self, ticker: str, start_date: str = None,
                    period: str = "5y", force_refresh: bool = False) -> pd.DataFrame:
        """Get price data, using cache when available.

        Args:
            ticker: Stock ticker
            start_date: Start date (overrides period)
            period: yfinance period string
            force_refresh: Bypass cache

        Returns:
            DataFrame with OHLCV data
        """
        # Check cache first
        if not force_refresh and not self._needs_update(ticker):
            cached = self.cache.get(ticker, start_date=start_date)
            if not cached.empty:
                logger.info(f"Cache hit for {ticker} ({len(cached)} records)")
                return cached

        # Fetch from API
        logger.info(f"Fetching {ticker} from API...")
        if start_date:
            df = yf.download(ticker, start=start_date, auto_adjust=True, progress=False)
        else:
            df = yf.download(ticker, period=period, auto_adjust=True, progress=False)

        if not df.empty:
            self.cache.store(ticker, df)
            logger.info(f"Cached {len(df)} records for {ticker}")

        return df

    def _needs_update(self, ticker: str) -> bool:
        """Determine if cached data needs updating."""
        if self.cache.is_stale(ticker, max_age_hours=16):
            return True

        last_date = self.cache.get_last_date(ticker)
        if last_date is None:
            return True

        # Check if market has closed since last cache update
        last = pd.Timestamp(last_date)
        now = pd.Timestamp.now()

        # If it is a weekday and market has closed (after 4 PM ET),
        # and our last data is from before today
        if now.weekday() < 5 and now.hour >= 16 and last.date() < now.date():
            return True

        return False

    def get_multiple(self, tickers: list, **kwargs) -> dict:
        """Fetch multiple tickers with caching."""
        results = {}
        for ticker in tickers:
            results[ticker] = self.get_prices(ticker, **kwargs)
        return results

# Usage
fetcher = CachedDataFetcher()
data = fetcher.get_prices("AAPL", period="1y")
print(f"Got {len(data)} records for AAPL")
```

## Market Hours Awareness

```python
from datetime import datetime, time
import pytz

def is_market_open(exchange: str = "NYSE") -> bool:
    """Check if a stock exchange is currently open.

    Args:
        exchange: Exchange name ('NYSE', 'NASDAQ', 'LSE', 'TSE')

    Returns:
        True if the exchange is currently in regular trading hours
    """
    exchange_hours = {
        "NYSE":   {"tz": "US/Eastern", "open": time(9, 30), "close": time(16, 0)},
        "NASDAQ": {"tz": "US/Eastern", "open": time(9, 30), "close": time(16, 0)},
        "LSE":    {"tz": "Europe/London", "open": time(8, 0), "close": time(16, 30)},
        "TSE":    {"tz": "Asia/Tokyo", "open": time(9, 0), "close": time(15, 0)},
    }

    if exchange not in exchange_hours:
        return False

    config = exchange_hours[exchange]
    tz = pytz.timezone(config["tz"])
    now = datetime.now(tz)

    # Weekend check
    if now.weekday() >= 5:
        return False

    current_time = now.time()
    return config["open"] <= current_time <= config["close"]

def cache_ttl_for_market(exchange: str = "NYSE") -> int:
    """Calculate appropriate cache TTL based on market hours.

    Returns shorter TTL during market hours, longer after close.
    """
    if is_market_open(exchange):
        return 60  # 1 minute during market hours
    else:
        return 3600 * 12  # 12 hours when market is closed
```

## Tiered Caching

```python
class TieredCache:
    """Multi-level cache: memory -> disk -> API.

    Level 1 (memory): Fastest, limited size, session-scoped
    Level 2 (disk): Fast, large capacity, persistent
    Level 3 (API): Slow, authoritative, rate-limited
    """

    def __init__(self, cache_dir: str = ".cache/market_data",
                 max_memory_items: int = 100):
        self.memory = {}  # Level 1
        self.disk = ParquetCache(cache_dir)  # Level 2
        self.max_memory = max_memory_items

    def get(self, ticker: str, **kwargs) -> pd.DataFrame:
        """Get data from the fastest available cache level."""
        cache_key = f"{ticker}_{kwargs.get('start_date', '')}_{kwargs.get('period', '')}"

        # Level 1: Memory
        if cache_key in self.memory:
            logger.debug(f"L1 cache hit: {ticker}")
            return self.memory[cache_key]

        # Level 2: Disk
        disk_data = self.disk.get(ticker, start_date=kwargs.get("start_date"))
        if not disk_data.empty and not self.disk.is_stale(ticker):
            logger.debug(f"L2 cache hit: {ticker}")
            self._store_memory(cache_key, disk_data)
            return disk_data

        # Level 3: API
        logger.debug(f"L3 API fetch: {ticker}")
        api_data = self._fetch_from_api(ticker, **kwargs)
        if not api_data.empty:
            self.disk.store(ticker, api_data)
            self._store_memory(cache_key, api_data)
        return api_data

    def _store_memory(self, key: str, data: pd.DataFrame):
        """Store in memory cache with eviction."""
        if len(self.memory) >= self.max_memory:
            # Evict oldest entry
            oldest = next(iter(self.memory))
            del self.memory[oldest]
        self.memory[key] = data

    def _fetch_from_api(self, ticker: str, **kwargs) -> pd.DataFrame:
        """Fetch from the data API."""
        return yf.download(
            ticker,
            period=kwargs.get("period", "1y"),
            start=kwargs.get("start_date"),
            auto_adjust=True,
            progress=False,
        )

    def invalidate(self, ticker: str = None):
        """Invalidate cache entries."""
        if ticker:
            keys_to_remove = [k for k in self.memory if k.startswith(ticker)]
            for k in keys_to_remove:
                del self.memory[k]
            self.disk.clear(ticker)
        else:
            self.memory.clear()
            self.disk.clear()
```

## Rate Limit Management

```python
import time
from collections import deque
from threading import Lock

class RateLimiter:
    """Token bucket rate limiter for API calls.

    Args:
        max_calls: Maximum calls allowed in the window
        window_seconds: Time window for the rate limit
    """

    def __init__(self, max_calls: int = 5, window_seconds: float = 60):
        self.max_calls = max_calls
        self.window = window_seconds
        self.calls = deque()
        self.lock = Lock()

    def wait_if_needed(self):
        """Block until a call is allowed."""
        with self.lock:
            now = time.time()

            # Remove calls outside the window
            while self.calls and self.calls[0] < now - self.window:
                self.calls.popleft()

            if len(self.calls) >= self.max_calls:
                # Wait until the oldest call falls out of the window
                sleep_time = self.calls[0] + self.window - now
                if sleep_time > 0:
                    time.sleep(sleep_time)

            self.calls.append(time.time())

    @property
    def remaining_calls(self) -> int:
        """Number of calls remaining in the current window."""
        now = time.time()
        recent = sum(1 for t in self.calls if t > now - self.window)
        return max(0, self.max_calls - recent)

# Usage with Polygon (5 req/min free tier)
polygon_limiter = RateLimiter(max_calls=5, window_seconds=60)

# Before each API call:
# polygon_limiter.wait_if_needed()
# result = client.get_aggs(...)
```

## Common Pitfalls

1. **Not invalidating cache after corporate actions**: Stock splits, mergers, and ticker changes require cache invalidation. Stale data with incorrect prices will produce wrong calculations.

2. **Caching non-deterministic API responses**: Some API responses include real-time data that changes. Cache only the historical portion and always fetch the latest data point fresh.

3. **Ignoring timezone in cache keys**: "2024-01-15 close price" depends on which timezone's market close you mean. Store and retrieve data with explicit timezone awareness.

4. **Cache corruption on crashes**: Writing to cache files without atomic operations can corrupt data if the process crashes mid-write. Use temporary files and rename for atomic writes.

5. **Unbounded memory cache growth**: In-memory caches without eviction policies will eventually exhaust memory. Always implement a maximum size with LRU or LFU eviction.

6. **Not compressing large datasets**: Parquet with snappy compression can reduce file sizes by 5-10x compared to CSV. Always use compression for disk caches.

## Cross-References

- **[api-comparison](api-comparison.md)** - Understanding provider rate limits
- **[yfinance-guide](yfinance-guide.md)** - yfinance-specific caching needs
- **[polygon-guide](polygon-guide.md)** - Polygon rate limit handling
- **[fred-guide](fred-guide.md)** - FRED data caching (economic data changes infrequently)
- **[02-market-analysis/technical-indicators](../02-market-analysis/technical-indicators.md)** - Using cached data for analysis
