---
name: validate-formula-crosscheck
description: "Cross-validate financial calculations using mathematical identities. Use when asking 'cross-check', 'verify calculation', 'formula identity', 'weights sum to one', or 'cross-validation'."
---

# Validate Formula Cross-Checks

> **Skill Metadata**
> Category: `validation`
> Priority: `MEDIUM`

## Cross-Validation Patterns

```python
import numpy as np
import pandas as pd
import pytest


def cross_check_cumulative_return(prices: pd.Series) -> None:
    """Verify: cumulative return from daily returns == price ratio - 1.

    This is a mathematical identity that must hold exactly.
    """
    returns = prices.pct_change().dropna()
    from_returns = (1 + returns).prod() - 1
    from_prices = prices.iloc[-1] / prices.iloc[0] - 1

    assert from_returns == pytest.approx(from_prices, abs=1e-10), (
        f"Cumulative return mismatch: "
        f"from returns={from_returns:.10f}, from prices={from_prices:.10f}"
    )


def cross_check_geometric_vs_arithmetic(returns: np.ndarray) -> None:
    """Verify: geometric mean <= arithmetic mean.

    Equality only when all returns are identical.
    """
    geo = np.prod(1 + returns) ** (1 / len(returns)) - 1
    arith = np.mean(returns)

    # Geometric should be <= arithmetic (Jensen's inequality)
    assert geo <= arith + 1e-10, (
        f"Geometric mean ({geo:.6f}) exceeds arithmetic mean ({arith:.6f})"
    )


def cross_check_portfolio_weights(weights: np.ndarray,
                                   tolerance: float = 1e-10) -> None:
    """Verify: portfolio weights sum to 1.0."""
    total = np.sum(weights)
    assert abs(total - 1.0) < tolerance, (
        f"Weights sum to {total:.10f}, expected 1.0"
    )


def cross_check_covariance_matrix(cov: np.ndarray) -> None:
    """Verify: covariance matrix is symmetric and positive semi-definite."""
    # Symmetric
    assert np.allclose(cov, cov.T, atol=1e-10), (
        "Covariance matrix is not symmetric"
    )

    # Positive semi-definite (all eigenvalues >= 0)
    eigenvalues = np.linalg.eigvalsh(cov)
    assert np.all(eigenvalues >= -1e-10), (
        f"Covariance matrix not positive semi-definite. "
        f"Min eigenvalue: {eigenvalues.min():.6e}"
    )

    # Diagonal values (variances) must be non-negative
    assert np.all(np.diag(cov) >= 0), (
        "Negative variance on diagonal of covariance matrix"
    )


def cross_check_log_vs_simple_return(simple: float) -> None:
    """Verify: log return = ln(1 + simple return)."""
    log_return = np.log(1 + simple)
    reconstructed = np.exp(log_return) - 1

    assert reconstructed == pytest.approx(simple, abs=1e-10), (
        f"Log/simple return mismatch: "
        f"simple={simple:.10f}, reconstructed={reconstructed:.10f}"
    )
```

## Quick Cross-Checks

```python
# Portfolio weights
assert abs(weights.sum() - 1.0) < 1e-10

# Cumulative return identity
assert (1 + returns).prod() - 1 == pytest.approx(
    prices.iloc[-1] / prices.iloc[0] - 1, abs=1e-10
)

# Correlation bounded [-1, 1]
assert (corr_matrix >= -1.0 - 1e-10).all().all()
assert (corr_matrix <= 1.0 + 1e-10).all().all()

# Diagonal of correlation matrix is 1.0
assert np.allclose(np.diag(corr_matrix), 1.0)
```

<!-- Trigger Keywords: cross-check, verify calculation, formula identity, weights sum to one, cross-validation, mathematical identity, portfolio weights, covariance check -->
