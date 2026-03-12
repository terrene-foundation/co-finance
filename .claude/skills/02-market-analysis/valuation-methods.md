---
name: valuation-methods
description: "Valuation methods reference covering DCF analysis, comparable company analysis, precedent transactions, dividend discount model, and residual income model with Python implementations. Use when asking about 'DCF', 'discounted cash flow', 'valuation', 'comparable companies', 'comps', 'precedent transactions', 'dividend discount model', 'DDM', 'Gordon growth model', 'residual income', 'intrinsic value', 'WACC', 'terminal value', or 'equity valuation'."
---

# Valuation Methods

Step-by-step reference for major equity valuation approaches with Python implementations.

## Discounted Cash Flow (DCF) Analysis

The DCF model values a company by discounting its projected future free cash flows back to present value.

### Components

1. **Free Cash Flow (FCF) projections**: Forecast future cash flows
2. **Discount rate (WACC)**: Weighted average cost of capital
3. **Terminal value**: Value of all cash flows beyond the projection period
4. **Enterprise value**: Sum of discounted FCFs + discounted terminal value

### WACC Calculation

```python
import numpy as np

def calculate_wacc(equity_value: float, debt_value: float,
                    cost_of_equity: float, cost_of_debt: float,
                    tax_rate: float) -> float:
    """Calculate Weighted Average Cost of Capital.

    Args:
        equity_value: Market value of equity
        debt_value: Market value of debt
        cost_of_equity: Required return on equity (as decimal)
        cost_of_debt: Cost of debt (as decimal)
        tax_rate: Corporate tax rate (as decimal)

    Returns:
        WACC as decimal
    """
    total = equity_value + debt_value
    weight_equity = equity_value / total
    weight_debt = debt_value / total

    wacc = (weight_equity * cost_of_equity +
            weight_debt * cost_of_debt * (1 - tax_rate))
    return wacc

# Example
wacc = calculate_wacc(
    equity_value=500e9,    # $500B market cap
    debt_value=100e9,      # $100B debt
    cost_of_equity=0.10,   # 10% required return
    cost_of_debt=0.04,     # 4% cost of debt
    tax_rate=0.21,         # 21% tax rate
)
print(f"WACC: {wacc:.2%}")
```

### Full DCF Model

```python
import yfinance as yf
import pandas as pd

def dcf_valuation(ticker_symbol: str, growth_rates: list,
                   wacc: float, terminal_growth: float = 0.025,
                   shares_outstanding: float = None) -> dict:
    """Perform a DCF valuation.

    Args:
        ticker_symbol: Stock ticker
        growth_rates: List of annual FCF growth rates for projection years
        wacc: Weighted average cost of capital
        terminal_growth: Perpetual growth rate for terminal value
        shares_outstanding: Override for shares (otherwise from yfinance)

    Returns:
        DCF valuation results
    """
    ticker = yf.Ticker(ticker_symbol)
    info = ticker.info
    cf = ticker.cashflow

    # Get base FCF (most recent year)
    base_fcf = info.get("freeCashflow")
    if base_fcf is None or base_fcf <= 0:
        return {"error": "No positive free cash flow available"}

    if shares_outstanding is None:
        shares_outstanding = info.get("sharesOutstanding", 0)

    # Project future FCFs
    projected_fcfs = []
    fcf = base_fcf
    for i, rate in enumerate(growth_rates):
        fcf = fcf * (1 + rate)
        projected_fcfs.append({
            "year": i + 1,
            "growth_rate": rate,
            "fcf": fcf,
            "discount_factor": 1 / (1 + wacc) ** (i + 1),
            "pv_fcf": fcf / (1 + wacc) ** (i + 1),
        })

    # Terminal value (Gordon Growth Model)
    final_fcf = projected_fcfs[-1]["fcf"]
    terminal_fcf = final_fcf * (1 + terminal_growth)
    terminal_value = terminal_fcf / (wacc - terminal_growth)
    years = len(growth_rates)
    pv_terminal = terminal_value / (1 + wacc) ** years

    # Sum up
    pv_fcfs = sum(p["pv_fcf"] for p in projected_fcfs)
    enterprise_value = pv_fcfs + pv_terminal

    # Equity value
    total_debt = info.get("totalDebt", 0)
    cash = info.get("totalCash", 0)
    equity_value = enterprise_value - total_debt + cash

    # Per share
    per_share = equity_value / shares_outstanding if shares_outstanding > 0 else 0
    current_price = info.get("currentPrice", 0)

    return {
        "ticker": ticker_symbol,
        "base_fcf": base_fcf,
        "projected_fcfs": projected_fcfs,
        "terminal_value": terminal_value,
        "pv_terminal": pv_terminal,
        "pv_fcfs": pv_fcfs,
        "enterprise_value": enterprise_value,
        "total_debt": total_debt,
        "cash": cash,
        "equity_value": equity_value,
        "shares_outstanding": shares_outstanding,
        "intrinsic_value_per_share": per_share,
        "current_price": current_price,
        "upside_downside": (per_share / current_price - 1) if current_price > 0 else None,
        "wacc": wacc,
        "terminal_growth": terminal_growth,
    }

# Example: 5-year DCF with declining growth rates
result = dcf_valuation(
    "MSFT",
    growth_rates=[0.12, 0.10, 0.08, 0.06, 0.05],  # Declining growth
    wacc=0.09,
    terminal_growth=0.025,
)

if "error" not in result:
    print(f"Base FCF: ${result['base_fcf']/1e9:.1f}B")
    print(f"Enterprise Value: ${result['enterprise_value']/1e9:.1f}B")
    print(f"Equity Value: ${result['equity_value']/1e9:.1f}B")
    print(f"Intrinsic Value/Share: ${result['intrinsic_value_per_share']:.2f}")
    print(f"Current Price: ${result['current_price']:.2f}")
    if result['upside_downside'] is not None:
        print(f"Upside/Downside: {result['upside_downside']:+.1%}")
```

### DCF Sensitivity Analysis

```python
def dcf_sensitivity(ticker_symbol: str, base_growth: float,
                     wacc_range: list, growth_range: list) -> pd.DataFrame:
    """Generate a sensitivity table varying WACC and terminal growth.

    Args:
        ticker_symbol: Stock ticker
        base_growth: Base case FCF growth rate
        wacc_range: List of WACC values to test
        growth_range: List of terminal growth rates to test

    Returns:
        DataFrame with intrinsic value for each WACC/growth combination
    """
    results = {}
    growth_rates = [base_growth] * 5  # 5-year projection

    for tg in growth_range:
        col = []
        for w in wacc_range:
            r = dcf_valuation(ticker_symbol, growth_rates, w, tg)
            val = r.get("intrinsic_value_per_share", 0)
            col.append(val)
        results[f"TG={tg:.1%}"] = col

    return pd.DataFrame(results, index=[f"WACC={w:.1%}" for w in wacc_range])

sensitivity = dcf_sensitivity(
    "MSFT",
    base_growth=0.10,
    wacc_range=[0.07, 0.08, 0.09, 0.10, 0.11],
    growth_range=[0.015, 0.020, 0.025, 0.030, 0.035],
)
print("DCF Sensitivity Table (Intrinsic Value per Share):")
print(sensitivity.to_string(float_format="${:.2f}".format))
```

## Comparable Company Analysis (Comps)

Values a company by comparing its multiples to similar publicly traded companies.

```python
def comparable_analysis(target_ticker: str, comp_tickers: list,
                         multiple: str = "trailingPE") -> dict:
    """Perform comparable company valuation.

    Args:
        target_ticker: The company to value
        comp_tickers: List of comparable company tickers
        multiple: The valuation multiple to use

    Returns:
        Implied valuation based on peer average
    """
    # Get comparable multiples
    comps = []
    for symbol in comp_tickers:
        info = yf.Ticker(symbol).info
        val = info.get(multiple)
        if val and val > 0:
            comps.append({
                "ticker": symbol,
                "name": info.get("shortName", ""),
                multiple: val,
            })

    if not comps:
        return {"error": "No valid comparable multiples found"}

    multiples = [c[multiple] for c in comps]
    median_multiple = np.median(multiples)
    mean_multiple = np.mean(multiples)

    # Get target financials
    target = yf.Ticker(target_ticker)
    target_info = target.info

    # Map multiple to the denominator metric
    metric_map = {
        "trailingPE": "trailingEps",
        "forwardPE": "forwardEps",
        "priceToBook": "bookValue",
        "priceToSalesTrailing12Months": None,  # Need revenue / shares
    }

    denominator_key = metric_map.get(multiple)
    if denominator_key:
        target_metric = target_info.get(denominator_key)
    else:
        target_metric = None

    implied_prices = {}
    if target_metric and target_metric > 0:
        implied_prices["median"] = median_multiple * target_metric
        implied_prices["mean"] = mean_multiple * target_metric

    return {
        "target": target_ticker,
        "current_price": target_info.get("currentPrice"),
        "multiple_used": multiple,
        "comp_count": len(comps),
        "comps": comps,
        "median_multiple": median_multiple,
        "mean_multiple": mean_multiple,
        "target_metric": target_metric,
        "implied_prices": implied_prices,
    }

# Value META against social media / ad tech peers
comps_result = comparable_analysis(
    target_ticker="META",
    comp_tickers=["GOOGL", "SNAP", "PINS", "TTD"],
    multiple="trailingPE",
)

print(f"Comparable {comps_result['multiple_used']}:")
for c in comps_result["comps"]:
    print(f"  {c['ticker']}: {c[comps_result['multiple_used']]:.1f}x")
print(f"\nMedian: {comps_result['median_multiple']:.1f}x")
print(f"Mean: {comps_result['mean_multiple']:.1f}x")
if comps_result["implied_prices"]:
    print(f"\nImplied price (median): ${comps_result['implied_prices']['median']:.2f}")
    print(f"Current price: ${comps_result['current_price']:.2f}")
```

## Precedent Transactions

Values a company based on multiples paid in recent M&A transactions in the same industry. Similar to comps but uses acquisition prices instead of market prices.

```python
def precedent_transaction_valuation(target_ebitda: float,
                                      transactions: list) -> dict:
    """Value a company using precedent transaction multiples.

    Args:
        target_ebitda: Target company's EBITDA
        transactions: List of dicts with 'acquirer', 'target',
                     'ev_ebitda', 'date', 'premium' keys

    Returns:
        Implied valuation range
    """
    multiples = [t["ev_ebitda"] for t in transactions if t.get("ev_ebitda")]

    if not multiples:
        return {"error": "No valid transaction multiples"}

    return {
        "target_ebitda": target_ebitda,
        "num_transactions": len(multiples),
        "median_multiple": np.median(multiples),
        "mean_multiple": np.mean(multiples),
        "min_multiple": min(multiples),
        "max_multiple": max(multiples),
        "implied_ev_median": target_ebitda * np.median(multiples),
        "implied_ev_mean": target_ebitda * np.mean(multiples),
        "implied_ev_range": (
            target_ebitda * min(multiples),
            target_ebitda * max(multiples),
        ),
        "transactions": transactions,
    }

# Example: hypothetical precedent transactions
transactions = [
    {"acquirer": "Company A", "target": "Target 1", "ev_ebitda": 12.5, "date": "2024-06", "premium": 0.30},
    {"acquirer": "Company B", "target": "Target 2", "ev_ebitda": 14.0, "date": "2024-03", "premium": 0.25},
    {"acquirer": "Company C", "target": "Target 3", "ev_ebitda": 11.0, "date": "2023-11", "premium": 0.20},
    {"acquirer": "Company D", "target": "Target 4", "ev_ebitda": 13.5, "date": "2023-08", "premium": 0.35},
]

result = precedent_transaction_valuation(500e6, transactions)  # $500M EBITDA
print(f"Implied EV range: ${result['implied_ev_range'][0]/1e9:.1f}B - ${result['implied_ev_range'][1]/1e9:.1f}B")
print(f"Implied EV (median): ${result['implied_ev_median']/1e9:.1f}B")
```

## Dividend Discount Model (DDM)

Values a stock as the present value of all future dividends.

### Gordon Growth Model (Constant Growth DDM)

For mature companies with stable, growing dividends.

**Formula**: P = D1 / (r - g)

Where D1 = next year's dividend, r = required return, g = dividend growth rate.

```python
def gordon_growth_model(current_dividend: float, growth_rate: float,
                         required_return: float) -> float:
    """Value a stock using the Gordon Growth Model.

    Args:
        current_dividend: Current annual dividend per share
        growth_rate: Expected constant dividend growth rate
        required_return: Required rate of return (cost of equity)

    Returns:
        Intrinsic value per share
    """
    if required_return <= growth_rate:
        raise ValueError("Required return must exceed growth rate")

    d1 = current_dividend * (1 + growth_rate)
    return d1 / (required_return - growth_rate)

# Example: $4.00 dividend, 5% growth, 10% required return
value = gordon_growth_model(4.00, 0.05, 0.10)
print(f"Intrinsic value: ${value:.2f}")  # $84.00
```

### Two-Stage DDM

For companies transitioning from high growth to stable growth.

```python
def two_stage_ddm(current_dividend: float, high_growth: float,
                   high_growth_years: int, stable_growth: float,
                   required_return: float) -> dict:
    """Value a stock using a two-stage DDM.

    Args:
        current_dividend: Current annual dividend
        high_growth: Growth rate during high-growth phase
        high_growth_years: Duration of high-growth phase
        stable_growth: Growth rate in perpetuity after high-growth phase
        required_return: Required rate of return

    Returns:
        Valuation breakdown
    """
    if required_return <= stable_growth:
        raise ValueError("Required return must exceed stable growth rate")

    dividends = []
    pv_dividends = 0
    div = current_dividend

    # High-growth phase
    for year in range(1, high_growth_years + 1):
        div = div * (1 + high_growth)
        pv = div / (1 + required_return) ** year
        pv_dividends += pv
        dividends.append({"year": year, "dividend": div, "pv": pv})

    # Terminal value at end of high-growth phase
    terminal_div = div * (1 + stable_growth)
    terminal_value = terminal_div / (required_return - stable_growth)
    pv_terminal = terminal_value / (1 + required_return) ** high_growth_years

    intrinsic_value = pv_dividends + pv_terminal

    return {
        "dividends": dividends,
        "pv_high_growth_dividends": pv_dividends,
        "terminal_value": terminal_value,
        "pv_terminal_value": pv_terminal,
        "intrinsic_value": intrinsic_value,
    }

result = two_stage_ddm(
    current_dividend=3.00,
    high_growth=0.12,
    high_growth_years=5,
    stable_growth=0.04,
    required_return=0.10,
)

print(f"PV of high-growth dividends: ${result['pv_high_growth_dividends']:.2f}")
print(f"PV of terminal value: ${result['pv_terminal_value']:.2f}")
print(f"Intrinsic value: ${result['intrinsic_value']:.2f}")
```

## Residual Income Model

Values a stock based on its ability to generate returns above the cost of equity.

**Formula**: V = Book Value + Sum of [PV of (Net Income - Equity Charge)]

Where Equity Charge = Book Value \* Cost of Equity

```python
def residual_income_model(book_value: float, roe_projections: list,
                           cost_of_equity: float,
                           terminal_growth: float = 0.0) -> dict:
    """Value a stock using the residual income model.

    Args:
        book_value: Current book value per share
        roe_projections: List of projected ROE values (as decimals)
        cost_of_equity: Cost of equity (as decimal)
        terminal_growth: Growth rate of residual income in perpetuity

    Returns:
        Valuation breakdown
    """
    bv = book_value
    pv_residual_income = 0
    details = []

    for year, roe in enumerate(roe_projections, 1):
        net_income = bv * roe
        equity_charge = bv * cost_of_equity
        residual_income = net_income - equity_charge
        pv_ri = residual_income / (1 + cost_of_equity) ** year

        details.append({
            "year": year,
            "book_value": bv,
            "roe": roe,
            "net_income": net_income,
            "equity_charge": equity_charge,
            "residual_income": residual_income,
            "pv_residual_income": pv_ri,
        })

        pv_residual_income += pv_ri

        # Update book value (retain all earnings for simplicity)
        bv = bv + net_income

    # Terminal value of residual income
    last_ri = details[-1]["residual_income"]
    if cost_of_equity > terminal_growth:
        terminal_ri = last_ri * (1 + terminal_growth) / (cost_of_equity - terminal_growth)
        pv_terminal = terminal_ri / (1 + cost_of_equity) ** len(roe_projections)
    else:
        pv_terminal = 0

    intrinsic_value = book_value + pv_residual_income + pv_terminal

    return {
        "book_value": book_value,
        "pv_residual_income": pv_residual_income,
        "pv_terminal": pv_terminal,
        "intrinsic_value": intrinsic_value,
        "details": details,
    }

result = residual_income_model(
    book_value=30.0,
    roe_projections=[0.20, 0.18, 0.16, 0.14, 0.12],
    cost_of_equity=0.10,
    terminal_growth=0.03,
)

print(f"Book Value: ${result['book_value']:.2f}")
print(f"PV Residual Income: ${result['pv_residual_income']:.2f}")
print(f"PV Terminal: ${result['pv_terminal']:.2f}")
print(f"Intrinsic Value: ${result['intrinsic_value']:.2f}")
```

## Valuation Summary Framework

```python
def valuation_football_field(ticker_symbol: str) -> dict:
    """Generate a multi-method valuation range ("football field").

    Combines DCF, comps, and DDM for a comprehensive view.

    Args:
        ticker_symbol: Stock to value

    Returns:
        Dictionary with valuation ranges from each method
    """
    info = yf.Ticker(ticker_symbol).info
    current_price = info.get("currentPrice", 0)

    methods = {"current_price": current_price}

    # DCF range (vary WACC)
    for label, wacc in [("DCF_conservative", 0.11), ("DCF_base", 0.09), ("DCF_optimistic", 0.07)]:
        r = dcf_valuation(ticker_symbol, [0.08]*5, wacc, 0.025)
        methods[label] = r.get("intrinsic_value_per_share", 0)

    # DDM (if dividends exist)
    div_rate = info.get("dividendRate")
    if div_rate and div_rate > 0:
        try:
            methods["DDM"] = gordon_growth_model(div_rate, 0.05, 0.10)
        except ValueError:
            methods["DDM"] = None

    return methods

summary = valuation_football_field("JNJ")
print("Valuation Football Field:")
for method, value in summary.items():
    if value and isinstance(value, (int, float)):
        print(f"  {method}: ${value:.2f}")
    else:
        print(f"  {method}: {value}")
```

## Common Pitfalls

1. **Garbage in, garbage out**: DCF is highly sensitive to growth rate and WACC assumptions. A 1% change in WACC or terminal growth can swing the value by 20-30%. Always run sensitivity analysis.

2. **Terminal value dominance**: In many DCFs, the terminal value represents 60-80% of total value. This means most of your valuation depends on a perpetuity assumption, which is inherently uncertain.

3. **Selecting biased comparables**: Cherry-picking comps to support a preconceived value. Use objective criteria (same industry, similar size, similar growth) to select peers.

4. **Applying DDM to non-dividend stocks**: The DDM only works for dividend-paying stocks. For growth stocks that reinvest all earnings, use DCF or residual income.

5. **Ignoring the difference between equity value and enterprise value**: DCF yields enterprise value. You must subtract debt and add cash to get equity value before dividing by shares.

6. **Using a single method in isolation**: No single valuation method is perfect. Professional analysts use multiple methods and triangulate to a value range. If methods disagree significantly, investigate why.

## Cross-References

- **[fundamental-ratios](fundamental-ratios.md)** - Input ratios for valuation models
- **[01-financial-instruments/equities](../01-financial-instruments/equities.md)** - Equity characteristics affecting valuation
- **[01-financial-instruments/fixed-income](../01-financial-instruments/fixed-income.md)** - Risk-free rate for discount calculations
- **[03-portfolio-theory/capm-factor-models](../03-portfolio-theory/capm-factor-models.md)** - Estimating cost of equity for WACC
- **[05-financial-data-apis/yfinance-guide](../05-financial-data-apis/yfinance-guide.md)** - Data retrieval for valuation inputs
