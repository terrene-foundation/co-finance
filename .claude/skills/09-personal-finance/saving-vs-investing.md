# Saving vs Investing

Saving and investing serve different purposes. Saving preserves capital for short-term needs. Investing grows wealth over the long term by accepting risk. Understanding when to save, when to invest, and how to allocate between the two is a foundational personal finance skill.

**Educational Disclaimer**: This content is for educational purposes only. It does not constitute financial or investment advice. Past performance is not indicative of future results. Consult a qualified financial professional for personalized guidance.

## When to Save vs Invest

| Purpose                     | Time Horizon     | Vehicle                        | Why                           |
| --------------------------- | ---------------- | ------------------------------ | ----------------------------- |
| Emergency fund              | Immediate access | High-yield savings account     | Must be liquid and stable     |
| Vacation in 6 months        | <1 year          | Savings account, CDs           | Too short for market risk     |
| Down payment in 2 years     | 1-3 years        | Savings, CDs, short-term bonds | Moderate risk tolerance       |
| Child's college in 10 years | 5-10 years       | 529 plan (invested)            | Long enough for moderate risk |
| Retirement in 30 years      | 10+ years        | 401(k), IRA (invested)         | Long enough for equity risk   |

**Rule of thumb**: Money you need within 3 years should generally be saved (not invested). Money you will not need for 5+ years should generally be invested.

## Risk Tolerance

Risk tolerance has two components:

1. **Risk capacity**: Your objective ability to take risk (income, time horizon, financial cushion)
2. **Risk willingness**: Your subjective comfort with volatility and potential losses

```python
def assess_risk_profile(age, income, emergency_fund_months,
                         time_horizon_years, comfort_with_loss):
    """
    Simple risk profile assessment.

    comfort_with_loss: 1-5 scale
        1 = "I can't sleep if my portfolio drops 5%"
        5 = "A 30% drop doesn't bother me — I'm investing for the long term"

    Educational illustration — not a substitute for professional assessment.
    """
    # Risk capacity score (objective)
    capacity = 0
    capacity += min(3, (110 - age) / 20)  # Younger = more capacity
    capacity += min(2, emergency_fund_months / 6)  # Funded emergency = more capacity
    capacity += min(3, time_horizon_years / 10)  # Longer horizon = more capacity
    capacity += min(2, income / 100_000)  # Higher income = more capacity

    # Risk willingness (subjective)
    willingness = comfort_with_loss

    # Overall risk score (capacity constrained by willingness)
    overall = min(capacity, willingness * 2)
    max_possible = 10

    # Map to profile
    if overall < 3:
        profile = "Conservative"
        equity_range = "20-40%"
    elif overall < 5:
        profile = "Moderate-Conservative"
        equity_range = "40-55%"
    elif overall < 7:
        profile = "Moderate"
        equity_range = "55-70%"
    elif overall < 8.5:
        profile = "Moderate-Aggressive"
        equity_range = "70-85%"
    else:
        profile = "Aggressive"
        equity_range = "85-95%"

    print(f"Risk Profile: {profile}")
    print(f"Risk Capacity Score: {capacity:.1f}/{max_possible}")
    print(f"Risk Willingness: {willingness}/5")
    print(f"Suggested Equity Allocation: {equity_range}")

    return {"profile": profile, "equity_range": equity_range}

# Example
assess_risk_profile(
    age=30,
    income=75_000,
    emergency_fund_months=6,
    time_horizon_years=30,
    comfort_with_loss=3,
)
```

## Time Horizon

Time horizon is the single most important factor in determining whether to save or invest, and how aggressively to invest.

### Why Time Matters

```python
import numpy as np

def time_horizon_analysis():
    """
    Show how the probability of positive returns increases with time.

    Uses historical S&P 500 characteristics (approx 10% avg return,
    ~16% annual volatility) to illustrate, not to predict.

    Educational illustration — not financial advice.
    """
    np.random.seed(42)
    annual_return = 0.10
    annual_vol = 0.16
    n_simulations = 100_000

    horizons = [1, 3, 5, 10, 15, 20, 30]

    print("PROBABILITY OF POSITIVE RETURN BY HOLDING PERIOD")
    print("(Based on illustrative simulation, not actual guarantees)")
    print("=" * 55)

    for years in horizons:
        # Simulate annual returns
        annual_returns = np.random.normal(annual_return, annual_vol,
                                           (n_simulations, years))
        # Cumulative returns
        cumulative = np.prod(1 + annual_returns, axis=1) - 1
        pct_positive = np.mean(cumulative > 0) * 100
        median_return = np.median(cumulative) * 100

        print(f"  {years:2d}-year: {pct_positive:5.1f}% chance of gain, "
              f"median return: {median_return:+6.1f}%")

    print("\nNote: These are illustrative simulations, not guarantees.")
    print("Actual results depend on many factors not modeled here.")

time_horizon_analysis()
```

## Compound Interest

Albert Einstein may or may not have called compound interest the "eighth wonder of the world," but its power is undeniable.

### The Compound Interest Formula

```
A = P * (1 + r/n)^(n*t)

Where:
  A = Final amount
  P = Principal (initial investment)
  r = Annual interest rate
  n = Compounding frequency per year
  t = Time in years
```

### Python: Compound Growth Calculator

```python
def compound_growth(
    initial_investment, monthly_contribution, annual_return,
    years, annual_fee=0.0
):
    """
    Calculate compound growth with regular contributions.

    Educational illustration — not a guarantee of returns.
    """
    monthly_return = (1 + annual_return - annual_fee) ** (1/12) - 1
    months = years * 12
    total_contributions = initial_investment + (monthly_contribution * months)

    balance = initial_investment
    balances = [balance]

    for month in range(1, months + 1):
        balance = balance * (1 + monthly_return) + monthly_contribution
        balances.append(balance)

    growth = balance - total_contributions

    print(f"COMPOUND GROWTH PROJECTION")
    print(f"(Hypothetical — not a guarantee of returns)")
    print(f"{'='*50}")
    print(f"Initial Investment:     ${initial_investment:>12,.2f}")
    print(f"Monthly Contribution:   ${monthly_contribution:>12,.2f}")
    print(f"Annual Return:          {annual_return:>11.1%}")
    print(f"Annual Fee:             {annual_fee:>11.2%}")
    print(f"Time Horizon:           {years:>8d} years")
    print(f"{'='*50}")
    print(f"Total Contributions:    ${total_contributions:>12,.2f}")
    print(f"Investment Growth:      ${growth:>12,.2f}")
    print(f"Final Balance:          ${balance:>12,.2f}")
    print(f"Growth Multiple:        {balance/total_contributions:>11.1f}x")

    return balances


# Example: $10,000 initial + $500/month for 30 years at 7%
balances = compound_growth(
    initial_investment=10_000,
    monthly_contribution=500,
    annual_return=0.07,
    years=30,
)

# Show the impact of starting 10 years later
print("\n--- IMPACT OF STARTING 10 YEARS LATER ---")
compound_growth(
    initial_investment=10_000,
    monthly_contribution=500,
    annual_return=0.07,
    years=20,  # 10 fewer years
)
```

### The Cost of Fees

```python
# The dramatic impact of seemingly small fee differences
print("IMPACT OF FEES ON A $10,000 INVESTMENT OVER 30 YEARS")
print("(Hypothetical 7% gross return, $500/month contributions)")
print("=" * 55)

for fee in [0.0, 0.001, 0.005, 0.01, 0.015]:
    monthly_return = (1 + 0.07 - fee) ** (1/12) - 1
    balance = 10_000
    for _ in range(30 * 12):
        balance = balance * (1 + monthly_return) + 500
    print(f"  Fee {fee:.2%}: ${balance:>12,.0f}  "
          f"({'baseline' if fee == 0 else f'lost ${balances_no_fee - balance:,.0f}' if fee > 0 else ''})")
    if fee == 0:
        balances_no_fee = balance
```

## Dollar-Cost Averaging (DCA)

**Concept**: Invest a fixed dollar amount at regular intervals (e.g., $500/month), regardless of market conditions.

**How it works**: When prices are high, your fixed dollar amount buys fewer shares. When prices are low, you buy more shares. Over time, this tends to result in a lower average cost per share than buying a fixed number of shares.

```python
import numpy as np

def dca_vs_lump_sum(total_amount, months, prices):
    """
    Compare dollar-cost averaging vs lump sum investment.

    Educational illustration — not financial advice.
    """
    monthly_investment = total_amount / months

    # DCA: invest monthly_investment each month
    dca_shares = sum(monthly_investment / p for p in prices[:months])
    dca_value = dca_shares * prices[months - 1]
    dca_avg_cost = total_amount / dca_shares

    # Lump sum: invest everything at the start
    ls_shares = total_amount / prices[0]
    ls_value = ls_shares * prices[months - 1]

    print(f"DCA vs Lump Sum Comparison")
    print(f"Total amount: ${total_amount:,.2f} over {months} months")
    print(f"{'='*45}")
    print(f"DCA:")
    print(f"  Shares acquired:  {dca_shares:,.2f}")
    print(f"  Average cost:     ${dca_avg_cost:,.2f}")
    print(f"  Final value:      ${dca_value:,.2f}")
    print(f"Lump Sum:")
    print(f"  Shares acquired:  {ls_shares:,.2f}")
    print(f"  Buy price:        ${prices[0]:,.2f}")
    print(f"  Final value:      ${ls_value:,.2f}")

    return {"dca_value": dca_value, "lump_sum_value": ls_value}

# Scenario: volatile market
prices = [100, 95, 88, 82, 78, 85, 90, 95, 92, 98, 105, 110]
dca_vs_lump_sum(12_000, 12, prices)
```

**Important context**: Academic research generally shows that lump-sum investing outperforms DCA approximately two-thirds of the time (because markets tend to go up over time, so investing earlier captures more upside). However, DCA is psychologically easier — it reduces the risk of investing everything at a market peak, which is the scenario investors fear most. See **[10-behavioral-finance](../10-behavioral-finance/SKILL.md)** for why this matters.

## Asset Allocation by Age

The appropriate mix of stocks and bonds depends primarily on time horizon and risk tolerance.

### Common Guidelines

```
Conservative rule:    Bond % = Your age
                      (Age 30: 70% stocks, 30% bonds)

Moderate rule:        Bond % = Your age - 10
                      (Age 30: 80% stocks, 20% bonds)

Aggressive rule:      Bond % = Your age - 20
                      (Age 30: 90% stocks, 10% bonds)
```

**These are starting points, not prescriptions.** Your actual allocation should reflect your personal risk tolerance, financial situation, and goals. Someone who is 60 with a pension and Social Security may be able to hold more equities than a 40-year-old who is their family's sole income source.

### Target-Date Fund Glide Paths

Target-date funds automatically adjust the stock/bond mix as you approach retirement. Example glide path:

| Years to Retirement      | Stock Allocation | Bond Allocation |
| ------------------------ | ---------------- | --------------- |
| 40 years                 | 90%              | 10%             |
| 30 years                 | 85%              | 15%             |
| 20 years                 | 75%              | 25%             |
| 10 years                 | 60%              | 40%             |
| At retirement            | 45%              | 55%             |
| 10 years into retirement | 35%              | 65%             |

## Index Fund Investing Basics

Index funds track a market index (like the S&P 500) rather than trying to beat it.

### Why Index Funds?

1. **Low fees**: Index funds charge 0.03-0.20% annually vs 0.50-1.50% for actively managed funds
2. **Broad diversification**: Own hundreds or thousands of companies in one fund
3. **Consistent performance**: Most actively managed funds underperform their benchmark index over long periods
4. **Simplicity**: No need to pick individual stocks or time the market

### The Three-Fund Portfolio

A popular simple portfolio using just three index funds:

```
Total US Stock Market Index Fund      (e.g., VTI, VTSAX, FZROX)
Total International Stock Market Fund (e.g., VXUS, VTIAX, FZILX)
Total US Bond Market Index Fund       (e.g., BND, VBTLX, FXNAX)
```

Adjust the percentages based on your risk tolerance and time horizon.

## Emergency Fund vs Investment Account

| Feature     | Emergency Fund               | Investment Account          |
| ----------- | ---------------------------- | --------------------------- |
| Purpose     | Short-term safety net        | Long-term wealth building   |
| Vehicle     | High-yield savings account   | Brokerage, 401(k), IRA      |
| Liquidity   | Immediate                    | Days to access              |
| Return      | Low (savings rate)           | Higher (with volatility)    |
| Risk        | None (FDIC insured to $250k) | Market risk                 |
| Target size | 3-6 months expenses          | As much as possible         |
| Priority    | Build this FIRST             | After emergency fund is set |

**Sequence**: Emergency fund first, then invest. Investing without an emergency fund means you may be forced to sell investments at a loss when unexpected expenses arise.

## Common Pitfalls

1. **Investing before building an emergency fund**: If you need cash and your investments are down 30%, you lock in losses. Build your emergency fund first.

2. **Waiting for the "right time" to invest**: Market timing consistently underperforms simply being invested. Time in the market beats timing the market for long-term investors.

3. **Checking your portfolio daily**: Frequent monitoring leads to emotional reactions and unnecessary trading. For long-term investments, quarterly or semi-annual reviews are sufficient.

4. **Ignoring fees**: A 1% annual fee may seem small, but over 30 years it can reduce your portfolio value by 25-30% compared to a 0.03% index fund.

5. **Not investing at all due to fear**: Keeping all money in savings accounts means losing purchasing power to inflation over time. A reasonable, diversified investment approach is generally preferable to pure cash for long-term goals.

## Cross-References

- See **[budgeting-basics](budgeting-basics.md)** for determining how much to save and invest
- See **[tax-advantaged-accounts](tax-advantaged-accounts.md)** for where to hold your investments
- See **[insurance-debt](insurance-debt.md)** for addressing debt before investing
- See **[03-portfolio-theory](../03-portfolio-theory/SKILL.md)** for the theory behind diversification and asset allocation
- See **[10-behavioral-finance](../10-behavioral-finance/SKILL.md)** for understanding why investors make emotional mistakes
- See **[06-python-finance/numpy-financial](../06-python-finance/numpy-financial.md)** for financial calculation tools
