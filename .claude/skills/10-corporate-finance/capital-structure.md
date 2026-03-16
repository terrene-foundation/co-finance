# Capital Structure

How firms choose between debt and equity financing. Capital structure decisions affect a firm's cost of capital, risk profile, and ultimately its value. This topic covers the foundational theories (Modigliani-Miller, trade-off, pecking order) and the practical ratios used to measure leverage.

## Why Capital Structure Matters

Every firm needs capital to operate and grow. The fundamental question is: should the firm raise money by borrowing (debt) or by selling ownership shares (equity)? This choice affects:

- **Cost of capital** -- debt is generally cheaper than equity (interest is tax-deductible, and lenders have priority in bankruptcy)
- **Financial risk** -- more debt means higher fixed obligations, increasing the chance of financial distress
- **Control** -- equity dilutes ownership; debt does not
- **Flexibility** -- too much debt limits the firm's ability to borrow in the future

## Modigliani-Miller Theorems

### Proposition I (No Taxes): Capital Structure Irrelevance

In a perfect market (no taxes, no bankruptcy costs, no information asymmetry), the value of a firm is independent of its capital structure.

> **V_L = V_U**

Where:
- V_L = Value of the levered firm (uses debt)
- V_U = Value of the unlevered firm (all-equity)

**Intuition**: Think of a pizza. Whether you slice it into 4 pieces or 8 pieces, the total amount of pizza does not change. Similarly, how you divide cash flows between debt and equity holders does not change the total value of those cash flows.

**Key assumptions** (all unrealistic, which is the point -- relaxing these assumptions drives the other theories):
1. No taxes
2. No bankruptcy costs
3. No transaction costs
4. Symmetric information
5. Individuals and firms can borrow at the same rate

*Source: Modigliani, F. & Miller, M.H. (1958). "The Cost of Capital, Corporation Finance and the Theory of Investment." American Economic Review, 48(3), 261-297.*

### Proposition I (With Taxes): The Tax Shield

When corporate taxes exist, debt creates value through the interest tax shield.

> **V_L = V_U + T_c x D**

Where:
- T_c = Corporate tax rate
- D = Market value of debt

**Intuition**: The government effectively subsidizes debt financing. If a firm pays $100 in interest and the tax rate is 30%, the after-tax cost is only $70. The $30 saved each year has a present value -- that is the tax shield.

### Worked Example: Tax Shield Value

A firm is currently all-equity with a value of $10 million. The corporate tax rate is 25%. The firm is considering borrowing $4 million permanently.

V_L = V_U + T_c x D
V_L = $10,000,000 + 0.25 x $4,000,000
V_L = $10,000,000 + $1,000,000
V_L = **$11,000,000**

The tax shield adds $1 million in value. This explains why, if we only consider the tax benefit, firms should use as much debt as possible -- which leads to the trade-off theory.

### Proposition II: Cost of Equity Rises with Leverage

> **r_e = r_0 + (r_0 - r_d) x (D/E) x (1 - T_c)**

Where:
- r_e = Cost of equity (levered)
- r_0 = Cost of equity (unlevered) = cost of capital for the firm with no debt
- r_d = Cost of debt
- D/E = Debt-to-equity ratio
- T_c = Corporate tax rate

**Intuition**: As a firm adds debt, equity becomes riskier because debt holders get paid first. Equity holders demand a higher return to compensate for this additional risk.

## Trade-Off Theory

The optimal capital structure balances the **tax benefit of debt** against the **costs of financial distress**.

> **V_L = V_U + PV(Tax Shield) - PV(Financial Distress Costs)**

### Benefits of Debt
- Interest tax shield (tax-deductible interest payments)
- Disciplinary effect (forces managers to generate cash flow to meet debt payments, reducing wasteful spending)

### Costs of Debt
- **Direct bankruptcy costs**: Legal fees, court costs, administrative expenses (~3-5% of firm value for large firms)
- **Indirect bankruptcy costs**: Lost customers, suppliers demanding cash payment, difficulty retaining employees, fire-sale prices on assets (~10-20% of firm value)
- **Agency costs of debt**: Incentive to take excessive risk (asset substitution), underinvestment problem, monitoring costs

### The Optimal Point

The optimal debt ratio maximizes the difference between the PV of tax shields and the PV of distress costs. In practice:
- Firms with **stable cash flows** and **tangible assets** can carry more debt (e.g., utilities, real estate)
- Firms with **volatile cash flows** and **intangible assets** should use less debt (e.g., tech startups, biotech)

*Source: Kraus, A. & Litzenberger, R.H. (1973). "A State-Preference Model of Optimal Financial Leverage." Journal of Finance, 28(4), 911-922.*

## Pecking Order Theory

Firms prefer internal financing first, then debt, and issue equity only as a last resort -- not because of an optimal ratio, but because of information asymmetry.

**The pecking order**:
1. **Internal funds** (retained earnings) -- no information asymmetry problem
2. **Debt** -- less sensitive to information asymmetry than equity
3. **Equity** -- most sensitive; issuing equity signals that management thinks shares are overvalued

**Why equity is a last resort**: When a firm announces a new equity issue, the market interprets it as a signal that insiders believe the stock is overvalued. The stock price typically drops 2-3% on the announcement (the "equity issue announcement effect").

**Implications**:
- There is no "optimal" debt ratio; the observed ratio is the cumulative result of past financing decisions
- Profitable firms borrow less (they have more internal funds), contradicting the trade-off theory prediction
- Firms maintain financial slack (cash reserves, unused debt capacity) to avoid being forced into equity issuance

*Source: Myers, S.C. & Majluf, N.S. (1984). "Corporate Financing and Investment Decisions When Firms Have Information That Investors Do Not Have." Journal of Financial Economics, 13(2), 187-221.*

## Leverage Ratios

### Debt-to-Equity Ratio (D/E)

> **D/E = Total Debt / Total Equity**

Measures relative contribution of debt and equity. A D/E of 1.5 means $1.50 of debt for every $1.00 of equity.

### Debt-to-Capital Ratio (D/V)

> **D/V = Total Debt / (Total Debt + Total Equity)**

Also called the "debt ratio." Expresses debt as a fraction of total capital. A D/V of 0.60 means 60% debt financing.

**Relationship**: D/V = (D/E) / (1 + D/E)

### Interest Coverage Ratio (ICR)

> **ICR = EBIT / Interest Expense**

Measures the firm's ability to meet interest payments. An ICR of 3.0 means the firm earns 3 times its interest expense.

- ICR > 3.0: Generally considered safe
- ICR 1.5-3.0: Moderate risk
- ICR < 1.5: High risk of debt service difficulties

### Debt-to-EBITDA

> **Debt/EBITDA = Total Debt / EBITDA**

Measures how many years of earnings it would take to repay all debt. Widely used in leveraged finance and credit analysis.

- < 2x: Conservative leverage
- 2x-4x: Moderate leverage
- 4x-6x: High leverage (typical for leveraged buyouts)
- > 6x: Very high leverage

### Worked Example: Leverage Ratios

A firm has total debt of $500 million, total equity of $800 million, EBIT of $200 million, interest expense of $40 million, and EBITDA of $250 million.

| Ratio | Calculation | Result |
|-------|-------------|--------|
| D/E | 500 / 800 | 0.625 |
| D/V | 500 / (500 + 800) | 0.385 (38.5%) |
| ICR | 200 / 40 | 5.0x |
| Debt/EBITDA | 500 / 250 | 2.0x |

**Interpretation**: This firm has moderate leverage, comfortable interest coverage, and could repay all debt in about 2 years of EBITDA. This is a reasonably conservative capital structure.

## Common Mistakes

1. **Confusing book and market values**: Capital structure ratios should use market values of debt and equity for economic analysis, but book values are often used for covenants and reporting. Be clear about which you are using.

2. **Ignoring off-balance-sheet liabilities**: Operating leases (now capitalized under IFRS 16/ASC 842), pension obligations, and contingent liabilities affect the true leverage of a firm.

3. **Assuming more debt is always better because of the tax shield**: The trade-off theory only says debt is beneficial up to a point. Beyond that point, distress costs dominate.

4. **Applying MM without stating assumptions**: Always note which MM world you are in (no taxes, corporate taxes only, or corporate + personal taxes).

5. **Forgetting that leverage amplifies both gains and losses**: If a firm earns 15% on assets but pays 5% on debt, equity holders earn more than 15%. But if the firm earns only 3%, equity holders earn less than 3%.

## Practice Problems

**Problem 1**: An unlevered firm is worth $50 million. The corporate tax rate is 30%. If the firm issues $20 million in permanent debt, what is the value of the levered firm under MM with taxes?

**Problem 2**: A firm has an unlevered cost of equity of 12%, a cost of debt of 6%, a D/E ratio of 0.8, and a tax rate of 25%. What is the levered cost of equity under MM Proposition II with taxes?

**Problem 3**: Explain why a profitable tech company with significant intangible assets might have less debt than an equally profitable electric utility. Which theory (trade-off or pecking order) better explains each case?

## Key References

- Berk, J. & DeMarzo, P. (2020). *Corporate Finance*, 5th ed., Pearson. Chapters 14-16.
- Modigliani, F. & Miller, M.H. (1958). "The Cost of Capital, Corporation Finance and the Theory of Investment." *American Economic Review*, 48(3), 261-297.
- Myers, S.C. (1984). "The Capital Structure Puzzle." *Journal of Finance*, 39(3), 575-592.
- Graham, J.R. & Harvey, C.R. (2001). "The Theory and Practice of Corporate Finance." *Journal of Financial Economics*, 60(2-3), 187-243.
