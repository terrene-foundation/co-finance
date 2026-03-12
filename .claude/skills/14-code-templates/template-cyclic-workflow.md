---
name: template-iterative-optimization
description: "Generate iterative optimization template for financial calculations. Use when requesting 'optimization template', 'iterative calculation', 'convergence template', 'portfolio optimization', or 'iterative workflow'."
---

# Iterative Optimization Template

Template for creating iterative/convergent financial calculations such as portfolio optimization, Newton-Raphson IRR, and iterative risk budgeting.

> **Skill Metadata**
> Category: `cross-cutting` (code-generation)
> Priority: `MEDIUM`
> Related Skills: [`template-financial-calculator`](template-financial-calculator.md)
> Related Subagents: `finance-pattern-expert` (complex optimizations)

## Portfolio Optimization Template (Iterative)

```python
"""Iterative Portfolio Optimization Template"""

import numpy as np
from scipy.optimize import minimize
import logging

logger = logging.getLogger(__name__)

TRADING_DAYS_PER_YEAR = 252


def optimize_portfolio(
    returns: np.ndarray,
    target_return: float = None,
    max_iterations: int = 100,
    tolerance: float = 1e-8,
    risk_free_rate: float = 0.0,
) -> dict:
    """Find optimal portfolio weights using mean-variance optimization.

    Args:
        returns: Matrix of asset returns (rows=observations, cols=assets)
        target_return: Target portfolio return (None for max Sharpe)
        max_iterations: Maximum optimization iterations
        tolerance: Convergence tolerance
        risk_free_rate: Annual risk-free rate

    Returns:
        Dictionary with optimal weights and portfolio metrics
    """
    n_assets = returns.shape[1]
    mean_returns = np.mean(returns, axis=0)
    cov_matrix = np.cov(returns, rowvar=False)

    # Initial weights (equal weight)
    initial_weights = np.ones(n_assets) / n_assets

    # Constraints: weights sum to 1
    constraints = [{"type": "eq", "fun": lambda w: np.sum(w) - 1}]

    if target_return is not None:
        constraints.append({
            "type": "eq",
            "fun": lambda w: np.dot(w, mean_returns) - target_return
        })

    # Bounds: 0 <= weight <= 1 (long only)
    bounds = [(0, 1) for _ in range(n_assets)]

    # Objective: minimize portfolio variance
    def portfolio_variance(weights):
        return np.dot(weights, np.dot(cov_matrix, weights))

    # Optimize
    result = minimize(
        portfolio_variance,
        initial_weights,
        method="SLSQP",
        bounds=bounds,
        constraints=constraints,
        options={"maxiter": max_iterations, "ftol": tolerance},
    )

    if not result.success:
        logger.warning("Optimization did not converge: %s", result.message)

    weights = result.x
    port_return = np.dot(weights, mean_returns)
    port_vol = np.sqrt(portfolio_variance(weights))

    # Annualize
    annual_return = (1 + port_return) ** TRADING_DAYS_PER_YEAR - 1
    annual_vol = port_vol * np.sqrt(TRADING_DAYS_PER_YEAR)

    daily_rf = risk_free_rate / TRADING_DAYS_PER_YEAR
    sharpe = (port_return - daily_rf) / port_vol * np.sqrt(TRADING_DAYS_PER_YEAR)

    return {
        "weights": weights,
        "annual_return": annual_return,
        "annual_volatility": annual_vol,
        "sharpe_ratio": sharpe,
        "converged": result.success,
        "iterations": result.nit,
    }
```

## Newton-Raphson IRR Template

```python
"""Newton-Raphson IRR Calculation with Convergence"""

import numpy as np


def irr_newton(cashflows: list, guess: float = 0.1,
               max_iterations: int = 100, tolerance: float = 1e-10) -> float:
    """Calculate IRR using Newton-Raphson method.

    Args:
        cashflows: List of cash flows (first is typically negative)
        guess: Initial IRR guess
        max_iterations: Maximum iterations
        tolerance: Convergence tolerance

    Returns:
        IRR as a decimal (e.g., 0.12 for 12%)

    Raises:
        ValueError: If calculation doesn't converge
    """
    rate = guess

    for iteration in range(max_iterations):
        # NPV at current rate
        npv = sum(cf / (1 + rate) ** t for t, cf in enumerate(cashflows))

        # Derivative of NPV
        npv_deriv = sum(
            -t * cf / (1 + rate) ** (t + 1)
            for t, cf in enumerate(cashflows)
        )

        if abs(npv_deriv) < 1e-15:
            raise ValueError("Derivative too small; try a different initial guess")

        # Newton-Raphson update
        new_rate = rate - npv / npv_deriv

        # Check convergence
        if abs(new_rate - rate) < tolerance:
            return new_rate

        rate = new_rate

    raise ValueError(
        f"IRR did not converge after {max_iterations} iterations. "
        f"Last rate: {rate:.6f}, NPV: {npv:.6f}"
    )


# Usage
cashflows = [-1000, 300, 400, 400, 200]
irr = irr_newton(cashflows)
print(f"IRR: {irr:.2%}")  # e.g., IRR: 12.83%
```

## Key Patterns

### Critical Steps for Iterative Calculations

1. **Set max iterations** to prevent infinite loops
2. **Define convergence criteria** (tolerance)
3. **Provide initial guess** or starting values
4. **Log convergence status** (did it converge? how many iterations?)
5. **Validate inputs** before starting iteration
6. **Handle non-convergence** gracefully (raise informative error)

### Convergence Criteria

```python
# Absolute tolerance
if abs(new_value - old_value) < tolerance:
    break  # Converged

# Relative tolerance
if abs((new_value - old_value) / old_value) < rel_tolerance:
    break  # Converged

# Function value tolerance
if abs(f(x)) < f_tolerance:
    break  # Root found
```

## Quick Tips

- Always set `max_iterations` to prevent infinite loops
- Log whether optimization converged and how many iterations it took
- Use scipy.optimize for standard optimization problems
- Provide sensible initial guesses (equal weights for portfolios, 10% for IRR)
- Validate inputs before starting expensive iterations

<!-- Trigger Keywords: optimization template, iterative calculation, convergence template, portfolio optimization, iterative workflow, Newton-Raphson, IRR calculation, mean-variance -->
