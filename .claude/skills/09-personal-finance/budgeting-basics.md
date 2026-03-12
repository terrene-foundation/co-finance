# Budgeting Basics

Budgeting is the foundation of personal financial health. Before investing, before retirement planning, before anything else — you need to know where your money goes. This guide covers the major budgeting methods, emergency fund sizing, and practical Python tools for budget analysis.

**Educational Disclaimer**: This content is for educational purposes only. It does not constitute financial advice. Individual circumstances vary. Consult a qualified financial professional for personalized guidance.

## Income vs Expenses

### Gross vs Net Income

```
Gross Income:   What your employer pays you (salary)
  - Federal Tax
  - State Tax
  - FICA (Social Security + Medicare)
  - Health Insurance Premium
  - 401(k) Contribution
  - Other Deductions
= Net Income:    What actually hits your bank account ("take-home pay")
```

Always budget from **net income** (take-home pay), not gross income. Gross income is misleading because a significant portion never reaches your bank account.

### Expense Categories

| Category           | Type              | Examples                                               |
| ------------------ | ----------------- | ------------------------------------------------------ |
| **Housing**        | Fixed             | Rent/mortgage, property tax, insurance                 |
| **Utilities**      | Semi-fixed        | Electric, gas, water, internet, phone                  |
| **Transportation** | Mixed             | Car payment (fixed), gas (variable), insurance (fixed) |
| **Food**           | Variable          | Groceries, dining out                                  |
| **Healthcare**     | Mixed             | Insurance premium (fixed), copays (variable)           |
| **Debt Payments**  | Fixed             | Student loans, credit cards, personal loans            |
| **Savings**        | Fixed (should be) | Emergency fund, retirement, goals                      |
| **Discretionary**  | Variable          | Entertainment, hobbies, subscriptions, clothing        |

### Fixed vs Variable Expenses

**Fixed expenses** stay the same each month (rent, car payment, insurance premiums). These are predictable and easy to plan for.

**Variable expenses** change month to month (groceries, dining out, entertainment). These are where most budget flexibility exists — and where most overspending happens.

## The 50/30/20 Rule

A simple guideline for allocating net income:

```
50% -> Needs     (housing, food, transportation, insurance, minimum debt payments)
30% -> Wants     (dining out, entertainment, hobbies, subscriptions, travel)
20% -> Savings   (emergency fund, retirement, debt payoff beyond minimums, investments)
```

### Python Example: 50/30/20 Budget Calculator

```python
def budget_50_30_20(monthly_net_income):
    """
    Calculate a 50/30/20 budget allocation.

    Educational example — not financial advice.
    """
    needs = monthly_net_income * 0.50
    wants = monthly_net_income * 0.30
    savings = monthly_net_income * 0.20

    print(f"Monthly Net Income: ${monthly_net_income:,.2f}")
    print(f"{'='*40}")
    print(f"Needs (50%):    ${needs:,.2f}")
    print(f"  Housing:      ${needs * 0.60:,.2f}")  # ~30% of total
    print(f"  Food:         ${needs * 0.20:,.2f}")  # ~10% of total
    print(f"  Transport:    ${needs * 0.12:,.2f}")  # ~6% of total
    print(f"  Insurance:    ${needs * 0.08:,.2f}")  # ~4% of total
    print(f"Wants (30%):    ${wants:,.2f}")
    print(f"Savings (20%):  ${savings:,.2f}")
    print(f"  Emergency:    ${savings * 0.25:,.2f}")  # Until funded
    print(f"  Retirement:   ${savings * 0.50:,.2f}")
    print(f"  Goals:        ${savings * 0.25:,.2f}")

    return {"needs": needs, "wants": wants, "savings": savings}

# Example: $5,000/month take-home pay
budget_50_30_20(5_000)
```

### When 50/30/20 Does Not Fit

The 50/30/20 rule is a starting point, not a strict requirement:

- **High cost-of-living areas**: Housing alone may consume 40%+ of income. Adjust to 60/20/20 or 55/25/20.
- **High debt**: If you have significant debt, consider 50/20/30 (30% to debt payoff + savings).
- **High income**: If you earn well above your needs, you can often save 30-50%.
- **Low income**: If needs consume more than 50%, focus on covering essentials first and building savings gradually.

## Zero-Based Budgeting

**Concept**: Every dollar of income is assigned a specific purpose. Income minus all allocated expenses equals exactly zero.

```
Income:                    $5,000
  - Rent:                  $1,500
  - Utilities:               $200
  - Groceries:               $400
  - Transportation:          $350
  - Insurance:               $200
  - Student Loan:            $300
  - Dining Out:              $200
  - Entertainment:           $150
  - Clothing:                $100
  - Emergency Fund:          $300
  - Retirement (Roth IRA):   $500
  - Vacation Fund:           $200
  - Miscellaneous:           $100
  - Buffer (unexpected):     $500
= Remaining:                  $0
```

### Python: Zero-Based Budget Tracker

```python
def zero_based_budget(income, expenses):
    """
    Create a zero-based budget and check if it balances.

    Parameters:
        income: Monthly net income
        expenses: Dict of {category: amount}

    Educational example — not financial advice.
    """
    total_expenses = sum(expenses.values())
    remainder = income - total_expenses

    print(f"Monthly Income: ${income:,.2f}")
    print(f"{'='*45}")

    # Group by type
    for category, amount in sorted(expenses.items(), key=lambda x: -x[1]):
        pct = amount / income * 100
        bar = "#" * int(pct / 2)
        print(f"  {category:<20s} ${amount:>8,.2f}  ({pct:4.1f}%) {bar}")

    print(f"{'='*45}")
    print(f"  Total Allocated:     ${total_expenses:,.2f}")
    print(f"  Remaining:           ${remainder:,.2f}")

    if abs(remainder) < 1:
        print("  Status: BALANCED")
    elif remainder > 0:
        print(f"  Status: ${remainder:,.2f} UNALLOCATED - assign to a category")
    else:
        print(f"  Status: ${abs(remainder):,.2f} OVER BUDGET - reduce spending")

    return remainder

# Example
expenses = {
    "Rent": 1500,
    "Utilities": 200,
    "Groceries": 400,
    "Transportation": 350,
    "Insurance": 200,
    "Student Loan": 300,
    "Dining Out": 200,
    "Entertainment": 150,
    "Clothing": 100,
    "Emergency Fund": 300,
    "Retirement": 500,
    "Vacation Fund": 200,
    "Buffer": 100,
}
zero_based_budget(5000, expenses)
```

### Advantages

- Forces intentional spending decisions
- No money "disappears" — every dollar is accounted for
- Makes overspending in one category immediately visible
- Works well for variable or irregular income

### Disadvantages

- Time-consuming to maintain
- Requires tracking every expense
- Can feel restrictive
- Requires re-budgeting when income changes

## Envelope Method

**Concept**: Allocate cash (physical or virtual) into envelopes for each spending category. When an envelope is empty, you stop spending in that category until next month.

```
Virtual Envelope System:

[Groceries: $400]     -> Spent $350, remaining $50
[Dining Out: $200]    -> Spent $180, remaining $20
[Entertainment: $150] -> Spent $150, remaining $0 (DONE for the month)
[Clothing: $100]      -> Spent $40, remaining $60
[Gas: $150]           -> Spent $120, remaining $30
```

Best for: Categories where overspending is common (dining out, entertainment, shopping). Not practical for bills paid electronically (rent, utilities).

## Emergency Fund Sizing

An emergency fund is cash savings to cover unexpected expenses or income loss, held in a liquid, accessible account (savings account, money market).

### How Much?

| Situation                         | Recommended Size                  |
| --------------------------------- | --------------------------------- |
| Single income, stable job         | 3 months of essential expenses    |
| Dual income, both stable          | 3 months of essential expenses    |
| Single income, variable/freelance | 6 months of essential expenses    |
| Single income, sole provider      | 6 months of essential expenses    |
| Self-employed                     | 6-12 months of essential expenses |
| Approaching retirement            | 12 months of essential expenses   |

**"Essential expenses"** means needs only — housing, food, transportation, insurance, minimum debt payments. Not your full lifestyle spending.

### Python: Emergency Fund Calculator

```python
def emergency_fund_calculator(monthly_expenses, months_target,
                               current_savings, monthly_contribution):
    """
    Calculate emergency fund target and time to reach it.

    Educational example — not financial advice.
    """
    target = monthly_expenses * months_target
    shortfall = max(0, target - current_savings)

    print(f"Monthly Essential Expenses: ${monthly_expenses:,.2f}")
    print(f"Target ({months_target} months):       ${target:,.2f}")
    print(f"Current Savings:           ${current_savings:,.2f}")
    print(f"Shortfall:                 ${shortfall:,.2f}")

    if shortfall > 0 and monthly_contribution > 0:
        months_to_goal = shortfall / monthly_contribution
        print(f"Monthly Contribution:      ${monthly_contribution:,.2f}")
        print(f"Time to Goal:              {months_to_goal:.1f} months "
              f"({months_to_goal/12:.1f} years)")
    elif shortfall == 0:
        print("Emergency fund is fully funded!")
    else:
        print("Set a monthly contribution to start building your fund.")

    return {
        "target": target,
        "shortfall": shortfall,
        "current": current_savings,
    }

# Example: $3,000/month in essential expenses, targeting 6 months
emergency_fund_calculator(
    monthly_expenses=3_000,
    months_target=6,
    current_savings=5_000,
    monthly_contribution=500,
)
```

### Where to Keep It

- **High-yield savings account**: Best option — FDIC insured, easy to access, earns some interest
- **Money market account**: Similar to savings, may offer slightly higher rates
- **NOT in the stock market**: Emergency funds should not be invested in volatile assets. The whole point is that the money is there when you need it, regardless of market conditions.

## Cash Flow Tracking

### Python: Monthly Cash Flow Analyzer

```python
import pandas as pd
from collections import defaultdict

def analyze_cash_flow(transactions):
    """
    Analyze monthly cash flow from transaction data.

    Parameters:
        transactions: List of dicts with 'date', 'description',
                      'amount' (negative = expense), 'category'

    Educational example — not financial advice.
    """
    df = pd.DataFrame(transactions)
    df["date"] = pd.to_datetime(df["date"])
    df["month"] = df["date"].dt.to_period("M")

    # Income vs expenses
    income = df[df["amount"] > 0]["amount"].sum()
    expenses = df[df["amount"] < 0]["amount"].sum()
    net = income + expenses

    print("CASH FLOW ANALYSIS")
    print("=" * 40)
    print(f"Total Income:   ${income:>10,.2f}")
    print(f"Total Expenses: ${abs(expenses):>10,.2f}")
    print(f"Net Cash Flow:  ${net:>10,.2f}")
    print(f"Savings Rate:   {net/income:.1%}" if income > 0 else "")

    # Expenses by category
    print(f"\nEXPENSES BY CATEGORY")
    print("-" * 40)
    expense_df = df[df["amount"] < 0].copy()
    expense_df["amount"] = expense_df["amount"].abs()
    by_category = expense_df.groupby("category")["amount"].sum().sort_values(ascending=False)

    for category, amount in by_category.items():
        pct = amount / abs(expenses) * 100
        print(f"  {category:<20s} ${amount:>8,.2f}  ({pct:4.1f}%)")

    return {"income": income, "expenses": expenses, "net": net}

# Example usage
transactions = [
    {"date": "2024-03-01", "description": "Paycheck", "amount": 3500, "category": "Income"},
    {"date": "2024-03-15", "description": "Paycheck", "amount": 3500, "category": "Income"},
    {"date": "2024-03-01", "description": "Rent", "amount": -1500, "category": "Housing"},
    {"date": "2024-03-05", "description": "Electric", "amount": -120, "category": "Utilities"},
    {"date": "2024-03-07", "description": "Groceries", "amount": -85, "category": "Food"},
    {"date": "2024-03-10", "description": "Gas", "amount": -45, "category": "Transportation"},
    {"date": "2024-03-12", "description": "Restaurant", "amount": -65, "category": "Dining Out"},
    {"date": "2024-03-14", "description": "Groceries", "amount": -92, "category": "Food"},
    {"date": "2024-03-18", "description": "Netflix", "amount": -15, "category": "Entertainment"},
    {"date": "2024-03-20", "description": "Student Loan", "amount": -300, "category": "Debt"},
    {"date": "2024-03-22", "description": "Groceries", "amount": -78, "category": "Food"},
    {"date": "2024-03-25", "description": "401k Match", "amount": 200, "category": "Income"},
]

analyze_cash_flow(transactions)
```

## Common Pitfalls

1. **Budgeting gross income**: Always use net (take-home) pay. Budgeting $80,000/year when you only take home $58,000 leads to overspending.

2. **Forgetting irregular expenses**: Annual insurance premiums, car registration, holiday gifts, and property taxes. Divide annual costs by 12 and include them monthly.

3. **No buffer category**: Unexpected expenses happen every month. A $100-200 "buffer" or "miscellaneous" category prevents blowing the budget on small surprises.

4. **Being too strict**: Budgets that leave zero room for discretionary spending are unsustainable. Like crash diets, extreme budgets tend to be abandoned.

5. **Not tracking**: A budget that exists only on paper is not a budget. Regular tracking (weekly or biweekly) is essential.

## Cross-References

- See **[tax-advantaged-accounts](tax-advantaged-accounts.md)** for where to direct savings (401k, IRA, HSA)
- See **[insurance-debt](insurance-debt.md)** for managing the debt payments line of your budget
- See **[saving-vs-investing](saving-vs-investing.md)** for when your emergency fund is built and you are ready to invest
- See **[10-behavioral-finance/cognitive-biases](../10-behavioral-finance/cognitive-biases.md)** for mental accounting and other biases that affect budgeting
