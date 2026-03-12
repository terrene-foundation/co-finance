---
name: fred-guide
description: "FRED (Federal Reserve Economic Data) guide covering economic indicators like GDP, CPI, unemployment, fed funds rate, yield curves, data retrieval with fredapi, and time series analysis. Use when asking about 'FRED', 'economic data', 'GDP', 'CPI', 'inflation', 'unemployment', 'fed funds rate', 'yield curve', 'Treasury rates', 'economic indicators', 'fredapi', 'Federal Reserve data', 'interest rates', 'money supply', or 'consumer confidence'."
---

# FRED (Federal Reserve Economic Data) Guide

Complete reference for accessing economic data from the Federal Reserve Bank of St. Louis.

## Setup

```python
import os

# pip install fredapi
from fredapi import Fred

# API key from environment (free registration at https://fred.stlouisfed.org/docs/api/api_key.html)
fred = Fred(api_key=os.environ["FRED_API_KEY"])
```

## Key Economic Indicators

### GDP

```python
import pandas as pd
import matplotlib.pyplot as plt

# Real GDP (Quarterly, seasonally adjusted annual rate)
real_gdp = fred.get_series("GDPC1")
print(f"Latest Real GDP: ${real_gdp.iloc[-1]:,.1f}B")

# GDP Growth Rate (Quarter-over-quarter, annualized)
gdp_growth = fred.get_series("A191RL1Q225SBEA")
print(f"Latest GDP Growth Rate: {gdp_growth.iloc[-1]:.1f}%")

# Nominal GDP
nominal_gdp = fred.get_series("GDP")

# GDP visualization
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
ax1.plot(real_gdp.index, real_gdp / 1000, linewidth=1.5)
ax1.set_title("US Real GDP (Trillions)")
ax1.set_ylabel("$T")
ax1.grid(True, alpha=0.3)

ax2.bar(gdp_growth.tail(20).index, gdp_growth.tail(20), width=60, color=
        ["green" if x > 0 else "red" for x in gdp_growth.tail(20)])
ax2.set_title("GDP Growth Rate (Annualized %)")
ax2.set_ylabel("%")
ax2.axhline(y=0, color="black", linewidth=0.5)
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig("gdp.png", dpi=150)
plt.close()
```

### Inflation (CPI)

```python
# Consumer Price Index (All Urban Consumers, Seasonally Adjusted)
cpi = fred.get_series("CPIAUCSL")

# CPI Year-over-Year Change (Inflation Rate)
cpi_yoy = fred.get_series("CPIAUCSL", observation_start="2000-01-01")
inflation_rate = cpi_yoy.pct_change(periods=12) * 100

# Core CPI (Excluding Food and Energy)
core_cpi_yoy = fred.get_series("CPILFESL", observation_start="2000-01-01")
core_inflation = core_cpi_yoy.pct_change(periods=12) * 100

# PCE Price Index (Fed's preferred inflation measure)
pce = fred.get_series("PCEPI", observation_start="2000-01-01")
pce_inflation = pce.pct_change(periods=12) * 100

print(f"Latest CPI YoY: {inflation_rate.iloc[-1]:.1f}%")
print(f"Latest Core CPI YoY: {core_inflation.iloc[-1]:.1f}%")
print(f"Latest PCE YoY: {pce_inflation.iloc[-1]:.1f}%")

# Inflation comparison chart
fig, ax = plt.subplots(figsize=(12, 6))
ax.plot(inflation_rate.index, inflation_rate, label="CPI (All Items)", linewidth=1)
ax.plot(core_inflation.index, core_inflation, label="Core CPI", linewidth=1)
ax.plot(pce_inflation.index, pce_inflation, label="PCE", linewidth=1)
ax.axhline(y=2, color="red", linestyle="--", alpha=0.5, label="2% Target")
ax.set_title("US Inflation Measures")
ax.set_ylabel("Year-over-Year Change (%)")
ax.legend()
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig("inflation.png", dpi=150)
plt.close()
```

### Unemployment

```python
# Unemployment Rate
unemployment = fred.get_series("UNRATE")

# Nonfarm Payrolls (Monthly Change)
nonfarm = fred.get_series("PAYEMS")
nonfarm_change = nonfarm.diff()

# U-6 Unemployment (Broader measure)
u6 = fred.get_series("U6RATE")

# Initial Jobless Claims (Weekly)
claims = fred.get_series("ICSA")

# Labor Force Participation Rate
lfpr = fred.get_series("CIVPART")

print(f"Unemployment Rate: {unemployment.iloc[-1]:.1f}%")
print(f"U-6 Rate: {u6.iloc[-1]:.1f}%")
print(f"Latest Payroll Change: {nonfarm_change.iloc[-1]:+,.0f}K")
print(f"Labor Force Participation: {lfpr.iloc[-1]:.1f}%")
```

### Federal Funds Rate

```python
# Effective Federal Funds Rate
fed_funds = fred.get_series("FEDFUNDS")

# Target Rate (Upper Bound)
target_upper = fred.get_series("DFEDTARU")

# Target Rate (Lower Bound)
target_lower = fred.get_series("DFEDTARL")

print(f"Effective Fed Funds Rate: {fed_funds.iloc[-1]:.2f}%")

# Historical fed funds rate
fig, ax = plt.subplots(figsize=(14, 6))
ax.plot(fed_funds.index, fed_funds, linewidth=1)
ax.set_title("Federal Funds Rate (Historical)")
ax.set_ylabel("Rate (%)")
ax.grid(True, alpha=0.3)
ax.fill_between(fed_funds.index, 0, fed_funds, alpha=0.1)
plt.tight_layout()
plt.savefig("fed_funds.png", dpi=150)
plt.close()
```

### Treasury Yield Curve

```python
def get_yield_curve(date: str = None) -> pd.Series:
    """Get Treasury yield curve data.

    Args:
        date: Specific date (YYYY-MM-DD) or None for latest

    Returns:
        Series indexed by maturity with yield values
    """
    series_ids = {
        "1M": "DGS1MO",
        "3M": "DGS3MO",
        "6M": "DGS6MO",
        "1Y": "DGS1",
        "2Y": "DGS2",
        "3Y": "DGS3",
        "5Y": "DGS5",
        "7Y": "DGS7",
        "10Y": "DGS10",
        "20Y": "DGS20",
        "30Y": "DGS30",
    }

    yields = {}
    for maturity, series_id in series_ids.items():
        data = fred.get_series(series_id)
        if date:
            # Find the closest available date
            data = data[data.index <= date]
        if not data.empty:
            yields[maturity] = data.iloc[-1]

    return pd.Series(yields, name="Yield (%)")

# Current yield curve
curve = get_yield_curve()
print("Current Treasury Yield Curve:")
print(curve.to_string())

# Check for inversion (2Y > 10Y)
if "2Y" in curve.index and "10Y" in curve.index:
    spread = curve["10Y"] - curve["2Y"]
    print(f"\n2Y-10Y Spread: {spread:.2f}bps")
    print(f"Curve: {'INVERTED' if spread < 0 else 'Normal'}")
```

### Yield Curve Visualization

```python
def plot_yield_curves(dates: list = None):
    """Plot yield curves for multiple dates."""
    maturity_years = [1/12, 3/12, 6/12, 1, 2, 3, 5, 7, 10, 20, 30]
    maturity_labels = ["1M", "3M", "6M", "1Y", "2Y", "3Y", "5Y", "7Y", "10Y", "20Y", "30Y"]

    fig, ax = plt.subplots(figsize=(12, 6))

    if dates is None:
        dates = ["2024-01-02", "2023-01-03", "2022-01-03", "2019-01-02"]

    for date in dates:
        curve = get_yield_curve(date)
        if not curve.empty:
            values = [curve.get(m) for m in maturity_labels]
            ax.plot(maturity_years, values, 'o-', label=date, markersize=4)

    ax.set_xlabel("Maturity (Years)")
    ax.set_ylabel("Yield (%)")
    ax.set_title("US Treasury Yield Curves")
    ax.legend()
    ax.grid(True, alpha=0.3)
    return fig, ax

fig, ax = plot_yield_curves()
plt.tight_layout()
plt.savefig("yield_curves.png", dpi=150)
plt.close()
```

## Useful FRED Series IDs

### Economic Activity

| Series ID       | Description           | Frequency |
| --------------- | --------------------- | --------- |
| GDPC1           | Real GDP              | Quarterly |
| A191RL1Q225SBEA | GDP Growth Rate       | Quarterly |
| INDPRO          | Industrial Production | Monthly   |
| RSAFS           | Retail Sales          | Monthly   |
| HOUST           | Housing Starts        | Monthly   |
| UMCSENT         | Consumer Sentiment    | Monthly   |

### Labor Market

| Series ID     | Description               | Frequency |
| ------------- | ------------------------- | --------- |
| UNRATE        | Unemployment Rate         | Monthly   |
| U6RATE        | U-6 Unemployment          | Monthly   |
| PAYEMS        | Nonfarm Payrolls          | Monthly   |
| ICSA          | Initial Jobless Claims    | Weekly    |
| CIVPART       | Labor Force Participation | Monthly   |
| CES0500000003 | Average Hourly Earnings   | Monthly   |

### Prices and Inflation

| Series ID  | Description            | Frequency |
| ---------- | ---------------------- | --------- |
| CPIAUCSL   | CPI (All Urban)        | Monthly   |
| CPILFESL   | Core CPI               | Monthly   |
| PCEPI      | PCE Price Index        | Monthly   |
| DCOILWTICO | WTI Crude Oil Price    | Daily     |
| GASREGW    | Regular Gasoline Price | Weekly    |

### Interest Rates

| Series ID    | Description           | Frequency |
| ------------ | --------------------- | --------- |
| FEDFUNDS     | Federal Funds Rate    | Monthly   |
| DGS10        | 10-Year Treasury      | Daily     |
| DGS2         | 2-Year Treasury       | Daily     |
| T10Y2Y       | 10Y-2Y Spread         | Daily     |
| MORTGAGE30US | 30-Year Mortgage Rate | Weekly    |
| BAMLH0A0HYM2 | High Yield Spread     | Daily     |

### Money Supply and Financial Conditions

| Series ID | Description                | Frequency |
| --------- | -------------------------- | --------- |
| M2SL      | M2 Money Supply            | Monthly   |
| WALCL     | Fed Balance Sheet          | Weekly    |
| VIXCLS    | VIX Index                  | Daily     |
| NFCI      | Financial Conditions Index | Weekly    |

## Time Series Analysis with FRED Data

```python
def economic_dashboard() -> dict:
    """Create a snapshot of key economic indicators."""
    indicators = {
        "GDP Growth": ("A191RL1Q225SBEA", "%"),
        "Unemployment": ("UNRATE", "%"),
        "CPI (YoY)": ("CPIAUCSL", "idx"),
        "Fed Funds": ("FEDFUNDS", "%"),
        "10Y Treasury": ("DGS10", "%"),
        "2Y Treasury": ("DGS2", "%"),
    }

    dashboard = {}
    for name, (series_id, unit) in indicators.items():
        data = fred.get_series(series_id)
        latest = data.dropna().iloc[-1]

        if unit == "idx":
            # Calculate YoY change
            yoy = data.pct_change(periods=12).dropna()
            dashboard[name] = f"{yoy.iloc[-1]*100:.1f}%"
        else:
            dashboard[name] = f"{latest:.2f}%"

    return dashboard

dashboard = economic_dashboard()
print("Economic Dashboard:")
for name, value in dashboard.items():
    print(f"  {name}: {value}")
```

## FRED Search

```python
def search_fred(query: str, limit: int = 10) -> pd.DataFrame:
    """Search for FRED series by keyword.

    Args:
        query: Search terms
        limit: Maximum results

    Returns:
        DataFrame with matching series
    """
    results = fred.search(query)

    if results is None or results.empty:
        return pd.DataFrame()

    return results[["title", "frequency", "units", "seasonal_adjustment",
                     "observation_start", "observation_end", "popularity"]].head(limit)

results = search_fred("inflation expectations")
print(results.to_string())
```

## Common Pitfalls

1. **Not handling missing/NaN values**: FRED data often has gaps (e.g., daily series have no values on weekends/holidays). Use `.dropna()` or `.ffill()` before calculations.

2. **Mixing frequencies**: GDP is quarterly, CPI is monthly, Treasury yields are daily. When comparing, resample to a common frequency first.

3. **Forgetting seasonal adjustment**: Many series come in both seasonally adjusted (SA) and not seasonally adjusted (NSA) versions. Use SA for trend analysis, NSA for raw comparisons.

4. **Ignoring revision history**: Economic data like GDP gets revised multiple times. The first release may differ significantly from the final. FRED provides vintage data for academic research.

5. **Rate limiting**: FRED limits to 120 requests per minute. Batch your requests and cache results. The `fredapi` library does not handle rate limiting automatically.

6. **Assuming data is current**: Some series have significant publication lags. GDP data for Q4 is not released until late January. Check the `observation_end` date.

## Cross-References

- **[api-comparison](api-comparison.md)** - How FRED compares to other providers
- **[caching-patterns](caching-patterns.md)** - Caching FRED data locally
- **[01-financial-instruments/fixed-income](../01-financial-instruments/fixed-income.md)** - Using Treasury yield data
- **[04-risk-management/stress-testing](../04-risk-management/stress-testing.md)** - Economic data for stress scenarios
- **[02-market-analysis/valuation-methods](../02-market-analysis/valuation-methods.md)** - Risk-free rate for valuation models
