# DCF Walkthrough for Case Analysis

A step-by-step guide to building a Discounted Cash Flow valuation in a case study context.

## Overview

> **Enterprise Value = PV of projected FCFs + PV of Terminal Value**

Then: Equity Value = Enterprise Value - Net Debt

## Step 1: Project Revenue

Start with the most recent revenue and grow it forward 5-10 years.

**Methods**:
- **Top-down**: Market size x market share x growth rate
- **Bottom-up**: Units x price, or customers x revenue per customer
- **Historical extrapolation**: Use CAGR of recent years, adjusted for expected changes

**Worked Example**: Current revenue = $500M, expected growth = 8% Year 1-3, 5% Year 4-5.

| Year | 1 | 2 | 3 | 4 | 5 |
|------|---|---|---|---|---|
| Revenue ($M) | 540 | 583 | 630 | 661 | 694 |

## Step 2: Project Operating Margins

Estimate EBIT margins based on historical averages and expected trends.

If EBIT margin is expected to be 20% in steady state:

| Year | 1 | 2 | 3 | 4 | 5 |
|------|---|---|---|---|---|
| EBIT ($M) | 108 | 117 | 126 | 132 | 139 |

## Step 3: Calculate Free Cash Flow

> **FCF = EBIT x (1 - Tax Rate) + Depreciation - CapEx - Change in NWC**

Typical assumptions:
- Tax rate: use the effective rate from financial statements
- Depreciation: as a % of revenue or PP&E
- CapEx: as a % of revenue (maintenance + growth)
- NWC: change in NWC as a % of revenue change

## Step 4: Estimate WACC

> **WACC = (E/V) x r_e + (D/V) x r_d x (1 - T)**

See [wacc.md](../10-corporate-finance/wacc.md) for detailed guidance.

For a case competition, a WACC of 8-12% is typical for most industries. Justify your choice.

## Step 5: Calculate Terminal Value

Two common approaches:

**Gordon Growth (Perpetuity Growth)**:
> **TV = FCF_(n+1) / (WACC - g)**

Where g = long-term growth rate (typically 2-3%, approximating long-run GDP growth + inflation).

**Exit Multiple**:
> **TV = EBITDA_n x EV/EBITDA multiple**

Use the industry median EV/EBITDA multiple.

**Warning**: Terminal value typically represents 60-80% of total enterprise value. Your assumptions here matter enormously. Always do a sensitivity analysis.

## Step 6: Discount to Present Value

> **Enterprise Value = sum from t=1 to n of: FCF_t / (1 + WACC)^t + TV / (1 + WACC)^n**

## Step 7: Derive Equity Value

> **Equity Value = Enterprise Value - Total Debt + Cash**
> **Per-share Value = Equity Value / Shares Outstanding**

## Sensitivity Analysis

Always show how your valuation changes with different assumptions:

| | WACC = 8% | WACC = 9% | WACC = 10% |
|---|-----------|-----------|-----------|
| **g = 2%** | $X | $Y | $Z |
| **g = 2.5%** | ... | ... | ... |
| **g = 3%** | ... | ... | ... |

## Common Mistakes

1. **Double-counting the tax shield**: If you use WACC (which includes the tax benefit of debt), do not also add a separate tax shield value.
2. **Terminal growth > WACC**: Produces a negative or infinite terminal value. Impossible in reality.
3. **Forgetting to subtract net debt**: Enterprise value includes both debt and equity claims. Subtract debt to get equity value.
4. **Not doing sensitivity analysis**: A single-point DCF estimate is meaningless without understanding how it changes with key assumptions.
5. **Using nominal growth with real WACC (or vice versa)**: Both must be in the same terms.
