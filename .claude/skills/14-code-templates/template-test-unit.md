---
name: template-test-unit
description: "Financial formula unit test template with CFA benchmark comparisons, edge case validation, and fast execution. Use when requesting 'unit test template', 'formula test', 'fast test template', 'pure function test', or 'unit test example'."
---

# Unit Test Template (Financial Formulas)

Fast, isolated unit test template for pure financial calculations (<1 second execution). Validates formulas against CFA/textbook benchmark values.

> **Skill Metadata**
> Category: `cross-cutting` (code-generation)
> Priority: `HIGH`

## Quick Reference

- **Purpose**: Fast formula validation against known benchmark values
- **Speed**: <1 second per test
- **Dependencies**: None (pure calculation tests)
- **Location**: `tests/unit/`

## Complete Unit Test Template

```python
"""Unit tests for financial calculations.

All benchmark values from:
- CFA Institute Level I curriculum
- Hull, "Options, Futures, and Other Derivatives"
- Bodie, Kane, Marcus, "Investments"

Each test uses known inputs with published expected outputs.
"""

import pytest
import numpy as np
from decimal import Decimal, ROUND_HALF_UP


class TestSimpleReturn:
    """Test simple return formula: (P1 - P0) / P0."""

    def test_positive_return(self):
        """10% gain: (110 - 100) / 100 = 0.10."""
        result = (110.0 - 100.0) / 100.0
        assert result == pytest.approx(0.10, abs=1e-10)

    def test_negative_return(self):
        """5% loss: (95 - 100) / 100 = -0.05."""
        result = (95.0 - 100.0) / 100.0
        assert result == pytest.approx(-0.05, abs=1e-10)

    def test_zero_return(self):
        """No change: (100 - 100) / 100 = 0.0."""
        result = (100.0 - 100.0) / 100.0
        assert result == 0.0

    def test_total_loss(self):
        """Total loss: (0 - 100) / 100 = -1.0."""
        result = (0.0 - 100.0) / 100.0
        assert result == -1.0

    def test_large_gain(self):
        """100% gain: (200 - 100) / 100 = 1.0."""
        result = (200.0 - 100.0) / 100.0
        assert result == pytest.approx(1.0, abs=1e-10)


class TestLogReturn:
    """Test logarithmic return: ln(P1 / P0)."""

    def test_log_return_basic(self):
        """ln(110/100) = 0.09531."""
        result = np.log(110.0 / 100.0)
        assert result == pytest.approx(0.09531, abs=1e-4)

    def test_log_return_negative(self):
        """ln(90/100) = -0.10536."""
        result = np.log(90.0 / 100.0)
        assert result == pytest.approx(-0.10536, abs=1e-4)

    def test_log_return_zero_change(self):
        """ln(100/100) = 0.0."""
        result = np.log(100.0 / 100.0)
        assert result == 0.0

    def test_log_return_additivity(self):
        """Log returns are additive across periods."""
        # Day 1: 100->105, Day 2: 105->110
        r1 = np.log(105.0 / 100.0)
        r2 = np.log(110.0 / 105.0)
        total = np.log(110.0 / 100.0)
        assert r1 + r2 == pytest.approx(total, abs=1e-10)


class TestAnnualization:
    """Test return and volatility annualization formulas."""

    def test_annualize_daily_return(self):
        """(1 + 0.0004)^252 - 1 ~ 10.63%."""
        daily = 0.0004
        annualized = (1 + daily) ** 252 - 1
        assert annualized == pytest.approx(0.1063, abs=1e-3)

    def test_annualize_monthly_return(self):
        """(1 + 0.01)^12 - 1 = 12.68%."""
        monthly = 0.01
        annualized = (1 + monthly) ** 12 - 1
        assert annualized == pytest.approx(0.1268, abs=1e-3)

    def test_annualize_daily_volatility(self):
        """0.01 * sqrt(252) = 15.87%."""
        daily_vol = 0.01
        annual_vol = daily_vol * np.sqrt(252)
        assert annual_vol == pytest.approx(0.1587, abs=1e-3)

    def test_annualize_monthly_volatility(self):
        """0.04 * sqrt(12) = 13.86%."""
        monthly_vol = 0.04
        annual_vol = monthly_vol * np.sqrt(12)
        assert annual_vol == pytest.approx(0.1386, abs=1e-3)


class TestGeometricMean:
    """Test geometric mean return calculation."""

    def test_geometric_mean_basic(self):
        """Geometric mean of [10%, -5%, 8%, -3%, 12%] = 4.178%."""
        returns = np.array([0.10, -0.05, 0.08, -0.03, 0.12])
        geo_mean = np.prod(1 + returns) ** (1 / len(returns)) - 1
        assert geo_mean == pytest.approx(0.04178, abs=1e-4)

    def test_geometric_mean_less_than_arithmetic(self):
        """Geometric mean <= arithmetic mean (equality only if all equal)."""
        returns = np.array([0.10, -0.05, 0.08, -0.03, 0.12])
        geo = np.prod(1 + returns) ** (1 / len(returns)) - 1
        arith = np.mean(returns)
        assert geo < arith

    def test_geometric_mean_all_equal(self):
        """If all returns equal, geometric = arithmetic."""
        returns = np.array([0.05, 0.05, 0.05])
        geo = np.prod(1 + returns) ** (1 / len(returns)) - 1
        arith = np.mean(returns)
        assert geo == pytest.approx(arith, abs=1e-10)


class TestMonetaryArithmetic:
    """Test Decimal-based monetary calculations."""

    def test_decimal_avoids_float_error(self):
        """Decimal('0.1') + Decimal('0.2') == Decimal('0.3')."""
        assert Decimal("0.1") + Decimal("0.2") == Decimal("0.3")

    def test_trade_cost(self):
        """100 shares @ $149.99 + $9.95 commission = $15,008.95."""
        price = Decimal("149.99")
        quantity = Decimal("100")
        commission = Decimal("9.95")
        total = (price * quantity + commission).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )
        assert total == Decimal("15008.95")

    def test_weighted_average_cost(self):
        """Buy 100@$50 + 50@$55 -> avg = $51.6667."""
        total_cost = Decimal("100") * Decimal("50") + Decimal("50") * Decimal("55")
        total_qty = Decimal("150")
        avg = (total_cost / total_qty).quantize(
            Decimal("0.0001"), rounding=ROUND_HALF_UP
        )
        assert avg == Decimal("51.6667")

    def test_percentage_commission(self):
        """0.1% of $10,000 = $10.00."""
        trade_value = Decimal("10000.00")
        rate = Decimal("0.001")
        commission = (trade_value * rate).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )
        assert commission == Decimal("10.00")


class TestEdgeCases:
    """Test edge cases and boundary conditions."""

    def test_division_by_zero_protection(self):
        """Start price of zero should raise or be caught."""
        with pytest.raises((ZeroDivisionError, ValueError)):
            _ = (110.0 - 0.0) / 0.0

    def test_nan_detection(self):
        """NaN values should be detectable."""
        returns = np.array([0.01, np.nan, 0.02])
        assert np.isnan(returns).any()
        clean = returns[~np.isnan(returns)]
        assert len(clean) == 2

    def test_empty_array_mean(self):
        """Mean of empty array produces warning."""
        with pytest.warns(RuntimeWarning):
            np.mean(np.array([]))

    @pytest.mark.parametrize("start,end,expected", [
        (100.0, 110.0, 0.10),
        (100.0, 90.0, -0.10),
        (100.0, 200.0, 1.00),
        (100.0, 50.0, -0.50),
        (100.0, 100.0, 0.00),
    ])
    def test_simple_return_parametrized(self, start, end, expected):
        """Parametrized simple return tests."""
        result = (end - start) / start
        assert result == pytest.approx(expected, abs=1e-10)
```

## Quick Tips

- Use `pytest.approx()` for all floating-point comparisons
- Cite the benchmark source in docstrings (CFA, Hull, etc.)
- Parametrize tests for multiple input/output combinations
- Keep each test focused on one formula or edge case
- All tests should run in under 1 second total
- Use Decimal for monetary calculations, float for returns

<!-- Trigger Keywords: unit test template, formula test, fast test template, pure function test, unit test example, financial unit test, benchmark test, CFA test -->
