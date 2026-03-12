# Common Financial Formulas Cheatsheet

Quick reference for financial formulas and their Python implementations.

## Time Value of Money

### Present Value (PV)

```
PV = FV / (1 + r)^n
```

```python
import numpy_financial as npf
pv = npf.pv(rate=0.05, nper=10, pmt=0, fv=-1000)  # = 613.91
```

### Future Value (FV)

```
FV = PV * (1 + r)^n
```

```python
fv = npf.fv(rate=0.05, nper=10, pmt=0, pv=-1000)  # = 1628.89
```

### Net Present Value (NPV)

```
NPV = sum(CF_t / (1 + r)^t) for t = 0..n
```

```python
cashflows = [-1000, 200, 300, 400, 500]
npv = npf.npv(rate=0.10, values=cashflows)
```

### Internal Rate of Return (IRR)

```
NPV = 0 => solve for r
```

```python
irr = npf.irr([-1000, 200, 300, 400, 500])
```

### Payment (PMT)

```
PMT = PV * r / (1 - (1 + r)^(-n))
```

```python
monthly_payment = npf.pmt(rate=0.05/12, nper=360, pv=-250000)
```

## Returns

### Simple Return

```
R = (P1 - P0) / P0
```

```python
simple_return = (price_end - price_start) / price_start
# Or with pandas:
df['returns'] = df['close'].pct_change()
```

### Log Return

```
r = ln(P1 / P0)
```

```python
import numpy as np
log_return = np.log(price_end / price_start)
df['log_returns'] = np.log(df['close'] / df['close'].shift(1))
```

### Annualized Return

```
R_annual = (1 + R_total)^(252/n) - 1
```

```python
total_return = (df['close'].iloc[-1] / df['close'].iloc[0]) - 1
n_days = len(df)
annualized = (1 + total_return) ** (252 / n_days) - 1
```

### CAGR (Compound Annual Growth Rate)

```
CAGR = (V_final / V_initial)^(1/years) - 1
```

```python
years = (end_date - start_date).days / 365.25
cagr = (final_value / initial_value) ** (1 / years) - 1
```

## Risk Metrics

### Standard Deviation (Volatility)

```
sigma = sqrt(sum((R_i - R_mean)^2) / (n-1))
```

```python
daily_vol = df['returns'].std()
annual_vol = daily_vol * np.sqrt(252)
```

### Sharpe Ratio

```
S = (R_p - R_f) / sigma_p
```

```python
risk_free = 0.05  # annualized
excess_return = df['returns'].mean() * 252 - risk_free
sharpe = excess_return / (df['returns'].std() * np.sqrt(252))
```

### Sortino Ratio

```
Sortino = (R_p - R_f) / sigma_downside
```

```python
downside = df['returns'][df['returns'] < 0].std() * np.sqrt(252)
sortino = (df['returns'].mean() * 252 - risk_free) / downside
```

### Maximum Drawdown

```
MDD = min((Peak - Trough) / Peak)
```

```python
cumulative = (1 + df['returns']).cumprod()
peak = cumulative.cummax()
drawdown = (cumulative - peak) / peak
max_drawdown = drawdown.min()
```

### Beta

```
beta = Cov(R_asset, R_market) / Var(R_market)
```

```python
cov_matrix = np.cov(asset_returns, market_returns)
beta = cov_matrix[0, 1] / cov_matrix[1, 1]
```

### Alpha (Jensen's Alpha)

```
alpha = R_p - (R_f + beta * (R_m - R_f))
```

```python
alpha = portfolio_return - (risk_free + beta * (market_return - risk_free))
```

### Value at Risk (VaR) - Historical

```
VaR_alpha = percentile(returns, alpha)
```

```python
var_95 = np.percentile(df['returns'], 5)  # 5% VaR
var_99 = np.percentile(df['returns'], 1)  # 1% VaR
```

### Conditional VaR (CVaR / Expected Shortfall)

```
CVaR = E[R | R <= VaR]
```

```python
var_95 = np.percentile(df['returns'], 5)
cvar_95 = df['returns'][df['returns'] <= var_95].mean()
```

## Portfolio Math

### Portfolio Return

```
R_p = sum(w_i * R_i)
```

```python
weights = np.array([0.4, 0.3, 0.3])
returns = np.array([0.12, 0.08, 0.15])
portfolio_return = np.dot(weights, returns)
```

### Portfolio Variance

```
sigma_p^2 = w^T * Sigma * w
```

```python
cov_matrix = returns_df.cov() * 252  # annualized
port_variance = np.dot(weights, np.dot(cov_matrix, weights))
port_vol = np.sqrt(port_variance)
```

### Correlation

```
rho = Cov(X, Y) / (sigma_X * sigma_Y)
```

```python
correlation = returns_df.corr()
```

## Fixed Income

### Bond Price

```
P = sum(C / (1+y)^t) + F / (1+y)^n
```

```python
def bond_price(face, coupon_rate, ytm, years, freq=2):
    c = face * coupon_rate / freq
    n = years * freq
    y = ytm / freq
    pv_coupons = c * (1 - (1 + y) ** -n) / y
    pv_face = face / (1 + y) ** n
    return pv_coupons + pv_face
```

### Duration (Macaulay)

```
D = sum(t * CF_t / (1+y)^t) / P
```

### Modified Duration

```
D_mod = D_mac / (1 + y/freq)
```

### Yield to Maturity

```
Solve: P = sum(C/(1+y)^t) + F/(1+y)^n for y
```

```python
from scipy.optimize import brentq

def ytm(price, face, coupon_rate, years, freq=2):
    c = face * coupon_rate / freq
    n = years * freq
    def price_diff(y):
        y_per = y / freq
        return c * (1 - (1+y_per)**-n) / y_per + face/(1+y_per)**n - price
    return brentq(price_diff, 0.001, 1.0)
```

## Options (Black-Scholes)

### Call Price

```
C = S*N(d1) - K*e^(-rT)*N(d2)
d1 = (ln(S/K) + (r + sigma^2/2)*T) / (sigma*sqrt(T))
d2 = d1 - sigma*sqrt(T)
```

```python
from scipy.stats import norm

def black_scholes_call(S, K, T, r, sigma):
    d1 = (np.log(S/K) + (r + sigma**2/2)*T) / (sigma*np.sqrt(T))
    d2 = d1 - sigma*np.sqrt(T)
    return S*norm.cdf(d1) - K*np.exp(-r*T)*norm.cdf(d2)
```

### Put Price (via put-call parity)

```
P = C - S + K*e^(-rT)
```

### Greeks

```
Delta_call = N(d1)
Gamma = N'(d1) / (S * sigma * sqrt(T))
Theta_call = -(S*N'(d1)*sigma)/(2*sqrt(T)) - r*K*e^(-rT)*N(d2)
Vega = S * N'(d1) * sqrt(T)
```

## Moving Averages

### Simple Moving Average (SMA)

```python
df['SMA_20'] = df['close'].rolling(window=20).mean()
```

### Exponential Moving Average (EMA)

```python
df['EMA_20'] = df['close'].ewm(span=20, adjust=False).mean()
```

### Bollinger Bands

```python
df['SMA_20'] = df['close'].rolling(20).mean()
df['upper'] = df['SMA_20'] + 2 * df['close'].rolling(20).std()
df['lower'] = df['SMA_20'] - 2 * df['close'].rolling(20).std()
```

## Quick Reference Table

| Formula           | Python                       | Library          |
| ----------------- | ---------------------------- | ---------------- |
| PV/FV/PMT/IRR/NPV | `npf.pv()`, `npf.fv()`, etc. | numpy-financial  |
| Returns           | `df.pct_change()`            | pandas           |
| Log returns       | `np.log(df / df.shift(1))`   | numpy + pandas   |
| Volatility        | `df.std() * np.sqrt(252)`    | pandas + numpy   |
| Correlation       | `df.corr()`                  | pandas           |
| Covariance        | `df.cov()`                   | pandas           |
| VaR               | `np.percentile(returns, 5)`  | numpy            |
| Black-Scholes     | `norm.cdf()`                 | scipy.stats      |
| Bond pricing      | Custom or QuantLib           | scipy / QuantLib |
| Moving averages   | `df.rolling().mean()`        | pandas           |
