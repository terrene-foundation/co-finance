# Stock Valuation

How do you figure out what a share of stock is actually worth? Stock valuation is the process of estimating the intrinsic value of an equity security -- the price it should trade at based on fundamentals, as distinct from its current market price. If intrinsic value exceeds the market price, the stock may be undervalued; if it is below, the stock may be overvalued.

## Why Stock Valuation Matters

Every investment decision ultimately reduces to one question: is the price you are paying less than the value you are receiving? Stock valuation provides a disciplined framework for answering that question, rather than relying on intuition or market sentiment.

Think of it this way: if you were buying an entire business (say, a local restaurant), you would want to know how much cash it generates and how likely those cash flows are to continue. Valuing a share of stock is exactly the same exercise -- you are buying a small piece of a business.

## Absolute Valuation: Dividend Discount Model (DDM)

The most fundamental stock valuation model. The value of a stock is the present value of all future dividends.

### General DDM

> **P_0 = sum from t=1 to infinity of: D_t / (1 + r)^t**

Where:
- P_0 = Current stock price (intrinsic value)
- D_t = Dividend expected in period t
- r = Required rate of return on equity

**Intuition**: You are buying a stream of future cash payments (dividends). What is that stream worth today?

### Gordon Growth Model (Constant Growth DDM)

If dividends grow at a constant rate g forever, the infinite sum collapses to a simple formula.

> **P_0 = D_1 / (r - g)**

Where:
- D_1 = Expected dividend next period = D_0 x (1 + g)
- r = Required rate of return (must be > g)
- g = Constant dividend growth rate

**Key assumptions**:
1. Dividends grow at a constant rate forever
2. The growth rate is less than the required return (g < r)
3. The required return is constant

### Worked Example: Gordon Growth Model

A company just paid a dividend of $2.00 per share. Dividends are expected to grow at 5% per year forever. The required return on equity is 12%.

Step 1: Calculate D_1.
D_1 = D_0 x (1 + g) = $2.00 x 1.05 = $2.10

Step 2: Apply the Gordon Growth Model.
P_0 = D_1 / (r - g) = $2.10 / (0.12 - 0.05) = $2.10 / 0.07 = **$30.00**

**Interpretation**: Based on its fundamentals, the stock is worth $30.00. If the market price is $25.00, it may be undervalued; if $40.00, it may be overvalued.

### Deriving the Required Return from the Gordon Model

Rearranging:

> **r = D_1 / P_0 + g**

This says the required return equals the dividend yield (D_1/P_0) plus the capital gains yield (g).

### Two-Stage DDM

For companies expected to grow rapidly for a period and then slow to a stable rate.

> **P_0 = [sum from t=1 to n of: D_0 x (1 + g_H)^t / (1 + r)^t] + [D_(n+1) / (r - g_L)] x [1 / (1 + r)^n]**

Where:
- g_H = High growth rate (first n years)
- g_L = Long-run stable growth rate (after year n)
- D_(n+1) = Dividend in the first year of stable growth

### Worked Example: Two-Stage DDM

A technology company pays no dividends now but is expected to begin paying $1.00 per share in Year 3. Dividends grow at 20% for Years 3-7 (high growth), then at 4% forever. Required return is 14%.

Step 1: Project dividends for the high-growth phase (Years 3-7).

| Year | Dividend |
|------|----------|
| 3 | $1.00 |
| 4 | $1.00 x 1.20 = $1.20 |
| 5 | $1.44 |
| 6 | $1.728 |
| 7 | $2.074 |

Step 2: Calculate the terminal value at the end of Year 7.
D_8 = $2.074 x 1.04 = $2.157
Terminal Value (at Year 7) = $2.157 / (0.14 - 0.04) = $21.57

Step 3: Discount everything back to today.
P_0 = $1.00/(1.14)^3 + $1.20/(1.14)^4 + $1.44/(1.14)^5 + $1.728/(1.14)^6 + $2.074/(1.14)^7 + $21.57/(1.14)^7

P_0 = $0.675 + $0.710 + $0.748 + $0.788 + $0.830 + $8.631

P_0 = **$12.38**

## Absolute Valuation: Free Cash Flow to Equity (FCFE)

For companies that do not pay dividends (or whose dividends do not reflect earning power), value the cash flow available to equity holders.

> **FCFE = Net Income + Depreciation - Capital Expenditures - Change in Working Capital - Net Debt Repayment**

> **P_0 = sum from t=1 to infinity of: FCFE_t / (1 + r)^t**

With constant growth:

> **P_0 = FCFE_1 / (r - g)**

**When to use FCFE instead of DDM**: When a company retains most of its earnings (low payout ratio) or pays no dividends.

### Worked Example: FCFE Valuation

A company has FCFE of $4.00 per share, growing at 6% forever. Required return on equity is 11%.

FCFE_1 = $4.00 x 1.06 = $4.24

P_0 = $4.24 / (0.11 - 0.06) = $4.24 / 0.05 = **$84.80**

## Relative Valuation: Multiples

Rather than projecting cash flows, compare the company's pricing ratios to those of similar companies.

### Price-to-Earnings Ratio (P/E)

> **P/E = Market Price per Share / Earnings per Share (EPS)**

**Trailing P/E**: Uses last 12 months of actual earnings.
**Forward P/E**: Uses consensus estimate of next 12 months' earnings.

**How to use**: If similar companies trade at an average P/E of 18 and your target company earns $5.00 per share:

Implied price = 18 x $5.00 = **$90.00**

**What P/E tells you**: How much investors are willing to pay per dollar of earnings. A higher P/E suggests the market expects higher future growth or lower risk.

**Linking P/E to fundamentals** (from the Gordon model):

> **P/E = (D_1 / E_1) / (r - g) = Payout Ratio / (r - g)**

This shows that P/E is higher when:
- The payout ratio is higher
- The required return is lower
- The growth rate is higher

### Price-to-Book Ratio (P/B)

> **P/B = Market Price per Share / Book Value per Share**

Where Book Value per Share = (Total Assets - Total Liabilities) / Shares Outstanding.

**What P/B tells you**: How much the market values the firm relative to its accounting net worth. P/B > 1 means the market believes the firm's assets are worth more than their accounting value (often due to intangible assets, growth prospects, or superior management).

**Most useful for**: Financial institutions (banks, insurance companies) where assets are largely financial and carried near market value.

### Enterprise Value to EBITDA (EV/EBITDA)

> **EV/EBITDA = Enterprise Value / EBITDA**

Where:
- Enterprise Value (EV) = Market Cap + Total Debt - Cash and Cash Equivalents
- EBITDA = Earnings Before Interest, Taxes, Depreciation, and Amortization

**Why EV/EBITDA, not P/E?**
- EV/EBITDA is capital-structure-neutral (not affected by debt vs. equity financing)
- EBITDA approximates operating cash flow (removes non-cash charges)
- Useful for comparing firms with different leverage or tax situations

### Worked Example: Relative Valuation Using EV/EBITDA

You are valuing Company X. Comparable firms trade at an average EV/EBITDA of 10x. Company X has EBITDA of $50 million, total debt of $100 million, and cash of $20 million. Shares outstanding: 10 million.

Step 1: Implied Enterprise Value.
EV = 10 x $50M = $500 million

Step 2: Derive equity value.
Equity Value = EV - Debt + Cash = $500M - $100M + $20M = $420 million

Step 3: Per-share value.
Price per share = $420M / 10M = **$42.00**

## Choosing a Valuation Method

| Method | Best For | Limitations |
|--------|----------|-------------|
| **Gordon Growth DDM** | Mature companies with stable, growing dividends (utilities, REITs) | Useless for non-dividend payers; highly sensitive to r - g |
| **Two-Stage DDM** | Companies transitioning from high growth to stable growth | Requires estimating when growth stabilizes |
| **FCFE** | Companies that do not pay dividends but generate cash flow | Requires detailed forecasting of capex and working capital |
| **P/E** | Quick valuation; widely understood | Affected by accounting choices; meaningless for loss-making firms |
| **P/B** | Financial firms; asset-heavy industries | Accounting book value may poorly represent true asset value |
| **EV/EBITDA** | Comparing firms with different capital structures | EBITDA ignores capex needs, which vary across firms |

**Best practice**: Use multiple methods and triangulate. If three different approaches all suggest a value of $40-$50, you can have more confidence than if a single method gives $45.

## Common Mistakes

1. **Using D_0 instead of D_1 in the Gordon Growth Model**: The formula requires the *next* dividend (D_1 = D_0 x (1 + g)), not the dividend just paid. This is the single most common error.

2. **Setting g >= r in the Gordon model**: If the growth rate equals or exceeds the required return, the formula produces a negative or infinite price. This means the constant-growth assumption does not hold -- use a multi-stage model instead.

3. **Applying a P/E multiple to the wrong earnings**: Make sure you are consistent -- trailing P/E with trailing earnings, or forward P/E with forward earnings. Never mix them.

4. **Ignoring that multiples embed assumptions**: A P/E of 25 is not inherently "expensive." It could reflect legitimately high expected growth. Always ask: what growth rate is implied by this multiple?

5. **Comparing companies that are not truly comparable**: A tech startup is not comparable to a utility. Comparable companies should be in the same industry, of similar size, with similar growth profiles and risk.

6. **Forgetting to convert Enterprise Value to equity value**: EV/EBITDA gives enterprise value. You must subtract debt and add cash to get equity value before computing per-share price.

## Practice Problems

**Problem 1**: A company just paid a dividend of $3.50. Dividends grow at 4% per year forever. Required return is 9%. What is the intrinsic value?

**Problem 2**: A firm has a forward P/E of 22 and is expected to earn $6.00 per share next year. What implied stock price does this suggest? If comparable firms have an average forward P/E of 18, is this firm potentially overvalued?

**Problem 3**: Company A has EBITDA of $200 million, debt of $500 million, cash of $80 million, and 50 million shares outstanding. Comparable firms trade at 8x EV/EBITDA. Estimate the per-share value.

**Problem 4**: A high-growth company is expected to grow dividends at 25% for the next 5 years, then 5% forever. It just paid a dividend of $0.50. Required return is 15%. What is the stock worth today?

## Key References

- Berk, J. & DeMarzo, P. (2020). *Corporate Finance*, 5th ed., Pearson. Chapter 9.
- Damodaran, A. (2012). *Investment Valuation*, 3rd ed., Wiley. Chapters 13-20.
- Ross, S.A., Westerfield, R.W. & Jordan, B.D. (2022). *Fundamentals of Corporate Finance*, 13th ed., McGraw-Hill. Chapter 8.
- Bodie, Z., Kane, A. & Marcus, A.J. (2021). *Investments*, 12th ed., McGraw-Hill. Chapter 18.
