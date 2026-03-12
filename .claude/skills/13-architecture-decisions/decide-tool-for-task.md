---
name: decide-tool-for-task
description: "Map common financial tasks to the best library or approach. Use when asking 'which tool for', 'how to calculate', 'best approach for', 'tool selection', 'financial task tool', or 'what library for'."
---

# Decision: Tool Selection for Financial Tasks

Map common financial tasks to the best Python library or approach.

> **Skill Metadata**
> Category: `cross-cutting`
> Priority: `CRITICAL`

## Quick Reference

### Data & Time Series

| Task                      | Best Tool                   | Example                                       |
| ------------------------- | --------------------------- | --------------------------------------------- |
| Load CSV/Excel prices     | `pandas`                    | `pd.read_csv("prices.csv")`                   |
| Calculate daily returns   | `pandas`                    | `prices.pct_change()`                         |
| Rolling moving average    | `pandas`                    | `prices.rolling(20).mean()`                   |
| Resample daily to monthly | `pandas`                    | `prices.resample("M").last()`                 |
| Merge price + fundamental | `pandas`                    | `pd.merge(prices, fundamentals, on="symbol")` |
| Handle missing data       | `pandas`                    | `prices.ffill()` or `prices.interpolate()`    |
| Read from SQL database    | `pandas + psycopg2/sqlite3` | `pd.read_sql(query, conn)`                    |
| Read parquet files        | `pandas + pyarrow`          | `pd.read_parquet("data.parquet")`             |

### Returns & Risk

| Task                      | Best Tool           | Example                                       |
| ------------------------- | ------------------- | --------------------------------------------- |
| Annualized return         | `pandas + numpy`    | `returns.mean() * 252`                        |
| Annualized volatility     | `pandas + numpy`    | `returns.std() * np.sqrt(252)`                |
| Sharpe ratio              | `pandas + numpy`    | `(ret - rf) / vol`                            |
| Sortino ratio             | `pandas + numpy`    | `(ret - rf) / downside_std`                   |
| Maximum drawdown          | `pandas`            | `(prices / prices.cummax() - 1).min()`        |
| Value at Risk (VaR)       | `numpy` or `scipy`  | `np.percentile(returns, 5)`                   |
| CVaR / Expected Shortfall | `numpy`             | `returns[returns <= var].mean()`              |
| Correlation matrix        | `pandas`            | `returns.corr()`                              |
| Covariance matrix         | `pandas` or `numpy` | `returns.cov() * 252`                         |
| Beta                      | `numpy`             | `np.cov(stock, market)[0,1] / np.var(market)` |

### Time Value of Money

| Task                    | Best Tool         | Example                       |
| ----------------------- | ----------------- | ----------------------------- |
| Net Present Value       | `numpy_financial` | `npf.npv(rate, cashflows)`    |
| Internal Rate of Return | `numpy_financial` | `npf.irr(cashflows)`          |
| Loan payment (PMT)      | `numpy_financial` | `npf.pmt(rate, nper, pv)`     |
| Future value            | `numpy_financial` | `npf.fv(rate, nper, pmt, pv)` |
| Present value           | `numpy_financial` | `npf.pv(rate, nper, pmt, fv)` |
| Number of periods       | `numpy_financial` | `npf.nper(rate, pmt, pv, fv)` |

### Backtesting

| Task                         | Best Tool    | Example                                |
| ---------------------------- | ------------ | -------------------------------------- |
| Backtest a strategy          | `backtrader` | Cerebro + Strategy class               |
| SMA crossover strategy       | `backtrader` | `bt.ind.CrossOver(sma_fast, sma_slow)` |
| Calculate Sharpe in backtest | `backtrader` | `bt.analyzers.SharpeRatio`             |
| Walk-forward analysis        | `backtrader` | Custom analyzer + date ranges          |
| Commission/slippage modeling | `backtrader` | `cerebro.broker.setcommission()`       |
| Multiple timeframes          | `backtrader` | `cerebro.resampledata()`               |

### Derivatives & Fixed Income

| Task                     | Best Tool             | Example                                   |
| ------------------------ | --------------------- | ----------------------------------------- |
| European option price    | `QuantLib`            | `AnalyticEuropeanEngine`                  |
| American option price    | `QuantLib`            | `BinomialVanillaEngine`                   |
| Black-Scholes Greeks     | `QuantLib` or manual  | `option.delta()`, `option.gamma()`        |
| Implied volatility       | `QuantLib` or `scipy` | Solver on BS formula                      |
| Bond pricing             | `QuantLib`            | `FixedRateBond` + `DiscountingBondEngine` |
| Yield curve construction | `QuantLib`            | `PiecewiseYieldCurve`                     |
| Day count conventions    | `QuantLib`            | `Actual360()`, `Thirty360()`              |

### Portfolio Optimization

| Task                       | Best Tool         | Example                                   |
| -------------------------- | ----------------- | ----------------------------------------- |
| Mean-variance optimization | `cvxpy`           | Maximize return - lambda \* risk          |
| Minimum variance portfolio | `cvxpy`           | Minimize `quad_form(w, Sigma)`            |
| Risk parity                | `scipy.optimize`  | Equal risk contribution                   |
| Black-Litterman            | `numpy` + `cvxpy` | Prior + views -> posterior -> optimize    |
| Efficient frontier         | `cvxpy` in loop   | Sweep target return, minimize risk        |
| Constraint handling        | `cvxpy`           | `w >= 0`, `cp.sum(w) == 1`, sector limits |

### Statistical Analysis

| Task                  | Best Tool                  | Example                     |
| --------------------- | -------------------------- | --------------------------- |
| Normality test        | `scipy.stats`              | `jarque_bera(returns)`      |
| Distribution fitting  | `scipy.stats`              | `t.fit(returns)`            |
| Hypothesis testing    | `scipy.stats`              | `ttest_1samp(returns, 0)`   |
| Linear regression     | `scipy.stats` or `sklearn` | `linregress(x, y)`          |
| Autocorrelation       | `statsmodels`              | `acf(returns)`              |
| ADF stationarity test | `statsmodels`              | `adfuller(prices)`          |
| GARCH volatility      | `arch`                     | `arch_model(returns).fit()` |

### Visualization

| Task                     | Best Tool                 | Example                            |
| ------------------------ | ------------------------- | ---------------------------------- |
| Candlestick charts       | `mplfinance`              | `mpf.plot(df, type="candle")`      |
| Interactive price charts | `plotly`                  | `px.line(df, x="date", y="close")` |
| Correlation heatmap      | `seaborn`                 | `sns.heatmap(corr_matrix)`         |
| Distribution plots       | `matplotlib` or `seaborn` | `plt.hist(returns, bins=50)`       |
| Efficient frontier plot  | `matplotlib`              | Scatter of risk vs return          |

## Quick Tips

- Start with pandas for data loading and basic calculations
- Use numpy-financial for TVM instead of reimplementing formulas
- Use backtrader for any backtesting more complex than a simple loop
- Use QuantLib when day count conventions or calibration matter
- Use cvxpy for constrained optimization -- cleaner than scipy.optimize for convex problems
- Always check if pandas has a built-in method before writing custom code

<!-- Trigger Keywords: which tool for, how to calculate, best approach for, tool selection, financial task tool, what library for, task mapping, financial calculation -->
