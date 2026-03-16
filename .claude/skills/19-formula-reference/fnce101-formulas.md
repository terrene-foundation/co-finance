# FNCE101 Formula Reference

## Time Value of Money

| Formula | Expression | Variables |
|---------|-----------|-----------|
| Future Value | FV = PV x (1 + r)^n | r = rate per period, n = number of periods |
| Present Value | PV = FV / (1 + r)^n | |
| PV of Annuity | PV = PMT x [(1 - (1+r)^(-n)) / r] | PMT = payment per period |
| FV of Annuity | FV = PMT x [((1+r)^n - 1) / r] | |
| Annuity Due | Multiply ordinary annuity by (1 + r) | Payments at beginning of period |
| Perpetuity | PV = PMT / r | |
| Growing Perpetuity | PV = PMT / (r - g) | g = growth rate, g < r |
| Growing Annuity | PV = PMT x [1/(r-g)] x [1-((1+g)/(1+r))^n] | |
| EAR | EAR = (1 + r/m)^m - 1 | m = compounding frequency |
| Continuous FV | FV = PV x e^(r x n) | e = 2.71828... |
| Loan Payment | PMT = PV x [r / (1-(1+r)^(-n))] | |
| Rule of 72 | Doubling time = 72 / r(%) | Quick approximation |

## Bond Valuation

| Formula | Expression |
|---------|-----------|
| Bond Price | P = C x [(1-(1+y)^(-n))/y] + F/(1+y)^n |
| Current Yield | CY = Annual Coupon / Price |
| Modified Duration | D_Mod = D_Mac / (1 + y/m) |
| Price Change (duration) | %Delta P = -D_Mod x Delta y |
| Price Change (with convexity) | %Delta P = -D_Mod x Delta y + 0.5 x Convexity x (Delta y)^2 |
| Zero-coupon Price | P = F / (1 + y)^n |

Where: C = coupon per period, F = face value, y = yield per period, n = number of periods, m = payments per year.

## Stock Valuation

| Formula | Expression |
|---------|-----------|
| Gordon Growth Model | P_0 = D_1 / (r - g) |
| Dividend Yield + Growth | r = D_1/P_0 + g |
| Two-Stage DDM | P_0 = sum(D_t/(1+r)^t) + P_n/(1+r)^n, where P_n = D_(n+1)/(r-g_stable) |
| P/E from Gordon | P/E = Payout / (r - g) |
| FCFE Valuation | P_0 = FCFE_1 / (r - g) |
| EV/EBITDA Valuation | Equity = (EV/EBITDA x EBITDA) - Debt + Cash |

## Risk and Return

| Formula | Expression |
|---------|-----------|
| Expected Return | E(R) = sum(p_i x R_i) |
| Variance | Var = sum(p_i x (R_i - E(R))^2) |
| Standard Deviation | sigma = sqrt(Variance) |
| Portfolio Return | E(R_p) = sum(w_i x E(R_i)) |
| Portfolio Variance (2 assets) | sigma_p^2 = w_A^2 x sigma_A^2 + w_B^2 x sigma_B^2 + 2 x w_A x w_B x sigma_A x sigma_B x rho |
| CAPM | E(R_i) = R_f + beta_i x (E(R_m) - R_f) |
| Beta | beta = Cov(R_i, R_m) / Var(R_m) |
| Sharpe Ratio | S = (E(R_p) - R_f) / sigma_p |
| Alpha (Jensen's) | alpha = R_actual - [R_f + beta x (R_m - R_f)] |

## Financial Ratios

| Category | Ratio | Formula |
|----------|-------|---------|
| Profitability | Gross Margin | Gross Profit / Revenue |
| | Operating Margin | EBIT / Revenue |
| | Net Margin | Net Income / Revenue |
| | ROE | Net Income / Equity |
| | ROA | Net Income / Total Assets |
| Liquidity | Current Ratio | Current Assets / Current Liabilities |
| | Quick Ratio | (Current Assets - Inventory) / Current Liabilities |
| Leverage | D/E | Total Debt / Equity |
| | Interest Coverage | EBIT / Interest Expense |
| Efficiency | Asset Turnover | Revenue / Total Assets |
| DuPont | ROE | Net Margin x Asset Turnover x Equity Multiplier |
