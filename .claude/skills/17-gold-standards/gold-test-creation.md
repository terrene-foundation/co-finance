---
name: gold-test-creation
description: "Test creation standards with 3-tier strategy, fixtures, and real infrastructure requirements. Use when asking 'test standards', 'test creation', 'test guidelines', '3-tier testing', 'test requirements', or 'testing gold standard'."
---

# Gold Standard: Test Creation

Test creation guide with patterns, examples, and best practices for Python finance applications.

> **Skill Metadata**
> Category: `gold-standards`
> Priority: `HIGH`

## Test Creation Pattern

### Basic Test Structure

```python
import pytest
import pandas as pd
import numpy as np

def test_sharpe_ratio_calculation():
    """Test Sharpe ratio with known benchmark values."""
    # Arrange: Create known data
    returns = pd.Series([0.01, -0.005, 0.02, -0.01, 0.015])

    # Act: Calculate
    rf_daily = 0.04 / 252
    excess = returns - rf_daily
    sharpe = np.mean(excess) / np.std(excess, ddof=1) * np.sqrt(252)

    # Assert: Verify
    assert isinstance(sharpe, float)
    assert not np.isnan(sharpe)
```

## 3-Tier Test Creation

### Tier 1: Unit Tests

```python
# tests/unit/test_returns.py
import pytest
import numpy as np

def test_simple_return():
    """(P1 - P0) / P0 = (110 - 100) / 100 = 0.10."""
    result = (110.0 - 100.0) / 100.0
    assert result == pytest.approx(0.10, abs=1e-10)

def test_log_return():
    """ln(110/100) = 0.09531."""
    result = np.log(110.0 / 100.0)
    assert result == pytest.approx(0.09531, abs=1e-4)

def test_annualized_return():
    """(1 + 0.0004)^252 - 1 ~ 10.63%."""
    daily = 0.0004
    annualized = (1 + daily) ** 252 - 1
    assert annualized == pytest.approx(0.1063, abs=1e-3)
```

### Tier 2: Integration Tests (NO MOCKING)

```python
# tests/integration/test_data_pipeline.py
import pytest
import pandas as pd

def test_csv_load_and_calculate(tmp_path):
    """Test CSV loading and returns calculation - NO MOCKING."""
    csv_path = tmp_path / "prices.csv"
    df = pd.DataFrame({
        "date": pd.date_range("2024-01-02", periods=5, freq="B"),
        "close": [186.0, 185.5, 185.0, 188.0, 189.5],
    })
    df.to_csv(csv_path, index=False)

    loaded = pd.read_csv(csv_path, parse_dates=["date"])
    returns = loaded["close"].pct_change().dropna()

    assert len(returns) == 4
    assert not returns.isna().any()
```

### Tier 3: E2E Tests

```python
# tests/e2e/test_full_pipeline.py
import pytest
import sqlite3
import pandas as pd

@pytest.mark.e2e
def test_complete_analysis_pipeline(tmp_path):
    """Test complete pipeline end-to-end."""
    # Create test data
    csv_path = tmp_path / "AAPL.csv"
    create_sample_data(csv_path)

    # Run full analysis
    metrics = run_full_analysis(str(csv_path))

    # Store results in real database
    db_path = tmp_path / "results.db"
    store_results(str(db_path), metrics)

    # Verify from database
    conn = sqlite3.connect(str(db_path))
    stored = pd.read_sql("SELECT * FROM results", conn)
    assert len(stored) == 1
    assert stored.iloc[0]["sharpe_ratio"] is not None
    conn.close()
```

## Test Fixtures

### Data Fixtures

```python
# tests/conftest.py
import pytest
import pandas as pd
import numpy as np

@pytest.fixture
def sample_prices():
    """Known price series for reproducible tests."""
    return pd.Series(
        [100.0, 102.0, 101.0, 104.0, 103.0, 106.0, 105.0, 108.0],
        index=pd.date_range("2024-01-02", periods=8, freq="B"),
        name="close",
    )

@pytest.fixture
def sample_returns(sample_prices):
    """Daily returns from sample prices."""
    return sample_prices.pct_change().dropna()

@pytest.fixture
def sample_csv(tmp_path):
    """Create a real CSV file with known OHLCV data."""
    csv_path = tmp_path / "test_prices.csv"
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
```

## Parametrized Testing

### Testing Multiple Scenarios

```python
@pytest.mark.parametrize("start,end,expected", [
    (100.0, 110.0, 0.10),
    (100.0, 90.0, -0.10),
    (100.0, 200.0, 1.00),
    (100.0, 50.0, -0.50),
    (100.0, 100.0, 0.00),
])
def test_simple_return_parametrized(start, end, expected):
    """Parametrized simple return tests."""
    result = (end - start) / start
    assert result == pytest.approx(expected, abs=1e-10)
```

## Error Testing

### Testing Error Handling

```python
import pytest

def test_insufficient_data_raises_error():
    """Test that too few observations raises ValueError."""
    prices = pd.Series([100.0])  # Only 1 observation

    with pytest.raises(ValueError, match="at least 2"):
        calculate_returns(prices)

def test_nan_prices_raises_error():
    """Test that NaN prices are rejected."""
    prices = pd.Series([100.0, np.nan, 102.0])

    with pytest.raises(ValueError, match="NaN"):
        validate_prices(prices)
```

## Test Organization Standards

### File Naming

```
tests/
  unit/
    test_returns.py
    test_risk_metrics.py
    test_monetary.py
  integration/
    test_csv_pipeline.py
    test_database.py
  e2e/
    test_full_analysis.py
```

### Test Naming

```python
# GOOD: Descriptive test names
def test_sharpe_ratio_with_positive_returns_is_positive():
    pass

def test_csv_load_with_missing_columns_raises_error():
    pass

# BAD: Generic test names
def test_calc():
    pass

def test_it():
    pass
```

## Test Standards Checklist

- [ ] Test organized in correct tier (unit/, integration/, e2e/)
- [ ] NO MOCKING in integration/e2e tests
- [ ] Clear, descriptive test name
- [ ] Proper fixtures for test isolation
- [ ] Error cases tested
- [ ] Edge cases covered
- [ ] Parametrized for multiple scenarios (where applicable)
- [ ] `pytest.approx` used for floating-point comparison
- [ ] Proper pytest markers (@pytest.mark.e2e)
- [ ] Benchmark values cited in docstrings

## Related Patterns

- **Testing best practices**: [`testing-best-practices`](../../07-development-guides/testing-best-practices.md)
- **Gold testing standard**: [`gold-testing`](gold-testing.md)

<!-- Trigger Keywords: test standards, test creation, test guidelines, 3-tier testing, test requirements, testing gold standard -->
