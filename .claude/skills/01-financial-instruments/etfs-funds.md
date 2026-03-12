---
name: etfs-funds
description: "ETFs, mutual funds, and index funds reference covering fund types, expense ratios, tracking error, NAV, creation/redemption, and portfolio construction. Use when asking about 'ETFs', 'mutual funds', 'index funds', 'expense ratio', 'tracking error', 'NAV', 'net asset value', 'creation redemption', 'factor ETFs', 'smart beta', 'fund comparison', 'portfolio construction', 'passive investing', or 'fund selection'."
---

# ETFs and Funds

Comprehensive reference for pooled investment vehicles including ETFs, mutual funds, index funds, factor-based strategies, and portfolio construction.

## Fund Types Comparison

| Feature            | ETF                       | Mutual Fund                        | Index Fund            |
| ------------------ | ------------------------- | ---------------------------------- | --------------------- |
| Trading            | Intraday on exchange      | End-of-day NAV                     | End-of-day NAV        |
| Minimum investment | 1 share                   | Often $1,000-$3,000                | Often $1,000-$3,000   |
| Expense ratios     | Very low (0.03-0.50%)     | Low to high (0.10-1.50%)           | Very low (0.02-0.20%) |
| Tax efficiency     | High (in-kind redemption) | Lower (capital gain distributions) | Moderate              |
| Transparency       | Daily holdings disclosure | Quarterly/semi-annual              | Quarterly/semi-annual |
| Pricing            | Real-time market price    | NAV calculated daily               | NAV calculated daily  |
| Short selling      | Yes                       | No                                 | No                    |
| Options available  | Yes (popular ETFs)        | No                                 | No                    |
| Management         | Passive or active         | Active or passive                  | Passive               |

**Note**: An "index fund" can be structured as either an ETF or a mutual fund. The term refers to the strategy (tracking an index), not the vehicle.

## Net Asset Value (NAV)

NAV is the per-share value of a fund's holdings.

```python
def calculate_nav(total_assets: float, total_liabilities: float,
                  shares_outstanding: float) -> float:
    """Calculate Net Asset Value per share.

    Args:
        total_assets: Total value of all fund holdings
        total_liabilities: Total fund liabilities
        shares_outstanding: Number of shares outstanding

    Returns:
        NAV per share
    """
    return (total_assets - total_liabilities) / shares_outstanding

# Example
nav = calculate_nav(
    total_assets=500_000_000,      # $500M in holdings
    total_liabilities=2_000_000,    # $2M in liabilities
    shares_outstanding=10_000_000   # 10M shares
)
print(f"NAV per share: ${nav:.2f}")  # $49.80
```

### Premium and Discount to NAV

```python
import yfinance as yf

def nav_premium_discount(market_price: float, nav: float) -> float:
    """Calculate the premium (+) or discount (-) to NAV."""
    return (market_price / nav - 1) * 100

# For ETFs, the market price usually tracks NAV closely
# For closed-end funds, persistent premiums/discounts are common
etf = yf.Ticker("SPY")
info = etf.info
market_price = info.get("previousClose", 0)
nav_val = info.get("navPrice", market_price)

if nav_val:
    prem_disc = nav_premium_discount(market_price, nav_val)
    print(f"Market Price: ${market_price:.2f}")
    print(f"NAV: ${nav_val:.2f}")
    print(f"Premium/Discount: {prem_disc:+.3f}%")
```

## Expense Ratios

The annual fee charged by a fund as a percentage of assets under management.

```python
def expense_ratio_impact(investment: float, annual_return: float,
                          expense_ratio: float, years: int) -> dict:
    """Calculate the long-term impact of expense ratios.

    Args:
        investment: Initial investment amount
        annual_return: Expected annual return (before fees)
        expense_ratio: Annual expense ratio (as decimal)
        years: Investment horizon

    Returns:
        Dictionary with final values and cost comparison
    """
    # Without fees
    no_fee_value = investment * (1 + annual_return) ** years

    # With fees
    net_return = annual_return - expense_ratio
    fee_value = investment * (1 + net_return) ** years

    cost = no_fee_value - fee_value

    return {
        "initial_investment": investment,
        "value_without_fees": no_fee_value,
        "value_with_fees": fee_value,
        "total_cost_of_fees": cost,
        "cost_as_pct_of_initial": cost / investment * 100,
    }

# Compare a low-cost ETF (0.03%) vs active fund (1.00%) over 30 years
for name, er in [("Low-cost ETF", 0.0003), ("Active Fund", 0.0100)]:
    result = expense_ratio_impact(100000, 0.08, er, 30)
    print(f"{name} (ER: {er:.2%}):")
    print(f"  Final value: ${result['value_with_fees']:,.0f}")
    print(f"  Fees cost:   ${result['total_cost_of_fees']:,.0f}")
    print()
```

## Tracking Error

Measures how closely a fund follows its benchmark index.

```python
import numpy as np
import pandas as pd
import yfinance as yf

def tracking_error(fund_returns: pd.Series, benchmark_returns: pd.Series,
                    annualize: bool = True) -> float:
    """Calculate tracking error (annualized standard deviation of return difference).

    Args:
        fund_returns: Fund daily returns
        benchmark_returns: Benchmark daily returns
        annualize: Whether to annualize (default True)

    Returns:
        Tracking error
    """
    diff = fund_returns - benchmark_returns
    te = diff.std()
    if annualize:
        te *= np.sqrt(252)  # Annualize using trading days
    return te

def tracking_difference(fund_returns: pd.Series, benchmark_returns: pd.Series) -> float:
    """Calculate tracking difference (cumulative return gap)."""
    fund_cumulative = (1 + fund_returns).prod() - 1
    bench_cumulative = (1 + benchmark_returns).prod() - 1
    return fund_cumulative - bench_cumulative

# Compare SPY (ETF) vs ^GSPC (S&P 500 index)
spy = yf.download("SPY", period="1y", auto_adjust=True)["Close"]
spx = yf.download("^GSPC", period="1y", auto_adjust=True)["Close"]

spy_returns = spy.pct_change().dropna()
spx_returns = spx.pct_change().dropna()

# Align dates
common_dates = spy_returns.index.intersection(spx_returns.index)
spy_ret = spy_returns.loc[common_dates]
spx_ret = spx_returns.loc[common_dates]

te = tracking_error(spy_ret, spx_ret)
td = tracking_difference(spy_ret, spx_ret)
print(f"SPY Tracking Error (annualized): {te:.4%}")
print(f"SPY Tracking Difference: {td:.4%}")
```

## Creation/Redemption Process

The ETF creation/redemption mechanism keeps market price aligned with NAV.

**Creation (when ETF trades at a premium):**

1. Authorized Participant (AP) buys the underlying basket of securities
2. AP delivers the basket to the ETF sponsor
3. Sponsor issues new ETF shares (a "creation unit," typically 25,000-50,000 shares)
4. AP sells new ETF shares on the market, arbitraging the premium

**Redemption (when ETF trades at a discount):**

1. AP buys discounted ETF shares on the market
2. AP delivers ETF shares to the sponsor
3. Sponsor delivers the underlying basket of securities
4. AP sells the securities, arbitraging the discount

This "in-kind" mechanism also provides tax efficiency, as the fund does not need to sell securities (and realize capital gains) to meet redemptions.

## Factor-Based ETFs (Smart Beta)

Factor investing targets specific return drivers that have been identified in academic research.

| Factor         | Description                        | Example ETFs   | Risk Premium Source              |
| -------------- | ---------------------------------- | -------------- | -------------------------------- |
| Value          | Low price relative to fundamentals | VTV, VLUE, RPV | Behavioral biases, distress risk |
| Size           | Small-cap stocks                   | IWM, VB, IJR   | Illiquidity premium              |
| Momentum       | Recent strong performers           | MTUM, QMOM     | Behavioral underreaction         |
| Quality        | High profitability, low leverage   | QUAL, DGRW     | Mispricing of stability          |
| Low Volatility | Lower-volatility stocks            | USMV, SPLV     | Leverage constraints             |
| Dividend       | High dividend yield                | VYM, SCHD, HDV | Cash flow preference             |

```python
import yfinance as yf
import pandas as pd
import numpy as np

def compare_factor_etfs(tickers: list, period: str = "5y") -> pd.DataFrame:
    """Compare performance metrics of factor ETFs.

    Args:
        tickers: List of ETF ticker symbols
        period: Historical period to analyze

    Returns:
        DataFrame with performance metrics
    """
    data = yf.download(tickers, period=period, auto_adjust=True)["Close"]
    returns = data.pct_change().dropna()

    metrics = []
    for ticker in tickers:
        ret = returns[ticker]
        ann_return = (1 + ret.mean()) ** 252 - 1
        ann_vol = ret.std() * np.sqrt(252)
        sharpe = ann_return / ann_vol if ann_vol > 0 else 0
        max_dd = (data[ticker] / data[ticker].cummax() - 1).min()

        etf_info = yf.Ticker(ticker).info

        metrics.append({
            "Ticker": ticker,
            "Name": etf_info.get("shortName", ""),
            "Ann. Return": f"{ann_return:.2%}",
            "Ann. Volatility": f"{ann_vol:.2%}",
            "Sharpe Ratio": f"{sharpe:.2f}",
            "Max Drawdown": f"{max_dd:.2%}",
            "Expense Ratio": f"{etf_info.get('annualReportExpenseRatio', 'N/A')}",
        })

    return pd.DataFrame(metrics)

# Compare factor ETFs
factor_etfs = ["SPY", "VTV", "MTUM", "QUAL", "USMV"]
comparison = compare_factor_etfs(factor_etfs, period="5y")
print(comparison.to_string(index=False))
```

## Portfolio Construction with ETFs

### Core-Satellite Portfolio

```python
import numpy as np

def core_satellite_portfolio(core_allocation: float, core_etf: str,
                              satellites: list) -> dict:
    """Design a core-satellite portfolio.

    Args:
        core_allocation: Percentage allocated to core (e.g., 0.70)
        core_etf: Core holding ticker
        satellites: List of dicts with 'ticker' and 'allocation'

    Returns:
        Portfolio allocation dictionary
    """
    satellite_total = sum(s["allocation"] for s in satellites)
    expected_satellite = 1 - core_allocation

    if abs(satellite_total - expected_satellite) > 0.001:
        raise ValueError(
            f"Satellite allocations ({satellite_total:.2%}) must equal "
            f"1 - core ({expected_satellite:.2%})"
        )

    portfolio = {"core": {"ticker": core_etf, "allocation": core_allocation}}
    portfolio["satellites"] = satellites
    return portfolio

# Example: 70% core + 30% satellite
portfolio = core_satellite_portfolio(
    core_allocation=0.70,
    core_etf="VTI",  # Total US Market
    satellites=[
        {"ticker": "VEA", "allocation": 0.10, "role": "International Developed"},
        {"ticker": "VWO", "allocation": 0.05, "role": "Emerging Markets"},
        {"ticker": "BND", "allocation": 0.10, "role": "US Bonds"},
        {"ticker": "VNQ", "allocation": 0.05, "role": "Real Estate"},
    ]
)

print("Core-Satellite Portfolio:")
print(f"  Core: {portfolio['core']['ticker']} ({portfolio['core']['allocation']:.0%})")
for s in portfolio["satellites"]:
    print(f"  Satellite: {s['ticker']} ({s['allocation']:.0%}) - {s['role']}")
```

### Simple Allocation Rebalancing

```python
import pandas as pd
import numpy as np

def rebalance_portfolio(current_values: dict, target_allocations: dict,
                         total_value: float = None) -> dict:
    """Calculate trades needed to rebalance to target allocations.

    Args:
        current_values: Dict of ticker -> current dollar value
        target_allocations: Dict of ticker -> target percentage (as decimal)
        total_value: Override total portfolio value (default: sum of current)

    Returns:
        Dict with rebalancing trades
    """
    if total_value is None:
        total_value = sum(current_values.values())

    trades = {}
    for ticker, target_pct in target_allocations.items():
        target_value = total_value * target_pct
        current_value = current_values.get(ticker, 0)
        trade = target_value - current_value

        trades[ticker] = {
            "current_value": current_value,
            "current_pct": current_value / total_value if total_value > 0 else 0,
            "target_pct": target_pct,
            "target_value": target_value,
            "trade_amount": trade,
            "action": "BUY" if trade > 0 else "SELL" if trade < 0 else "HOLD",
        }

    return trades

# Example: Portfolio has drifted from targets
current = {"VTI": 75000, "VXUS": 12000, "BND": 8000, "VNQ": 5000}
targets = {"VTI": 0.60, "VXUS": 0.20, "BND": 0.15, "VNQ": 0.05}

trades = rebalance_portfolio(current, targets)
print("Rebalancing Trades:")
print(f"{'Ticker':<6} {'Current':>10} {'Target':>10} {'Trade':>12} {'Action':<5}")
for ticker, info in trades.items():
    print(f"{ticker:<6} {info['current_pct']:>9.1%} {info['target_pct']:>9.1%} "
          f"${info['trade_amount']:>+10,.0f} {info['action']:<5}")
```

## Common Pitfalls

1. **Ignoring total cost of ownership**: Expense ratio is not the only cost. Also consider bid-ask spread, tracking error, commission, and tax efficiency. A 0.03% ER fund with poor tracking may cost more than a 0.10% ER fund with tight tracking.

2. **Assuming all index funds are the same**: Different funds tracking the same index can have different sampling methods, securities lending revenue, and rebalancing schedules that affect performance.

3. **Chasing past factor performance**: Factor returns are cyclical. Value, momentum, and quality each have multi-year periods of underperformance. Diversifying across factors is generally more robust.

4. **Overlapping holdings**: Holding both SPY (S&P 500) and QQQ (Nasdaq 100) creates significant overlap since tech mega-caps dominate both. Check actual overlap before combining ETFs.

5. **Forgetting tax implications of rebalancing**: In taxable accounts, selling appreciated positions triggers capital gains. Consider tax-loss harvesting and directing new contributions to underweight positions instead.

6. **Using leveraged/inverse ETFs for long-term holding**: These ETFs are designed for daily rebalancing and suffer from volatility decay over longer periods. A 2x leveraged ETF will not return 2x the index over a year.

## Cross-References

- **[equities](equities.md)** - Understanding the underlying equity securities
- **[fixed-income](fixed-income.md)** - For bond ETF analysis
- **[03-portfolio-theory/mpt-basics](../03-portfolio-theory/mpt-basics.md)** - Mean-variance framework for fund allocation
- **[03-portfolio-theory/portfolio-optimization](../03-portfolio-theory/portfolio-optimization.md)** - Optimization techniques for fund portfolios
- **[05-financial-data-apis/yfinance-guide](../05-financial-data-apis/yfinance-guide.md)** - Retrieving ETF data
