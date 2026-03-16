# Mergers and Acquisitions (M&A)

How firms combine, restructure, and create value (or destroy it) through corporate transactions. Covers M&A types, the valuation approaches used by investment bankers, the concept of synergy, and the due diligence framework.

## Why Study M&A?

M&A transactions reshape industries, create (and destroy) enormous wealth, and represent some of the most complex decisions in corporate finance. Understanding M&A is essential for careers in investment banking, corporate development, private equity, and consulting.

## Types of M&A Transactions

### By Strategic Rationale

| Type | Definition | Example |
|------|-----------|---------|
| **Horizontal merger** | Same industry, same stage of value chain | Two airlines merging (e.g., United + Continental, 2010) |
| **Vertical merger** | Same industry, different stage of value chain | A car manufacturer acquiring a parts supplier |
| **Conglomerate merger** | Unrelated industries | Berkshire Hathaway acquiring companies across insurance, railroads, and candy |
| **Market extension** | Same product, different geographic market | A US bank acquiring a European bank |
| **Product extension** | Related products, same market | A software company acquiring a cybersecurity firm |

### By Deal Structure

| Structure | Description | Key Feature |
|-----------|-------------|-------------|
| **Merger** | Two firms combine into one entity | Both firms cease to exist; new entity formed |
| **Acquisition** | One firm buys another | Target becomes subsidiary or is absorbed |
| **Tender offer** | Acquirer offers to buy shares directly from target shareholders | Bypasses target's board; can be hostile |
| **Asset purchase** | Acquirer buys specific assets, not the whole entity | Avoids assuming all liabilities |
| **Leveraged buyout (LBO)** | Acquisition financed primarily with debt | PE firms use target's cash flows to service debt |

### Friendly vs. Hostile

- **Friendly**: Target board approves and recommends the deal to shareholders
- **Hostile**: Target board opposes; acquirer goes directly to shareholders (tender offer) or tries to replace the board (proxy fight)

**Anti-takeover defenses**:
- *Poison pill (shareholder rights plan)*: Allows existing shareholders to buy more shares at a discount if triggered, diluting the acquirer
- *Staggered board*: Board members serve multi-year overlapping terms, so an acquirer cannot replace the entire board at once
- *Golden parachutes*: Large severance packages for executives, making the acquisition more expensive
- *White knight*: Finding a friendlier acquirer

## Valuation Approaches in M&A

Investment bankers typically use multiple valuation methods and present a "football field" chart showing the range of values from each approach.

### 1. Comparable Company Analysis ("Comps")

Value the target by comparing it to similar publicly traded companies.

**Process**:
1. Identify comparable companies (same industry, similar size, growth, margins)
2. Calculate valuation multiples for each comparable
3. Apply the multiples to the target's financials

**Common multiples**:

| Multiple | Formula | When to Use |
|----------|---------|-------------|
| EV/EBITDA | Enterprise Value / EBITDA | Most common; works across capital structures |
| EV/Revenue | Enterprise Value / Revenue | For unprofitable or early-stage companies |
| P/E | Price / Earnings per Share | Widely used but affected by capital structure |
| P/B | Price / Book Value | For financial institutions (banks, insurance) |

**Worked Example**: Comparable Company Valuation

Target EBITDA: $150 million. Comparable companies trade at EV/EBITDA multiples of 8x, 9x, 10x, and 11x.

Median multiple: (9x + 10x) / 2 = 9.5x

Implied Enterprise Value = $150M x 9.5 = **$1,425 million**

If the target has $300M in debt and $50M in cash:
Implied Equity Value = $1,425M - $300M + $50M = **$1,175 million**

### 2. Precedent Transaction Analysis ("Precedents")

Value the target by looking at what acquirers paid for similar companies in recent transactions.

This typically yields higher values than comps because transaction prices include a **control premium** -- the extra amount an acquirer pays for the right to control the target (typically 20-40% above the pre-announcement share price).

### 3. Discounted Cash Flow (DCF)

Intrinsic valuation based on projected future free cash flows.

> **Enterprise Value = sum from t=1 to n of: FCF_t / (1 + WACC)^t + Terminal Value / (1 + WACC)^n**

See [dcf-walkthrough.md](../18-case-study-framework/dcf-walkthrough.md) for a step-by-step guide.

### 4. LBO Analysis

Determines the maximum price a financial buyer (private equity) can pay while achieving a target return (typically 20-25% IRR).

**Logic**: Work backwards from the required IRR to determine the maximum purchase price. The acquirer uses significant debt (60-80% of purchase price), pays down debt with the target's cash flows, and exits after 3-7 years.

## Synergy

Synergy is the additional value created by combining two firms -- the idea that the whole is worth more than the sum of its parts.

> **Synergy Value = V_AB - (V_A + V_B)**

Where V_AB is the value of the combined firm.

### Types of Synergy

**Revenue synergies** (harder to achieve, riskier):
- Cross-selling products to each other's customers
- Entering new geographic markets
- Combining complementary product lines

**Cost synergies** (more predictable):
- Eliminating redundant functions (HR, IT, finance)
- Economies of scale in purchasing
- Consolidating facilities
- Reducing headcount

**Financial synergies**:
- Tax benefits (using target's tax losses)
- Lower cost of debt (larger, more diversified entity)
- Increased debt capacity

### The Synergy Trap

Acquirers frequently overpay by overestimating synergies. Studies consistently show that 60-70% of M&A deals fail to create value for the acquiring firm's shareholders.

**Rule of thumb**: The acquirer must pay a premium to convince target shareholders to sell. If all the synergy value goes to the target (through the premium), the acquirer's shareholders gain nothing.

> **Value created for acquirer = Synergy Value - Premium Paid**

## Due Diligence Framework

Due diligence is the investigation an acquirer conducts before completing a transaction. It aims to verify assumptions, identify risks, and uncover deal-breakers.

### Financial Due Diligence
- Quality of earnings analysis (are reported earnings sustainable?)
- Working capital normalization
- Capital expenditure requirements
- Debt and off-balance-sheet obligations
- Tax exposures

### Legal Due Diligence
- Pending or threatened litigation
- Regulatory compliance
- Intellectual property ownership
- Contract review (change-of-control clauses)
- Environmental liabilities

### Commercial Due Diligence
- Market position and competitive dynamics
- Customer concentration risk
- Revenue sustainability and growth prospects
- Industry trends and disruption risks

### Operational Due Diligence
- Management team assessment
- IT systems and integration complexity
- Supply chain risks
- Cultural compatibility

## Key Metrics for M&A Analysis

### Premium Paid

> **Premium = (Offer Price - Pre-announcement Price) / Pre-announcement Price**

Typical control premiums: 20-40% above the pre-announcement stock price.

### Accretion/Dilution Analysis

Determines whether the deal is accretive or dilutive to the acquirer's earnings per share (EPS).

> **Pro forma EPS = (Acquirer Earnings + Target Earnings + Synergies - Financing Costs) / Pro Forma Shares Outstanding**

- **Accretive**: Pro forma EPS > Acquirer's standalone EPS (good)
- **Dilutive**: Pro forma EPS < Acquirer's standalone EPS (needs justification)

## Common Mistakes

1. **Confusing enterprise value and equity value**: Enterprise value = Equity value + Debt - Cash. When using EV multiples, you get enterprise value; you must subtract debt and add cash to get equity value.

2. **Ignoring integration costs**: Synergies do not come for free. Restructuring, systems integration, and employee retention all cost money.

3. **Treating projected synergies as certain**: Cost synergies are more reliable (50-80% achievement rate) than revenue synergies (20-40% achievement rate).

4. **Using a single valuation method**: Always triangulate with multiple methods. Each has biases and limitations.

5. **Ignoring cultural fit**: Many technically sound deals fail because the two organizations cannot work together effectively.

## Practice Problems

**Problem 1**: A target company has EBITDA of $80 million, debt of $150 million, and cash of $20 million. Comparable companies trade at a median EV/EBITDA of 10x. What is the implied equity value? If there are 50 million shares outstanding, what is the implied share price?

**Problem 2**: An acquirer offers $45 per share for a target whose pre-announcement price was $32. Calculate the control premium. If the target has 100 million shares outstanding, what is the total deal value (equity)?

**Problem 3**: An acquirer with EPS of $3.00 and 200 million shares outstanding acquires a target with earnings of $100 million. The acquirer issues 80 million new shares to finance the deal. Expected annual cost synergies are $30 million. Is the deal accretive or dilutive?

## Key References

- Berk, J. & DeMarzo, P. (2020). *Corporate Finance*, 5th ed., Pearson. Chapters 28-29.
- DePamphilis, D. (2019). *Mergers, Acquisitions, and Other Restructuring Activities*, 10th ed., Academic Press.
- Rosenbaum, J. & Pearl, J. (2020). *Investment Banking: Valuation, LBOs, M&A, and IPOs*, 3rd ed., Wiley.
- Bruner, R.F. (2004). *Applied Mergers and Acquisitions*, Wiley.
