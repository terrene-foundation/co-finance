---
name: decide-test-tier
description: "Choose test tier (unit, integration, e2e) for financial code based on scope and dependencies. Use when asking 'test tier', 'unit vs integration', 'test type', 'which test', 'test strategy', or 'test level'."
---

# Decision: Test Tier Selection for Financial Code

Choose the right test tier for financial Python code: unit tests for formulas, integration tests for data pipelines, E2E tests for complete strategies.

> **Skill Metadata**
> Category: `cross-cutting`
> Priority: `MEDIUM`

## Quick Reference

| What You're Testing                     | Tier        | Speed | Dependencies           |
| --------------------------------------- | ----------- | ----- | ---------------------- |
| **Pure formula (NPV, Sharpe, returns)** | Tier 1 Unit | <1s   | None                   |
| **Data pipeline with real API/DB**      | Tier 2 Intg | <5s   | Real data source       |
| **Full strategy backtest pipeline**     | Tier 3 E2E  | <30s  | Data + engine + output |

## Tier 1: Unit Tests (Pure Calculations)

Test individual financial formulas and utility functions against known benchmark values.

```python
import pytest
from decimal import Decimal

class TestReturnCalculations:
    """Tier 1: Unit tests for return calculations."""

    def test_simple_return(self):
        """Simple return: (end - start) / start."""
        start, end = 100.0, 110.0
        result = (end - start) / start
        assert result == pytest.approx(0.10, abs=1e-10)

    def test_log_return(self):
        """Log return: ln(end / start)."""
        import numpy as np
        start, end = 100.0, 110.0
        result = np.log(end / start)
        assert result == pytest.approx(0.09531, abs=1e-4)

    def test_annualized_return(self):
        """Annualize daily return over 252 trading days."""
        daily_return = 0.0004
        annualized = (1 + daily_return) ** 252 - 1
        assert annualized == pytest.approx(0.1063, abs=1e-3)

    def test_sharpe_ratio(self):
        """Sharpe = (return - risk_free) / volatility."""
        annual_return = 0.12
        risk_free = 0.04
        volatility = 0.15
        sharpe = (annual_return - risk_free) / volatility
        assert sharpe == pytest.approx(0.5333, abs=1e-3)

    def test_npv_matches_known_value(self):
        """NPV benchmark: CFA Institute example."""
        import numpy_financial as npf
        cashflows = [-1000, 300, 400, 400, 200]
        result = npf.npv(0.10, cashflows)
        assert result == pytest.approx(78.82, abs=0.01)

    def test_monetary_precision_with_decimal(self):
        """Monetary calculations use Decimal for exactness."""
        price = Decimal("19.99")
        quantity = Decimal("100")
        commission = Decimal("9.95")
        total = price * quantity + commission
        assert total == Decimal("2008.95")
```

**Use Tier 1 when:**

- Testing a pure function with no external dependencies
- Validating against textbook/CFA benchmark values
- Checking edge cases (zero prices, negative returns, NaN handling)
- Fast feedback during development

## Tier 2: Integration Tests (Data Pipelines)

Test that data flows correctly through multi-step pipelines with real data sources.

```python
import pytest
import pandas as pd

class TestDataPipeline:
    """Tier 2: Integration tests with real data."""

    @pytest.fixture
    def sample_prices(self, tmp_path):
        """Create real CSV file for testing."""
        data = {
            "date": pd.date_range("2024-01-01", periods=60, freq="B"),
            "open": [100 + i * 0.1 for i in range(60)],
            "high": [101 + i * 0.1 for i in range(60)],
            "low": [99 + i * 0.1 for i in range(60)],
            "close": [100.5 + i * 0.1 for i in range(60)],
            "volume": [1000000 + i * 1000 for i in range(60)],
        }
        df = pd.DataFrame(data)
        path = tmp_path / "prices.csv"
        df.to_csv(path, index=False)
        return path

    def test_price_loading_and_returns(self, sample_prices):
        """Test loading prices and computing returns end-to-end."""
        df = pd.read_csv(sample_prices, parse_dates=["date"])
        df.set_index("date", inplace=True)

        returns = df["close"].pct_change().dropna()

        assert len(returns) == 59
        assert returns.isna().sum() == 0
        assert all(returns > -1)  # No return below -100%

    def test_rolling_statistics_pipeline(self, sample_prices):
        """Test rolling volatility pipeline with real data."""
        import numpy as np

        df = pd.read_csv(sample_prices, parse_dates=["date"])
        df.set_index("date", inplace=True)
        returns = df["close"].pct_change().dropna()

        vol_20 = returns.rolling(20).std() * np.sqrt(252)

        assert vol_20.dropna().min() > 0
        assert vol_20.dropna().max() < 5.0  # Sanity: less than 500% vol

    def test_database_roundtrip(self, sample_prices):
        """Test storing and retrieving from SQLite."""
        import sqlite3

        df = pd.read_csv(sample_prices)
        conn = sqlite3.connect(":memory:")
        df.to_sql("prices", conn, index=False)

        loaded = pd.read_sql("SELECT * FROM prices ORDER BY date", conn)
        assert len(loaded) == len(df)
        assert list(loaded.columns) == list(df.columns)
```

**Use Tier 2 when:**

- Testing data loading, cleaning, and transformation pipelines
- Testing database read/write operations
- Testing API data fetch and caching
- Testing multi-step calculations that depend on real data shapes

## Tier 3: E2E Tests (Full Strategies)

Test complete workflows from data ingestion through analysis to output.

```python
import pytest

class TestStrategyE2E:
    """Tier 3: End-to-end strategy tests."""

    def test_sma_crossover_backtest(self):
        """Test complete SMA crossover backtest pipeline."""
        import backtrader as bt

        class SmaCross(bt.Strategy):
            params = dict(fast=10, slow=30)
            def __init__(self):
                sma1 = bt.ind.SMA(period=self.p.fast)
                sma2 = bt.ind.SMA(period=self.p.slow)
                self.crossover = bt.ind.CrossOver(sma1, sma2)
            def next(self):
                if self.crossover > 0:
                    self.buy()
                elif self.crossover < 0:
                    self.sell()

        cerebro = bt.Cerebro()
        cerebro.addstrategy(SmaCross)

        # Use synthetic data for reproducibility
        import pandas as pd
        import numpy as np
        dates = pd.date_range("2023-01-01", periods=252, freq="B")
        np.random.seed(42)
        close = 100 * np.exp(np.cumsum(np.random.normal(0.0003, 0.015, 252)))
        data = bt.feeds.PandasData(
            dataname=pd.DataFrame({
                "open": close, "high": close * 1.01,
                "low": close * 0.99, "close": close,
                "volume": 1000000
            }, index=dates)
        )
        cerebro.adddata(data)
        cerebro.broker.setcash(100000)
        cerebro.addanalyzer(bt.analyzers.SharpeRatio, _name="sharpe")

        results = cerebro.run()

        # Verify backtest completed
        assert results is not None
        assert len(results) == 1
        assert cerebro.broker.getvalue() > 0  # Portfolio has value
```

**Use Tier 3 when:**

- Testing a complete backtest from data to results
- Testing portfolio construction pipeline end-to-end
- Testing report generation with real calculations
- Validating that all components work together

## Decision Flowchart

```
What are you testing?
  |
  |-- Pure formula or utility function?
  |     -> Tier 1 (Unit) -- benchmark against known values
  |
  |-- Data pipeline or storage?
  |     -> Tier 2 (Integration) -- use real files/databases
  |
  |-- Complete strategy or portfolio workflow?
  |     -> Tier 3 (E2E) -- run full pipeline
  |
  |-- All of above?
        -> Use all tiers, weighted toward Tier 1 (fastest feedback)
```

## Financial-Specific Testing Tips

- Always compare calculations against published benchmark values (CFA, Hull, etc.)
- Use `pytest.approx()` with explicit tolerance for floating-point comparisons
- Use `Decimal` for monetary amount tests where exactness matters
- Seed random number generators for reproducible Monte Carlo tests
- Test edge cases: zero prices, NaN values, single-day data, weekends/holidays

<!-- Trigger Keywords: test tier, unit vs integration, test type, which test, test strategy, test level, financial testing -->
