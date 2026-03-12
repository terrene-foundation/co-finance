# Insurance and Debt Management

Insurance protects against catastrophic financial loss. Debt management determines whether borrowing builds wealth or destroys it. This guide covers the major insurance types, debt management strategies, and how to evaluate both.

**Educational Disclaimer**: This content is for educational purposes only. Insurance needs and debt strategies depend on individual circumstances. Consult qualified professionals for personalized guidance.

## Insurance Types

### Term Life Insurance

**What it does**: Pays a death benefit to your beneficiaries if you die during the term (10, 20, or 30 years).

**Who needs it**: Anyone with dependents who rely on their income — spouses, children, aging parents.

**How much**: A common guideline is 10-12x your annual income, but the right amount depends on:

- Outstanding debts (mortgage, student loans)
- Number and ages of dependents
- Spouse's income
- Future expenses to cover (college for children)

**Key points**:

- Term life is significantly cheaper than whole life or universal life
- Buy it when you are young and healthy for the lowest premiums
- The need typically decreases over time (as you build wealth and children become independent)

| Feature    | Term Life                | Whole Life                       |
| ---------- | ------------------------ | -------------------------------- |
| Duration   | Fixed term (10-30 years) | Lifetime                         |
| Cost       | Lower                    | Significantly higher             |
| Cash value | No                       | Yes (but grows slowly)           |
| Complexity | Simple                   | Complex                          |
| Best for   | Income replacement       | Estate planning (high net worth) |

### Health Insurance

**Key terms**:

- **Premium**: Monthly cost of the plan
- **Deductible**: Amount you pay before insurance kicks in
- **Copay**: Fixed amount per visit ($30 for a doctor visit)
- **Coinsurance**: Percentage you pay after deductible (20% of costs)
- **Out-of-pocket maximum**: The most you pay in a year; after this, insurance covers 100%

**High-Deductible Health Plan (HDHP)**: Lower premiums, higher deductible. Unlocks HSA eligibility. Good for healthy individuals who want to invest in an HSA. See **[tax-advantaged-accounts](tax-advantaged-accounts.md)** for HSA details.

### Disability Insurance

Often overlooked but critically important. Your ability to earn income is your most valuable financial asset.

**Short-term disability**: Covers 60-70% of income for 3-6 months (often provided by employers).

**Long-term disability**: Covers 50-60% of income for years or until retirement age. Consider purchasing additional coverage if employer-provided is insufficient.

**Who needs it**: Anyone who depends on their income. The probability of a working-age adult experiencing a disability lasting 90+ days is higher than most people expect.

### Umbrella Insurance

**What it does**: Provides additional liability coverage beyond your auto and homeowner's policies.

**Who needs it**: Anyone with significant assets to protect, especially if they:

- Own a home
- Have a swimming pool, trampoline, or dog
- Have teenage drivers
- Have a high net worth

**Cost**: Relatively inexpensive ($200-400/year for $1 million in coverage). One of the best values in insurance.

### Insurance You Probably Do NOT Need

- **Whole life insurance** (for most people — term is usually better)
- **Credit card insurance** (overpriced for what it covers)
- **Extended warranties** (statistically unprofitable for the buyer)
- **Rental car insurance** (if your auto policy already covers rentals)
- **Flight insurance** (your life insurance covers you everywhere)

## Debt Management

### Good Debt vs Bad Debt

This is a simplification, but a useful mental model:

| Type          | Examples                                                         | Why "Good" or "Bad"                                                |
| ------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Good debt** | Mortgage, student loans (moderate), business loans               | Finances an appreciating asset or increases earning potential      |
| **Bad debt**  | Credit card debt, payday loans, car loans on depreciating assets | Finances consumption or depreciating assets at high interest rates |

**Important nuance**: Even "good debt" becomes bad debt if the amount is excessive. A $200,000 student loan for a degree that leads to a $40,000 salary is problematic regardless of the category.

### Debt Avalanche Method

**Strategy**: Pay off debts in order of **highest interest rate first**.

**Mathematically optimal** — minimizes total interest paid.

```python
def debt_avalanche(debts, monthly_budget):
    """
    Simulate the debt avalanche payoff strategy.

    Parameters:
        debts: List of dicts with 'name', 'balance', 'rate', 'min_payment'
        monthly_budget: Total monthly amount available for debt payments

    Educational example — not financial advice.
    """
    # Sort by interest rate (highest first)
    debts = sorted(debts, key=lambda d: d["rate"], reverse=True)
    debts = [dict(d) for d in debts]  # Copy to avoid mutating input

    total_min = sum(d["min_payment"] for d in debts)
    if monthly_budget < total_min:
        print(f"Warning: Budget ${monthly_budget} is less than "
              f"minimum payments ${total_min}")
        return

    month = 0
    total_interest = 0

    print("DEBT AVALANCHE PAYOFF PLAN")
    print("=" * 50)
    print(f"Order: {' -> '.join(d['name'] for d in debts)}")
    print(f"Monthly budget: ${monthly_budget:,.2f}")
    print()

    while any(d["balance"] > 0 for d in debts):
        month += 1
        extra = monthly_budget - sum(
            d["min_payment"] for d in debts if d["balance"] > 0
        )

        for d in debts:
            if d["balance"] <= 0:
                continue

            # Apply interest
            interest = d["balance"] * d["rate"] / 12
            total_interest += interest
            d["balance"] += interest

            # Apply minimum payment
            payment = min(d["min_payment"], d["balance"])
            d["balance"] -= payment

            # Apply extra payment to highest-rate debt
            if extra > 0 and d == next(
                (x for x in debts if x["balance"] > 0), None
            ):
                extra_payment = min(extra, d["balance"])
                d["balance"] -= extra_payment
                extra -= extra_payment

            if d["balance"] < 0.01:
                d["balance"] = 0
                print(f"  Month {month}: {d['name']} PAID OFF!")

    print(f"\nTotal months: {month} ({month/12:.1f} years)")
    print(f"Total interest paid: ${total_interest:,.2f}")
    return month, total_interest


# Example
debts = [
    {"name": "Credit Card", "balance": 5_000, "rate": 0.22, "min_payment": 150},
    {"name": "Car Loan", "balance": 15_000, "rate": 0.06, "min_payment": 300},
    {"name": "Student Loan", "balance": 25_000, "rate": 0.05, "min_payment": 250},
]

debt_avalanche(debts, monthly_budget=1_000)
```

### Debt Snowball Method

**Strategy**: Pay off debts in order of **smallest balance first**.

**Not mathematically optimal** but psychologically effective — early wins build momentum and motivation.

```python
def debt_snowball(debts, monthly_budget):
    """
    Simulate the debt snowball payoff strategy.

    Parameters:
        debts: List of dicts with 'name', 'balance', 'rate', 'min_payment'
        monthly_budget: Total monthly amount available for debt payments

    Educational example — not financial advice.
    """
    # Sort by balance (smallest first)
    debts = sorted(debts, key=lambda d: d["balance"])
    debts = [dict(d) for d in debts]

    month = 0
    total_interest = 0

    print("DEBT SNOWBALL PAYOFF PLAN")
    print("=" * 50)
    print(f"Order: {' -> '.join(d['name'] for d in debts)}")
    print(f"Monthly budget: ${monthly_budget:,.2f}")
    print()

    while any(d["balance"] > 0 for d in debts):
        month += 1
        extra = monthly_budget - sum(
            d["min_payment"] for d in debts if d["balance"] > 0
        )

        for d in debts:
            if d["balance"] <= 0:
                continue

            interest = d["balance"] * d["rate"] / 12
            total_interest += interest
            d["balance"] += interest

            payment = min(d["min_payment"], d["balance"])
            d["balance"] -= payment

            if extra > 0 and d == next(
                (x for x in debts if x["balance"] > 0), None
            ):
                extra_payment = min(extra, d["balance"])
                d["balance"] -= extra_payment
                extra -= extra_payment

            if d["balance"] < 0.01:
                d["balance"] = 0
                print(f"  Month {month}: {d['name']} PAID OFF!")

    print(f"\nTotal months: {month} ({month/12:.1f} years)")
    print(f"Total interest paid: ${total_interest:,.2f}")
    return month, total_interest


# Compare both methods with the same debts
debts = [
    {"name": "Credit Card", "balance": 5_000, "rate": 0.22, "min_payment": 150},
    {"name": "Car Loan", "balance": 15_000, "rate": 0.06, "min_payment": 300},
    {"name": "Student Loan", "balance": 25_000, "rate": 0.05, "min_payment": 250},
]

print("METHOD 1: AVALANCHE (highest rate first)")
a_months, a_interest = debt_avalanche(debts, 1_000)

print("\n" + "=" * 50)
print("\nMETHOD 2: SNOWBALL (smallest balance first)")
s_months, s_interest = debt_snowball(debts, 1_000)

print(f"\n{'='*50}")
print(f"COMPARISON:")
print(f"  Avalanche: {a_months} months, ${a_interest:,.2f} interest")
print(f"  Snowball:  {s_months} months, ${s_interest:,.2f} interest")
print(f"  Difference: ${s_interest - a_interest:,.2f} more interest with snowball")
```

### Which Method Is Better?

The mathematically optimal method (avalanche) saves more money. But the best method is the one you stick with. Research by behavioral economists suggests that the psychological wins from the snowball method help many people stay motivated to pay off all their debt. See **[10-behavioral-finance](../10-behavioral-finance/SKILL.md)** for more on how psychology affects financial decisions.

## Credit Scores

Credit scores (FICO and VantageScore) range from 300 to 850 and affect:

- Interest rates on loans and credit cards
- Rental applications
- Insurance premiums (in some states)
- Employment screening (in some industries)

### Factors That Affect Your Score

| Factor             | Weight (approx.) | What It Means                                          |
| ------------------ | ---------------- | ------------------------------------------------------ |
| Payment history    | 35%              | Pay on time, every time                                |
| Credit utilization | 30%              | Keep balances below 30% of limits (below 10% is ideal) |
| Length of history  | 15%              | Older accounts help; don't close your oldest card      |
| Credit mix         | 10%              | Mix of credit types (cards, loans, mortgage)           |
| New credit         | 10%              | Hard inquiries from applications (temporary impact)    |

### How to Build/Improve Credit

1. **Pay every bill on time** (most important factor)
2. **Keep credit utilization low** (use less than 30% of available credit)
3. **Don't close old accounts** (they contribute to length of history)
4. **Limit hard inquiries** (avoid applying for many cards at once)
5. **Check your report annually** for errors (free at annualcreditreport.com)

## Student Loans

### Federal vs Private

| Feature                 | Federal Loans          | Private Loans                    |
| ----------------------- | ---------------------- | -------------------------------- |
| Interest rates          | Fixed, set by Congress | Variable or fixed, set by lender |
| Income-driven repayment | Available              | Not available                    |
| Forgiveness programs    | PSLF, IDR forgiveness  | Rarely available                 |
| Deferment/forbearance   | Available              | Limited                          |
| Bankruptcy discharge    | Very difficult         | Very difficult                   |

### Repayment Strategies

1. **Standard Repayment**: Fixed payments over 10 years
2. **Income-Driven Repayment (IDR)**: Payments based on income (10-20% of discretionary income), forgiveness after 20-25 years
3. **Public Service Loan Forgiveness (PSLF)**: Forgiveness after 120 qualifying payments while working for a qualifying employer (government, nonprofit)
4. **Refinancing**: Replace federal or private loans with a new private loan at a lower rate (loses federal protections)

## Mortgages

### Key Concepts

- **Down payment**: 20% avoids Private Mortgage Insurance (PMI), but many programs accept 3-5%
- **PMI**: Additional monthly cost (0.5-1% of loan annually) when down payment is less than 20%
- **Fixed vs Adjustable Rate (ARM)**: Fixed rate stays the same; ARM adjusts after an initial period
- **Points**: Upfront fees paid to lower the interest rate (1 point = 1% of loan = ~0.25% rate reduction)

### How Much House Can You Afford?

Common guidelines (rules of thumb, not absolute rules):

- **28% rule**: Housing costs (mortgage + taxes + insurance) should not exceed 28% of gross monthly income
- **36% rule**: Total debt payments should not exceed 36% of gross monthly income
- **3x income rule**: Home price should not exceed 3x annual household income (varies significantly by market)

## Common Pitfalls

1. **Under-insuring**: Saving $50/month on disability insurance premiums but being unprotected against the risk of losing your entire income.

2. **Over-insuring**: Buying whole life insurance when term life meets your needs, or insuring things that are affordable to replace.

3. **Minimum payments only**: Making only minimum payments on credit cards means most of your payment goes to interest. A $5,000 balance at 22% APR with minimum payments takes 20+ years to pay off.

4. **Ignoring the interest rate**: Focusing on monthly payment instead of total cost. A longer loan term means a lower monthly payment but much more total interest.

5. **Not refinancing when rates drop**: If interest rates fall significantly below your current rate, refinancing can save thousands. But only if the break-even point (closing costs recouped through savings) makes sense for your timeline.

## Cross-References

- See **[budgeting-basics](budgeting-basics.md)** for fitting insurance premiums and debt payments into your budget
- See **[tax-advantaged-accounts](tax-advantaged-accounts.md)** for understanding HDHP/HSA health insurance strategy
- See **[saving-vs-investing](saving-vs-investing.md)** for what to do after debt is under control
- See **[10-behavioral-finance/loss-aversion-herding](../10-behavioral-finance/loss-aversion-herding.md)** for why people avoid addressing debt
