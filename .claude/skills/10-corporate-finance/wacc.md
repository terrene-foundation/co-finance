# Weighted Average Cost of Capital (WACC)

The WACC is the firm's blended cost of financing -- the minimum return a company must earn on its existing assets to satisfy all of its capital providers (debt holders and equity holders). It serves as the discount rate for evaluating new investments and for discounting free cash flows in valuation.

## Why WACC Matters

When a firm evaluates a new project, it needs a benchmark: "What return must this project earn to be worth doing?" That benchmark is the WACC. A project that earns more than the WACC creates value for shareholders; a project that earns less destroys value.

Think of WACC as the "rental cost" of the capital the firm uses. Just as you would not rent a machine unless the revenue it generates covers the rental cost, a firm should not invest capital unless the expected return covers the WACC.

## The WACC Formula

> **WACC = (E/V) x r_e + (D/V) x r_d x (1 - T_c)**

Where:
- E = Market value of equity
- D = Market value of debt
- V = E + D = Total firm value (enterprise value)
- r_e = Cost of equity
- r_d = Cost of debt (pre-tax)
- T_c = Corporate tax rate
- (1 - T_c) = Tax shield adjustment (interest payments are tax-deductible)

### Worked Example: WACC Calculation

A company has:
- Market value of equity: $600 million (share price $30 x 20 million shares)
- Market value of debt: $400 million
- Cost of equity: 11%
- Pre-tax cost of debt: 6%
- Corporate tax rate: 25%

**Step 1**: Calculate weights.
- E/V = 600 / (600 + 400) = 0.60
- D/V = 400 / (600 + 400) = 0.40

**Step 2**: Apply the formula.
- WACC = (0.60 x 0.11) + (0.40 x 0.06 x (1 - 0.25))
- WACC = 0.066 + 0.018
- WACC = 0.084 = **8.4%**

**Interpretation**: The firm needs to earn at least 8.4% on any new investment to compensate all capital providers. Notice that the after-tax cost of debt is 6% x (1 - 0.25) = 4.5%, which is cheaper than equity at 11% -- this is why debt is often called "cheap" capital.

## Cost of Equity (r_e)

The cost of equity is the return shareholders require to compensate them for the risk of holding the firm's stock. Unlike debt, equity has no contractual return -- the cost must be estimated.

### Method 1: Capital Asset Pricing Model (CAPM)

> **r_e = r_f + beta x (E(r_m) - r_f)**

Where:
- r_f = Risk-free rate (typically the yield on 10-year government bonds)
- beta = Sensitivity of the stock's returns to market returns (systematic risk)
- E(r_m) - r_f = Market risk premium (historically 4-7% for US equities)

**Worked Example**: CAPM Cost of Equity

Given:
- Risk-free rate: 4.0% (10-year US Treasury yield)
- Beta: 1.2
- Market risk premium: 5.5%

r_e = 4.0% + 1.2 x 5.5% = 4.0% + 6.6% = **10.6%**

**How to find beta**: Regress the stock's historical returns against the market index (e.g., S&P 500) returns. The slope coefficient is beta. Alternatively, use published betas from financial data providers (Bloomberg, Yahoo Finance, Reuters).

**Levering and unlevering beta**: If you need the beta for a different capital structure:

> **beta_unlevered = beta_levered / (1 + (1 - T_c) x (D/E))**

> **beta_relevered = beta_unlevered x (1 + (1 - T_c) x (D/E)_new)**

### Method 2: Dividend Discount Model (DDM) / Gordon Growth Model

> **r_e = (D_1 / P_0) + g**

Where:
- D_1 = Expected dividend per share next year
- P_0 = Current stock price
- g = Expected constant growth rate of dividends

**Worked Example**: DDM Cost of Equity

A stock trades at $50, is expected to pay a dividend of $2.50 next year, and dividends are expected to grow at 4% per year.

r_e = (2.50 / 50) + 0.04 = 0.05 + 0.04 = 0.09 = **9.0%**

**Limitations**: Only works for firms that pay dividends. Assumes constant growth forever, which is unrealistic for many firms.

### Method 3: Bond Yield Plus Risk Premium

> **r_e = r_d + Risk Premium (typically 3-5%)**

A rough approximation. The logic: equity is riskier than debt, so the cost of equity should be higher than the cost of debt by some premium.

**When to use each method**:

| Method | Best for | Limitations |
|--------|----------|-------------|
| CAPM | Any publicly traded firm | Requires reliable beta estimate; sensitive to market risk premium assumption |
| DDM | Mature, dividend-paying firms | Does not work for non-dividend payers; assumes constant growth |
| Bond Yield + Premium | Quick estimate, private firms with rated debt | Imprecise; risk premium is subjective |

## Cost of Debt (r_d)

The cost of debt is the interest rate the firm pays on its borrowings, adjusted for the tax deductibility of interest.

### Pre-Tax Cost of Debt

- **For publicly traded bonds**: Use the yield to maturity (YTM) on the firm's outstanding bonds, not the coupon rate. YTM reflects the current market rate.
- **For bank loans**: Use the current interest rate on the firm's loan facilities.
- **For new debt**: Use the rate the firm would pay if it issued new debt today (based on its credit rating).

### After-Tax Cost of Debt

> **After-tax r_d = r_d x (1 - T_c)**

This is the figure used in the WACC formula. Interest payments are tax-deductible, so the effective cost to the firm is lower than the stated interest rate.

**Worked Example**: A firm has bonds outstanding with a YTM of 5.5% and a corporate tax rate of 25%.

After-tax cost of debt = 5.5% x (1 - 0.25) = 5.5% x 0.75 = **4.125%**

### Estimating Cost of Debt from Credit Ratings

If YTM data is unavailable, estimate using credit spreads:

| Credit Rating | Typical Spread Over Treasuries | Example (if Treasury = 4%) |
|---------------|-------------------------------|---------------------------|
| AAA | 0.5-0.7% | 4.5-4.7% |
| AA | 0.7-1.0% | 4.7-5.0% |
| A | 1.0-1.5% | 5.0-5.5% |
| BBB | 1.5-2.5% | 5.5-6.5% |
| BB | 2.5-4.0% | 6.5-8.0% |
| B | 4.0-6.0% | 8.0-10.0% |

*Source: Damodaran, A. (updated annually). Default Spreads and Risk Premiums. NYU Stern.*

## The Tax Shield

The tax shield is the reduction in taxes that results from the deductibility of interest expense.

> **Annual Tax Shield = Interest Expense x T_c**

> **PV of Tax Shield (perpetual debt) = T_c x D**

### Worked Example: Tax Shield

A firm has $200 million in debt at 6% interest and a 25% tax rate.

Annual interest expense = $200M x 0.06 = $12 million
Annual tax shield = $12M x 0.25 = **$3 million per year**

If this debt is perpetual, PV of tax shield = 0.25 x $200M = **$50 million**

This $50 million is "free" value created by using debt instead of equity -- the fundamental insight behind MM Proposition I with taxes.

## WACC with Multiple Debt Types

Many firms have multiple types of debt (senior secured, subordinated, convertible). In this case:

> **WACC = (E/V) x r_e + sum over all debt types of: (D_i/V) x r_d,i x (1 - T_c)**

Weight each debt type by its market value and use its specific cost.

## WACC for Valuation: When to Adjust

- **Project-specific WACC**: If a project has different risk than the firm's overall operations, use a project-specific WACC (find comparable pure-play companies, unlever their betas, relever to the project's capital structure)
- **Country risk premium**: For projects in emerging markets, add a country risk premium to the cost of equity
- **Changing capital structure**: If the firm plans to change its capital structure over time, use the Adjusted Present Value (APV) method instead of WACC

## Common Mistakes

1. **Using book value weights instead of market value weights**: Book values are historical; market values reflect current economics. Always use market values for WACC.

2. **Forgetting the tax adjustment on debt**: The cost of debt in WACC must be after-tax. Using pre-tax cost overstates WACC.

3. **Using the coupon rate as cost of debt**: The coupon rate is the historical contractual rate. The YTM reflects the current market cost of debt.

4. **Applying the firm's WACC to a project with different risk**: A biotech firm investing in a real estate project should not use the biotech WACC. Use a project-specific rate.

5. **Double-counting the tax shield**: If you use WACC to discount free cash flows (which do not subtract interest), the tax benefit is already in the WACC through the (1 - T_c) term. Do not also add PV(tax shield) separately -- that would be double-counting.

6. **Assuming WACC is constant when capital structure changes**: WACC changes as the debt/equity mix changes. A firm that significantly increases leverage will have a different WACC.

## Practice Problems

**Problem 1**: A firm has a market cap of $2 billion and outstanding debt with a market value of $800 million. The cost of equity is 13%, the pre-tax cost of debt is 7%, and the tax rate is 30%. Calculate the WACC.

**Problem 2**: Using the CAPM, estimate the cost of equity for a firm with beta = 0.9, given a risk-free rate of 3.5% and a market risk premium of 6%. Then calculate WACC if the firm has D/E = 0.5 and a pre-tax cost of debt of 5.5% with a 25% tax rate.

**Problem 3**: A firm is considering a project in a different industry. The comparable firms in that industry have an average levered beta of 1.4 and an average D/E ratio of 0.6. The firm plans to finance the project with a D/E of 0.3. The tax rate is 25%, risk-free rate is 4%, and market risk premium is 5.5%. Calculate the project-specific cost of equity.

## Key References

- Berk, J. & DeMarzo, P. (2020). *Corporate Finance*, 5th ed., Pearson. Chapters 12-13.
- Damodaran, A. (2012). *Investment Valuation*, 3rd ed., Wiley. Chapter 8.
- Modigliani, F. & Miller, M.H. (1963). "Corporate Income Taxes and the Cost of Capital." *American Economic Review*, 53(3), 433-443.
- Bruner, R.F. et al. (1998). "Best Practices in Estimating the Cost of Capital." *Financial Practice and Education*, 8(1), 13-28.
