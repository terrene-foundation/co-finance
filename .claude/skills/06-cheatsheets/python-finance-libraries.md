# Python Finance Library Quick Reference

Quick reference for Python libraries commonly used in financial applications.

## Core Libraries

### pandas - Data Manipulation

```python
import pandas as pd

# Read CSV price data
df = pd.read_csv('prices.csv', parse_dates=['date'], index_col='date')

# Resample daily to monthly
monthly = df['close'].resample('ME').last()

# Rolling calculations
df['sma_20'] = df['close'].rolling(20).mean()
df['vol_20'] = df['returns'].rolling(20).std() * np.sqrt(252)

# Percentage change (returns)
df['returns'] = df['close'].pct_change()

# Shift for lagged values
df['prev_close'] = df['close'].shift(1)

# Group by year
annual = df.groupby(df.index.year)['returns'].sum()

# Pivot table
pivot = df.pivot_table(values='close', index='date', columns='ticker')
```

### numpy - Numerical Computing

```python
import numpy as np

# Array operations
weights = np.array([0.4, 0.3, 0.2, 0.1])
returns = np.array([0.12, 0.08, 0.15, 0.05])

# Dot product (portfolio return)
port_return = np.dot(weights, returns)

# Covariance matrix
cov = np.cov(returns_matrix.T)

# Linear algebra
eigenvalues, eigenvectors = np.linalg.eig(cov)

# Random for Monte Carlo
np.random.seed(42)
simulated = np.random.normal(mu, sigma, (10000, 252))

# Percentile (VaR)
var_95 = np.percentile(returns, 5)
```

### numpy-financial - TVM Calculations

```python
import numpy_financial as npf

npf.pv(rate, nper, pmt, fv=0)     # Present Value
npf.fv(rate, nper, pmt, pv=0)     # Future Value
npf.pmt(rate, nper, pv, fv=0)     # Payment
npf.nper(rate, pmt, pv, fv=0)     # Number of periods
npf.rate(nper, pmt, pv, fv=0)     # Interest rate
npf.npv(rate, values)              # Net Present Value
npf.irr(values)                    # Internal Rate of Return
npf.mirr(values, finance_rate, reinvest_rate)  # Modified IRR
```

### scipy - Scientific Computing

```python
from scipy import stats, optimize

# Normal distribution
z_score = stats.norm.ppf(0.95)        # Inverse CDF
prob = stats.norm.cdf(1.96)            # CDF
pdf_val = stats.norm.pdf(0, 0, 1)      # PDF

# Optimization (portfolio)
from scipy.optimize import minimize
result = minimize(neg_sharpe, x0, method='SLSQP', bounds=bounds, constraints=constraints)

# Root finding (YTM)
from scipy.optimize import brentq
ytm = brentq(price_diff_func, 0.001, 1.0)

# Regression
slope, intercept, r, p, se = stats.linregress(x, y)

# Curve fitting
from scipy.interpolate import CubicSpline
cs = CubicSpline(maturities, yields)
```

## Data Access Libraries

### yfinance - Yahoo Finance

```python
import yfinance as yf

# Single ticker
ticker = yf.Ticker("AAPL")
hist = ticker.history(period="1y")
info = ticker.info

# Multiple tickers
data = yf.download(["AAPL", "MSFT", "GOOGL"], start="2023-01-01")
closes = data['Close']

# Options chain
options = ticker.options  # expiration dates
chain = ticker.option_chain(options[0])
calls = chain.calls
puts = chain.puts

# Fundamentals
balance_sheet = ticker.balance_sheet
income_stmt = ticker.income_stmt
cashflow = ticker.cashflow
```

### pandas-datareader - FRED & More

```python
import pandas_datareader as pdr

# Federal Reserve (FRED)
gdp = pdr.get_data_fred('GDP', start='2020-01-01')
cpi = pdr.get_data_fred('CPIAUCSL', start='2020-01-01')
fed_rate = pdr.get_data_fred('DFF', start='2020-01-01')

# Multiple series
data = pdr.get_data_fred(['GDP', 'UNRATE', 'CPIAUCSL'], start='2020-01-01')
```

### Alpha Vantage

```python
import os
import requests

API_KEY = os.environ["ALPHA_VANTAGE_KEY"]

# Daily prices
url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey={API_KEY}"
response = requests.get(url)
data = response.json()

# Forex
url = f"https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey={API_KEY}"
```

## Visualization Libraries

### matplotlib + mplfinance

```python
import matplotlib.pyplot as plt
import mplfinance as mpf

# Basic price chart
plt.figure(figsize=(12, 6))
plt.plot(df.index, df['close'])
plt.title('Price History')
plt.xlabel('Date')
plt.ylabel('Price')
plt.show()

# Candlestick chart
mpf.plot(df, type='candle', volume=True, mav=(20, 50),
         style='yahoo', title='AAPL')

# Save to file
mpf.plot(df, type='candle', savefig='chart.png')
```

### plotly - Interactive Charts

```python
import plotly.graph_objects as go

fig = go.Figure(data=[go.Candlestick(
    x=df.index, open=df['Open'], high=df['High'],
    low=df['Low'], close=df['Close']
)])
fig.update_layout(title='AAPL', xaxis_rangeslider_visible=False)
fig.show()

# Multiple subplots
from plotly.subplots import make_subplots
fig = make_subplots(rows=2, cols=1, shared_xaxes=True,
                    row_heights=[0.7, 0.3])
fig.add_trace(go.Scatter(x=df.index, y=df['close'], name='Price'), row=1, col=1)
fig.add_trace(go.Bar(x=df.index, y=df['volume'], name='Volume'), row=2, col=1)
```

## Specialized Finance Libraries

### QuantLib - Derivatives Pricing

```python
import QuantLib as ql

# Date setup
today = ql.Date(15, 3, 2026)
ql.Settings.instance().evaluationDate = today

# Black-Scholes European option
option_type = ql.Option.Call
strike = 100
maturity = ql.Date(15, 9, 2026)
exercise = ql.EuropeanExercise(maturity)
payoff = ql.PlainVanillaPayoff(option_type, strike)
option = ql.VanillaOption(payoff, exercise)

# Set up pricing engine
spot = ql.SimpleQuote(105)
rate = ql.SimpleQuote(0.05)
vol = ql.SimpleQuote(0.20)
# ... (full setup requires yield/dividend/vol term structures)
```

### backtrader - Backtesting

```python
import backtrader as bt

class SMAStrategy(bt.Strategy):
    params = (('period', 20),)

    def __init__(self):
        self.sma = bt.indicators.SMA(self.data.close, period=self.p.period)

    def next(self):
        if self.data.close[0] > self.sma[0] and not self.position:
            self.buy()
        elif self.data.close[0] < self.sma[0] and self.position:
            self.sell()

cerebro = bt.Cerebro()
cerebro.addstrategy(SMAStrategy)
data = bt.feeds.YahooFinanceData(dataname='AAPL', fromdate=start, todate=end)
cerebro.adddata(data)
cerebro.run()
```

### cvxpy - Portfolio Optimization

```python
import cvxpy as cp

n = len(expected_returns)
w = cp.Variable(n)
ret = expected_returns @ w
risk = cp.quad_form(w, cov_matrix)

# Maximize Sharpe (approximate)
objective = cp.Maximize(ret - 0.5 * risk_aversion * risk)
constraints = [cp.sum(w) == 1, w >= 0]
prob = cp.Problem(objective, constraints)
prob.solve()
optimal_weights = w.value
```

## Install Commands

```bash
pip install pandas numpy numpy-financial scipy
pip install yfinance pandas-datareader
pip install matplotlib mplfinance plotly
pip install QuantLib-Python backtrader cvxpy
```

## Library Selection Guide

| Task                   | Library                  | Why                     |
| ---------------------- | ------------------------ | ----------------------- |
| Price data download    | yfinance                 | Free, simple API        |
| Economic data          | pandas-datareader (FRED) | Official FRED access    |
| Time series analysis   | pandas                   | Industry standard       |
| TVM calculations       | numpy-financial          | Clean API for PV/FV/IRR |
| Portfolio optimization | cvxpy                    | Convex optimization     |
| Options pricing        | QuantLib or scipy        | QuantLib for production |
| Backtesting            | backtrader               | Full-featured framework |
| Static charts          | matplotlib/mplfinance    | Publication quality     |
| Interactive charts     | plotly                   | Web-ready, interactive  |
| Monte Carlo            | numpy                    | Fast random generation  |
