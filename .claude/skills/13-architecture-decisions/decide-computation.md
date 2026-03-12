---
name: decide-computation
description: "Choose between vectorized numpy, pandas operations, manual loops, and multiprocessing for financial calculations. Use when asking 'vectorized vs loops', 'when to use multiprocessing', 'computation strategy', 'Monte Carlo performance', 'numpy vs pandas speed', or 'parallel computation'."
---

# Decision: Computation Strategy

Choose the right computation approach for financial calculations: vectorized numpy/pandas, manual loops, multiprocessing, or GPU acceleration.

> **Skill Metadata**
> Category: `cross-cutting`
> Priority: `HIGH`

## Decision Matrix

| Calculation Type                  | Best Approach          | Why                                        |
| --------------------------------- | ---------------------- | ------------------------------------------ |
| **Bulk returns / rolling stats**  | Vectorized pandas      | Built-in, optimized C backend              |
| **Element-wise math on arrays**   | Vectorized numpy       | SIMD operations, no Python overhead        |
| **Path-dependent simulation**     | numpy loops            | State carries forward, hard to vectorize   |
| **Monte Carlo (many trials)**     | multiprocessing        | Embarrassingly parallel, scales with cores |
| **Large matrix operations**       | numpy / scipy.linalg   | BLAS/LAPACK optimized                      |
| **Optimization problems**         | cvxpy / scipy.optimize | Solver handles iteration                   |
| **Massive datasets (100M+ rows)** | Polars or Dask         | Out-of-core, lazy evaluation               |

## Vectorized pandas (Default Choice)

Use for any calculation that operates on entire columns or rolling windows.

```python
import pandas as pd
import numpy as np

prices = pd.read_csv("prices.csv", index_col="date", parse_dates=True)

# Daily returns -- vectorized, fast
returns = prices.pct_change().dropna()

# Rolling 21-day volatility, annualized
vol = returns.rolling(21).std() * np.sqrt(252)

# Cumulative returns
cumulative = (1 + returns).cumprod()

# Exponentially weighted moving average
ewma = prices.ewm(span=20).mean()

# Correlation matrix across all assets
corr_matrix = returns.corr()

# Drawdown calculation -- fully vectorized
peak = prices.cummax()
drawdown = (prices - peak) / peak
max_drawdown = drawdown.min()
```

**When to use:** Returns, moving averages, rolling statistics, cross-sectional analysis, resampling.

## Vectorized numpy (Performance-Critical)

Use when you need raw speed on arrays without DataFrame overhead.

```python
import numpy as np

# Simulating GBM paths -- vectorized across time steps
def simulate_gbm_vectorized(S0, mu, sigma, T, dt, n_paths):
    """Geometric Brownian Motion -- vectorized."""
    n_steps = int(T / dt)
    Z = np.random.standard_normal((n_steps, n_paths))
    drift = (mu - 0.5 * sigma**2) * dt
    diffusion = sigma * np.sqrt(dt) * Z
    log_returns = drift + diffusion
    log_paths = np.cumsum(log_returns, axis=0)
    paths = S0 * np.exp(log_paths)
    return np.vstack([np.full(n_paths, S0), paths])

# 10,000 paths in ~10ms
paths = simulate_gbm_vectorized(100, 0.08, 0.20, 1.0, 1/252, 10000)

# Portfolio variance -- matrix multiplication
weights = np.array([0.4, 0.3, 0.2, 0.1])
cov_matrix = np.array(...)  # 4x4 covariance
port_var = weights @ cov_matrix @ weights
port_vol = np.sqrt(port_var)

# VaR calculation -- vectorized percentile
portfolio_returns = returns @ weights
var_95 = np.percentile(portfolio_returns, 5)
cvar_95 = portfolio_returns[portfolio_returns <= var_95].mean()
```

**When to use:** Matrix math, random number generation, large array operations, custom indicators.

## Manual Loops (Path-Dependent Logic)

Use when the calculation at step `t` depends on the result at step `t-1` in a way that cannot be vectorized.

```python
import numpy as np

def price_american_option_binomial(S, K, T, r, sigma, N, option_type="call"):
    """American option pricing -- requires backward induction loop."""
    dt = T / N
    u = np.exp(sigma * np.sqrt(dt))
    d = 1 / u
    p = (np.exp(r * dt) - d) / (u - d)
    discount = np.exp(-r * dt)

    # Build price tree (vectorized where possible)
    prices = S * u ** np.arange(N, -1, -1) * d ** np.arange(0, N + 1)

    if option_type == "call":
        values = np.maximum(prices - K, 0)
    else:
        values = np.maximum(K - prices, 0)

    # Backward induction -- must loop (path-dependent early exercise)
    for i in range(N - 1, -1, -1):
        prices_at_i = S * u ** np.arange(i, -1, -1) * d ** np.arange(0, i + 1)
        hold_value = discount * (p * values[:i+1] + (1 - p) * values[1:i+2])
        if option_type == "call":
            exercise_value = np.maximum(prices_at_i - K, 0)
        else:
            exercise_value = np.maximum(K - prices_at_i, 0)
        values = np.maximum(hold_value, exercise_value)

    return values[0]

# Stop-loss backtest -- state-dependent
def backtest_with_stop_loss(prices, stop_loss_pct=-0.05):
    """Must loop because position depends on previous stop-loss triggers."""
    position = 1  # 1 = long, 0 = out
    entry_price = prices[0]
    equity = [1.0]

    for i in range(1, len(prices)):
        if position == 1:
            ret = (prices[i] - prices[i-1]) / prices[i-1]
            equity.append(equity[-1] * (1 + ret))
            # Check stop loss
            drawdown = (prices[i] - entry_price) / entry_price
            if drawdown <= stop_loss_pct:
                position = 0  # Exit
        else:
            equity.append(equity[-1])  # Flat
            # Re-entry logic
            if prices[i] > prices[i-1]:  # Simple re-entry
                position = 1
                entry_price = prices[i]

    return np.array(equity)
```

**When to use:** American options, path-dependent strategies, stop-loss logic, regime switching, any calculation where future steps depend on past decisions.

## Multiprocessing (Monte Carlo & Parameter Sweeps)

Use for embarrassingly parallel workloads like Monte Carlo simulations.

```python
import numpy as np
from multiprocessing import Pool
from functools import partial

def monte_carlo_chunk(n_paths, S0, mu, sigma, T, dt):
    """Run a chunk of Monte Carlo paths."""
    np.random.seed()  # Each process needs its own seed
    n_steps = int(T / dt)
    Z = np.random.standard_normal((n_steps, n_paths))
    drift = (mu - 0.5 * sigma**2) * dt
    diffusion = sigma * np.sqrt(dt) * Z
    final_prices = S0 * np.exp(np.sum(drift + diffusion, axis=0))
    return final_prices

def monte_carlo_option_price(S0, K, r, sigma, T, n_total=1_000_000, n_workers=8):
    """Price option using parallel Monte Carlo."""
    paths_per_worker = n_total // n_workers
    dt = 1 / 252

    worker_fn = partial(monte_carlo_chunk, paths_per_worker, S0, r, sigma, T, dt)

    with Pool(n_workers) as pool:
        results = pool.starmap(monte_carlo_chunk,
            [(paths_per_worker, S0, r, sigma, T, dt)] * n_workers)

    final_prices = np.concatenate(results)
    payoffs = np.maximum(final_prices - K, 0)
    price = np.exp(-r * T) * payoffs.mean()
    std_error = np.exp(-r * T) * payoffs.std() / np.sqrt(n_total)

    return price, std_error

# Parameter sweep -- also parallel
def sharpe_for_params(params):
    """Calculate Sharpe ratio for a parameter combination."""
    fast, slow = params
    # ... run backtest with these parameters ...
    return fast, slow, sharpe_ratio

param_grid = [(f, s) for f in range(5, 30) for s in range(20, 100) if f < s]
with Pool(8) as pool:
    results = pool.map(sharpe_for_params, param_grid)
```

**When to use:** Monte Carlo pricing, bootstrap confidence intervals, parameter optimization sweeps, stress testing across scenarios.

## Performance Comparison

| Approach              | 1M return calculations | Notes                       |
| --------------------- | ---------------------- | --------------------------- |
| **Python loop**       | ~2000ms                | Avoid for bulk calculations |
| **pandas vectorized** | ~5ms                   | 400x faster than loops      |
| **numpy vectorized**  | ~2ms                   | Fastest for pure arrays     |
| **multiprocessing**   | Depends on cores       | Linear scaling for parallel |

## Decision Flowchart

```
What kind of calculation?
  |
  |-- Operates on entire columns uniformly?
  |     YES -> Vectorized pandas/numpy
  |
  |-- Step t depends on step t-1 decisions?
  |     YES -> Loop (optimize inner ops with numpy)
  |
  |-- Same calculation, many independent runs?
  |     YES -> multiprocessing.Pool
  |
  |-- Matrix algebra (covariance, regression)?
  |     YES -> numpy / scipy.linalg
  |
  |-- Optimization with constraints?
        YES -> cvxpy (convex) or scipy.optimize (general)
```

## Quick Tips

- Always try vectorized first -- it is almost always fast enough
- Profile before parallelizing (multiprocessing has overhead)
- Use `np.random.seed()` in each worker process for reproducibility
- For loops, keep the inner operation vectorized where possible
- Consider Polars for DataFrames larger than memory
- numba `@jit` can accelerate unavoidable Python loops by 10-100x

<!-- Trigger Keywords: vectorized vs loops, when to use multiprocessing, computation strategy, Monte Carlo performance, numpy vs pandas speed, parallel computation, performance optimization, numba, GPU -->
