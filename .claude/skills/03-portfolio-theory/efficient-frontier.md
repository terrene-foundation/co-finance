---
name: efficient-frontier
description: "Efficient frontier reference covering computation, minimum variance portfolio, tangency portfolio, capital allocation line, and short-selling constraints. Use when asking about 'efficient frontier', 'minimum variance portfolio', 'tangency portfolio', 'capital allocation line', 'mean-variance frontier', 'optimal portfolio', 'maximum Sharpe portfolio', 'short selling constraints', 'feasible set', or 'portfolio frontier'."
---

# Efficient Frontier

Reference for computing and visualizing the efficient frontier with minimum variance and tangency portfolios.

## Concept

The efficient frontier is the set of portfolios that offer the highest expected return for each level of risk (or equivalently, the lowest risk for each level of return). Any portfolio below the frontier is suboptimal because you can achieve either higher return at the same risk or lower risk at the same return.

## Computing the Efficient Frontier

### Using scipy.optimize

```python
import numpy as np
import pandas as pd
import yfinance as yf
from scipy.optimize import minimize
import matplotlib.pyplot as plt

def get_portfolio_data(tickers: list, period: str = "5y") -> tuple:
    """Download data and compute annualized returns and covariance.

    Returns:
        Tuple of (mean_returns, cov_matrix, tickers)
    """
    data = yf.download(tickers, period=period, auto_adjust=True)["Close"]
    returns = data.pct_change().dropna()

    mean_returns = returns.mean().values * 252
    cov_matrix = returns.cov().values * 252

    return mean_returns, cov_matrix, tickers

def portfolio_volatility(weights, cov_matrix):
    """Calculate portfolio volatility."""
    return np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))

def portfolio_return(weights, mean_returns):
    """Calculate portfolio expected return."""
    return np.dot(weights, mean_returns)

def neg_sharpe_ratio(weights, mean_returns, cov_matrix, risk_free_rate):
    """Negative Sharpe ratio (for minimization)."""
    ret = portfolio_return(weights, mean_returns)
    vol = portfolio_volatility(weights, cov_matrix)
    return -(ret - risk_free_rate) / vol

def compute_efficient_frontier(mean_returns: np.ndarray, cov_matrix: np.ndarray,
                                n_points: int = 100,
                                allow_short: bool = False) -> pd.DataFrame:
    """Compute the efficient frontier.

    Args:
        mean_returns: Annualized expected returns
        cov_matrix: Annualized covariance matrix
        n_points: Number of points on the frontier
        allow_short: Whether to allow short selling

    Returns:
        DataFrame with return, volatility, and weights for each frontier point
    """
    n_assets = len(mean_returns)

    # Constraints
    constraints = [{"type": "eq", "fun": lambda w: np.sum(w) - 1}]

    if allow_short:
        bounds = tuple((-1, 1) for _ in range(n_assets))
    else:
        bounds = tuple((0, 1) for _ in range(n_assets))

    # First find the min and max return portfolios
    # Minimum variance portfolio
    result_minvar = minimize(
        portfolio_volatility, np.ones(n_assets) / n_assets,
        args=(cov_matrix,),
        method="SLSQP",
        bounds=bounds,
        constraints=constraints,
    )
    min_ret = portfolio_return(result_minvar.x, mean_returns)

    # Maximum return portfolio
    result_maxret = minimize(
        lambda w: -portfolio_return(w, mean_returns),
        np.ones(n_assets) / n_assets,
        method="SLSQP",
        bounds=bounds,
        constraints=constraints,
    )
    max_ret = portfolio_return(result_maxret.x, mean_returns)

    # Generate target returns
    target_returns = np.linspace(min_ret, max_ret, n_points)

    frontier = []
    for target in target_returns:
        cons = [
            {"type": "eq", "fun": lambda w: np.sum(w) - 1},
            {"type": "eq", "fun": lambda w, t=target: portfolio_return(w, mean_returns) - t},
        ]

        result = minimize(
            portfolio_volatility,
            np.ones(n_assets) / n_assets,
            args=(cov_matrix,),
            method="SLSQP",
            bounds=bounds,
            constraints=cons,
        )

        if result.success:
            frontier.append({
                "return": target,
                "volatility": portfolio_volatility(result.x, cov_matrix),
                **{f"w_{i}": result.x[i] for i in range(n_assets)},
            })

    return pd.DataFrame(frontier)

# Example
tickers = ["SPY", "TLT", "GLD", "VNQ", "EFA"]
mean_returns, cov_matrix, _ = get_portfolio_data(tickers)
frontier = compute_efficient_frontier(mean_returns, cov_matrix, allow_short=False)
```

## Minimum Variance Portfolio

The portfolio with the lowest possible volatility. Always on the efficient frontier.

```python
def minimum_variance_portfolio(mean_returns: np.ndarray, cov_matrix: np.ndarray,
                                allow_short: bool = False) -> dict:
    """Find the minimum variance portfolio.

    Args:
        mean_returns: Annualized expected returns
        cov_matrix: Annualized covariance matrix
        allow_short: Allow short positions

    Returns:
        Portfolio weights, return, and volatility
    """
    n_assets = len(mean_returns)
    constraints = [{"type": "eq", "fun": lambda w: np.sum(w) - 1}]
    bounds = tuple((-1, 1) if allow_short else (0, 1) for _ in range(n_assets))

    result = minimize(
        portfolio_volatility,
        np.ones(n_assets) / n_assets,
        args=(cov_matrix,),
        method="SLSQP",
        bounds=bounds,
        constraints=constraints,
    )

    weights = result.x
    ret = portfolio_return(weights, mean_returns)
    vol = portfolio_volatility(weights, cov_matrix)

    return {
        "weights": weights,
        "return": ret,
        "volatility": vol,
        "sharpe": ret / vol if vol > 0 else 0,
    }

minvar = minimum_variance_portfolio(mean_returns, cov_matrix)
print("Minimum Variance Portfolio:")
print(f"  Return: {minvar['return']:.2%}")
print(f"  Volatility: {minvar['volatility']:.2%}")
for i, t in enumerate(tickers):
    print(f"  {t}: {minvar['weights'][i]:.2%}")
```

## Tangency Portfolio (Maximum Sharpe Ratio)

The portfolio where the Capital Allocation Line is tangent to the efficient frontier. This gives the highest Sharpe ratio.

```python
def tangency_portfolio(mean_returns: np.ndarray, cov_matrix: np.ndarray,
                        risk_free_rate: float = 0.04,
                        allow_short: bool = False) -> dict:
    """Find the tangency (maximum Sharpe ratio) portfolio.

    Args:
        mean_returns: Annualized expected returns
        cov_matrix: Annualized covariance matrix
        risk_free_rate: Risk-free rate
        allow_short: Allow short positions

    Returns:
        Portfolio weights, return, volatility, and Sharpe ratio
    """
    n_assets = len(mean_returns)
    constraints = [{"type": "eq", "fun": lambda w: np.sum(w) - 1}]
    bounds = tuple((-1, 1) if allow_short else (0, 1) for _ in range(n_assets))

    result = minimize(
        neg_sharpe_ratio,
        np.ones(n_assets) / n_assets,
        args=(mean_returns, cov_matrix, risk_free_rate),
        method="SLSQP",
        bounds=bounds,
        constraints=constraints,
    )

    weights = result.x
    ret = portfolio_return(weights, mean_returns)
    vol = portfolio_volatility(weights, cov_matrix)
    sharpe = (ret - risk_free_rate) / vol

    return {
        "weights": weights,
        "return": ret,
        "volatility": vol,
        "sharpe": sharpe,
    }

tangent = tangency_portfolio(mean_returns, cov_matrix, risk_free_rate=0.04)
print("\nTangency Portfolio (Max Sharpe):")
print(f"  Return: {tangent['return']:.2%}")
print(f"  Volatility: {tangent['volatility']:.2%}")
print(f"  Sharpe: {tangent['sharpe']:.2f}")
for i, t in enumerate(tickers):
    print(f"  {t}: {tangent['weights'][i]:.2%}")
```

## Capital Allocation Line (CAL)

The line connecting the risk-free asset to the tangency portfolio. Any point on this line is achievable by mixing the risk-free asset with the tangency portfolio.

```python
def capital_allocation_line(tangency_return: float, tangency_vol: float,
                             risk_free_rate: float,
                             vol_range: np.ndarray = None) -> tuple:
    """Calculate points on the Capital Allocation Line.

    Args:
        tangency_return: Return of the tangency portfolio
        tangency_vol: Volatility of the tangency portfolio
        risk_free_rate: Risk-free rate
        vol_range: Range of volatilities to compute

    Returns:
        Tuple of (volatilities, returns)
    """
    if vol_range is None:
        vol_range = np.linspace(0, tangency_vol * 1.5, 100)

    sharpe = (tangency_return - risk_free_rate) / tangency_vol
    cal_returns = risk_free_rate + sharpe * vol_range

    return vol_range, cal_returns
```

## Complete Visualization

```python
def plot_efficient_frontier(frontier: pd.DataFrame, mean_returns: np.ndarray,
                             cov_matrix: np.ndarray, tickers: list,
                             risk_free_rate: float = 0.04):
    """Plot the efficient frontier with key portfolios and CAL.

    Args:
        frontier: DataFrame from compute_efficient_frontier
        mean_returns: Annualized returns
        cov_matrix: Annualized covariance matrix
        tickers: Asset ticker names
        risk_free_rate: Risk-free rate
    """
    fig, ax = plt.subplots(figsize=(12, 8))

    # Efficient frontier
    ax.plot(frontier["volatility"] * 100, frontier["return"] * 100,
            "b-", linewidth=2, label="Efficient Frontier")

    # Individual assets
    individual_vols = [np.sqrt(cov_matrix[i, i]) * 100 for i in range(len(tickers))]
    individual_rets = [mean_returns[i] * 100 for i in range(len(tickers))]
    ax.scatter(individual_vols, individual_rets, s=100, color="orange", zorder=5)
    for i, t in enumerate(tickers):
        ax.annotate(t, (individual_vols[i], individual_rets[i]),
                    textcoords="offset points", xytext=(8, 3), fontsize=10)

    # Minimum variance portfolio
    minvar = minimum_variance_portfolio(mean_returns, cov_matrix)
    ax.scatter(minvar["volatility"] * 100, minvar["return"] * 100,
               s=200, color="blue", marker="*", zorder=6, label="Min Variance")

    # Tangency portfolio
    tangent = tangency_portfolio(mean_returns, cov_matrix, risk_free_rate)
    ax.scatter(tangent["volatility"] * 100, tangent["return"] * 100,
               s=200, color="red", marker="*", zorder=6, label="Max Sharpe")

    # Capital Allocation Line
    cal_vols, cal_rets = capital_allocation_line(
        tangent["return"], tangent["volatility"], risk_free_rate
    )
    ax.plot(cal_vols * 100, cal_rets * 100, "r--", linewidth=1, alpha=0.7,
            label="Capital Allocation Line")

    # Risk-free point
    ax.scatter(0, risk_free_rate * 100, s=100, color="green",
               marker="D", zorder=6, label=f"Risk-Free ({risk_free_rate:.0%})")

    ax.set_xlabel("Annualized Volatility (%)")
    ax.set_ylabel("Annualized Return (%)")
    ax.set_title("Efficient Frontier with Capital Allocation Line")
    ax.legend(loc="upper left")
    ax.grid(True, alpha=0.3)
    ax.set_xlim(left=0)
    return fig, ax

fig, ax = plot_efficient_frontier(frontier, mean_returns, cov_matrix, tickers)
plt.tight_layout()
plt.savefig("efficient_frontier.png", dpi=150)
plt.close()
```

## Short-Selling Constraints

```python
def compare_frontiers(mean_returns: np.ndarray, cov_matrix: np.ndarray,
                       tickers: list):
    """Compare efficient frontiers with and without short selling."""
    frontier_long = compute_efficient_frontier(mean_returns, cov_matrix,
                                                allow_short=False)
    frontier_short = compute_efficient_frontier(mean_returns, cov_matrix,
                                                 allow_short=True)

    fig, ax = plt.subplots(figsize=(12, 8))

    ax.plot(frontier_long["volatility"] * 100, frontier_long["return"] * 100,
            "b-", linewidth=2, label="Long Only")
    ax.plot(frontier_short["volatility"] * 100, frontier_short["return"] * 100,
            "r--", linewidth=2, label="With Short Selling")

    # Individual assets
    for i, t in enumerate(tickers):
        vol = np.sqrt(cov_matrix[i, i]) * 100
        ret = mean_returns[i] * 100
        ax.scatter(vol, ret, s=80, color="gray", zorder=5)
        ax.annotate(t, (vol, ret), textcoords="offset points", xytext=(8, 3))

    ax.set_xlabel("Annualized Volatility (%)")
    ax.set_ylabel("Annualized Return (%)")
    ax.set_title("Efficient Frontier: Long Only vs Short Selling Allowed")
    ax.legend()
    ax.grid(True, alpha=0.3)
    return fig, ax

fig, ax = compare_frontiers(mean_returns, cov_matrix, tickers)
plt.tight_layout()
plt.savefig("frontier_comparison.png", dpi=150)
plt.close()
```

## Weight Allocation Along the Frontier

```python
def plot_frontier_weights(frontier: pd.DataFrame, tickers: list):
    """Visualize how portfolio weights change along the efficient frontier."""
    weight_cols = [col for col in frontier.columns if col.startswith("w_")]

    fig, ax = plt.subplots(figsize=(12, 6))

    # Stacked area chart of weights vs target return
    returns_pct = frontier["return"] * 100
    bottom = np.zeros(len(frontier))

    colors = plt.cm.Set3(np.linspace(0, 1, len(tickers)))
    for i, (col, ticker) in enumerate(zip(weight_cols, tickers)):
        values = frontier[col].values * 100
        ax.fill_between(returns_pct, bottom, bottom + values,
                        label=ticker, color=colors[i], alpha=0.7)
        bottom += values

    ax.set_xlabel("Target Return (%)")
    ax.set_ylabel("Weight (%)")
    ax.set_title("Portfolio Weights Along the Efficient Frontier")
    ax.legend(loc="center left", bbox_to_anchor=(1, 0.5))
    ax.grid(True, alpha=0.3)
    return fig, ax

fig, ax = plot_frontier_weights(frontier, tickers)
plt.tight_layout()
plt.savefig("frontier_weights.png", dpi=150)
plt.close()
```

## Common Pitfalls

1. **Sensitivity to expected return inputs**: The efficient frontier is very sensitive to expected return estimates. Small changes in expected returns can lead to dramatically different optimal portfolios. This is the primary practical limitation of mean-variance optimization.

2. **Using historical returns as expected returns**: Historical returns are a poor proxy for expected future returns. Consider using CAPM, factor models, or Black-Litterman to generate more robust expected return estimates.

3. **Ignoring estimation error**: The covariance matrix estimated from historical data has substantial sampling error, especially with many assets and limited observations. Use shrinkage estimators (Ledoit-Wolf) or factor-based covariance models.

4. **Neglecting the role of the risk-free asset**: The CAL (combining the risk-free asset with the tangency portfolio) often dominates any point on the frontier. Including a risk-free asset fundamentally changes the optimization problem.

5. **Unrealistic short positions**: Unconstrained optimization may suggest large short positions that are impossible or very expensive in practice. Always consider the impact of short-selling constraints, borrowing costs, and margin requirements.

6. **Concentrating in too few assets**: Without maximum weight constraints, the optimizer often concentrates in 2-3 assets. Add weight caps (e.g., max 25% per asset) for practical portfolios.

## Cross-References

- **[mpt-basics](mpt-basics.md)** - Underlying theory and calculations
- **[portfolio-optimization](portfolio-optimization.md)** - Advanced optimization methods
- **[capm-factor-models](capm-factor-models.md)** - Estimating expected returns for frontier inputs
- **[04-risk-management/var-methods](../04-risk-management/var-methods.md)** - Risk measures for frontier portfolios
- **[01-financial-instruments/etfs-funds](../01-financial-instruments/etfs-funds.md)** - Implementing frontier portfolios with ETFs
