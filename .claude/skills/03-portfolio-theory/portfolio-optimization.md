---
name: portfolio-optimization
description: "Portfolio optimization reference covering mean-variance optimization, risk parity, Black-Litterman model, maximum Sharpe ratio, minimum volatility, and constraints handling. Use when asking about 'portfolio optimization', 'risk parity', 'Black-Litterman', 'maximum Sharpe', 'minimum volatility', 'convex optimization', 'cvxpy', 'scipy optimize', 'weight constraints', 'rebalancing', 'target volatility', or 'risk budgeting'."
---

# Portfolio Optimization

Reference for advanced portfolio optimization techniques including mean-variance, risk parity, and Black-Litterman with Python implementations.

## Mean-Variance Optimization with scipy

### Maximum Sharpe Ratio

```python
import numpy as np
import pandas as pd
import yfinance as yf
from scipy.optimize import minimize

def max_sharpe_portfolio(mean_returns: np.ndarray, cov_matrix: np.ndarray,
                          risk_free_rate: float = 0.04,
                          constraints: list = None) -> dict:
    """Find the portfolio that maximizes the Sharpe ratio.

    Args:
        mean_returns: Annualized expected returns
        cov_matrix: Annualized covariance matrix
        risk_free_rate: Risk-free rate
        constraints: Additional constraints (optional)

    Returns:
        Optimal weights and portfolio statistics
    """
    n = len(mean_returns)

    def neg_sharpe(weights):
        ret = np.dot(weights, mean_returns)
        vol = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
        return -(ret - risk_free_rate) / vol

    default_constraints = [
        {"type": "eq", "fun": lambda w: np.sum(w) - 1},
    ]
    if constraints:
        default_constraints.extend(constraints)

    bounds = tuple((0, 1) for _ in range(n))

    result = minimize(
        neg_sharpe,
        np.ones(n) / n,
        method="SLSQP",
        bounds=bounds,
        constraints=default_constraints,
    )

    weights = result.x
    ret = np.dot(weights, mean_returns)
    vol = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))

    return {
        "weights": weights,
        "return": ret,
        "volatility": vol,
        "sharpe": (ret - risk_free_rate) / vol,
    }
```

### Minimum Volatility

```python
def min_volatility_portfolio(cov_matrix: np.ndarray,
                              constraints: list = None) -> dict:
    """Find the minimum volatility portfolio.

    Args:
        cov_matrix: Annualized covariance matrix
        constraints: Additional constraints

    Returns:
        Optimal weights and volatility
    """
    n = cov_matrix.shape[0]

    def portfolio_vol(weights):
        return np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))

    default_constraints = [
        {"type": "eq", "fun": lambda w: np.sum(w) - 1},
    ]
    if constraints:
        default_constraints.extend(constraints)

    bounds = tuple((0, 1) for _ in range(n))

    result = minimize(
        portfolio_vol,
        np.ones(n) / n,
        method="SLSQP",
        bounds=bounds,
        constraints=default_constraints,
    )

    return {
        "weights": result.x,
        "volatility": portfolio_vol(result.x),
    }
```

### Target Return

```python
def target_return_portfolio(mean_returns: np.ndarray, cov_matrix: np.ndarray,
                             target_return: float) -> dict:
    """Find the minimum volatility portfolio for a given target return.

    Args:
        mean_returns: Annualized expected returns
        cov_matrix: Annualized covariance matrix
        target_return: Desired portfolio return

    Returns:
        Optimal weights, actual return, and volatility
    """
    n = len(mean_returns)

    def portfolio_vol(weights):
        return np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))

    constraints = [
        {"type": "eq", "fun": lambda w: np.sum(w) - 1},
        {"type": "eq", "fun": lambda w: np.dot(w, mean_returns) - target_return},
    ]
    bounds = tuple((0, 1) for _ in range(n))

    result = minimize(
        portfolio_vol,
        np.ones(n) / n,
        method="SLSQP",
        bounds=bounds,
        constraints=constraints,
    )

    weights = result.x
    return {
        "weights": weights,
        "return": np.dot(weights, mean_returns),
        "volatility": portfolio_vol(weights),
        "success": result.success,
    }
```

## Optimization with cvxpy

cvxpy provides a cleaner interface for convex optimization with better constraint handling.

```python
def optimize_with_cvxpy(mean_returns: np.ndarray, cov_matrix: np.ndarray,
                         risk_free_rate: float = 0.04,
                         max_weight: float = 0.40,
                         min_weight: float = 0.0,
                         target_return: float = None) -> dict:
    """Portfolio optimization using cvxpy.

    Args:
        mean_returns: Annualized expected returns
        cov_matrix: Annualized covariance matrix
        risk_free_rate: Risk-free rate
        max_weight: Maximum weight per asset
        min_weight: Minimum weight per asset (0 = long only)
        target_return: If set, minimize risk for this return

    Returns:
        Optimal weights and statistics
    """
    import cvxpy as cp

    n = len(mean_returns)
    w = cp.Variable(n)

    # Portfolio metrics
    ret = mean_returns @ w
    risk = cp.quad_form(w, cov_matrix)

    # Constraints
    constraints = [
        cp.sum(w) == 1,
        w >= min_weight,
        w <= max_weight,
    ]

    if target_return is not None:
        constraints.append(ret >= target_return)
        objective = cp.Minimize(risk)
    else:
        # Maximize Sharpe (approximate: maximize return - lambda * risk)
        # For true max Sharpe, we use a trick with risk budgeting
        gamma = 1.0  # Risk aversion parameter
        objective = cp.Maximize(ret - gamma * risk)

    prob = cp.Problem(objective, constraints)
    prob.solve(solver=cp.OSQP)

    if prob.status not in ["optimal", "optimal_inaccurate"]:
        return {"error": f"Optimization failed: {prob.status}"}

    weights = w.value
    port_ret = float(mean_returns @ weights)
    port_vol = float(np.sqrt(weights @ cov_matrix @ weights))

    return {
        "weights": weights,
        "return": port_ret,
        "volatility": port_vol,
        "sharpe": (port_ret - risk_free_rate) / port_vol if port_vol > 0 else 0,
        "status": prob.status,
    }
```

## Risk Parity

Risk parity allocates portfolio weights so that each asset contributes equally to total portfolio risk.

### Risk Contribution

```python
def risk_contribution(weights: np.ndarray, cov_matrix: np.ndarray) -> np.ndarray:
    """Calculate each asset's contribution to total portfolio risk.

    Risk contribution = weight * marginal risk contribution
    Marginal risk contribution = (Sigma @ w) / sigma_p

    Args:
        weights: Portfolio weights
        cov_matrix: Covariance matrix

    Returns:
        Array of risk contributions (sum to portfolio volatility)
    """
    port_vol = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
    marginal_contrib = np.dot(cov_matrix, weights) / port_vol
    risk_contrib = weights * marginal_contrib
    return risk_contrib

def risk_parity_portfolio(cov_matrix: np.ndarray,
                           risk_budget: np.ndarray = None) -> dict:
    """Find the risk parity portfolio.

    Args:
        cov_matrix: Annualized covariance matrix
        risk_budget: Target risk budget per asset (default: equal)

    Returns:
        Risk parity weights and diagnostics
    """
    n = cov_matrix.shape[0]

    if risk_budget is None:
        risk_budget = np.ones(n) / n  # Equal risk contribution

    def objective(weights):
        """Minimize squared differences between actual and target risk contributions."""
        rc = risk_contribution(weights, cov_matrix)
        port_vol = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))

        # Percentage contribution
        pct_rc = rc / port_vol if port_vol > 0 else rc

        # Minimize deviation from target
        return np.sum((pct_rc - risk_budget) ** 2)

    constraints = [{"type": "eq", "fun": lambda w: np.sum(w) - 1}]
    bounds = tuple((0.01, 1) for _ in range(n))  # Minimum 1% to avoid zero weights

    result = minimize(
        objective,
        np.ones(n) / n,
        method="SLSQP",
        bounds=bounds,
        constraints=constraints,
        options={"maxiter": 1000},
    )

    weights = result.x
    rc = risk_contribution(weights, cov_matrix)
    port_vol = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))

    return {
        "weights": weights,
        "volatility": port_vol,
        "risk_contributions": rc,
        "pct_risk_contributions": rc / port_vol,
        "converged": result.success,
    }

# Example
tickers = ["SPY", "TLT", "GLD", "VNQ", "EFA"]
data = yf.download(tickers, period="5y", auto_adjust=True)["Close"]
returns = data.pct_change().dropna()
cov_matrix = returns.cov().values * 252

rp = risk_parity_portfolio(cov_matrix)
print("Risk Parity Portfolio:")
for i, t in enumerate(tickers):
    print(f"  {t}: Weight={rp['weights'][i]:.2%}, "
          f"Risk Contrib={rp['pct_risk_contributions'][i]:.2%}")
```

## Black-Litterman Model

The Black-Litterman model combines market equilibrium returns (implied by market cap weights) with investor views to produce more stable expected return estimates.

### Step 1: Implied Equilibrium Returns

```python
def implied_returns(cov_matrix: np.ndarray, market_weights: np.ndarray,
                     risk_aversion: float = 2.5,
                     risk_free_rate: float = 0.04) -> np.ndarray:
    """Calculate implied equilibrium returns (reverse optimization).

    Args:
        cov_matrix: Annualized covariance matrix
        market_weights: Market capitalization weights
        risk_aversion: Risk aversion parameter (lambda)
        risk_free_rate: Risk-free rate

    Returns:
        Array of implied expected returns
    """
    pi = risk_aversion * np.dot(cov_matrix, market_weights)
    return pi + risk_free_rate
```

### Step 2: Define Views

```python
def create_views(n_assets: int, views: list) -> tuple:
    """Create the P (pick) matrix and Q (view) vector.

    Args:
        n_assets: Number of assets
        views: List of view dictionaries, each with:
            - 'assets': dict of {index: weight} for the view
            - 'return': expected return of the view

    Returns:
        Tuple of (P matrix, Q vector, omega diagonal)

    Example view: "Asset 0 will outperform asset 1 by 2%"
        {'assets': {0: 1, 1: -1}, 'return': 0.02}
    """
    k = len(views)  # Number of views
    P = np.zeros((k, n_assets))
    Q = np.zeros(k)

    for i, view in enumerate(views):
        for asset_idx, weight in view["assets"].items():
            P[i, asset_idx] = weight
        Q[i] = view["return"]

    return P, Q
```

### Step 3: Black-Litterman Combined Returns

```python
def black_litterman(cov_matrix: np.ndarray, market_weights: np.ndarray,
                     P: np.ndarray, Q: np.ndarray,
                     risk_aversion: float = 2.5,
                     tau: float = 0.05,
                     view_confidences: np.ndarray = None) -> dict:
    """Compute Black-Litterman posterior expected returns.

    Args:
        cov_matrix: Annualized covariance matrix (Sigma)
        market_weights: Market cap weights
        P: Pick matrix (K x N)
        Q: View vector (K x 1)
        risk_aversion: Risk aversion parameter
        tau: Uncertainty scaling factor (typically 0.01-0.10)
        view_confidences: Diagonal of omega (view uncertainty)

    Returns:
        Posterior returns and covariance
    """
    n = len(market_weights)

    # Prior: equilibrium returns
    pi = risk_aversion * np.dot(cov_matrix, market_weights)

    # Scaled covariance
    tau_sigma = tau * cov_matrix

    # View uncertainty matrix (Omega)
    if view_confidences is not None:
        omega = np.diag(view_confidences)
    else:
        # Idzorek default: proportional to view portfolio variance
        omega = np.diag(np.diag(P @ tau_sigma @ P.T))

    # Black-Litterman formula
    # Posterior = [( tau*Sigma)^-1 + P'*Omega^-1*P]^-1 * [(tau*Sigma)^-1*pi + P'*Omega^-1*Q]
    inv_tau_sigma = np.linalg.inv(tau_sigma)
    inv_omega = np.linalg.inv(omega)

    posterior_cov = np.linalg.inv(inv_tau_sigma + P.T @ inv_omega @ P)
    posterior_returns = posterior_cov @ (inv_tau_sigma @ pi + P.T @ inv_omega @ Q)

    return {
        "prior_returns": pi,
        "posterior_returns": posterior_returns,
        "posterior_covariance": posterior_cov + cov_matrix,  # Total posterior covariance
        "posterior_precision": posterior_cov,
    }

# Example: 5 assets, 2 views
tickers = ["SPY", "TLT", "GLD", "VNQ", "EFA"]
data = yf.download(tickers, period="5y", auto_adjust=True)["Close"]
returns = data.pct_change().dropna()
cov = returns.cov().values * 252

# Market cap weights (approximate)
market_caps = np.array([45e12, 0.3e12, 0.2e12, 0.1e12, 20e12])
market_weights = market_caps / market_caps.sum()

# Views
P, Q = create_views(5, [
    {"assets": {0: 1, 4: -1}, "return": 0.03},   # SPY outperforms EFA by 3%
    {"assets": {2: 1}, "return": 0.08},             # GLD returns 8%
])

bl_result = black_litterman(cov, market_weights, P, Q)

print("Black-Litterman Results:")
print(f"{'Asset':<6} {'Prior':>8} {'Posterior':>10}")
for i, t in enumerate(tickers):
    print(f"{t:<6} {bl_result['prior_returns'][i]:>8.2%} "
          f"{bl_result['posterior_returns'][i]:>10.2%}")
```

### Step 4: Optimize with BL Returns

```python
def bl_optimal_portfolio(bl_result: dict, cov_matrix: np.ndarray,
                          risk_free_rate: float = 0.04) -> dict:
    """Find optimal portfolio using Black-Litterman posterior returns."""
    posterior_returns = bl_result["posterior_returns"]

    return max_sharpe_portfolio(posterior_returns, cov_matrix, risk_free_rate)

bl_portfolio = bl_optimal_portfolio(bl_result, cov)
print("\nBL Optimal Portfolio:")
for i, t in enumerate(tickers):
    print(f"  {t}: {bl_portfolio['weights'][i]:.2%}")
print(f"  Expected Return: {bl_portfolio['return']:.2%}")
print(f"  Volatility: {bl_portfolio['volatility']:.2%}")
print(f"  Sharpe: {bl_portfolio['sharpe']:.2f}")
```

## Constraints Handling

### Common Constraint Types

```python
def build_constraints(n_assets: int, sector_map: dict = None,
                       max_weight: float = 0.30,
                       min_weight: float = 0.02,
                       max_sector: float = 0.40,
                       turnover_limit: float = None,
                       current_weights: np.ndarray = None) -> list:
    """Build a comprehensive set of portfolio constraints.

    Args:
        n_assets: Number of assets
        sector_map: Dict mapping sector name to list of asset indices
        max_weight: Maximum weight per asset
        min_weight: Minimum weight per asset
        max_sector: Maximum weight per sector
        turnover_limit: Maximum total turnover (sum of |delta_w|)
        current_weights: Current portfolio weights (needed for turnover)

    Returns:
        List of constraint dictionaries for scipy.optimize
    """
    constraints = [
        # Weights sum to 1
        {"type": "eq", "fun": lambda w: np.sum(w) - 1},
    ]

    # Sector constraints
    if sector_map:
        for sector, indices in sector_map.items():
            constraints.append({
                "type": "ineq",
                "fun": lambda w, idx=indices: max_sector - np.sum(w[idx]),
            })

    # Turnover constraint
    if turnover_limit is not None and current_weights is not None:
        constraints.append({
            "type": "ineq",
            "fun": lambda w: turnover_limit - np.sum(np.abs(w - current_weights)),
        })

    return constraints

# Example with sector constraints
sector_map = {
    "equity": [0, 4],      # SPY, EFA
    "fixed_income": [1],    # TLT
    "alternatives": [2, 3], # GLD, VNQ
}

custom_constraints = build_constraints(
    n_assets=5,
    sector_map=sector_map,
    max_weight=0.35,
    max_sector=0.60,
)
```

## Comparing Optimization Methods

```python
def compare_methods(mean_returns: np.ndarray, cov_matrix: np.ndarray,
                     tickers: list, risk_free_rate: float = 0.04) -> pd.DataFrame:
    """Compare different portfolio optimization methods.

    Args:
        mean_returns: Annualized returns
        cov_matrix: Annualized covariance matrix
        tickers: Asset names
        risk_free_rate: Risk-free rate

    Returns:
        Comparison DataFrame
    """
    n = len(tickers)

    methods = {}

    # 1. Equal Weight
    eq_w = np.ones(n) / n
    eq_ret = np.dot(eq_w, mean_returns)
    eq_vol = np.sqrt(np.dot(eq_w.T, np.dot(cov_matrix, eq_w)))
    methods["Equal Weight"] = {"weights": eq_w, "return": eq_ret, "volatility": eq_vol}

    # 2. Max Sharpe
    ms = max_sharpe_portfolio(mean_returns, cov_matrix, risk_free_rate)
    methods["Max Sharpe"] = ms

    # 3. Min Volatility
    mv = min_volatility_portfolio(cov_matrix)
    methods["Min Volatility"] = mv

    # 4. Risk Parity
    rp = risk_parity_portfolio(cov_matrix)
    methods["Risk Parity"] = rp

    # Build comparison table
    rows = []
    for name, m in methods.items():
        ret = m.get("return", np.dot(m["weights"], mean_returns))
        vol = m["volatility"]
        rows.append({
            "Method": name,
            "Return": f"{ret:.2%}",
            "Volatility": f"{vol:.2%}",
            "Sharpe": f"{(ret - risk_free_rate) / vol:.2f}" if vol > 0 else "N/A",
            **{t: f"{m['weights'][i]:.1%}" for i, t in enumerate(tickers)},
        })

    return pd.DataFrame(rows)

# Run comparison
mean_rets = returns.mean().values * 252
comparison = compare_methods(mean_rets, cov_matrix, tickers)
print(comparison.to_string(index=False))
```

## Common Pitfalls

1. **Optimizer sensitivity to inputs**: Small changes in expected returns or covariance can lead to dramatically different optimal weights. Black-Litterman and shrinkage help stabilize inputs.

2. **Not imposing realistic constraints**: Unconstrained optimization produces extreme portfolios. Always include weight bounds, sector limits, and turnover constraints for practical applications.

3. **Risk parity is not mean-variance optimal**: Risk parity ignores expected returns entirely. It produces well-diversified portfolios in terms of risk contribution but may not maximize risk-adjusted returns.

4. **Black-Litterman tau parameter sensitivity**: The tau parameter controls how much views move returns from equilibrium. Too high makes views dominate; too low makes views irrelevant. Typical range: 0.01 to 0.10.

5. **Ignoring transaction costs in rebalancing**: Optimal portfolios change daily, but trading has costs. Implement rebalancing bands (e.g., rebalance when weight drifts more than 5% from target) or schedule periodic rebalancing.

6. **Using cvxpy with non-convex objectives**: cvxpy only solves convex problems. Maximizing the Sharpe ratio directly is not convex. Either transform the problem (risk budgeting) or use scipy with SLSQP for non-convex cases.

## Cross-References

- **[mpt-basics](mpt-basics.md)** - Foundational theory and risk-return calculations
- **[efficient-frontier](efficient-frontier.md)** - Frontier computation and visualization
- **[capm-factor-models](capm-factor-models.md)** - Generating expected return inputs
- **[04-risk-management/var-methods](../04-risk-management/var-methods.md)** - Risk constraints for optimization
- **[01-financial-instruments/etfs-funds](../01-financial-instruments/etfs-funds.md)** - Implementing optimized portfolios with ETFs
