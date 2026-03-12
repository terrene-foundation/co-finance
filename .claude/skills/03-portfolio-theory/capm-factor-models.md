---
name: capm-factor-models
description: "CAPM and factor models reference covering beta estimation, Security Market Line, Fama-French 3-factor and 5-factor models, Carhart 4-factor model, and alpha calculation. Use when asking about 'CAPM', 'beta', 'alpha', 'Security Market Line', 'Fama-French', 'factor model', 'Carhart', 'systematic risk', 'market risk premium', 'cost of equity', 'factor loading', 'momentum factor', 'size factor', or 'value factor'."
---

# CAPM and Factor Models

Reference for the Capital Asset Pricing Model and multi-factor models with statsmodels implementations.

## Capital Asset Pricing Model (CAPM)

### Theory

CAPM states that the expected return of an asset equals the risk-free rate plus a premium for bearing systematic (market) risk.

**Formula**: E(Ri) = Rf + beta_i \* (E(Rm) - Rf)

Where:

- E(Ri): Expected return of asset i
- Rf: Risk-free rate
- beta_i: Sensitivity of asset i to the market
- E(Rm) - Rf: Market risk premium

### Beta Estimation

```python
import numpy as np
import pandas as pd
import yfinance as yf
import statsmodels.api as sm

def estimate_beta(ticker: str, market_ticker: str = "SPY",
                   period: str = "5y") -> dict:
    """Estimate CAPM beta using OLS regression.

    Args:
        ticker: Stock ticker
        market_ticker: Market proxy ticker
        period: Historical period

    Returns:
        Beta estimation results
    """
    data = yf.download([ticker, market_ticker], period=period, auto_adjust=True)["Close"]
    returns = data.pct_change().dropna()

    y = returns[ticker]
    X = returns[market_ticker]
    X_const = sm.add_constant(X)

    model = sm.OLS(y, X_const).fit()

    return {
        "ticker": ticker,
        "beta": model.params.iloc[1],
        "alpha": model.params.iloc[0] * 252,  # Annualized alpha
        "r_squared": model.rsquared,
        "alpha_pvalue": model.pvalues.iloc[0],
        "beta_pvalue": model.pvalues.iloc[1],
        "beta_std_error": model.bse.iloc[1],
        "beta_ci_95": (model.conf_int().iloc[1, 0], model.conf_int().iloc[1, 1]),
        "observations": model.nobs,
    }

result = estimate_beta("AAPL")
print(f"AAPL Beta: {result['beta']:.3f}")
print(f"R-squared: {result['r_squared']:.3f}")
print(f"Annualized Alpha: {result['alpha']:.4f}")
print(f"95% CI: ({result['beta_ci_95'][0]:.3f}, {result['beta_ci_95'][1]:.3f})")
```

### Rolling Beta

```python
def rolling_beta(ticker: str, market_ticker: str = "SPY",
                  period: str = "5y", window: int = 60) -> pd.Series:
    """Calculate rolling beta over a specified window.

    Args:
        ticker: Stock ticker
        market_ticker: Market proxy
        period: Data period
        window: Rolling window in trading days

    Returns:
        Series of rolling beta values
    """
    data = yf.download([ticker, market_ticker], period=period, auto_adjust=True)["Close"]
    returns = data.pct_change().dropna()

    stock_ret = returns[ticker]
    market_ret = returns[market_ticker]

    # Rolling covariance / rolling variance
    rolling_cov = stock_ret.rolling(window).cov(market_ret)
    rolling_var = market_ret.rolling(window).var()

    return rolling_cov / rolling_var

betas = rolling_beta("AAPL", window=60)
print(f"Current 60-day beta: {betas.iloc[-1]:.3f}")
print(f"Average beta: {betas.mean():.3f}")
print(f"Beta range: [{betas.min():.3f}, {betas.max():.3f}]")
```

### Security Market Line (SML)

```python
import matplotlib.pyplot as plt

def plot_sml(tickers: list, risk_free_rate: float = 0.04,
              market_return: float = 0.10) -> tuple:
    """Plot the Security Market Line with individual stocks.

    Args:
        tickers: List of tickers to plot
        risk_free_rate: Risk-free rate
        market_return: Expected market return

    Returns:
        Figure and axes
    """
    betas_list = []
    returns_list = []
    labels = []

    for t in tickers:
        try:
            result = estimate_beta(t)
            data = yf.download(t, period="5y", auto_adjust=True)["Close"]
            ann_ret = data.pct_change().mean() * 252
            betas_list.append(result["beta"])
            returns_list.append(ann_ret)
            labels.append(t)
        except Exception:
            continue

    fig, ax = plt.subplots(figsize=(10, 7))

    # SML line
    beta_range = np.linspace(0, max(betas_list) * 1.2, 100)
    sml_returns = risk_free_rate + beta_range * (market_return - risk_free_rate)
    ax.plot(beta_range, sml_returns * 100, "b--", linewidth=1, label="SML")

    # Individual stocks
    ax.scatter(betas_list, [r * 100 for r in returns_list], s=100, zorder=5)
    for i, label in enumerate(labels):
        ax.annotate(label, (betas_list[i], returns_list[i] * 100),
                    textcoords="offset points", xytext=(5, 5))

    ax.set_xlabel("Beta")
    ax.set_ylabel("Expected Return (%)")
    ax.set_title("Security Market Line")
    ax.legend()
    ax.grid(True, alpha=0.3)
    return fig, ax
```

### Cost of Equity from CAPM

```python
def cost_of_equity_capm(beta: float, risk_free_rate: float = 0.04,
                         market_risk_premium: float = 0.06) -> float:
    """Calculate cost of equity using CAPM.

    Args:
        beta: Stock beta
        risk_free_rate: Current risk-free rate
        market_risk_premium: Expected market premium (E(Rm) - Rf)

    Returns:
        Cost of equity
    """
    return risk_free_rate + beta * market_risk_premium

coe = cost_of_equity_capm(beta=1.2)
print(f"Cost of Equity: {coe:.2%}")  # 11.2%
```

## Fama-French Three-Factor Model

Extends CAPM with two additional factors: size (SMB) and value (HML).

**Formula**: Ri - Rf = alpha + beta_m _ (Rm - Rf) + beta_s _ SMB + beta_v \* HML + epsilon

Where:

- SMB (Small Minus Big): Return of small-cap stocks minus large-cap stocks
- HML (High Minus Low): Return of high book-to-market stocks minus low book-to-market stocks

```python
def fama_french_3factor(ticker: str, period: str = "5y") -> dict:
    """Estimate Fama-French 3-factor model loadings.

    Note: This example uses proxy ETFs for factors.
    For academic research, download actual FF factors from
    Kenneth French's data library.

    Args:
        ticker: Stock ticker
        period: Historical period

    Returns:
        Factor loadings and model statistics
    """
    # Download stock and factor proxy data
    # IWM-SPY as SMB proxy, IWD-IWF as HML proxy
    symbols = [ticker, "SPY", "IWM", "IWD", "IWF"]
    data = yf.download(symbols, period=period, auto_adjust=True)["Close"]
    returns = data.pct_change().dropna()

    # Construct factor proxies
    stock_excess = returns[ticker]  # Simplified: not subtracting Rf
    market = returns["SPY"]
    smb = returns["IWM"] - returns["SPY"]  # Small minus big proxy
    hml = returns["IWD"] - returns["IWF"]  # Value minus growth proxy

    # Regression
    X = pd.DataFrame({"Mkt": market, "SMB": smb, "HML": hml})
    X = sm.add_constant(X)
    model = sm.OLS(stock_excess, X).fit()

    return {
        "ticker": ticker,
        "alpha": model.params["const"] * 252,  # Annualized
        "beta_market": model.params["Mkt"],
        "beta_smb": model.params["SMB"],
        "beta_hml": model.params["HML"],
        "r_squared": model.rsquared,
        "adj_r_squared": model.rsquared_adj,
        "summary": model.summary().as_text(),
    }

ff3 = fama_french_3factor("AAPL")
print(f"Market Beta: {ff3['beta_market']:.3f}")
print(f"SMB (Size): {ff3['beta_smb']:.3f}")
print(f"HML (Value): {ff3['beta_hml']:.3f}")
print(f"Alpha (ann.): {ff3['alpha']:.4f}")
print(f"Adj R-sq: {ff3['adj_r_squared']:.3f}")
```

### Using Kenneth French Data Library

```python
def download_ff_factors() -> pd.DataFrame:
    """Download Fama-French factors from the data library.

    Uses pandas_datareader if available, otherwise provides
    instructions for manual download.
    """
    try:
        import pandas_datareader.data as web
        ff_factors = web.DataReader("F-F_Research_Data_Factors_daily",
                                     "famafrench", start="2000-01-01")[0]
        ff_factors = ff_factors / 100  # Convert from percentage
        return ff_factors
    except ImportError:
        print("Install pandas-datareader: pip install pandas-datareader")
        print("Or download from: https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html")
        return pd.DataFrame()
```

## Fama-French Five-Factor Model

Adds profitability (RMW) and investment (CMA) factors.

**Formula**: Ri - Rf = alpha + beta_m*(Rm-Rf) + beta_s*SMB + beta_v*HML + beta_r*RMW + beta_c\*CMA + epsilon

Where:

- RMW (Robust Minus Weak): Return of high-profitability minus low-profitability stocks
- CMA (Conservative Minus Aggressive): Return of low-investment minus high-investment stocks

```python
def fama_french_5factor(ticker: str, ff_factors: pd.DataFrame,
                         start_date: str = None) -> dict:
    """Estimate Fama-French 5-factor model.

    Args:
        ticker: Stock ticker
        ff_factors: DataFrame with FF5 factors (Mkt-RF, SMB, HML, RMW, CMA, RF)
        start_date: Optional start date

    Returns:
        Factor loadings and statistics
    """
    stock_data = yf.download(ticker, start=start_date or "2000-01-01",
                              auto_adjust=True)["Close"]
    stock_returns = stock_data.pct_change().dropna()

    # Align dates
    common = stock_returns.index.intersection(ff_factors.index)
    y = stock_returns.loc[common] - ff_factors.loc[common, "RF"]
    X = ff_factors.loc[common, ["Mkt-RF", "SMB", "HML", "RMW", "CMA"]]
    X = sm.add_constant(X)

    model = sm.OLS(y, X).fit()

    return {
        "ticker": ticker,
        "alpha": model.params["const"] * 252,
        "beta_market": model.params["Mkt-RF"],
        "beta_smb": model.params["SMB"],
        "beta_hml": model.params["HML"],
        "beta_rmw": model.params["RMW"],
        "beta_cma": model.params["CMA"],
        "r_squared": model.rsquared,
        "adj_r_squared": model.rsquared_adj,
    }
```

## Carhart Four-Factor Model

Extends FF3 with a momentum factor (WML -- Winners Minus Losers).

**Formula**: Ri - Rf = alpha + beta_m*(Rm-Rf) + beta_s*SMB + beta_v*HML + beta_w*WML + epsilon

```python
def carhart_4factor(ticker: str, period: str = "5y") -> dict:
    """Estimate Carhart 4-factor model using ETF proxies.

    Uses MTUM-SPY spread as a momentum factor proxy.

    Args:
        ticker: Stock ticker
        period: Historical period

    Returns:
        Factor loadings
    """
    symbols = [ticker, "SPY", "IWM", "IWD", "IWF", "MTUM"]
    data = yf.download(symbols, period=period, auto_adjust=True)["Close"]
    returns = data.pct_change().dropna()

    stock = returns[ticker]
    market = returns["SPY"]
    smb = returns["IWM"] - returns["SPY"]
    hml = returns["IWD"] - returns["IWF"]
    mom = returns["MTUM"] - returns["SPY"]  # Momentum proxy

    X = pd.DataFrame({"Mkt": market, "SMB": smb, "HML": hml, "MOM": mom})
    X = sm.add_constant(X)
    model = sm.OLS(stock, X).fit()

    return {
        "ticker": ticker,
        "alpha": model.params["const"] * 252,
        "beta_market": model.params["Mkt"],
        "beta_smb": model.params["SMB"],
        "beta_hml": model.params["HML"],
        "beta_mom": model.params["MOM"],
        "r_squared": model.rsquared,
        "adj_r_squared": model.rsquared_adj,
    }
```

## Alpha

Alpha represents the return in excess of what is explained by factor exposures.

```python
def alpha_analysis(ticker: str, period: str = "5y") -> dict:
    """Comprehensive alpha analysis across models.

    Args:
        ticker: Stock ticker
        period: Historical period

    Returns:
        Alpha estimates from different models
    """
    capm_result = estimate_beta(ticker)
    ff3_result = fama_french_3factor(ticker, period)
    c4_result = carhart_4factor(ticker, period)

    return {
        "ticker": ticker,
        "capm_alpha": capm_result["alpha"],
        "capm_r_squared": capm_result["r_squared"],
        "ff3_alpha": ff3_result["alpha"],
        "ff3_r_squared": ff3_result["adj_r_squared"],
        "carhart_alpha": c4_result["alpha"],
        "carhart_r_squared": c4_result["adj_r_squared"],
    }

# Compare alpha across models
alpha_data = alpha_analysis("AAPL")
print(f"Alpha Analysis for {alpha_data['ticker']}:")
print(f"  CAPM Alpha:    {alpha_data['capm_alpha']:.4f} (R2={alpha_data['capm_r_squared']:.3f})")
print(f"  FF3 Alpha:     {alpha_data['ff3_alpha']:.4f} (R2={alpha_data['ff3_r_squared']:.3f})")
print(f"  Carhart Alpha: {alpha_data['carhart_alpha']:.4f} (R2={alpha_data['carhart_r_squared']:.3f})")
```

## Factor Exposure Summary

```python
def factor_exposure_heatmap(tickers: list, period: str = "5y"):
    """Visualize factor exposures across multiple stocks."""
    results = []

    for t in tickers:
        try:
            ff3 = fama_french_3factor(t, period)
            results.append({
                "Ticker": t,
                "Market": ff3["beta_market"],
                "Size": ff3["beta_smb"],
                "Value": ff3["beta_hml"],
                "Alpha": ff3["alpha"],
            })
        except Exception:
            continue

    df = pd.DataFrame(results).set_index("Ticker")

    fig, ax = plt.subplots(figsize=(10, 6))
    sns.heatmap(df, annot=True, cmap="RdYlGn", center=0, fmt=".2f",
                linewidths=0.5, ax=ax)
    ax.set_title("Factor Exposures")
    return fig, ax
```

## Common Pitfalls

1. **Treating CAPM beta as constant**: Beta changes over time as the company evolves. A tech startup may have beta > 2, but its beta will decline as it matures. Use rolling beta for current estimates.

2. **Confusing alpha with skill**: Positive alpha can result from factor exposures not captured by the model, survivorship bias, or simple luck. True alpha is persistent, risk-adjusted outperformance after controlling for all known factors.

3. **Using ETF proxies for factor research**: ETF-based factor proxies (IWM for size, IWD/IWF for value) are convenient but imprecise. For academic research, use the actual Fama-French factor data.

4. **Ignoring statistical significance**: A beta of 1.5 with a p-value of 0.30 tells you very little. Always check confidence intervals and significance before interpreting factor loadings.

5. **Applying CAPM to illiquid assets**: CAPM assumes liquid, continuously traded assets. For private equity, real estate, or thinly traded stocks, observed beta is downward biased due to stale pricing.

6. **Overfitting with too many factors**: Adding factors always improves in-sample R-squared but may not improve out-of-sample prediction. Stick to well-established, economically motivated factors.

## Cross-References

- **[mpt-basics](mpt-basics.md)** - Portfolio theory fundamentals
- **[efficient-frontier](efficient-frontier.md)** - Using CAPM returns for frontier computation
- **[portfolio-optimization](portfolio-optimization.md)** - Factor-based optimization
- **[02-market-analysis/fundamental-ratios](../02-market-analysis/fundamental-ratios.md)** - Fundamental data behind value and quality factors
- **[04-risk-management/var-methods](../04-risk-management/var-methods.md)** - Risk measurement using factor models
