# Corporate Finance Formula Reference

## WACC and Cost of Capital

| Formula | Expression |
|---------|-----------|
| WACC | (E/V) x r_e + (D/V) x r_d x (1-T) |
| Cost of Equity (CAPM) | r_e = r_f + beta x (E(R_m) - r_f) |
| Cost of Equity (DDM) | r_e = D_1/P_0 + g |
| After-tax Cost of Debt | r_d x (1 - T) |
| Unlevered Beta | beta_U = beta_L / (1 + (1-T) x D/E) |
| Relevered Beta | beta_L = beta_U x (1 + (1-T) x D/E) |

Where: E = market value of equity, D = market value of debt, V = E + D, T = tax rate.

## Capital Budgeting

| Formula | Expression | Decision Rule |
|---------|-----------|---------------|
| NPV | -C_0 + sum(C_t / (1+r)^t) | Accept if NPV > 0 |
| IRR | Rate where NPV = 0 | Accept if IRR > WACC |
| Payback Period | Time to recover initial investment | Accept if < cutoff |
| Profitability Index | PV(future CFs) / C_0 | Accept if PI > 1 |
| Free Cash Flow | EBIT(1-T) + D&A - CapEx - Delta NWC | |
| FCFF | EBIT(1-T) + D&A - CapEx - Delta NWC | |
| FCFE | Net Income + D&A - CapEx - Delta NWC + Net Borrowing | |

## Capital Structure (Modigliani-Miller)

| Formula | Expression | Condition |
|---------|-----------|-----------|
| MM Prop I (no tax) | V_L = V_U | Perfect markets |
| MM Prop I (with tax) | V_L = V_U + T x D | Corporate taxes |
| MM Prop II (with tax) | r_e = r_0 + (r_0 - r_d)(D/E)(1-T) | Levered cost of equity |
| Tax Shield (annual) | Interest x T | |
| Tax Shield (PV, perpetual) | T x D | |

## Leverage Analysis

| Formula | Expression |
|---------|-----------|
| Degree of Operating Leverage (DOL) | %Delta EBIT / %Delta Sales |
| Degree of Financial Leverage (DFL) | %Delta EPS / %Delta EBIT |
| Degree of Total Leverage (DTL) | DOL x DFL |
| Break-even (units) | Fixed Costs / (Price - Variable Cost) |
| Break-even (EBIT for debt) | Interest Expense / (1 - T) |

## Dividend Policy

| Formula | Expression |
|---------|-----------|
| Payout Ratio | Dividends / Net Income |
| Retention Rate | 1 - Payout Ratio |
| Sustainable Growth | g = ROE x Retention Rate |
| Dividend Yield | Annual Dividend / Share Price |

## Valuation (DCF)

| Formula | Expression |
|---------|-----------|
| Enterprise Value | sum(FCF_t/(1+WACC)^t) + TV/(1+WACC)^n |
| Terminal Value (Gordon) | FCF_(n+1) / (WACC - g) |
| Terminal Value (Multiple) | EBITDA_n x EV/EBITDA |
| Equity Value | Enterprise Value - Net Debt |
| APV | V_U + PV(Tax Shields) |
