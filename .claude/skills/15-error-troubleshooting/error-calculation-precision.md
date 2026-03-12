---
name: error-calculation-precision
description: "Fix floating point precision errors in financial calculations. Use when encountering 'penny differences', 'rounding error', 'float precision', 'Decimal error', 'monetary calculation wrong', or assertion failures on monetary values."
---

# Error: Calculation Precision Errors

Fix floating-point precision issues in financial calculations including monetary rounding, assertion failures, and Decimal usage.

> **Skill Metadata**
> Category: `cross-cutting` (error-resolution)
> Priority: `CRITICAL` (Silent data corruption risk)

## Symptoms

- Penny differences in monetary totals ($100.00 vs $99.99999999)
- Assertion failures: `assert total == 15008.95` fails
- Rounding errors accumulate across many transactions
- Portfolio value off by small amounts
- Commission calculations slightly wrong

## Root Cause

IEEE 754 floating-point cannot represent many decimal fractions exactly:

```python
# The classic problem
>>> 0.1 + 0.2
0.30000000000000004

>>> 0.1 + 0.2 == 0.3
False
```

## Quick Fixes

### BAD: Float for money

```python
# BAD: Floating-point accumulates errors
price = 149.99
quantity = 100
commission = 9.95
total = price * quantity + commission
print(total)  # Might be 15008.949999999999

assert total == 15008.95  # FAILS!
```

### GOOD: Decimal for money

```python
from decimal import Decimal, ROUND_HALF_UP

price = Decimal("149.99")
quantity = Decimal("100")
commission = Decimal("9.95")
total = (price * quantity + commission).quantize(
    Decimal("0.01"), rounding=ROUND_HALF_UP
)
print(total)  # Decimal('15008.95') - exact

assert total == Decimal("15008.95")  # PASSES
```

### GOOD: pytest.approx for float comparisons

```python
import pytest

# When you must use float (returns, ratios)
sharpe = calculate_sharpe(returns)
assert sharpe == pytest.approx(1.25, abs=1e-4)

# BAD: Exact float comparison
assert sharpe == 1.25  # Almost certainly fails
```

## When to Use Decimal vs Float

| Use Case            | Type      | Why                               |
| ------------------- | --------- | --------------------------------- |
| **Prices**          | `Decimal` | Exact monetary representation     |
| **Commissions**     | `Decimal` | Must match to the penny           |
| **Portfolio value** | `Decimal` | Aggregation errors compound       |
| **Trade cost**      | `Decimal` | Regulatory requirement            |
| **Returns**         | `float64` | Statistical measure, tolerance OK |
| **Sharpe ratio**    | `float64` | Ratio, tolerance OK               |
| **Volatility**      | `float64` | Statistical measure               |
| **Correlation**     | `float64` | -1 to 1 range, tolerance OK       |

## Common Precision Errors

### Error 1: Rounding at wrong step

```python
# BAD: Round intermediate steps
tax = round(price * tax_rate, 2)
total = round(price + tax + shipping, 2)  # Rounds twice!

# GOOD: Round once at the end
total = (price + price * tax_rate + shipping).quantize(
    Decimal("0.01"), rounding=ROUND_HALF_UP
)
```

### Error 2: Comparing Decimal to float

```python
# BAD: Mixing types
result = Decimal("10.00")
assert result == 10.0  # Unreliable

# GOOD: Compare same types
assert result == Decimal("10.00")
# or
assert float(result) == pytest.approx(10.0, abs=1e-10)
```

### Error 3: String conversion for Decimal

```python
# BAD: Float through Decimal
d = Decimal(0.1)  # Decimal('0.1000000000000000055511151231257827021181583404541015625')

# GOOD: String to Decimal
d = Decimal("0.1")  # Decimal('0.1')
```

### Error 4: Wrong tolerance in tests

```python
# BAD: Tolerance too tight for the calculation
assert irr == pytest.approx(0.0970, abs=1e-10)  # May fail

# GOOD: Appropriate tolerance for the domain
assert irr == pytest.approx(0.0970, abs=1e-3)  # IRR precision is ~0.1%
```

## Tolerance Guide

| Calculation         | Recommended abs | Rationale                  |
| ------------------- | --------------- | -------------------------- |
| **Monetary totals** | Use `Decimal`   | Exact match required       |
| **Returns**         | `1e-6`          | 6 decimal places           |
| **Sharpe ratio**    | `1e-2`          | 2 decimal places           |
| **IRR**             | `1e-3`          | Iterative solver precision |
| **NPV**             | `0.01`          | Penny precision            |
| **Volatility**      | `1e-4`          | 4 decimal places           |
| **Correlation**     | `1e-4`          | 4 decimal places           |

## Prevention Checklist

- [ ] Using `Decimal` for all monetary amounts?
- [ ] Creating `Decimal` from strings, not floats?
- [ ] Rounding once at the final step, not intermediate?
- [ ] Using `pytest.approx()` for float comparisons?
- [ ] Tolerance appropriate for the calculation domain?
- [ ] Not mixing `Decimal` and `float` in comparisons?

## Quick Tips

- Always construct Decimal from strings: `Decimal("10.50")` not `Decimal(10.50)`
- Use `quantize()` with `ROUND_HALF_UP` for financial rounding
- Use `pytest.approx(expected, abs=tolerance)` for float test assertions
- Document tolerance choices in test docstrings

<!-- Trigger Keywords: penny differences, rounding error, float precision, Decimal error, monetary calculation wrong, precision error, floating point, calculation error, assertion failure monetary, quantize error -->
