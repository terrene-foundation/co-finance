---
name: analysis-patterns
description: "Financial analysis patterns including fundamental vs technical analysis, top-down vs bottom-up, quantitative approaches, and risk assessment frameworks. Use for 'fundamental analysis', 'technical analysis', 'top-down', 'bottom-up', 'risk assessment', or 'analysis methodology'."
---

# Financial Analysis Patterns

> **Skill Metadata**
> Category: `analysis`
> Priority: `HIGH`
> Use Cases: Investment analysis, strategy design, risk assessment

## Fundamental vs Technical Analysis

### Fundamental Analysis Framework

Evaluate the intrinsic value of a security based on financial data.

| Layer             | Data Sources                        | Key Metrics                             |
| ----------------- | ----------------------------------- | --------------------------------------- |
| **Macroeconomic** | GDP, inflation, rates, unemployment | Interest rate direction, economic cycle |
| **Industry**      | Sector reports, competitors         | Market share, barriers to entry, growth |
| **Company**       | Financial statements                | P/E, P/B, ROE, debt/equity, FCF yield   |
| **Valuation**     | DCF, comparables                    | Intrinsic value vs market price         |

```python
import pandas as pd
import numpy_financial as npf

def dcf_valuation(free_cash_flows, discount_rate, terminal_growth=0.02):
    """Discounted Cash Flow valuation."""
    # PV of projected cash flows
    n = len(free_cash_flows)
    pv_fcf = sum(fcf / (1 + discount_rate)**i for i, fcf in enumerate(free_cash_flows, 1))

    # Terminal value (Gordon Growth Model)
    terminal_value = free_cash_flows[-1] * (1 + terminal_growth) / (discount_rate - terminal_growth)
    pv_terminal = terminal_value / (1 + discount_rate)**n

    enterprise_value = pv_fcf + pv_terminal
    return enterprise_value, pv_fcf, pv_terminal

def ratio_analysis(financials: pd.DataFrame) -> dict:
    """Key financial ratios from income statement and balance sheet."""
    return {
        "pe_ratio": financials["price"] / financials["eps"],
        "pb_ratio": financials["price"] / financials["book_value_per_share"],
        "roe": financials["net_income"] / financials["equity"],
        "debt_to_equity": financials["total_debt"] / financials["equity"],
        "current_ratio": financials["current_assets"] / financials["current_liabilities"],
        "fcf_yield": financials["free_cash_flow"] / financials["market_cap"],
    }
```

### Technical Analysis Framework

Analyze price and volume patterns to identify trading opportunities.

| Category           | Indicators                    | Purpose                           |
| ------------------ | ----------------------------- | --------------------------------- |
| **Trend**          | SMA, EMA, MACD                | Direction of price movement       |
| **Momentum**       | RSI, Stochastic, ROC          | Speed and strength of moves       |
| **Volatility**     | Bollinger Bands, ATR          | Range and dispersion of prices    |
| **Volume**         | OBV, VWAP, Volume Profile     | Confirm or contradict price moves |
| **Support/Resist** | Pivot Points, Fib Retracement | Key price levels                  |

```python
import pandas as pd
import numpy as np

def technical_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """Calculate core technical indicators."""
    result = df.copy()

    # Moving averages
    result["sma_20"] = df["close"].rolling(20).mean()
    result["sma_50"] = df["close"].rolling(50).mean()
    result["ema_12"] = df["close"].ewm(span=12).mean()
    result["ema_26"] = df["close"].ewm(span=26).mean()

    # MACD
    result["macd"] = result["ema_12"] - result["ema_26"]
    result["macd_signal"] = result["macd"].ewm(span=9).mean()

    # RSI (14-period)
    delta = df["close"].diff()
    gain = delta.where(delta > 0, 0).rolling(14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
    rs = gain / loss
    result["rsi_14"] = 100 - (100 / (1 + rs))

    # Bollinger Bands
    result["bb_mid"] = df["close"].rolling(20).mean()
    bb_std = df["close"].rolling(20).std()
    result["bb_upper"] = result["bb_mid"] + 2 * bb_std
    result["bb_lower"] = result["bb_mid"] - 2 * bb_std

    # ATR (Average True Range)
    high_low = df["high"] - df["low"]
    high_close = (df["high"] - df["close"].shift()).abs()
    low_close = (df["low"] - df["close"].shift()).abs()
    true_range = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
    result["atr_14"] = true_range.rolling(14).mean()

    return result
```

## Top-Down vs Bottom-Up Analysis

### Top-Down Approach

Start from the macroeconomy, narrow to sectors, then individual securities.

```
1. MACROECONOMIC OUTLOOK
   |-- GDP growth trajectory
   |-- Interest rate direction
   |-- Inflation expectations
   |-- Currency trends
   |
2. SECTOR SELECTION
   |-- Which sectors benefit from macro outlook?
   |-- Cyclical vs defensive positioning
   |-- Relative sector valuations
   |
3. SECURITY SELECTION
   |-- Best companies within selected sectors
   |-- Relative valuation within sector
   |-- Catalyst identification
```

**Use when:** Making asset allocation decisions, building diversified portfolios, macro-driven strategies.

### Bottom-Up Approach

Start from individual securities, then consider macro context.

```
1. SECURITY SCREENING
   |-- Quantitative filters (P/E < 15, ROE > 15%, debt/equity < 0.5)
   |-- Quality filters (earnings stability, dividend growth)
   |
2. DEEP DIVE ANALYSIS
   |-- Financial statement analysis
   |-- Competitive advantage assessment
   |-- Management evaluation
   |-- Intrinsic value calculation
   |
3. PORTFOLIO CONSTRUCTION
   |-- Position sizing based on conviction
   |-- Sector exposure check (not too concentrated)
   |-- Risk budget allocation
```

**Use when:** Stock picking, value investing, finding individual opportunities regardless of macro.

## Quantitative Analysis Patterns

### Factor-Based Analysis

```python
import pandas as pd
import numpy as np

def calculate_factors(universe: pd.DataFrame) -> pd.DataFrame:
    """Calculate common investment factors."""
    factors = pd.DataFrame(index=universe.index)

    # Value factor
    factors["value"] = 1 / universe["pe_ratio"]  # Earnings yield

    # Momentum factor (12-month return, skip last month)
    factors["momentum"] = universe["return_12m"] - universe["return_1m"]

    # Quality factor
    factors["quality"] = (
        universe["roe"].rank(pct=True) +
        universe["debt_equity"].rank(pct=True, ascending=False) +
        universe["earnings_stability"].rank(pct=True)
    ) / 3

    # Size factor (small minus big)
    factors["size"] = -universe["market_cap"].rank(pct=True)

    # Low volatility factor
    factors["low_vol"] = -universe["volatility_12m"].rank(pct=True)

    return factors

def factor_portfolio(factors: pd.DataFrame, factor_name: str,
                     n_long: int = 20, n_short: int = 20) -> dict:
    """Construct long-short factor portfolio."""
    ranked = factors[factor_name].rank(ascending=False)
    long_stocks = ranked.nsmallest(n_long).index.tolist()
    short_stocks = ranked.nlargest(n_short).index.tolist()
    return {"long": long_stocks, "short": short_stocks}
```

### Risk Assessment Framework

| Risk Type         | Metrics                            | Mitigation                                |
| ----------------- | ---------------------------------- | ----------------------------------------- |
| **Market risk**   | Beta, VaR, CVaR, max drawdown      | Diversification, hedging, position sizing |
| **Credit risk**   | Credit spread, default probability | Credit quality filters, CDS               |
| **Liquidity**     | Bid-ask spread, volume, turnover   | Position limits, liquidity screens        |
| **Concentration** | Herfindahl index, sector weights   | Weight caps, sector limits                |
| **Model risk**    | Out-of-sample testing, sensitivity | Multiple models, stress testing           |

```python
import numpy as np
from scipy import stats

def risk_report(returns: np.ndarray, confidence: float = 0.95) -> dict:
    """Comprehensive risk metrics report."""
    return {
        "annualized_vol": returns.std() * np.sqrt(252),
        "var_parametric": stats.norm.ppf(1 - confidence) * returns.std(),
        "var_historical": np.percentile(returns, (1 - confidence) * 100),
        "cvar": returns[returns <= np.percentile(returns, (1 - confidence) * 100)].mean(),
        "max_drawdown": _max_drawdown(returns),
        "skewness": stats.skew(returns),
        "kurtosis": stats.kurtosis(returns),
        "jarque_bera_pvalue": stats.jarque_bera(returns)[1],
    }

def _max_drawdown(returns: np.ndarray) -> float:
    """Calculate maximum drawdown from returns series."""
    cumulative = np.cumprod(1 + returns)
    peak = np.maximum.accumulate(cumulative)
    drawdown = (cumulative - peak) / peak
    return drawdown.min()
```

## Analysis Output Template

```markdown
## Investment Analysis: [Security/Portfolio Name]

### Summary

- **Recommendation**: [BUY/HOLD/SELL] at [price level]
- **Target Price**: [value] (upside/downside: [X]%)
- **Risk Level**: [LOW/MEDIUM/HIGH]
- **Time Horizon**: [short/medium/long]-term

### Fundamental Assessment

- Valuation: [Undervalued/Fair/Overvalued] based on [DCF/comparables/multiples]
- Quality: [ROE, margins, debt levels]
- Growth: [Revenue/earnings growth trajectory]
- Catalyst: [What will unlock value]

### Technical Assessment

- Trend: [Uptrend/Downtrend/Sideways] on [timeframe]
- Momentum: [RSI, MACD readings]
- Support/Resistance: [Key levels]
- Volume: [Confirming/diverging from price]

### Risk Assessment

- Key risks: [List top 3 risks]
- Position sizing: [Recommended allocation]
- Stop loss: [Level and rationale]
- Hedge: [If applicable]

### Assumptions and Limitations

- [List key assumptions]
- [Note any data limitations]
- [Disclaimer about forward-looking nature]
```

<!-- Trigger Keywords: fundamental analysis, technical analysis, top-down, bottom-up, risk assessment, analysis methodology, factor analysis, quantitative analysis, DCF valuation, financial analysis, investment analysis -->
