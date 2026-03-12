---
name: decide-library
description: "Choose between pandas, numpy-financial, backtrader, QuantLib, cvxpy, and scipy for your financial project. Use when asking 'which library', 'pandas vs numpy', 'backtrader vs zipline', 'library selection', 'QuantLib vs manual', or 'best library for finance'."
---

# Library Selection Guide

Quick decision tree to choose the right Python library for financial computation: pandas, numpy-financial, backtrader, QuantLib, cvxpy, or scipy.

> **Skill Metadata**
> Category: `cross-cutting` (decision-support)
> Priority: `CRITICAL`

## Quick Decision Matrix

| Your Primary Need                     | Choose              | Why                                            |
| ------------------------------------- | ------------------- | ---------------------------------------------- |
| **Time series, returns, data**        | **pandas**          | DataFrames, rolling windows, resampling        |
| **NPV, IRR, PMT, FV**                 | **numpy-financial** | Dedicated TVM functions, vectorized            |
| **Strategy backtesting**              | **backtrader**      | Event-driven engine, analyzers, broker API     |
| **Derivatives pricing, yield curves** | **QuantLib**        | Industry-standard models, calibration          |
| **Portfolio optimization**            | **cvxpy**           | Convex optimization with constraints           |
| **Statistical tests, distributions**  | **scipy**           | Hypothesis tests, curve fitting, distributions |
| **Returns + optimization**            | **pandas + cvxpy**  | Data prep then optimize                        |
| **Full quant pipeline**               | **All of above**    | Each handles its strength                      |

## Library Comparison

### pandas (`pip install pandas`)

**The foundation for all financial data work**

**When to Choose:**

- Working with OHLCV price data
- Calculating returns, rolling statistics, moving averages
- Merging datasets (prices + fundamentals)
- Resampling time series (daily to monthly)
- Any tabular financial data manipulation

**Key Features:**

- DataFrame and Series with DatetimeIndex
- Rolling windows, expanding windows, EWM
- Resampling (daily -> weekly -> monthly)
- GroupBy for sector/portfolio analysis
- Read CSV, Excel, SQL, parquet, JSON

**Example:**

```python
import pandas as pd

prices = pd.read_csv("prices.csv", index_col="date", parse_dates=True)
returns = prices.pct_change().dropna()
rolling_vol = returns.rolling(21).std() * (252 ** 0.5)  # Annualized
cumulative = (1 + returns).cumprod()
```

### numpy-financial (`pip install numpy-financial`)

**Time-value-of-money calculations**

**When to Choose:**

- Net Present Value (NPV)
- Internal Rate of Return (IRR)
- Loan payment calculations (PMT)
- Future value / present value
- Amortization schedules

**Key Features:**

- `npf.npv()` - Net present value
- `npf.irr()` - Internal rate of return
- `npf.pmt()` - Periodic payment
- `npf.fv()` / `npf.pv()` - Future/present value
- `npf.nper()` - Number of periods
- Vectorized -- works on arrays

**Example:**

```python
import numpy_financial as npf

# NPV of cash flows at 10% discount rate
cash_flows = [-1000, 300, 400, 400, 200]
npv = npf.npv(0.10, cash_flows)

# Monthly mortgage payment
monthly_payment = npf.pmt(rate=0.05/12, nper=360, pv=-400000)

# IRR of an investment
irr = npf.irr(cash_flows)
```

### backtrader (`pip install backtrader`)

**Event-driven backtesting framework**

**When to Choose:**

- Backtesting trading strategies
- Strategy comparison with analyzers
- Simulating order execution and slippage
- Walk-forward optimization
- Paper trading / live trading bridge

**Key Features:**

- Event-driven architecture (next() method)
- Built-in indicators (SMA, RSI, MACD, Bollinger)
- Analyzers (Sharpe, drawdown, trade stats)
- Broker simulation (commission, slippage, margin)
- Multiple data feeds and timeframes
- Plotting with matplotlib integration

**Example:**

```python
import backtrader as bt

class SmaCross(bt.Strategy):
    params = dict(fast=10, slow=30)

    def __init__(self):
        sma_fast = bt.ind.SMA(period=self.p.fast)
        sma_slow = bt.ind.SMA(period=self.p.slow)
        self.crossover = bt.ind.CrossOver(sma_fast, sma_slow)

    def next(self):
        if self.crossover > 0:
            self.buy()
        elif self.crossover < 0:
            self.sell()

cerebro = bt.Cerebro()
cerebro.addstrategy(SmaCross)
data = bt.feeds.YahooFinanceCSVData(dataname="AAPL.csv")
cerebro.adddata(data)
cerebro.addanalyzer(bt.analyzers.SharpeRatio, _name="sharpe")
results = cerebro.run()
```

### QuantLib (`pip install QuantLib-Python`)

**Industry-standard derivatives pricing**

**When to Choose:**

- Options pricing (Black-Scholes, binomial, MC)
- Bond pricing and yield curve construction
- Interest rate modeling
- Credit derivatives
- Exotic derivatives
- Calibration of model parameters

**Key Features:**

- Black-Scholes-Merton pricing
- Binomial and trinomial trees
- Monte Carlo pricing engines
- Yield curve bootstrapping
- Day count conventions
- Calendar and schedule generation

**Example:**

```python
import QuantLib as ql

# European call option pricing
spot = 100.0
strike = 105.0
rate = 0.05
vol = 0.20
maturity = 1.0  # years

option = ql.EuropeanOption(
    ql.PlainVanillaPayoff(ql.Option.Call, strike),
    ql.EuropeanExercise(ql.Date(15, 6, 2027))
)

process = ql.BlackScholesMertonProcess(
    ql.QuoteHandle(ql.SimpleQuote(spot)),
    ql.YieldTermStructureHandle(ql.FlatForward(0, ql.TARGET(), rate, ql.Actual365Fixed())),
    ql.YieldTermStructureHandle(ql.FlatForward(0, ql.TARGET(), 0.0, ql.Actual365Fixed())),
    ql.BlackVolTermStructureHandle(ql.BlackConstantVol(0, ql.TARGET(), vol, ql.Actual365Fixed()))
)

option.setPricingEngine(ql.AnalyticEuropeanEngine(process))
price = option.NPV()
delta = option.delta()
```

### cvxpy (`pip install cvxpy`)

**Convex optimization for portfolio construction**

**When to Choose:**

- Mean-variance portfolio optimization
- Risk parity portfolios
- Minimum variance portfolios
- Portfolio with constraints (long-only, sector limits, turnover)
- Black-Litterman allocation

**Key Features:**

- Declarative optimization syntax
- Quadratic and linear objectives
- Rich constraint library
- Multiple solver backends (OSQP, ECOS, SCS)
- Works with numpy arrays directly

**Example:**

```python
import cvxpy as cp
import numpy as np

n_assets = 5
mu = np.array([0.12, 0.10, 0.07, 0.03, 0.15])  # Expected returns
Sigma = np.random.randn(n_assets, n_assets)
Sigma = Sigma @ Sigma.T / 100  # Covariance matrix

w = cp.Variable(n_assets)
ret = mu @ w
risk = cp.quad_form(w, Sigma)

prob = cp.Problem(
    cp.Maximize(ret - 0.5 * risk),
    [cp.sum(w) == 1, w >= 0]  # Long-only, fully invested
)
prob.solve()
optimal_weights = w.value
```

### scipy (`pip install scipy`)

**Statistical analysis and scientific computing**

**When to Choose:**

- Statistical hypothesis testing (t-test, KS test)
- Distribution fitting (normal, log-normal, t)
- Curve fitting and interpolation
- Numerical integration
- Non-convex optimization (when cvxpy is insufficient)

**Example:**

```python
from scipy import stats
import numpy as np

returns = np.random.normal(0.0008, 0.015, 252)

# Test for normality
stat, p_value = stats.jarque_bera(returns)

# Fit a t-distribution
params = stats.t.fit(returns)

# VaR using fitted distribution
var_95 = stats.t.ppf(0.05, *params)
```

## Decision Flowchart

```
START: What's your primary task?
  |
  |-- Data wrangling, returns, time series?
  |     YES -> pandas
  |
  |-- TVM (NPV, IRR, PMT)?
  |     YES -> numpy-financial
  |
  |-- Backtest a trading strategy?
  |     YES -> backtrader
  |
  |-- Price derivatives or build yield curves?
  |     YES -> QuantLib
  |
  |-- Optimize a portfolio?
  |     YES -> cvxpy
  |
  |-- Statistical tests or distribution fitting?
        YES -> scipy
```

## Combining Libraries

Most real projects use several libraries together:

```python
import pandas as pd
import numpy as np
import numpy_financial as npf
import cvxpy as cp

# Step 1: pandas for data loading and returns
prices = pd.read_csv("prices.csv", index_col="date", parse_dates=True)
returns = prices.pct_change().dropna()

# Step 2: numpy for covariance estimation
mu = returns.mean().values * 252
Sigma = returns.cov().values * 252

# Step 3: cvxpy for optimization
n = len(mu)
w = cp.Variable(n)
prob = cp.Problem(
    cp.Maximize(mu @ w - 0.5 * cp.quad_form(w, Sigma)),
    [cp.sum(w) == 1, w >= 0]
)
prob.solve()

# Step 4: pandas for results
weights = pd.Series(w.value, index=prices.columns)
print(weights.sort_values(ascending=False))
```

## Quick Tips

- Start with pandas -- almost every financial project needs it
- Use numpy-financial instead of reimplementing TVM formulas
- Choose backtrader for backtesting over building your own event loop
- Use QuantLib for anything involving day count conventions or yield curves
- Use cvxpy for portfolio optimization -- the constraint syntax is clean
- scipy fills gaps for statistics and non-standard optimization

<!--Trigger Keywords: which library, pandas vs numpy, backtrader vs zipline, library selection, QuantLib vs manual, best library for finance, choose library, library comparison, financial library decision -->
