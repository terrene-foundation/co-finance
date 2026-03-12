# Tax-Advantaged Accounts

Tax-advantaged accounts are among the most powerful wealth-building tools available to individuals. Understanding the differences between account types, contribution limits, and withdrawal rules is essential for personal financial planning.

**Educational Disclaimer**: This content is for educational purposes only. Tax rules, contribution limits, and eligibility criteria change frequently. The figures shown are illustrative examples and may not reflect current IRS limits. Always verify current rules with the IRS or a qualified tax professional.

## Account Types Overview

| Account                | Tax Treatment                                             | Best For                                       | Key Feature                           |
| ---------------------- | --------------------------------------------------------- | ---------------------------------------------- | ------------------------------------- |
| **Traditional 401(k)** | Pre-tax contributions, taxed withdrawals                  | Higher earners wanting to reduce current taxes | Employer match                        |
| **Roth 401(k)**        | After-tax contributions, tax-free withdrawals             | Those expecting higher taxes in retirement     | Tax-free growth                       |
| **Traditional IRA**    | Pre-tax (if eligible), taxed withdrawals                  | Supplement to 401(k) or if no employer plan    | Universal access                      |
| **Roth IRA**           | After-tax contributions, tax-free withdrawals             | Young earners, long time horizon               | Tax-free growth, flexible withdrawals |
| **HSA**                | Pre-tax contributions, tax-free withdrawals (medical)     | Those with high-deductible health plans        | Triple tax advantage                  |
| **529 Plan**           | After-tax contributions, tax-free withdrawals (education) | Parents saving for children's education        | State tax deductions (some states)    |

## 401(k) Plans

### Traditional 401(k)

**How it works**:

1. You contribute pre-tax dollars (reduces your taxable income today)
2. Money grows tax-deferred (no taxes on gains while in the account)
3. You pay income tax on withdrawals in retirement

**Contribution limits** (illustrative, verify current IRS limits):

- Employee contribution: ~$23,000/year
- Catch-up contribution (age 50+): additional ~$7,500/year
- Total employee + employer: ~$69,000/year

**Employer match**: Many employers match a percentage of your contribution. Common patterns:

- 100% match on first 3%, 50% match on next 2% (effectively 4% on 5% contribution)
- Dollar-for-dollar match on first 6%
- 50 cents on the dollar up to 6%

**The match is free money. Always contribute enough to get the full match.**

### Roth 401(k)

**How it works**:

1. You contribute after-tax dollars (no tax break today)
2. Money grows tax-free
3. Qualified withdrawals in retirement are completely tax-free

**Same contribution limits as Traditional 401(k)**. You can split contributions between Traditional and Roth within the same annual limit.

### Traditional vs Roth 401(k): When to Use Which

| Factor                      | Favors Traditional                               | Favors Roth                   |
| --------------------------- | ------------------------------------------------ | ----------------------------- |
| Current tax bracket         | High (32%+)                                      | Low to moderate (22% or less) |
| Expected retirement bracket | Lower than current                               | Same or higher than current   |
| Years to retirement         | Fewer (<15)                                      | More (15+)                    |
| State taxes                 | Currently in high-tax state, retiring in low-tax | Currently in low-tax state    |

```python
def compare_401k_options(
    annual_contribution, years, growth_rate,
    current_tax_rate, retirement_tax_rate
):
    """
    Compare Traditional vs Roth 401(k) outcomes.

    Educational example — not financial advice.
    Tax calculations are simplified illustrations.
    """
    # Traditional: contribute pre-tax, pay taxes on withdrawal
    trad_annual = annual_contribution  # Full amount goes in pre-tax
    trad_fv = 0
    for _ in range(years):
        trad_fv = (trad_fv + trad_annual) * (1 + growth_rate)
    trad_after_tax = trad_fv * (1 - retirement_tax_rate)

    # Roth: contribute after-tax (so less goes in), but no tax on withdrawal
    roth_annual = annual_contribution * (1 - current_tax_rate)
    roth_fv = 0
    for _ in range(years):
        roth_fv = (roth_fv + roth_annual) * (1 + growth_rate)
    roth_after_tax = roth_fv  # No tax on qualified withdrawal

    # But with Traditional, you have tax savings now that could be invested
    tax_savings = annual_contribution * current_tax_rate
    taxable_fv = 0
    for _ in range(years):
        taxable_fv = (taxable_fv + tax_savings) * (1 + growth_rate * 0.85)
        # 0.85 factor: taxable account has lower after-tax growth
    taxable_after_tax = taxable_fv * (1 - 0.15)  # Capital gains tax

    print(f"{'='*55}")
    print(f"Contribution: ${annual_contribution:,.0f}/yr for {years} years at {growth_rate:.0%}")
    print(f"Current tax rate: {current_tax_rate:.0%}")
    print(f"Retirement tax rate: {retirement_tax_rate:.0%}")
    print(f"{'='*55}")
    print(f"Traditional 401(k):")
    print(f"  Gross value:     ${trad_fv:>12,.0f}")
    print(f"  After-tax value: ${trad_after_tax:>12,.0f}")
    print(f"  + Invested tax savings: ${taxable_after_tax:>8,.0f}")
    print(f"  Total after-tax: ${trad_after_tax + taxable_after_tax:>12,.0f}")
    print(f"Roth 401(k):")
    print(f"  Gross value:     ${roth_fv:>12,.0f}")
    print(f"  After-tax value: ${roth_after_tax:>12,.0f}")
    print(f"{'='*55}")
    diff = roth_after_tax - (trad_after_tax + taxable_after_tax)
    winner = "Roth" if diff > 0 else "Traditional"
    print(f"Advantage: {winner} by ${abs(diff):,.0f}")

    return {
        "traditional_after_tax": trad_after_tax + taxable_after_tax,
        "roth_after_tax": roth_after_tax,
    }

# Example: 30 years, 7% growth
compare_401k_options(
    annual_contribution=23_000,
    years=30,
    growth_rate=0.07,
    current_tax_rate=0.24,
    retirement_tax_rate=0.22,
)
```

## Individual Retirement Accounts (IRAs)

### Traditional IRA

**Contribution limits** (illustrative):

- ~$7,000/year (~$8,000 if age 50+)
- Deductibility depends on income and whether you have a workplace plan

**Income limits for deductibility** (if covered by workplace plan):

- Full deduction below income threshold
- Partial deduction in phase-out range
- No deduction above phase-out (but non-deductible contributions still allowed)

### Roth IRA

**Contribution limits**: Same as Traditional IRA

**Income limits for contributions** (illustrative):

- Full contribution below income threshold
- Reduced contribution in phase-out range
- No direct contribution above phase-out (but backdoor Roth may be available)

**Key advantage**: Contributions (not earnings) can be withdrawn at any time without penalty. This makes the Roth IRA more flexible than other retirement accounts.

### Withdrawal Rules Comparison

| Feature                            | Traditional IRA                       | Roth IRA                                                 |
| ---------------------------------- | ------------------------------------- | -------------------------------------------------------- |
| **Early withdrawal (before 59.5)** | 10% penalty + income tax              | Contributions: penalty-free; Earnings: 10% penalty + tax |
| **Required Minimum Distributions** | Starting at age 73 (as of SECURE 2.0) | None during owner's lifetime                             |
| **Qualified withdrawals**          | Taxed as ordinary income              | Completely tax-free                                      |
| **5-year rule**                    | N/A                                   | Earnings tax-free only after 5 years AND age 59.5        |

### Roth Conversion Ladder

A strategy for accessing retirement funds before age 59.5:

```
Year 1: Convert $50,000 from Traditional IRA to Roth IRA (pay taxes on conversion)
Year 2: Convert another $50,000
Year 3: Convert another $50,000
...
Year 6: Year 1's converted amount has "seasoned" for 5 years
         -> Can withdraw the $50,000 converted amount penalty-free
Year 7: Year 2's amount is now seasoned -> withdraw
```

**Important**: You pay income tax on the conversion amount in the year you convert. This strategy works best if you have low-income years (early retirement, sabbatical, career transition) when your tax rate is low.

## Health Savings Account (HSA)

The HSA is often called the "triple tax advantage" account:

1. **Tax-deductible contributions** (reduces taxable income)
2. **Tax-free growth** (no taxes on investment gains)
3. **Tax-free withdrawals** (for qualified medical expenses)

No other account type offers all three tax advantages.

**Eligibility**: Must be enrolled in a High-Deductible Health Plan (HDHP)

**Contribution limits** (illustrative):

- Individual: ~$4,150/year
- Family: ~$8,300/year
- Catch-up (age 55+): additional ~$1,000/year

**Advanced strategy**: Pay medical expenses out of pocket, invest your HSA for growth, and withdraw tax-free in retirement for accumulated medical receipts. There is no time limit on reimbursement — you can pay a medical bill today and reimburse yourself from your HSA 20 years from now.

**After age 65**: HSA withdrawals for non-medical expenses are taxed as ordinary income (like a Traditional IRA) but with no penalty. This effectively makes the HSA a flexible retirement account.

## 529 Plans

**Purpose**: Education savings (K-12 tuition, college, graduate school, vocational training)

**Tax treatment**:

- Contributions: After-tax (but many states offer state income tax deductions)
- Growth: Tax-free
- Withdrawals: Tax-free for qualified education expenses

**Qualified expenses**: Tuition, fees, books, supplies, room and board (within limits), computers

**Key considerations**:

- Owned by the parent/account holder, not the student
- Can change beneficiaries (e.g., from one child to another)
- Non-qualified withdrawals: earnings taxed + 10% penalty
- As of SECURE 2.0: unused 529 funds can be rolled into a Roth IRA for the beneficiary (subject to limits)

## Comparison Table: Contribution Limits

| Account            | Annual Limit (approx.) | Catch-Up      | Tax on Contribution      | Tax on Withdrawal    |
| ------------------ | ---------------------- | ------------- | ------------------------ | -------------------- |
| Traditional 401(k) | $23,000                | +$7,500 (50+) | Deductible               | Taxed as income      |
| Roth 401(k)        | $23,000                | +$7,500 (50+) | After-tax                | Tax-free             |
| Traditional IRA    | $7,000                 | +$1,000 (50+) | Deductible (if eligible) | Taxed as income      |
| Roth IRA           | $7,000                 | +$1,000 (50+) | After-tax                | Tax-free             |
| HSA                | $4,150 / $8,300        | +$1,000 (55+) | Deductible               | Tax-free (medical)   |
| 529                | Varies by state        | N/A           | After-tax                | Tax-free (education) |

_Limits shown are approximate and illustrative. Verify current limits with the IRS._

## Contribution Priority Order (Common Guidance)

This is a commonly suggested priority for allocating savings across account types. Individual circumstances may warrant a different order:

```
1. 401(k) up to employer match (free money — always first)
2. HSA (if eligible — triple tax advantage)
3. Roth IRA (tax-free growth, flexible withdrawals)
4. 401(k) up to annual limit (more tax-advantaged space)
5. Taxable brokerage account (no tax advantages but fully flexible)
6. 529 if saving for education
```

## Common Pitfalls

1. **Not getting the employer match**: Leaving employer match on the table is leaving free money behind. Even if you can only contribute 3%, get the match.

2. **Choosing Traditional when Roth is better**: Young earners in low tax brackets often benefit more from Roth contributions (pay low taxes now, withdraw tax-free when income is higher).

3. **Treating the HSA as a spending account**: Using the HSA to pay current medical bills instead of investing for long-term growth sacrifices the triple tax advantage.

4. **Over-funding 529s**: If you contribute too much and the child gets a scholarship or does not attend college, the excess faces penalties. Contribute conservatively and increase over time.

5. **Ignoring income limits**: Contributing to a Roth IRA when your income exceeds the limit can result in a 6% excess contribution penalty per year until corrected.

## Cross-References

- See **[budgeting-basics](budgeting-basics.md)** for determining how much you can afford to contribute
- See **[insurance-debt](insurance-debt.md)** for understanding HDHP requirements for HSA eligibility
- See **[saving-vs-investing](saving-vs-investing.md)** for what to invest in within these accounts
- See **[06-python-finance/numpy-financial](../06-python-finance/numpy-financial.md)** for compound growth calculations
