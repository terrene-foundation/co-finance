---
name: template-test-integration
description: "Financial data pipeline integration test template with real file I/O, database roundtrip, and multi-step calculation verification. Use when requesting 'integration test template', 'pipeline test', 'data pipeline test', 'database roundtrip test', or 'integration test example'."
---

# Integration Test Template (Data Pipeline)

Integration test template for financial data pipelines with real file I/O, database operations, and multi-step calculations.

> **Skill Metadata**
> Category: `cross-cutting` (code-generation)
> Priority: `HIGH`

## Complete Integration Test Template

```python
"""Integration tests for financial data pipeline.

Tests validate real file I/O, database operations, and multi-step
calculation pipelines using actual data (no mocking).
"""

import pytest
import pandas as pd
import numpy as np
import sqlite3
import tempfile
from pathlib import Path
from datetime import datetime


class TestCSVPipelineIntegration:
    """Test loading, validating, and processing CSV market data."""

    @pytest.fixture
    def sample_csv(self, tmp_path):
        """Create a real CSV file with known OHLCV data."""
        csv_path = tmp_path / "AAPL.csv"
        df = pd.DataFrame({
            "date": pd.date_range("2024-01-02", periods=5, freq="B"),
            "open": [185.0, 186.5, 184.0, 187.0, 188.5],
            "high": [187.0, 187.5, 186.0, 189.0, 190.0],
            "low": [184.0, 185.0, 183.0, 186.0, 187.5],
            "close": [186.0, 185.5, 185.0, 188.0, 189.5],
            "volume": [1000000, 1200000, 900000, 1100000, 1300000],
        })
        df.to_csv(csv_path, index=False)
        return csv_path

    def test_csv_load_and_validate(self, sample_csv):
        """Load CSV, validate schema, check data quality."""
        df = pd.read_csv(sample_csv, parse_dates=["date"])

        # Schema validation
        required_cols = {"date", "open", "high", "low", "close", "volume"}
        assert required_cols.issubset(set(df.columns))

        # Data quality checks
        assert df["close"].gt(0).all(), "All prices must be positive"
        assert (df["high"] >= df["low"]).all(), "High must be >= Low"
        assert df["volume"].ge(0).all(), "Volume must be non-negative"
        assert df["date"].is_monotonic_increasing, "Dates must be sorted"

    def test_csv_returns_calculation(self, sample_csv):
        """Load CSV and calculate returns end-to-end."""
        df = pd.read_csv(sample_csv, parse_dates=["date"])
        returns = df["close"].pct_change().dropna()

        # Known values: 186->185.5->185->188->189.5
        expected_returns = [
            (185.5 - 186.0) / 186.0,
            (185.0 - 185.5) / 185.5,
            (188.0 - 185.0) / 185.0,
            (189.5 - 188.0) / 188.0,
        ]

        for actual, expected in zip(returns.values, expected_returns):
            assert actual == pytest.approx(expected, abs=1e-6)

    def test_csv_roundtrip_preserves_data(self, tmp_path):
        """Write CSV, read it back, verify data unchanged."""
        original = pd.DataFrame({
            "date": ["2024-01-02", "2024-01-03"],
            "open": [100.25, 101.50],
            "high": [102.00, 103.00],
            "low": [99.50, 100.00],
            "close": [101.00, 102.50],
            "volume": [500000, 600000],
        })

        path = tmp_path / "roundtrip.csv"
        original.to_csv(path, index=False)
        loaded = pd.read_csv(path)

        pd.testing.assert_frame_equal(original, loaded)


class TestDatabaseIntegration:
    """Test SQLite database operations for market data storage."""

    @pytest.fixture
    def db_path(self, tmp_path):
        """Create a temporary SQLite database with schema."""
        path = tmp_path / "market_data.db"
        conn = sqlite3.connect(str(path))
        conn.execute("""
            CREATE TABLE prices (
                date TEXT NOT NULL,
                symbol TEXT NOT NULL,
                open REAL, high REAL, low REAL, close REAL,
                volume INTEGER,
                PRIMARY KEY (date, symbol)
            )
        """)
        conn.commit()
        conn.close()
        return path

    def test_insert_and_query_prices(self, db_path):
        """Insert price data and query it back."""
        conn = sqlite3.connect(str(db_path))

        # Insert
        conn.execute(
            "INSERT INTO prices VALUES (?, ?, ?, ?, ?, ?, ?)",
            ("2024-01-02", "AAPL", 185.0, 187.0, 184.0, 186.0, 1000000),
        )
        conn.commit()

        # Query
        df = pd.read_sql(
            "SELECT * FROM prices WHERE symbol = ?",
            conn, params=("AAPL",),
        )
        conn.close()

        assert len(df) == 1
        assert df.iloc[0]["close"] == 186.0
        assert df.iloc[0]["symbol"] == "AAPL"

    def test_bulk_insert_and_aggregate(self, db_path):
        """Insert multiple rows and run aggregate queries."""
        conn = sqlite3.connect(str(db_path))

        rows = [
            ("2024-01-02", "AAPL", 185.0, 187.0, 184.0, 186.0, 1000000),
            ("2024-01-03", "AAPL", 186.5, 187.5, 185.0, 185.5, 1200000),
            ("2024-01-04", "AAPL", 184.0, 186.0, 183.0, 185.0, 900000),
        ]
        conn.executemany(
            "INSERT INTO prices VALUES (?, ?, ?, ?, ?, ?, ?)", rows
        )
        conn.commit()

        # Aggregate: average close
        result = conn.execute(
            "SELECT AVG(close) FROM prices WHERE symbol = ?", ("AAPL",)
        ).fetchone()
        conn.close()

        avg_close = result[0]
        expected_avg = (186.0 + 185.5 + 185.0) / 3
        assert avg_close == pytest.approx(expected_avg, abs=1e-6)

    def test_parquet_roundtrip(self, tmp_path):
        """Write to Parquet, read back, verify fidelity."""
        df = pd.DataFrame({
            "date": pd.date_range("2024-01-02", periods=3, freq="B"),
            "symbol": ["AAPL"] * 3,
            "close": [186.0, 185.5, 185.0],
            "volume": [1000000, 1200000, 900000],
        })

        path = tmp_path / "prices.parquet"
        df.to_parquet(path, engine="pyarrow", index=False)
        loaded = pd.read_parquet(path)

        pd.testing.assert_frame_equal(df, loaded)


class TestMultiStepCalculation:
    """Test multi-step financial calculations end-to-end."""

    @pytest.fixture
    def price_series(self):
        """Known price series for reproducible results."""
        return pd.Series(
            [100.0, 102.0, 101.0, 104.0, 103.0, 106.0, 105.0, 108.0],
            index=pd.date_range("2024-01-02", periods=8, freq="B"),
            name="close",
        )

    def test_returns_to_risk_metrics_pipeline(self, price_series):
        """Calculate returns -> volatility -> Sharpe, verify each step."""
        # Step 1: Returns
        returns = price_series.pct_change().dropna()
        assert len(returns) == 7
        assert returns.iloc[0] == pytest.approx(0.02, abs=1e-6)

        # Step 2: Annualized volatility
        daily_vol = returns.std(ddof=1)
        annual_vol = daily_vol * np.sqrt(252)
        assert annual_vol > 0

        # Step 3: Sharpe ratio (rf=4%)
        rf_daily = 0.04 / 252
        excess = returns - rf_daily
        sharpe = np.mean(excess) / np.std(excess, ddof=1) * np.sqrt(252)
        assert isinstance(sharpe, float)
        assert not np.isnan(sharpe)

    def test_portfolio_weights_sum_to_one(self):
        """Equal-weight portfolio construction pipeline."""
        symbols = ["AAPL", "MSFT", "GOOG", "AMZN"]

        # Step 1: Equal weights
        weights = np.array([1.0 / len(symbols)] * len(symbols))
        assert weights.sum() == pytest.approx(1.0, abs=1e-10)

        # Step 2: Simulated returns
        np.random.seed(42)
        returns = pd.DataFrame(
            np.random.normal(0.0005, 0.02, (252, len(symbols))),
            columns=symbols,
        )

        # Step 3: Portfolio return
        portfolio_return = (returns * weights).sum(axis=1)
        assert len(portfolio_return) == 252
        assert not portfolio_return.isna().any()

    def test_cumulative_return_matches_price_ratio(self, price_series):
        """Verify cumulative return equals (final/initial - 1)."""
        returns = price_series.pct_change().dropna()
        cumulative = (1 + returns).prod() - 1

        direct = (price_series.iloc[-1] / price_series.iloc[0]) - 1

        assert cumulative == pytest.approx(direct, abs=1e-10)
```

## Quick Tips

- Use `tmp_path` fixture for temporary files (automatic cleanup)
- Use real SQLite databases for storage tests (lightweight, no Docker needed)
- Verify each step independently in multi-step pipelines
- Use `pd.testing.assert_frame_equal` for DataFrame comparison
- Use `pytest.approx` with explicit tolerance for floating-point comparison
- Known input data makes assertions deterministic

<!-- Trigger Keywords: integration test template, pipeline test, data pipeline test, database roundtrip test, integration test example, financial pipeline test, data validation test, multi-step test -->
