---
name: mpt-basics
description: "Modern Portfolio Theory basics covering Markowitz mean-variance framework, efficient frontier, risk-return tradeoff, diversification benefit, and correlation matrices. Use when asking about 'Markowitz', 'mean-variance', 'portfolio theory', 'diversification', 'correlation matrix', 'covariance matrix', 'portfolio risk', 'portfolio return', 'risk-return tradeoff', 'two-asset portfolio', or 'MPT'."
---

# Modern Portfolio Theory (MPT) Basics

Reference for the Markowitz mean-variance framework with complete Python implementations.

## Core Concepts

### Expected Return of a Portfolio

The portfolio expected return is the weighted average of individual asset expected returns.

**Formula**: E(Rp) = Sum of (wi \* E(Ri))

### Portfolio Variance

Portfolio risk depends on individual asset variances and their correlations.

**Two-asset case**:
sigma_p^2 = w1^2 _ sigma1^2 + w2^2 _ sigma2^2 + 2 _ w1 _ w2 _ sigma1 _ sigma2 \* rho12

**General case**:
sigma_p^2 = w^T _ Sigma _ w

Where w is the weight vector and Sigma is the covariance matrix.

## Building Blocks

### Returns Calculation

```python
import numpy as np
import pandas as pd
import yfinance as yf

def get_returns(tickers: list, period: str = "5y",
                frequency: str = "daily") -> pd.DataFrame:
    """Download and calculate returns for a list of tickers.

    Args:
        tickers: List of ticker symbols
        period: Historical period
        frequency: 'daily', 'weekly', or 'monthly'

    Returns:
        DataFrame of returns
    """
    data = yf.download(tickers, period=period, auto_adjust=True)["Close"]

    if frequency == "weekly":
        data = data.resample("W-FRI").last()
    elif frequency == "monthly":
        data = data.resample("ME").last()

    returns = data.pct_change().dropna()
    return returns

# Example
tickers = ["SPY", "TLT", "GLD", "VNQ", "EFA"]
returns = get_returns(tickers, period="5y")
print(f"Shape: {returns.shape}")
print(f"Date range: {returns.index[0].date()} to {returns.index[-1].date()}")
```

### Annualized Statistics

```python
def annualized_stats(returns: pd.DataFrame, trading_days: int = 252) -> pd.DataFrame:
    """Calculate annualized return, volatility, and Sharpe ratio.

    Args:
        returns: DataFrame of daily returns
        trading_days: Number of trading days per year

    Returns:
        DataFrame with annualized statistics
    """
    ann_return = returns.mean() * trading_days
    ann_vol = returns.std() * np.sqrt(trading_days)
    sharpe = ann_return / ann_vol

    stats = pd.DataFrame({
        "Ann. Return": ann_return,
        "Ann. Volatility": ann_vol,
        "Sharpe Ratio": sharpe,
    })

    return stats

stats = annualized_stats(returns)
print(stats.to_string(float_format="{:.4f}".format))
```

### Covariance and Correlation Matrices

```python
def portfolio_matrices(returns: pd.DataFrame,
                        trading_days: int = 252) -> tuple:
    """Calculate annualized covariance and correlation matrices.

    Args:
        returns: DataFrame of daily returns
        trading_days: Trading days per year

    Returns:
        Tuple of (covariance_matrix, correlation_matrix)
    """
    cov_matrix = returns.cov() * trading_days
    corr_matrix = returns.corr()
    return cov_matrix, corr_matrix

cov_matrix, corr_matrix = portfolio_matrices(returns)

print("Correlation Matrix:")
print(corr_matrix.round(3).to_string())
print("\nAnnualized Covariance Matrix:")
print(cov_matrix.round(6).to_string())
```

### Correlation Heatmap

```python
import matplotlib.pyplot as plt
import seaborn as sns

def plot_correlation_heatmap(corr_matrix: pd.DataFrame, title: str = "Correlation Matrix"):
    """Plot a correlation heatmap."""
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.heatmap(
        corr_matrix, annot=True, cmap="RdYlGn", center=0,
        fmt=".2f", square=True, linewidths=0.5, ax=ax,
        vmin=-1, vmax=1,
    )
    ax.set_title(title)
    return fig, ax

fig, ax = plot_correlation_heatmap(corr_matrix)
plt.tight_layout()
plt.savefig("correlation_heatmap.png", dpi=150)
plt.close()
```

## Portfolio Calculations

### Two-Asset Portfolio

```python
def two_asset_portfolio(r1: float, r2: float, sigma1: float, sigma2: float,
                         rho: float, w1: float) -> dict:
    """Calculate return and risk of a two-asset portfolio.

    Args:
        r1, r2: Expected returns
        sigma1, sigma2: Standard deviations
        rho: Correlation coefficient
        w1: Weight of asset 1 (w2 = 1 - w1)

    Returns:
        Portfolio return and risk
    """
    w2 = 1 - w1
    port_return = w1 * r1 + w2 * r2
    port_var = (w1**2 * sigma1**2 + w2**2 * sigma2**2 +
                2 * w1 * w2 * sigma1 * sigma2 * rho)
    port_std = np.sqrt(port_var)

    return {
        "return": port_return,
        "volatility": port_std,
        "variance": port_var,
        "weights": (w1, w2),
    }

# Demonstrate diversification benefit
r1, r2 = 0.10, 0.06
s1, s2 = 0.15, 0.08

print("Effect of correlation on portfolio risk (50/50 portfolio):")
for rho in [1.0, 0.5, 0.0, -0.5, -1.0]:
    result = two_asset_portfolio(r1, r2, s1, s2, rho, 0.5)
    print(f"  rho={rho:+.1f}: Return={result['return']:.2%}, Vol={result['volatility']:.2%}")
```

### Diversification Benefit Visualization

```python
def plot_diversification(r1, r2, s1, s2, correlations: list):
    """Plot the two-asset frontier for different correlation levels."""
    fig, ax = plt.subplots(figsize=(10, 7))

    for rho in correlations:
        weights = np.linspace(0, 1, 100)
        returns = []
        vols = []

        for w in weights:
            result = two_asset_portfolio(r1, r2, s1, s2, rho, w)
            returns.append(result["return"])
            vols.append(result["volatility"])

        ax.plot(vols, returns, label=f"rho = {rho:+.1f}", linewidth=1.5)

    ax.scatter([s1, s2], [r1, r2], color="red", s=100, zorder=5)
    ax.annotate("Asset 1", (s1, r1), textcoords="offset points", xytext=(10, 5))
    ax.annotate("Asset 2", (s2, r2), textcoords="offset points", xytext=(10, 5))

    ax.set_xlabel("Portfolio Volatility")
    ax.set_ylabel("Portfolio Return")
    ax.set_title("Diversification Benefit at Different Correlations")
    ax.legend()
    ax.grid(True, alpha=0.3)
    return fig, ax

fig, ax = plot_diversification(0.10, 0.06, 0.15, 0.08, [1.0, 0.5, 0.0, -0.5, -1.0])
plt.tight_layout()
plt.savefig("diversification.png", dpi=150)
plt.close()
```

### N-Asset Portfolio

```python
def portfolio_performance(weights: np.ndarray, mean_returns: np.ndarray,
                           cov_matrix: np.ndarray) -> tuple:
    """Calculate expected return and volatility for an N-asset portfolio.

    Args:
        weights: Array of portfolio weights
        mean_returns: Array of annualized expected returns
        cov_matrix: Annualized covariance matrix

    Returns:
        Tuple of (expected_return, volatility)
    """
    port_return = np.dot(weights, mean_returns)
    port_vol = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
    return port_return, port_vol

# Example with real data
mean_returns = returns.mean().values * 252
cov = returns.cov().values * 252

# Equal weight portfolio
n = len(tickers)
equal_weights = np.ones(n) / n
eq_ret, eq_vol = portfolio_performance(equal_weights, mean_returns, cov)
print(f"Equal-weight portfolio:")
print(f"  Return: {eq_ret:.2%}")
print(f"  Volatility: {eq_vol:.2%}")
print(f"  Sharpe: {eq_ret / eq_vol:.2f}")
```

## Monte Carlo Portfolio Simulation

```python
def monte_carlo_portfolios(mean_returns: np.ndarray, cov_matrix: np.ndarray,
                            n_portfolios: int = 10000,
                            risk_free_rate: float = 0.04) -> pd.DataFrame:
    """Generate random portfolios to visualize the feasible set.

    Args:
        mean_returns: Annualized expected returns
        cov_matrix: Annualized covariance matrix
        n_portfolios: Number of random portfolios
        risk_free_rate: Risk-free rate for Sharpe calculation

    Returns:
        DataFrame with portfolio return, volatility, Sharpe, and weights
    """
    n_assets = len(mean_returns)
    results = []

    for _ in range(n_portfolios):
        # Random weights that sum to 1
        w = np.random.random(n_assets)
        w = w / w.sum()

        ret, vol = portfolio_performance(w, mean_returns, cov_matrix)
        sharpe = (ret - risk_free_rate) / vol

        results.append({
            "return": ret,
            "volatility": vol,
            "sharpe": sharpe,
            **{f"w_{i}": w[i] for i in range(n_assets)},
        })

    return pd.DataFrame(results)

mc = monte_carlo_portfolios(mean_returns, cov, n_portfolios=5000)

# Find best Sharpe portfolio from simulation
best_idx = mc["sharpe"].idxmax()
best = mc.loc[best_idx]
print(f"Best Sharpe portfolio (from Monte Carlo):")
print(f"  Return: {best['return']:.2%}")
print(f"  Volatility: {best['volatility']:.2%}")
print(f"  Sharpe: {best['sharpe']:.2f}")
```

### Visualization

```python
def plot_monte_carlo(mc_results: pd.DataFrame, tickers: list = None):
    """Plot the Monte Carlo simulation results."""
    fig, ax = plt.subplots(figsize=(12, 8))

    scatter = ax.scatter(
        mc_results["volatility"] * 100,
        mc_results["return"] * 100,
        c=mc_results["sharpe"],
        cmap="viridis",
        s=2,
        alpha=0.5,
    )
    plt.colorbar(scatter, ax=ax, label="Sharpe Ratio")

    # Highlight max Sharpe
    best = mc_results.loc[mc_results["sharpe"].idxmax()]
    ax.scatter(best["volatility"] * 100, best["return"] * 100,
               color="red", s=200, marker="*", label="Max Sharpe")

    # Highlight min volatility
    min_vol = mc_results.loc[mc_results["volatility"].idxmin()]
    ax.scatter(min_vol["volatility"] * 100, min_vol["return"] * 100,
               color="blue", s=200, marker="*", label="Min Volatility")

    ax.set_xlabel("Annualized Volatility (%)")
    ax.set_ylabel("Annualized Return (%)")
    ax.set_title("Monte Carlo Portfolio Simulation")
    ax.legend()
    ax.grid(True, alpha=0.3)
    return fig, ax

fig, ax = plot_monte_carlo(mc)
plt.tight_layout()
plt.savefig("monte_carlo_portfolios.png", dpi=150)
plt.close()
```

## Risk-Return Metrics

```python
def portfolio_metrics(returns_series: pd.Series, risk_free_rate: float = 0.04,
                       trading_days: int = 252) -> dict:
    """Calculate comprehensive portfolio metrics.

    Args:
        returns_series: Daily portfolio returns
        risk_free_rate: Annual risk-free rate
        trading_days: Trading days per year

    Returns:
        Dictionary of risk-return metrics
    """
    daily_rf = risk_free_rate / trading_days
    excess_returns = returns_series - daily_rf

    ann_return = returns_series.mean() * trading_days
    ann_vol = returns_series.std() * np.sqrt(trading_days)

    # Sharpe ratio
    sharpe = (ann_return - risk_free_rate) / ann_vol

    # Sortino ratio (uses downside deviation)
    downside = returns_series[returns_series < daily_rf]
    downside_std = downside.std() * np.sqrt(trading_days) if len(downside) > 0 else ann_vol
    sortino = (ann_return - risk_free_rate) / downside_std

    # Maximum drawdown
    cum_returns = (1 + returns_series).cumprod()
    running_max = cum_returns.cummax()
    drawdown = (cum_returns - running_max) / running_max
    max_drawdown = drawdown.min()

    # Calmar ratio
    calmar = ann_return / abs(max_drawdown) if max_drawdown != 0 else np.inf

    return {
        "annualized_return": ann_return,
        "annualized_volatility": ann_vol,
        "sharpe_ratio": sharpe,
        "sortino_ratio": sortino,
        "max_drawdown": max_drawdown,
        "calmar_ratio": calmar,
        "skewness": returns_series.skew(),
        "kurtosis": returns_series.kurtosis(),
        "positive_days_pct": (returns_series > 0).mean(),
    }

# Equal-weight portfolio metrics
port_returns = (returns * equal_weights).sum(axis=1)
metrics = portfolio_metrics(port_returns)
for name, value in metrics.items():
    if isinstance(value, float):
        print(f"{name}: {value:.4f}")
```

## Common Pitfalls

1. **Using historical returns as expected returns**: Past returns are not a reliable predictor of future returns. MPT requires expected (forward-looking) returns, which is the hardest input to estimate.

2. **Estimation error in covariance matrix**: With N assets and T observations, you need T > N for the covariance matrix to be non-singular. Even then, estimation error grows with the number of assets. Consider shrinkage estimators (Ledoit-Wolf).

3. **Ignoring transaction costs**: The "optimal" portfolio changes daily, but frequent rebalancing incurs costs. Practical portfolios need rebalancing bands or scheduled rebalancing.

4. **Assuming normal distributions**: Financial returns have fat tails and are often skewed. Mean-variance optimization can underestimate tail risk. Consider using CVaR or other risk measures.

5. **Corner solutions**: Unconstrained optimization often concentrates the portfolio in a few assets. Use constraints (max weight, sector limits) to produce diversified portfolios.

6. **Confusing Sharpe ratio timeframe**: A daily Sharpe of 0.1 is much better than an annual Sharpe of 0.1. Always annualize before comparing. Annual Sharpe = Daily Sharpe \* sqrt(252).

## Cross-References

- **[capm-factor-models](capm-factor-models.md)** - Factor models for expected return estimation
- **[efficient-frontier](efficient-frontier.md)** - Computing and visualizing the efficient frontier
- **[portfolio-optimization](portfolio-optimization.md)** - Optimization techniques
- **[04-risk-management/var-methods](../04-risk-management/var-methods.md)** - Risk measures for portfolios
- **[01-financial-instruments/etfs-funds](../01-financial-instruments/etfs-funds.md)** - Implementing portfolios with ETFs
