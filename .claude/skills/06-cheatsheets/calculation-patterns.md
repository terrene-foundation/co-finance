# Common Calculation Patterns

Reusable Python patterns for financial calculations.

## Returns Calculations

### Daily Returns from Price Series

```python
import pandas as pd
import numpy as np

# Simple returns
df['returns'] = df['close'].pct_change()

# Log returns (additive across time)
df['log_returns'] = np.log(df['close'] / df['close'].shift(1))

# Cumulative returns
df['cumulative'] = (1 + df['returns']).cumprod() - 1

# Rolling returns (e.g., 20-day)
df['rolling_20d'] = df['close'].pct_change(periods=20)
```

### Annualization

```python
# Daily -> Annual
annual_return = df['returns'].mean() * 252
annual_vol = df['returns'].std() * np.sqrt(252)

# Monthly -> Annual
annual_return = df['monthly_returns'].mean() * 12
annual_vol = df['monthly_returns'].std() * np.sqrt(12)

# Weekly -> Annual
annual_return = df['weekly_returns'].mean() * 52
annual_vol = df['weekly_returns'].std() * np.sqrt(52)
```

## Risk Metrics Pipeline

### Complete Risk Report

```python
def risk_report(returns: pd.Series, risk_free_rate: float = 0.05) -> dict:
    """Generate comprehensive risk metrics from a returns series."""
    ann_return = returns.mean() * 252
    ann_vol = returns.std() * np.sqrt(252)

    # Sharpe
    sharpe = (ann_return - risk_free_rate) / ann_vol

    # Sortino
    downside = returns[returns < 0].std() * np.sqrt(252)
    sortino = (ann_return - risk_free_rate) / downside if downside > 0 else np.inf

    # Max drawdown
    cumulative = (1 + returns).cumprod()
    peak = cumulative.cummax()
    drawdown = (cumulative - peak) / peak
    max_dd = drawdown.min()

    # VaR and CVaR
    var_95 = np.percentile(returns.dropna(), 5)
    cvar_95 = returns[returns <= var_95].mean()

    # Calmar ratio
    calmar = ann_return / abs(max_dd) if max_dd != 0 else np.inf

    return {
        'annualized_return': ann_return,
        'annualized_volatility': ann_vol,
        'sharpe_ratio': sharpe,
        'sortino_ratio': sortino,
        'max_drawdown': max_dd,
        'var_95': var_95,
        'cvar_95': cvar_95,
        'calmar_ratio': calmar,
        'skewness': returns.skew(),
        'kurtosis': returns.kurtosis(),
    }
```

## Portfolio Analysis

### Efficient Frontier

```python
def efficient_frontier(returns_df: pd.DataFrame, n_portfolios: int = 5000,
                       risk_free_rate: float = 0.05) -> pd.DataFrame:
    """Generate random portfolios for efficient frontier visualization."""
    n_assets = len(returns_df.columns)
    mean_returns = returns_df.mean() * 252
    cov_matrix = returns_df.cov() * 252

    results = []
    for _ in range(n_portfolios):
        weights = np.random.dirichlet(np.ones(n_assets))
        port_return = np.dot(weights, mean_returns)
        port_vol = np.sqrt(np.dot(weights, np.dot(cov_matrix, weights)))
        sharpe = (port_return - risk_free_rate) / port_vol
        results.append({
            'return': port_return,
            'volatility': port_vol,
            'sharpe': sharpe,
            **{f'w_{col}': w for col, w in zip(returns_df.columns, weights)}
        })

    return pd.DataFrame(results)
```

### Minimum Variance Portfolio

```python
from scipy.optimize import minimize

def min_variance_portfolio(returns_df: pd.DataFrame) -> np.ndarray:
    """Find minimum variance portfolio weights."""
    n = len(returns_df.columns)
    cov_matrix = returns_df.cov() * 252

    def portfolio_vol(weights):
        return np.sqrt(np.dot(weights, np.dot(cov_matrix, weights)))

    constraints = {'type': 'eq', 'fun': lambda w: np.sum(w) - 1}
    bounds = tuple((0, 1) for _ in range(n))
    x0 = np.array([1/n] * n)

    result = minimize(portfolio_vol, x0, method='SLSQP',
                      bounds=bounds, constraints=constraints)
    return result.x
```

### Maximum Sharpe Portfolio

```python
def max_sharpe_portfolio(returns_df: pd.DataFrame,
                         risk_free_rate: float = 0.05) -> np.ndarray:
    """Find maximum Sharpe ratio portfolio weights."""
    n = len(returns_df.columns)
    mean_returns = returns_df.mean() * 252
    cov_matrix = returns_df.cov() * 252

    def neg_sharpe(weights):
        port_return = np.dot(weights, mean_returns)
        port_vol = np.sqrt(np.dot(weights, np.dot(cov_matrix, weights)))
        return -(port_return - risk_free_rate) / port_vol

    constraints = {'type': 'eq', 'fun': lambda w: np.sum(w) - 1}
    bounds = tuple((0, 1) for _ in range(n))
    x0 = np.array([1/n] * n)

    result = minimize(neg_sharpe, x0, method='SLSQP',
                      bounds=bounds, constraints=constraints)
    return result.x
```

## Time Series Patterns

### Rolling Correlation

```python
def rolling_correlation(series_a: pd.Series, series_b: pd.Series,
                        window: int = 60) -> pd.Series:
    """Calculate rolling correlation between two return series."""
    return series_a.rolling(window).corr(series_b)
```

### Regime Detection (Simple)

```python
def detect_volatility_regime(returns: pd.Series, window: int = 20) -> pd.Series:
    """Label periods as low/medium/high volatility."""
    rolling_vol = returns.rolling(window).std() * np.sqrt(252)
    q33 = rolling_vol.quantile(0.33)
    q66 = rolling_vol.quantile(0.66)
    return pd.cut(rolling_vol, bins=[-np.inf, q33, q66, np.inf],
                  labels=['low', 'medium', 'high'])
```

### Drawdown Analysis

```python
def drawdown_analysis(returns: pd.Series) -> pd.DataFrame:
    """Analyze drawdown periods."""
    cumulative = (1 + returns).cumprod()
    peak = cumulative.cummax()
    drawdown = (cumulative - peak) / peak

    # Find drawdown periods
    is_dd = drawdown < 0
    dd_starts = is_dd & ~is_dd.shift(1, fill_value=False)
    dd_ends = ~is_dd & is_dd.shift(1, fill_value=False)

    periods = []
    starts = drawdown.index[dd_starts]
    ends = drawdown.index[dd_ends]

    for i, start in enumerate(starts):
        end = ends[ends > start]
        if len(end) > 0:
            period = drawdown[start:end[0]]
            periods.append({
                'start': start,
                'end': end[0],
                'max_drawdown': period.min(),
                'duration_days': (end[0] - start).days,
            })

    return pd.DataFrame(periods)
```

## Monte Carlo Simulation

### Simple Price Simulation

```python
def monte_carlo_prices(current_price: float, mu: float, sigma: float,
                       days: int = 252, simulations: int = 10000) -> np.ndarray:
    """Simulate future prices using geometric Brownian motion."""
    dt = 1 / 252
    paths = np.zeros((simulations, days + 1))
    paths[:, 0] = current_price

    for t in range(1, days + 1):
        z = np.random.standard_normal(simulations)
        paths[:, t] = paths[:, t-1] * np.exp(
            (mu - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * z
        )

    return paths
```

### Portfolio Value at Risk (Monte Carlo)

```python
def portfolio_var_monte_carlo(weights: np.ndarray, mean_returns: np.ndarray,
                               cov_matrix: np.ndarray, portfolio_value: float,
                               days: int = 1, simulations: int = 10000,
                               confidence: float = 0.95) -> float:
    """Calculate portfolio VaR using Monte Carlo simulation."""
    port_return = np.dot(weights, mean_returns) * days
    port_vol = np.sqrt(np.dot(weights, np.dot(cov_matrix, weights))) * np.sqrt(days)

    simulated_returns = np.random.normal(port_return, port_vol, simulations)
    var = np.percentile(simulated_returns, (1 - confidence) * 100)

    return portfolio_value * abs(var)
```

## Data Validation Patterns

### Price Data Checks

```python
def validate_price_data(df: pd.DataFrame) -> list[str]:
    """Validate price data quality. Returns list of issues found."""
    issues = []

    # Check for missing values
    missing = df.isnull().sum()
    if missing.any():
        issues.append(f"Missing values: {missing[missing > 0].to_dict()}")

    # Check for negative prices
    if (df[['open', 'high', 'low', 'close']] < 0).any().any():
        issues.append("Negative prices found")

    # Check high >= low
    if (df['high'] < df['low']).any():
        issues.append("High < Low violations found")

    # Check for duplicate dates
    if df.index.duplicated().any():
        issues.append("Duplicate dates found")

    # Check for large gaps
    if hasattr(df.index, 'to_series'):
        gaps = df.index.to_series().diff()
        max_gap = gaps.max()
        if max_gap > pd.Timedelta(days=5):
            issues.append(f"Large gap found: {max_gap}")

    return issues
```

### Returns Sanity Check

```python
def validate_returns(returns: pd.Series, max_daily: float = 0.5) -> list[str]:
    """Check returns for anomalies."""
    issues = []

    if returns.isnull().sum() > len(returns) * 0.1:
        issues.append(f"More than 10% NaN values: {returns.isnull().sum()}")

    extreme = returns[returns.abs() > max_daily]
    if len(extreme) > 0:
        issues.append(f"Extreme returns (>{max_daily*100}%): {len(extreme)} occurrences")

    if returns.std() == 0:
        issues.append("Zero variance - constant returns")

    return issues
```
