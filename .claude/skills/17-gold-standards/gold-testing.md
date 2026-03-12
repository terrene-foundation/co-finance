---
name: gold-testing
description: "Gold standard for testing Python finance applications. Use when asking 'testing standard', 'testing best practices', or 'how to test'."
---

# Gold Standard: Testing

> **Skill Metadata**
> Category: `gold-standards`
> Priority: `HIGH`

## Testing Principles

### 1. Test-First Development

```python
import pytest
import pandas as pd
import numpy as np

# Write test FIRST
def test_annualized_return():
    """(1 + 0.0004)^252 - 1 ~ 10.63%."""
    daily = 0.0004
    result = annualize_return(daily, periods=252)
    assert result == pytest.approx(0.1063, abs=1e-3)

# Then implement
def annualize_return(daily_return: float, periods: int = 252) -> float:
    return (1 + daily_return) ** periods - 1
```

### 2. 3-Tier Testing Strategy

```python
# Tier 1: Unit (fast, in-memory, pure calculations)
def test_simple_return():
    """(110 - 100) / 100 = 0.10."""
    assert (110.0 - 100.0) / 100.0 == pytest.approx(0.10)

# Tier 2: Integration (real file I/O, real database - NO MOCKING)
def test_csv_pipeline(tmp_path):
    """Test with real CSV file."""
    csv_path = tmp_path / "prices.csv"
    pd.DataFrame({"close": [100, 102, 101]}).to_csv(csv_path, index=False)
    loaded = pd.read_csv(csv_path)
    assert len(loaded) == 3

# Tier 3: E2E (full pipeline with real infrastructure)
@pytest.mark.e2e
def test_full_analysis(tmp_path):
    """Test complete analysis pipeline."""
    create_test_data(tmp_path / "data.csv")
    result = run_full_analysis(str(tmp_path / "data.csv"))
    assert result["sharpe_ratio"] is not None
```

### 3. NO MOCKING (Tiers 2-3)

```python
# GOOD: Real file I/O in integration tests
def test_load_prices(tmp_path):
    """Use real CSV file."""
    csv_path = tmp_path / "prices.csv"
    df = pd.DataFrame({"date": ["2024-01-02"], "close": [186.0]})
    df.to_csv(csv_path, index=False)

    loaded = pd.read_csv(csv_path, parse_dates=["date"])
    assert loaded.iloc[0]["close"] == 186.0

# BAD: Mocking in integration tests
# @patch("pandas.read_csv")  # DON'T DO THIS
# def test_load_prices(mock_read):
#     mock_read.return_value = fake_df
```

### 4. Clear Test Names

```python
# GOOD: Descriptive names
def test_sharpe_ratio_with_zero_volatility_returns_none():
    pass

def test_csv_load_with_missing_date_column_raises_error():
    pass

# BAD: Generic names
def test_calc():
    pass

def test_data():
    pass
```

### 5. Test Isolation

```python
import pytest

@pytest.fixture
def sample_returns():
    """Fresh return series for each test."""
    return pd.Series([0.01, -0.005, 0.02, -0.01, 0.015])

def test_mean_return(sample_returns):
    """Isolated test with fixture."""
    assert sample_returns.mean() == pytest.approx(0.006, abs=1e-4)

def test_return_count(sample_returns):
    """Another isolated test."""
    assert len(sample_returns) == 5
```

### 6. Benchmark-Based Testing

```python
def test_npv_against_textbook():
    """NPV at 10%: -1000, 300, 400, 400, 200 = 78.82 (CFA Level I)."""
    import numpy_financial as npf
    cashflows = [-1000, 300, 400, 400, 200]
    result = npf.npv(0.10, cashflows)
    assert result == pytest.approx(78.82, abs=0.01)

def test_irr_against_textbook():
    """IRR of [-1000, 400, 400, 400] ~ 9.70% (Hull Ch.6)."""
    import numpy_financial as npf
    result = npf.irr([-1000, 400, 400, 400])
    assert result == pytest.approx(0.0970, abs=0.001)
```

## Testing Checklist

- [ ] Test written before implementation (TDD)
- [ ] All 3 tiers covered (unit, integration, E2E)
- [ ] NO MOCKING in Tiers 2-3 (use real files, real databases)
- [ ] Clear, descriptive test names
- [ ] Test isolation with fixtures
- [ ] `pytest.approx` for floating-point comparison
- [ ] 80%+ code coverage
- [ ] Error cases tested
- [ ] Edge cases tested
- [ ] Benchmark values cited (CFA, Hull, etc.)
- [ ] Tests organized in correct tier (unit/, integration/, e2e/)

## Related Patterns

- **Test organization**: [`testing-best-practices`](../../07-development-guides/testing-best-practices.md)
- **Test creation**: [`gold-test-creation`](gold-test-creation.md)

<!-- Trigger Keywords: testing standard, testing best practices, how to test, testing gold standard, test guidelines -->
