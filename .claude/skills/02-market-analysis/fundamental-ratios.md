---
name: fundamental-ratios
description: "Fundamental financial ratios reference covering P/E, P/B, P/S, EV/EBITDA, ROE, ROA, debt-to-equity, current ratio, quick ratio, and free cash flow yield. Use when asking about 'P/E ratio', 'price to earnings', 'P/B ratio', 'price to book', 'EV/EBITDA', 'ROE', 'ROA', 'debt to equity', 'current ratio', 'quick ratio', 'free cash flow', 'fundamental ratios', 'valuation ratios', 'profitability ratios', 'leverage ratios', or 'liquidity ratios'."
---

# Fundamental Financial Ratios

Reference for key financial ratios used in equity analysis, organized by category with calculations, interpretations, and Python examples.

## Valuation Ratios

### Price-to-Earnings (P/E) Ratio

The most widely used valuation metric. Measures how much investors pay per dollar of earnings.

**Formula**: P/E = Price per Share / Earnings per Share (EPS)

| P/E Variant        | Description                               | Use Case                                   |
| ------------------ | ----------------------------------------- | ------------------------------------------ |
| Trailing P/E       | Uses last 12 months of earnings           | Backward-looking, based on actual data     |
| Forward P/E        | Uses analyst estimates for next 12 months | Forward-looking, subject to estimate error |
| Shiller P/E (CAPE) | Uses 10-year inflation-adjusted average   | Cyclically adjusted, long-term valuation   |

```python
import yfinance as yf

def pe_analysis(ticker_symbol: str) -> dict:
    """Comprehensive P/E analysis for a stock."""
    ticker = yf.Ticker(ticker_symbol)
    info = ticker.info

    trailing_pe = info.get("trailingPE")
    forward_pe = info.get("forwardPE")
    peg = info.get("pegRatio")  # P/E divided by growth rate

    result = {
        "ticker": ticker_symbol,
        "price": info.get("currentPrice"),
        "trailing_pe": trailing_pe,
        "forward_pe": forward_pe,
        "peg_ratio": peg,
        "trailing_eps": info.get("trailingEps"),
        "forward_eps": info.get("forwardEps"),
    }

    # Interpretation
    if trailing_pe:
        if trailing_pe < 15:
            result["pe_assessment"] = "Below market average - potentially undervalued or low growth"
        elif trailing_pe < 25:
            result["pe_assessment"] = "Near market average"
        else:
            result["pe_assessment"] = "Above market average - high growth expectations or overvalued"

    return result

analysis = pe_analysis("AAPL")
for key, value in analysis.items():
    if isinstance(value, float):
        print(f"{key}: {value:.2f}")
    else:
        print(f"{key}: {value}")
```

### Price-to-Book (P/B) Ratio

Compares market price to book value (assets minus liabilities).

**Formula**: P/B = Price per Share / Book Value per Share

```python
def price_to_book(ticker_symbol: str) -> dict:
    """Calculate and interpret P/B ratio."""
    ticker = yf.Ticker(ticker_symbol)
    info = ticker.info

    pb = info.get("priceToBook")
    book_value = info.get("bookValue")

    return {
        "ticker": ticker_symbol,
        "price_to_book": pb,
        "book_value_per_share": book_value,
        "interpretation": (
            "Trading below book value - potential value play or distress"
            if pb and pb < 1
            else "Premium to book value - market values intangibles/growth"
            if pb and pb > 1
            else "N/A"
        ),
    }
```

### Price-to-Sales (P/S) Ratio

Useful for companies with no earnings (startups, high-growth).

**Formula**: P/S = Market Cap / Revenue

```python
def price_to_sales(ticker_symbol: str) -> float:
    """Retrieve price-to-sales ratio."""
    info = yf.Ticker(ticker_symbol).info
    return info.get("priceToSalesTrailing12Months")
```

### Enterprise Value / EBITDA

More comprehensive than P/E because it accounts for capital structure and non-cash charges.

**Formula**: EV/EBITDA = Enterprise Value / EBITDA

Where Enterprise Value = Market Cap + Total Debt - Cash

```python
def ev_ebitda_analysis(ticker_symbol: str) -> dict:
    """Calculate EV/EBITDA and its components."""
    ticker = yf.Ticker(ticker_symbol)
    info = ticker.info

    market_cap = info.get("marketCap", 0)
    total_debt = info.get("totalDebt", 0)
    cash = info.get("totalCash", 0)
    ebitda = info.get("ebitda", 0)

    ev = market_cap + total_debt - cash
    ev_ebitda = ev / ebitda if ebitda and ebitda > 0 else None

    return {
        "ticker": ticker_symbol,
        "market_cap": market_cap,
        "total_debt": total_debt,
        "cash": cash,
        "enterprise_value": ev,
        "ebitda": ebitda,
        "ev_ebitda": ev_ebitda,
        "yfinance_ev_ebitda": info.get("enterpriseToEbitda"),
    }

result = ev_ebitda_analysis("MSFT")
print(f"EV: ${result['enterprise_value']/1e9:.1f}B")
print(f"EV/EBITDA: {result['ev_ebitda']:.1f}x" if result['ev_ebitda'] else "EV/EBITDA: N/A")
```

## Profitability Ratios

### Return on Equity (ROE)

Measures how efficiently a company generates profit from shareholders' equity.

**Formula**: ROE = Net Income / Shareholders' Equity

```python
def roe_analysis(ticker_symbol: str) -> dict:
    """Calculate ROE and related metrics."""
    ticker = yf.Ticker(ticker_symbol)
    info = ticker.info

    roe = info.get("returnOnEquity")

    # DuPont decomposition: ROE = Profit Margin x Asset Turnover x Equity Multiplier
    profit_margin = info.get("profitMargins")
    revenue = info.get("totalRevenue", 0)
    total_assets = info.get("totalAssets")  # May not always be available

    return {
        "ticker": ticker_symbol,
        "roe": roe,
        "profit_margin": profit_margin,
        "interpretation": (
            "Excellent" if roe and roe > 0.20
            else "Good" if roe and roe > 0.15
            else "Average" if roe and roe > 0.10
            else "Below average" if roe and roe > 0
            else "Negative (losses)"
        ),
    }

roe_data = roe_analysis("AAPL")
for k, v in roe_data.items():
    if isinstance(v, float):
        print(f"{k}: {v:.2%}")
    else:
        print(f"{k}: {v}")
```

### Return on Assets (ROA)

Measures how efficiently a company uses its assets to generate profit.

**Formula**: ROA = Net Income / Total Assets

```python
def roa(ticker_symbol: str) -> float:
    """Retrieve return on assets."""
    return yf.Ticker(ticker_symbol).info.get("returnOnAssets")
```

## Leverage Ratios

### Debt-to-Equity Ratio

Measures financial leverage -- how much debt the company uses relative to equity.

**Formula**: D/E = Total Debt / Total Shareholders' Equity

```python
def leverage_analysis(ticker_symbol: str) -> dict:
    """Analyze company leverage."""
    ticker = yf.Ticker(ticker_symbol)
    info = ticker.info
    bs = ticker.balance_sheet

    de_ratio = info.get("debtToEquity")

    result = {
        "ticker": ticker_symbol,
        "debt_to_equity": de_ratio / 100 if de_ratio else None,  # yfinance reports as percentage
        "total_debt": info.get("totalDebt"),
        "total_cash": info.get("totalCash"),
        "net_debt": (info.get("totalDebt", 0) - info.get("totalCash", 0)),
    }

    if de_ratio:
        de = de_ratio / 100
        if de < 0.5:
            result["assessment"] = "Conservative leverage"
        elif de < 1.0:
            result["assessment"] = "Moderate leverage"
        elif de < 2.0:
            result["assessment"] = "Elevated leverage"
        else:
            result["assessment"] = "High leverage - monitor closely"

    return result
```

## Liquidity Ratios

### Current Ratio

Measures ability to pay short-term obligations.

**Formula**: Current Ratio = Current Assets / Current Liabilities

### Quick Ratio (Acid Test)

More conservative than current ratio -- excludes inventory.

**Formula**: Quick Ratio = (Current Assets - Inventory) / Current Liabilities

```python
def liquidity_analysis(ticker_symbol: str) -> dict:
    """Analyze company liquidity ratios."""
    ticker = yf.Ticker(ticker_symbol)
    info = ticker.info

    current_ratio = info.get("currentRatio")
    quick_ratio = info.get("quickRatio")

    result = {
        "ticker": ticker_symbol,
        "current_ratio": current_ratio,
        "quick_ratio": quick_ratio,
    }

    if current_ratio:
        if current_ratio > 2.0:
            result["current_assessment"] = "Strong liquidity (may indicate underutilized assets)"
        elif current_ratio > 1.0:
            result["current_assessment"] = "Adequate liquidity"
        else:
            result["current_assessment"] = "Potential liquidity concern"

    return result
```

## Cash Flow Metrics

### Free Cash Flow Yield

Measures how much free cash flow a company generates relative to its market value.

**Formula**: FCF Yield = Free Cash Flow / Market Cap

```python
def fcf_analysis(ticker_symbol: str) -> dict:
    """Analyze free cash flow metrics."""
    ticker = yf.Ticker(ticker_symbol)
    info = ticker.info
    cf = ticker.cashflow

    fcf = info.get("freeCashflow", 0)
    market_cap = info.get("marketCap", 0)

    fcf_yield = fcf / market_cap if market_cap > 0 else None

    return {
        "ticker": ticker_symbol,
        "free_cash_flow": fcf,
        "market_cap": market_cap,
        "fcf_yield": fcf_yield,
        "operating_cash_flow": info.get("operatingCashflow"),
        "interpretation": (
            "Strong FCF generation" if fcf_yield and fcf_yield > 0.05
            else "Moderate FCF" if fcf_yield and fcf_yield > 0.02
            else "Low FCF yield" if fcf_yield and fcf_yield > 0
            else "Negative FCF - burning cash"
        ),
    }
```

## Comprehensive Ratio Comparison

```python
import pandas as pd

def compare_fundamentals(tickers: list) -> pd.DataFrame:
    """Compare fundamental ratios across multiple stocks.

    Args:
        tickers: List of ticker symbols

    Returns:
        DataFrame with key ratios for comparison
    """
    rows = []
    for symbol in tickers:
        info = yf.Ticker(symbol).info
        rows.append({
            "Ticker": symbol,
            "Name": info.get("shortName", ""),
            "Sector": info.get("sector", ""),
            "P/E (TTM)": info.get("trailingPE"),
            "P/E (Fwd)": info.get("forwardPE"),
            "P/B": info.get("priceToBook"),
            "P/S": info.get("priceToSalesTrailing12Months"),
            "EV/EBITDA": info.get("enterpriseToEbitda"),
            "ROE": info.get("returnOnEquity"),
            "ROA": info.get("returnOnAssets"),
            "D/E": (info.get("debtToEquity", 0) or 0) / 100,
            "Current": info.get("currentRatio"),
            "FCF Yield": (
                info.get("freeCashflow", 0) / info.get("marketCap", 1)
                if info.get("marketCap") else None
            ),
            "Div Yield": info.get("dividendYield"),
            "Profit Margin": info.get("profitMargins"),
        })

    df = pd.DataFrame(rows)

    # Format percentages
    pct_cols = ["ROE", "ROA", "FCF Yield", "Div Yield", "Profit Margin"]
    for col in pct_cols:
        if col in df.columns:
            df[col] = df[col].apply(lambda x: f"{x:.2%}" if pd.notna(x) else "N/A")

    # Format ratios
    ratio_cols = ["P/E (TTM)", "P/E (Fwd)", "P/B", "P/S", "EV/EBITDA", "D/E", "Current"]
    for col in ratio_cols:
        if col in df.columns:
            df[col] = df[col].apply(lambda x: f"{x:.2f}" if pd.notna(x) else "N/A")

    return df

# Compare tech stocks
comparison = compare_fundamentals(["AAPL", "MSFT", "GOOGL", "META", "AMZN"])
print(comparison.to_string(index=False))
```

## Common Pitfalls

1. **Comparing ratios across sectors**: A P/E of 30 is normal for tech but high for utilities. Always compare within the same sector or industry.

2. **Ignoring earnings quality**: A low P/E can reflect one-time gains, aggressive accounting, or cyclical peak earnings. Check earnings consistency and quality.

3. **Using P/E for loss-making companies**: P/E is meaningless when earnings are negative. Use P/S or EV/Revenue for unprofitable companies.

4. **Confusing book value with intrinsic value**: Book value reflects historical cost minus depreciation, not market value of assets. This is especially misleading for tech companies with valuable intangibles.

5. **Ignoring the capital structure**: ROE can be artificially inflated by high leverage. Use DuPont decomposition to understand the drivers. A company with 30% ROE and 5x leverage is riskier than one with 20% ROE and 1x leverage.

6. **Snapshot vs trend**: A single ratio at one point in time is less informative than the trend over multiple quarters. Always look at how ratios are changing.

## Cross-References

- **[valuation-methods](valuation-methods.md)** - Full valuation models that use these ratios
- **[technical-indicators](technical-indicators.md)** - Technical analysis to complement fundamentals
- **[01-financial-instruments/equities](../01-financial-instruments/equities.md)** - Equity security characteristics
- **[03-portfolio-theory/capm-factor-models](../03-portfolio-theory/capm-factor-models.md)** - Factor models incorporating fundamental data
- **[05-financial-data-apis/yfinance-guide](../05-financial-data-apis/yfinance-guide.md)** - Retrieving fundamental data
