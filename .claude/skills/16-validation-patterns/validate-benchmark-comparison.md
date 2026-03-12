---
name: validate-benchmark-comparison
description: "Validate financial calculations against published benchmark values. Use when asking 'validate calculation', 'benchmark comparison', 'verify formula', 'check NPV', or 'validate Sharpe'."
---

# Validate Benchmark Comparison

> **Skill Metadata**
> Category: `validation`
> Priority: `HIGH`

## Benchmark Validation Pattern

```python
import pytest
import numpy as np
import numpy_financial as npf


def validate_npv(rate: float, cashflows: list, expected: float,
                 tolerance: float = 0.01, source: str = "CFA L1") -> bool:
    """Validate NPV calculation against published benchmark.

    Args:
        rate: Discount rate
        cashflows: List of cash flows
        expected: Expected NPV from benchmark source
        tolerance: Acceptable absolute difference
        source: Citation for benchmark value

    Returns:
        True if result matches benchmark
    """
    result = npf.npv(rate, cashflows)
    diff = abs(result - expected)
    if diff > tolerance:
        raise AssertionError(
            f"NPV mismatch: got {result:.4f}, expected {expected:.4f} "
            f"(diff={diff:.4f}, tolerance={tolerance}). Source: {source}"
        )
    return True


def validate_irr(cashflows: list, expected: float,
                 tolerance: float = 0.001) -> bool:
    """Validate IRR against benchmark."""
    result = npf.irr(cashflows)
    if np.isnan(result):
        raise AssertionError(f"IRR returned NaN for cashflows: {cashflows}")
    diff = abs(result - expected)
    if diff > tolerance:
        raise AssertionError(
            f"IRR mismatch: got {result:.6f}, expected {expected:.6f} "
            f"(diff={diff:.6f}, tolerance={tolerance})"
        )
    return True
```

## Known Benchmark Values

```python
# CFA Level I benchmarks for validation
BENCHMARKS = {
    "npv_basic": {
        "rate": 0.10,
        "cashflows": [-1000, 300, 400, 400, 200],
        "expected": 78.82,
        "tolerance": 0.01,
        "source": "CFA Level I TVM",
    },
    "irr_basic": {
        "cashflows": [-1000, 400, 400, 400],
        "expected": 0.0970,
        "tolerance": 0.001,
        "source": "CFA Level I TVM",
    },
    "fv_compound": {
        "pv": 10000,
        "rate": 0.05,
        "periods": 10,
        "expected": 16288.95,
        "tolerance": 0.01,
        "source": "TVM formula",
    },
    "sharpe_sanity": {
        "min": -5.0,
        "max": 5.0,
        "description": "Reasonable Sharpe ratio range for annual data",
    },
}

def run_all_benchmarks():
    """Run all benchmark validations."""
    results = {}

    # NPV
    b = BENCHMARKS["npv_basic"]
    try:
        validate_npv(b["rate"], b["cashflows"], b["expected"], b["tolerance"])
        results["npv_basic"] = "PASS"
    except AssertionError as e:
        results["npv_basic"] = f"FAIL: {e}"

    # IRR
    b = BENCHMARKS["irr_basic"]
    try:
        validate_irr(b["cashflows"], b["expected"], b["tolerance"])
        results["irr_basic"] = "PASS"
    except AssertionError as e:
        results["irr_basic"] = f"FAIL: {e}"

    return results
```

## Reasonableness Checks

```python
def check_sharpe_reasonable(sharpe: float) -> None:
    """Verify Sharpe ratio is within reasonable bounds."""
    if np.isnan(sharpe):
        raise ValueError("Sharpe ratio is NaN")
    if sharpe > 5.0:
        raise ValueError(f"Sharpe {sharpe:.2f} too high - check for look-ahead bias")
    if sharpe < -5.0:
        raise ValueError(f"Sharpe {sharpe:.2f} too low - check data quality")

def check_volatility_reasonable(annual_vol: float) -> None:
    """Verify annualized volatility is within reasonable bounds."""
    if annual_vol < 0:
        raise ValueError("Volatility cannot be negative")
    if annual_vol > 2.0:
        raise ValueError(f"Volatility {annual_vol:.2%} too high - check annualization")
    if annual_vol < 0.001:
        raise ValueError(f"Volatility {annual_vol:.4%} near zero - check data")
```

<!-- Trigger Keywords: validate calculation, benchmark comparison, verify formula, check NPV, validate Sharpe, formula validation, CFA benchmark -->
