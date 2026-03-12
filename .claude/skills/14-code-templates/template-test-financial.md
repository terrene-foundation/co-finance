---
name: template-test-financial
description: "Financial calculation test template with benchmark values, tolerance handling, and Decimal precision tests. Use when requesting 'financial test template', 'benchmark test', 'calculation test template', 'finance test example', or 'numerical test template'."
---

# Financial Calculation Test Template

Test template for financial calculations using known benchmark values from textbooks, CFA materials, and published sources.

> **Skill Metadata**
> Category: `cross-cutting` (code-generation)
> Priority: `MEDIUM`

## Complete Test Template

```python
"""Financial Calculation Tests with Benchmark Values

Tests validate calculations against published values from:
- CFA Institute curriculum
- Hull, "Options, Futures, and Other Derivatives"
- Bodie, Kane, Marcus, "Investments"
"""

import pytest
import numpy as np
import numpy_financial as npf
from decimal import Decimal


class TestReturnCalculations:
    """Test return calculations against known values."""

    def test_simple_return(self):
        """Simple return: (110 - 100) / 100 = 10%."""
        start, end = 100.0, 110.0
        result = (end - start) / start
        assert result == pytest.approx(0.10, abs=1e-10)

    def test_log_return(self):
        """Log return: ln(110/100) = 0.09531."""
        result = np.log(110.0 / 100.0)
        assert result == pytest.approx(0.09531, abs=1e-4)

    def test_cumulative_return(self):
        """Cumulative return from daily returns."""
        daily_returns = np.array([0.01, -0.005, 0.02, -0.01, 0.015])
        cumulative = np.prod(1 + daily_returns) - 1
        assert cumulative == pytest.approx(0.02985, abs=1e-4)

    def test_annualized_return_from_daily(self):
        """Annualize daily return: (1 + r)^252 - 1."""
        daily = 0.0004  # ~10% annualized
        annualized = (1 + daily) ** 252 - 1
        assert annualized == pytest.approx(0.1063, abs=1e-3)

    def test_geometric_mean_return(self):
        """Geometric mean of [10%, -5%, 8%, -3%, 12%]."""
        returns = np.array([0.10, -0.05, 0.08, -0.03, 0.12])
        geo_mean = np.prod(1 + returns) ** (1 / len(returns)) - 1
        assert geo_mean == pytest.approx(0.04178, abs=1e-4)


class TestRiskMetrics:
    """Test risk metrics against known benchmark values."""

    @pytest.fixture
    def known_returns(self):
        """Fixed return series for reproducible tests."""
        np.random.seed(42)
        return np.random.normal(0.0004, 0.015, 252)

    def test_annualized_volatility(self, known_returns):
        """Annualized vol = daily_std * sqrt(252)."""
        daily_std = np.std(known_returns, ddof=1)
        annual_vol = daily_std * np.sqrt(252)
        assert 0.05 < annual_vol < 0.50  # Sanity check

    def test_sharpe_ratio(self, known_returns):
        """Sharpe = (mean_excess) / std * sqrt(252)."""
        rf_daily = 0.04 / 252
        excess = known_returns - rf_daily
        sharpe = np.mean(excess) / np.std(excess, ddof=1) * np.sqrt(252)
        assert isinstance(sharpe, float)
        assert -5 < sharpe < 5  # Reasonable range

    def test_max_drawdown(self):
        """Max drawdown from a known price series."""
        prices = np.array([100, 110, 105, 95, 90, 100, 108])
        peak = np.maximum.accumulate(prices)
        drawdown = (prices - peak) / peak
        max_dd = drawdown.min()
        # Peak was 110, trough was 90: (90-110)/110 = -18.18%
        assert max_dd == pytest.approx(-0.1818, abs=1e-3)

    def test_var_historical_95(self):
        """95% VaR: 5th percentile of returns."""
        np.random.seed(42)
        returns = np.random.normal(0, 0.02, 10000)
        var_95 = np.percentile(returns, 5)
        # For N(0, 0.02), 5th percentile ~ -1.645 * 0.02 = -0.0329
        assert var_95 == pytest.approx(-0.0329, abs=0.002)

    def test_cvar_exceeds_var(self):
        """CVaR should be more negative than VaR."""
        np.random.seed(42)
        returns = np.random.normal(0, 0.02, 10000)
        var_95 = np.percentile(returns, 5)
        cvar_95 = returns[returns <= var_95].mean()
        assert cvar_95 < var_95  # CVaR is worse (more negative)


class TestTimeValueOfMoney:
    """Test TVM calculations against textbook values."""

    def test_npv_positive_investment(self):
        """NPV at 10%: -1000, 300, 400, 400, 200 = 78.82."""
        cashflows = [-1000, 300, 400, 400, 200]
        result = npf.npv(0.10, cashflows)
        assert result == pytest.approx(78.82, abs=0.01)

    def test_npv_negative_investment(self):
        """NPV should be negative for poor investment."""
        cashflows = [-1000, 100, 100, 100, 100]
        result = npf.npv(0.10, cashflows)
        assert result < 0

    def test_irr_known_value(self):
        """IRR of [-1000, 400, 400, 400] ~ 9.70%."""
        cashflows = [-1000, 400, 400, 400]
        result = npf.irr(cashflows)
        assert result == pytest.approx(0.0970, abs=0.001)

    def test_monthly_payment(self):
        """30-year mortgage at 6.5% on $400,000."""
        monthly_rate = 0.065 / 12
        n_payments = 30 * 12
        pmt = npf.pmt(monthly_rate, n_payments, -400000)
        # Expected: approximately $2,528.27
        assert pmt == pytest.approx(2528.27, abs=1.0)

    def test_future_value(self):
        """FV of $10,000 at 5% for 10 years = $16,288.95."""
        fv = npf.fv(0.05, 10, 0, -10000)
        assert fv == pytest.approx(16288.95, abs=0.01)

    def test_present_value(self):
        """PV of $10,000 received in 5 years at 8% = $6,805.83."""
        pv = npf.pv(0.08, 5, 0, -10000)
        assert pv == pytest.approx(6805.83, abs=0.01)


class TestMonetaryPrecision:
    """Test monetary calculations using Decimal for exactness."""

    def test_trade_cost_exact(self):
        """Verify exact monetary arithmetic."""
        price = Decimal("149.99")
        quantity = Decimal("100")
        commission = Decimal("9.95")
        total = price * quantity + commission
        assert total == Decimal("15008.95")

    def test_weighted_average_cost(self):
        """Weighted average cost after two purchases."""
        # Buy 100 @ $50, then 50 @ $55
        total_cost = Decimal("100") * Decimal("50.00") + Decimal("50") * Decimal("55.00")
        total_shares = Decimal("150")
        avg_cost = total_cost / total_shares
        # (5000 + 2750) / 150 = 51.6667
        assert avg_cost == pytest.approx(Decimal("51.6667"), abs=Decimal("0.0001"))

    def test_no_floating_point_error(self):
        """Decimal avoids classic float issues."""
        # In float: 0.1 + 0.2 != 0.3
        assert Decimal("0.1") + Decimal("0.2") == Decimal("0.3")

    def test_commission_percentage(self):
        """Commission as percentage of trade value."""
        trade_value = Decimal("10000.00")
        commission_rate = Decimal("0.001")  # 0.1%
        commission = (trade_value * commission_rate).quantize(Decimal("0.01"))
        assert commission == Decimal("10.00")


class TestEdgeCases:
    """Test edge cases and boundary conditions."""

    def test_zero_return(self):
        """Return when price unchanged."""
        assert (100.0 - 100.0) / 100.0 == 0.0

    def test_total_loss_return(self):
        """Return = -100% when price goes to zero."""
        assert (0.0 - 100.0) / 100.0 == -1.0

    def test_single_observation_std(self):
        """Standard deviation of single observation should raise or return NaN."""
        with pytest.raises((ValueError, RuntimeWarning)):
            np.std([0.01], ddof=1)  # ddof=1 with n=1 gives division by zero

    def test_nan_handling(self):
        """NaN values should not silently corrupt calculations."""
        returns = np.array([0.01, np.nan, 0.02, -0.01])
        clean = returns[~np.isnan(returns)]
        assert len(clean) == 3
        assert np.mean(clean) == pytest.approx(0.00667, abs=1e-4)

    def test_empty_cashflows_irr(self):
        """IRR with no sign change should return NaN."""
        result = npf.irr([100, 200, 300])  # All positive
        assert np.isnan(result)
```

## Quick Tips

- Use `pytest.approx()` for all floating-point comparisons
- Set explicit absolute tolerance: `abs=1e-4` for 4 decimal places
- Use `Decimal` for monetary exactness tests
- Seed random generators: `np.random.seed(42)` for reproducibility
- Cite the benchmark source in docstrings
- Test edge cases: zero, negative, NaN, single observation, empty

<!-- Trigger Keywords: financial test template, benchmark test, calculation test template, finance test example, numerical test template, TVM test, return test, risk metric test -->
