# DCF Walkthrough for Case Analysis

The Discounted Cash Flow (DCF) model is the most rigorous valuation method used in finance. In a case setting, you will not have perfect data -- the art lies in making reasonable assumptions and testing their sensitivity. This walkthrough takes you through a DCF step by step.

## Why DCF in Cases

Cases frequently require you to value a company, project, or acquisition. The DCF forces you to think explicitly about future cash flows, growth, risk, and the time value of money. Even when the case does not require a full DCF, understanding the framework helps you assess whether a proposed price is reasonable.

## The DCF Framework

> **Enterprise Value = sum from t=1 to n of: FCF_t / (1 + WACC)^t + Terminal Value / (1 + WACC)^n**

> **Equity Value = Enterprise Value - Net Debt**

> **Per-Share Value = Equity Value / Shares Outstanding**

## Step-by-Step Walkthrough

### Step 1: Project Revenue

Start with the most recent revenue and grow it forward.

**Methods for estimating growth**:
- Historical growth rate (simple but may not persist)
- Analyst estimates (if available in the case)
- Industry growth rate + market share changes
- Bottom-up: units x price per unit

### Worked Example

Base year revenue: $1,000M
Projected growth: 12% (Years 1-3), 8% (Years 4-5), 4% (terminal)

| Year | Growth | Revenue |
|------|--------|---------|
| Base | -- | $1,000M |
| 1 | 12% | $1,120M |
| 2 | 12% | $1,254M |
| 3 | 12% | $1,405M |
| 4 | 8% | $1,517M |
| 5 | 8% | $1,638M |

### Step 2: Project Operating Margins

Estimate EBIT margin (or EBITDA margin) for each year.

**Considerations**:
- Current margins vs. industry average
- Will margins expand (operating leverage, cost synergies) or contract (competition, rising costs)?
- Be explicit about your assumptions

### Worked Example (continued)

Assume EBIT margin improves from 15% to 18% over 5 years due to scale.

| Year | Revenue | EBIT Margin | EBIT |
|------|---------|-------------|------|
| 1 | $1,120M | 15.5% | $174M |
| 2 | $1,254M | 16.0% | $201M |
| 3 | $1,405M | 16.5% | $232M |
| 4 | $1,517M | 17.0% | $258M |
| 5 | $1,638M | 18.0% | $295M |

### Step 3: Calculate Free Cash Flow (FCF)

> **FCF = EBIT x (1 - Tax Rate) + Depreciation & Amortization - Capital Expenditures - Change in Net Working Capital**

**Key relationships to estimate**:
- Tax rate: Use the effective rate from the case (often 25-30%)
- D&A: As a percentage of revenue (typically 3-8% depending on industry)
- CapEx: As a percentage of revenue (should exceed D&A for a growing company)
- Change in NWC: As a percentage of revenue growth (typically 5-15% of incremental revenue)

### Worked Example (continued)

Assumptions: Tax rate = 25%, D&A = 5% of revenue, CapEx = 7% of revenue, NWC change = 10% of revenue change.

| Year | EBIT | After-Tax EBIT | + D&A | - CapEx | - Delta NWC | = FCF |
|------|------|----------------|-------|---------|-------------|-------|
| 1 | $174M | $131M | $56M | ($78M) | ($12M) | **$97M** |
| 2 | $201M | $151M | $63M | ($88M) | ($13M) | **$113M** |
| 3 | $232M | $174M | $70M | ($98M) | ($15M) | **$131M** |
| 4 | $258M | $194M | $76M | ($106M) | ($11M) | **$153M** |
| 5 | $295M | $221M | $82M | ($115M) | ($12M) | **$176M** |

### Step 4: Calculate WACC

> **WACC = (E/V) x r_e + (D/V) x r_d x (1 - T)**

Where:
- E/V = equity weight, D/V = debt weight (use target or current capital structure)
- r_e = cost of equity (from CAPM: r_e = R_f + beta x Market Risk Premium)
- r_d = cost of debt (yield on existing debt or comparable credit)
- T = marginal tax rate

### Worked Example (continued)

- Risk-free rate (R_f) = 4.0%
- Equity beta = 1.2
- Market risk premium = 6.0%
- Cost of equity (r_e) = 4.0% + 1.2 x 6.0% = **11.2%**
- Cost of debt (r_d) = 5.5%
- Tax rate = 25%
- After-tax cost of debt = 5.5% x (1 - 0.25) = **4.125%**
- Capital structure: 70% equity, 30% debt

WACC = 0.70 x 11.2% + 0.30 x 4.125% = 7.84% + 1.24% = **9.08%**

Round to **9%** for simplicity in case work.

### Step 5: Calculate Terminal Value

The terminal value captures all cash flows beyond the explicit forecast period. Two methods:

**Method 1: Gordon Growth (Perpetuity)**

> **Terminal Value = FCF_(n+1) / (WACC - g)**

Where g = long-term sustainable growth rate (typically 2-4%, should not exceed long-term GDP growth).

**Method 2: Exit Multiple**

> **Terminal Value = EBITDA_n x Exit EV/EBITDA Multiple**

### Worked Example (continued, using Gordon Growth)

Terminal growth rate (g) = 3%
FCF in Year 6 = $176M x 1.03 = $181M

Terminal Value (at end of Year 5) = $181M / (0.09 - 0.03) = $181M / 0.06 = **$3,017M**

### Step 6: Discount to Present Value

| Year | Cash Flow | Discount Factor (at 9%) | Present Value |
|------|-----------|------------------------|---------------|
| 1 | $97M | 1/1.09 = 0.9174 | $89M |
| 2 | $113M | 1/(1.09)^2 = 0.8417 | $95M |
| 3 | $131M | 1/(1.09)^3 = 0.7722 | $101M |
| 4 | $153M | 1/(1.09)^4 = 0.7084 | $108M |
| 5 | $176M | 1/(1.09)^5 = 0.6499 | $114M |
| TV | $3,017M | 1/(1.09)^5 = 0.6499 | $1,961M |

**Enterprise Value = $89M + $95M + $101M + $108M + $114M + $1,961M = $2,468M**

### Step 7: Bridge to Equity Value

> **Equity Value = Enterprise Value - Net Debt**

If net debt (total debt minus cash) = $400M:

Equity Value = $2,468M - $400M = **$2,068M**

If shares outstanding = 100M:

Per-share value = $2,068M / 100M = **$20.68 per share**

## Sensitivity Analysis

A DCF is only as good as its assumptions. Always test how the valuation changes when key assumptions vary.

### Key Variables to Sensitize

| Variable | Base Case | Bull Case | Bear Case |
|----------|-----------|-----------|-----------|
| Revenue growth (Y1-3) | 12% | 15% | 8% |
| Terminal growth rate | 3% | 4% | 2% |
| WACC | 9% | 8% | 10% |
| EBIT margin (Year 5) | 18% | 20% | 15% |

### Sensitivity Table (Enterprise Value, varying WACC and terminal growth)

| WACC \ g | 2% | 3% | 4% |
|----------|------|------|------|
| **8%** | $2,700M | $3,200M | $4,000M |
| **9%** | $2,200M | $2,468M | $2,850M |
| **10%** | $1,850M | $2,050M | $2,300M |

**Insight**: The valuation is highly sensitive to both WACC and the terminal growth rate. A 1% change in WACC shifts the value by approximately $400M. This illustrates why stating a point estimate without a sensitivity range is misleading.

## Terminal Value: A Warning

In most DCFs, the terminal value accounts for 60-80% of total enterprise value. This means your entire valuation is dominated by assumptions about what happens after the explicit forecast period. This is a fundamental limitation of DCF analysis.

**Best practice**: Cross-check your DCF result with a comparable companies analysis (EV/EBITDA multiple). If the two approaches yield dramatically different values, investigate why.

## Common Mistakes

1. **Double-counting growth**: Do not grow revenue at 12% and also assume margin expansion from cost synergies that themselves drive revenue. Be consistent about what drives each assumption.

2. **Terminal growth rate above GDP growth**: A company growing faster than the economy forever would eventually become larger than the economy. Cap terminal growth at 2-4%.

3. **Forgetting working capital**: A growing company needs increasing working capital. Omitting the NWC investment overstates free cash flow.

4. **Using book value debt instead of market value**: WACC should use market value weights, not book value.

5. **Not discounting the terminal value**: The terminal value occurs at the end of Year 5 and must be discounted back to today. This is a surprisingly common error.

6. **Point estimate without sensitivity**: Never present a single DCF value. Always show how it changes with key assumptions.

## Key References

- Koller, T., Goedhart, M. & Wessels, D. (2020). *Valuation: Measuring and Managing the Value of Companies*, 7th ed., McKinsey & Company / Wiley.
- Damodaran, A. (2012). *Investment Valuation*, 3rd ed., Wiley. Chapters 12-16.
- Berk, J. & DeMarzo, P. (2020). *Corporate Finance*, 5th ed., Pearson. Chapters 18-19.
