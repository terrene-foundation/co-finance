---
name: template-data-pipeline
description: "Market data pipeline template: fetch from API, validate, cache locally, serve to consumers. Use when requesting 'data pipeline template', 'market data pipeline', 'data ingestion template', 'fetch and cache template', or 'data pipeline boilerplate'."
---

# Market Data Pipeline Template

Template for building a market data pipeline: fetch from API, validate, cache to local storage, and serve to analysis code.

> **Skill Metadata**
> Category: `cross-cutting` (code-generation)
> Priority: `MEDIUM`

## Complete Pipeline Template

```python
"""Market Data Pipeline: Fetch -> Validate -> Cache -> Serve"""

import os
import time
import logging
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional, List, Dict, Any

import pandas as pd
import numpy as np
import requests

logger = logging.getLogger(__name__)


class MarketDataPipeline:
    """Pipeline for fetching, validating, caching, and serving market data.

    Usage:
        pipeline = MarketDataPipeline(cache_dir="./data_cache")
        df = pipeline.get_prices("AAPL", start="2024-01-01", end="2024-12-31")
    """

    def __init__(self, cache_dir: str = "./data_cache", cache_ttl_hours: int = 24):
        """Initialize pipeline.

        Args:
            cache_dir: Directory for local cache files
            cache_ttl_hours: Cache time-to-live in hours
        """
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.cache_ttl = timedelta(hours=cache_ttl_hours)
        self.api_key = os.environ.get("MARKET_DATA_API_KEY")

    # --- Fetch Layer ---

    def fetch_prices(self, symbol: str, start: str, end: str,
                     source: str = "csv") -> pd.DataFrame:
        """Fetch price data from source.

        Args:
            symbol: Ticker symbol (e.g., 'AAPL')
            start: Start date 'YYYY-MM-DD'
            end: End date 'YYYY-MM-DD'
            source: Data source ('csv', 'api', 'database')

        Returns:
            DataFrame with columns: date, open, high, low, close, volume
        """
        if source == "csv":
            return self._fetch_from_csv(symbol, start, end)
        elif source == "api":
            return self._fetch_from_api(symbol, start, end)
        elif source == "database":
            return self._fetch_from_database(symbol, start, end)
        else:
            raise ValueError(f"Unknown source: {source}")

    def _fetch_from_csv(self, symbol: str, start: str, end: str) -> pd.DataFrame:
        """Fetch from local CSV file."""
        path = self.cache_dir / f"{symbol}.csv"
        if not path.exists():
            raise FileNotFoundError(f"No CSV file for {symbol} at {path}")

        df = pd.read_csv(path, parse_dates=["date"])
        mask = (df["date"] >= start) & (df["date"] <= end)
        return df.loc[mask].reset_index(drop=True)

    def _fetch_from_api(self, symbol: str, start: str, end: str,
                        max_retries: int = 3) -> pd.DataFrame:
        """Fetch from REST API with retry logic."""
        if not self.api_key:
            raise ValueError("MARKET_DATA_API_KEY environment variable not set")

        url = f"https://api.example.com/v1/prices/{symbol}"
        params = {
            "start": start,
            "end": end,
            "apikey": self.api_key,
        }

        last_error = None
        for attempt in range(max_retries):
            try:
                response = requests.get(url, params=params, timeout=30)
                response.raise_for_status()
                data = response.json()
                return pd.DataFrame(data["prices"])
            except requests.RequestException as e:
                last_error = e
                delay = 2 ** attempt
                logger.warning(
                    "API fetch attempt %d failed for %s: %s. Retrying in %ds.",
                    attempt + 1, symbol, e, delay,
                )
                time.sleep(delay)

        raise ConnectionError(
            f"Failed to fetch {symbol} after {max_retries} attempts: {last_error}"
        )

    def _fetch_from_database(self, symbol: str, start: str, end: str) -> pd.DataFrame:
        """Fetch from SQLite cache database."""
        db_path = self.cache_dir / "market_data.db"
        conn = sqlite3.connect(str(db_path))
        try:
            df = pd.read_sql(
                "SELECT * FROM prices WHERE symbol = ? AND date >= ? AND date <= ? ORDER BY date",
                conn,
                params=(symbol, start, end),
            )
            return df
        finally:
            conn.close()

    # --- Validate Layer ---

    def validate(self, df: pd.DataFrame, symbol: str = "") -> pd.DataFrame:
        """Validate and clean price data.

        Checks:
            - Required columns exist
            - No negative prices
            - Volume is non-negative
            - Dates are sorted
            - High >= Low
            - No extreme daily moves (configurable)

        Args:
            df: Raw price DataFrame
            symbol: Symbol name for error messages

        Returns:
            Validated DataFrame

        Raises:
            ValueError: If critical validation fails
        """
        required_cols = {"date", "open", "high", "low", "close", "volume"}
        missing = required_cols - set(df.columns)
        if missing:
            raise ValueError(f"Missing columns for {symbol}: {missing}")

        if df.empty:
            raise ValueError(f"No data returned for {symbol}")

        # Convert date column
        df["date"] = pd.to_datetime(df["date"])

        # Sort by date
        df = df.sort_values("date").reset_index(drop=True)

        # Check for negative prices
        price_cols = ["open", "high", "low", "close"]
        for col in price_cols:
            neg_count = (df[col] < 0).sum()
            if neg_count > 0:
                raise ValueError(
                    f"{symbol}: {neg_count} negative values in {col}"
                )

        # Check high >= low
        violations = df["high"] < df["low"]
        if violations.any():
            logger.warning(
                "%s: %d rows where high < low, swapping values.",
                symbol, violations.sum(),
            )
            mask = df["high"] < df["low"]
            df.loc[mask, ["high", "low"]] = df.loc[mask, ["low", "high"]].values

        # Check for extreme moves (> 50% in one day)
        returns = df["close"].pct_change().abs()
        extreme = returns > 0.50
        if extreme.any():
            logger.warning(
                "%s: %d extreme daily moves (>50%%) detected. "
                "Verify for stock splits or data errors.",
                symbol, extreme.sum(),
            )

        # Drop duplicates
        df = df.drop_duplicates(subset=["date"], keep="last")

        # Volume must be non-negative
        df["volume"] = df["volume"].clip(lower=0)

        return df

    # --- Cache Layer ---

    def cache_to_sqlite(self, df: pd.DataFrame, symbol: str) -> None:
        """Cache validated data to SQLite.

        Args:
            df: Validated DataFrame
            symbol: Ticker symbol
        """
        db_path = self.cache_dir / "market_data.db"
        conn = sqlite3.connect(str(db_path))
        try:
            df_to_store = df.copy()
            df_to_store["symbol"] = symbol
            df_to_store["cached_at"] = datetime.utcnow().isoformat()
            df_to_store.to_sql("prices", conn, if_exists="append", index=False)
            logger.info("Cached %d rows for %s", len(df), symbol)
        finally:
            conn.close()

    def cache_to_parquet(self, df: pd.DataFrame, symbol: str) -> Path:
        """Cache validated data to Parquet file.

        Args:
            df: Validated DataFrame
            symbol: Ticker symbol

        Returns:
            Path to parquet file
        """
        path = self.cache_dir / f"{symbol}.parquet"
        df.to_parquet(path, engine="pyarrow", index=False)
        logger.info("Cached %d rows for %s to %s", len(df), symbol, path)
        return path

    def is_cache_fresh(self, symbol: str) -> bool:
        """Check if cached data is still fresh."""
        parquet_path = self.cache_dir / f"{symbol}.parquet"
        if not parquet_path.exists():
            return False
        mod_time = datetime.fromtimestamp(parquet_path.stat().st_mtime)
        return datetime.now() - mod_time < self.cache_ttl

    # --- Serve Layer ---

    def get_prices(self, symbol: str, start: str, end: str,
                   source: str = "csv", use_cache: bool = True) -> pd.DataFrame:
        """Main entry point: get validated price data, using cache if available.

        Args:
            symbol: Ticker symbol
            start: Start date 'YYYY-MM-DD'
            end: End date 'YYYY-MM-DD'
            source: Data source if cache miss
            use_cache: Whether to use cached data

        Returns:
            Validated DataFrame with OHLCV data
        """
        # Check cache first
        if use_cache and self.is_cache_fresh(symbol):
            logger.info("Cache hit for %s", symbol)
            df = pd.read_parquet(self.cache_dir / f"{symbol}.parquet")
            mask = (df["date"] >= start) & (df["date"] <= end)
            return df.loc[mask].reset_index(drop=True)

        # Fetch fresh data
        logger.info("Fetching fresh data for %s from %s", symbol, source)
        df = self.fetch_prices(symbol, start, end, source=source)

        # Validate
        df = self.validate(df, symbol=symbol)

        # Cache for next time
        if use_cache:
            self.cache_to_parquet(df, symbol)

        return df

    def get_returns(self, symbol: str, start: str, end: str,
                    **kwargs) -> pd.Series:
        """Get daily returns for a symbol.

        Returns:
            Series of daily simple returns indexed by date
        """
        df = self.get_prices(symbol, start, end, **kwargs)
        returns = df.set_index("date")["close"].pct_change().dropna()
        returns.name = symbol
        return returns


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    pipeline = MarketDataPipeline(cache_dir="./data_cache")

    # Example usage (requires data file or API key)
    try:
        df = pipeline.get_prices("AAPL", "2024-01-01", "2024-12-31", source="csv")
        print(f"Loaded {len(df)} rows for AAPL")
        print(df.head())
    except FileNotFoundError:
        print("No data file found. Create AAPL.csv in ./data_cache/ or use API source.")
```

## Quick Tips

- Always validate data before using it in calculations
- Cache aggressively to avoid unnecessary API calls
- Use parquet for fast analytical reads, SQLite for queryability
- Log warnings for data quality issues instead of silently fixing
- Set API keys via environment variables, never hardcode

<!-- Trigger Keywords: data pipeline template, market data pipeline, data ingestion template, fetch and cache template, data pipeline boilerplate, ETL template, market data ETL -->
