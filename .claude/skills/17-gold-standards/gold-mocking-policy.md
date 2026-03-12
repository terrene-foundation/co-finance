---
name: gold-mocking-policy
description: "Testing policy requiring real infrastructure, no mocking for Tier 2-3 tests. Use when asking 'mocking policy', 'NO MOCKING', 'real infrastructure', 'test policy', 'mock guidelines', or 'testing standards'."
---

# Gold Standard: NO MOCKING Policy

NO MOCKING policy for integration and E2E tests - use real files, real databases, and real calculations.

> **Skill Metadata**
> Category: `gold-standards`
> Priority: `CRITICAL`

## Core Policy

### NO MOCKING in Tiers 2-3

**Tier 1 (Unit Tests)**: Mocking ALLOWED for external dependencies
**Tier 2 (Integration Tests)**: NO MOCKING - Use real file I/O, real databases
**Tier 3 (E2E Tests)**: NO MOCKING - Use real infrastructure

## Why NO MOCKING?

1. **Mocks hide real integration issues** - File format changes, encoding errors, data type mismatches
2. **Real infrastructure catches actual bugs** - Validates actual behavior, not assumptions
3. **Production-like testing prevents surprises** - Discovers deployment issues early
4. **Data validation** - Tests with real CSV/Parquet/SQLite prove the code works with real data
5. **Better confidence** - Tests prove the code works with real systems

## What to Use Instead

### Tier 1: Unit Tests (Mocking Allowed)

```python
from unittest.mock import patch
import pytest

# ALLOWED in unit tests
@patch('requests.get')
def test_api_fetch_handles_timeout(mock_get):
    """Unit test can mock external API."""
    mock_get.side_effect = requests.Timeout("Connection timed out")
    with pytest.raises(DataFetchError):
        fetch_prices("AAPL")
```

### Tier 2: Integration Tests (NO MOCKING)

```python
import pytest
import pandas as pd

# CORRECT: Use real CSV file I/O
def test_csv_pipeline(tmp_path):
    """Integration test with real file I/O - NO MOCKING."""
    csv_path = tmp_path / "prices.csv"
    df = pd.DataFrame({
        "date": pd.date_range("2024-01-02", periods=5, freq="B"),
        "close": [186.0, 185.5, 185.0, 188.0, 189.5],
        "volume": [1000000, 1200000, 900000, 1100000, 1300000],
    })
    df.to_csv(csv_path, index=False)

    # Test real file loading and calculation
    loaded = pd.read_csv(csv_path, parse_dates=["date"])
    returns = loaded["close"].pct_change().dropna()

    assert len(returns) == 4
    assert returns.iloc[0] == pytest.approx(-0.002688, abs=1e-4)


# WRONG: Mocking in integration tests
# from unittest.mock import patch
# @patch('pandas.read_csv')  # DON'T DO THIS
# def test_csv_pipeline(mock_read):
#     mock_read.return_value = fake_df
```

### Tier 3: E2E Tests (NO MOCKING)

```python
import pytest
import sqlite3
import pandas as pd

# CORRECT: Use real database for E2E
@pytest.mark.e2e
def test_complete_analysis_pipeline(tmp_path):
    """E2E test with real infrastructure - NO MOCKING."""
    # Create real CSV
    csv_path = tmp_path / "AAPL.csv"
    create_sample_data(csv_path)

    # Run full pipeline
    metrics = run_full_analysis(str(csv_path))

    # Store in real SQLite
    db_path = tmp_path / "results.db"
    conn = sqlite3.connect(str(db_path))
    pd.DataFrame([metrics]).to_sql("results", conn, if_exists="replace")

    # Verify from database
    stored = pd.read_sql("SELECT * FROM results", conn)
    assert stored.iloc[0]["sharpe_ratio"] == pytest.approx(
        metrics["sharpe_ratio"], abs=1e-6
    )
    conn.close()
```

## Real Infrastructure Examples

### Real CSV File I/O

```python
def test_with_real_csv(tmp_path):
    """Use real CSV files."""
    csv_path = tmp_path / "test_prices.csv"
    df = pd.DataFrame({
        "date": ["2024-01-02", "2024-01-03", "2024-01-04"],
        "close": [100.0, 102.0, 101.5],
    })
    df.to_csv(csv_path, index=False)

    loaded = pd.read_csv(csv_path, parse_dates=["date"])
    assert len(loaded) == 3
    assert loaded["close"].iloc[0] == 100.0
```

### Real SQLite Database

```python
import sqlite3

def test_with_real_sqlite(tmp_path):
    """Use real SQLite database."""
    db_path = tmp_path / "market_data.db"
    conn = sqlite3.connect(str(db_path))

    conn.execute("""
        CREATE TABLE prices (
            date TEXT, symbol TEXT, close REAL,
            PRIMARY KEY (date, symbol)
        )
    """)
    conn.execute(
        "INSERT INTO prices VALUES (?, ?, ?)",
        ("2024-01-02", "AAPL", 186.0),
    )
    conn.commit()

    df = pd.read_sql("SELECT * FROM prices WHERE symbol = ?", conn, params=("AAPL",))
    assert len(df) == 1
    assert df.iloc[0]["close"] == 186.0
    conn.close()
```

### Real Parquet Files

```python
def test_with_real_parquet(tmp_path):
    """Use real Parquet files."""
    parquet_path = tmp_path / "prices.parquet"
    df = pd.DataFrame({
        "date": pd.date_range("2024-01-02", periods=3, freq="B"),
        "close": [186.0, 185.5, 185.0],
    })
    df.to_parquet(parquet_path, engine="pyarrow")

    loaded = pd.read_parquet(parquet_path)
    pd.testing.assert_frame_equal(df, loaded)
```

## Common Violations and Fixes

### Violation 1: Mocking File I/O

```python
# WRONG: Mocking pandas in integration test
from unittest.mock import patch, Mock

@patch('pandas.read_csv')
def test_load_prices(mock_read):
    mock_read.return_value = pd.DataFrame({"close": [100, 101]})
    # BAD - mocking hides encoding issues, column name issues, etc.

# CORRECT: Use real files
def test_load_prices(tmp_path):
    csv_path = tmp_path / "prices.csv"
    pd.DataFrame({"close": [100, 101]}).to_csv(csv_path, index=False)
    result = load_prices(str(csv_path))
    assert len(result) == 2
```

### Violation 2: Mocking Calculations

```python
# WRONG: Mocking calculation functions
@patch('myproject.risk.sharpe_ratio')
def test_report(mock_sharpe):
    mock_sharpe.return_value = 1.5
    # BAD - not testing real calculation

# CORRECT: Use real calculations
def test_report():
    returns = pd.Series([0.01, -0.005, 0.02, -0.01, 0.015])
    metrics = calculate_risk_metrics(returns)
    assert "sharpe_ratio" in metrics
    assert isinstance(metrics["sharpe_ratio"], float)
```

## Policy Summary

| Test Tier               | Mocking Policy | Infrastructure              | Example                      |
| ----------------------- | -------------- | --------------------------- | ---------------------------- |
| **Tier 1: Unit**        | ALLOWED        | In-memory, mocked externals | Mock API responses           |
| **Tier 2: Integration** | NO MOCKING     | Real files, real SQLite     | Real CSV I/O, real DB        |
| **Tier 3: E2E**         | NO MOCKING     | Real infrastructure         | Full pipeline with real data |

## Related Patterns

- **Testing best practices**: [`testing-best-practices`](../../07-development-guides/testing-best-practices.md)
- **Gold testing standard**: [`gold-testing`](gold-testing.md)

<!-- Trigger Keywords: mocking policy, NO MOCKING, real infrastructure, test policy, mock guidelines, testing standards -->
