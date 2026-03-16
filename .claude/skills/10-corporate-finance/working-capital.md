# Working Capital Management

How firms manage their short-term assets and liabilities to ensure they can meet day-to-day obligations while maximizing efficiency. Working capital is the lifeblood of operations -- even profitable firms can fail if they run out of cash.

## Why Working Capital Matters

Imagine a manufacturer that sells $10 million worth of goods but cannot collect payment from customers for 90 days, while suppliers demand payment in 30 days. The firm is profitable on paper but has a cash gap that must be financed. Working capital management addresses this timing mismatch.

## Net Working Capital

> **Net Working Capital (NWC) = Current Assets - Current Liabilities**

**Current assets** (expected to be converted to cash within one year):
- Cash and cash equivalents
- Accounts receivable (money owed by customers)
- Inventory (raw materials, work-in-progress, finished goods)
- Prepaid expenses

**Current liabilities** (obligations due within one year):
- Accounts payable (money owed to suppliers)
- Short-term debt
- Accrued expenses (wages, taxes, interest owed but not yet paid)
- Current portion of long-term debt

## The Cash Conversion Cycle (CCC)

The CCC measures the number of days between when a firm pays cash for inventory and when it collects cash from customers. A shorter CCC means faster cash flow.

> **CCC = DIO + DSO - DPO**

Where:
- **DIO** = Days Inventory Outstanding
- **DSO** = Days Sales Outstanding
- **DPO** = Days Payable Outstanding

### Days Inventory Outstanding (DIO)

> **DIO = (Average Inventory / COGS) x 365**

How long inventory sits before being sold. Lower is generally better (faster turnover), but too low risks stockouts.

### Days Sales Outstanding (DSO)

> **DSO = (Average Accounts Receivable / Revenue) x 365**

How long it takes to collect payment from customers after a sale. Lower is better -- the firm gets cash sooner.

### Days Payable Outstanding (DPO)

> **DPO = (Average Accounts Payable / COGS) x 365**

How long the firm takes to pay its suppliers. Higher is better for cash flow (the firm holds cash longer), but paying too slowly damages supplier relationships.

### Worked Example: Cash Conversion Cycle

A retail company has the following annual figures:
- Revenue: $5,000,000
- Cost of Goods Sold (COGS): $3,500,000
- Average Inventory: $400,000
- Average Accounts Receivable: $300,000
- Average Accounts Payable: $250,000

**Step 1**: Calculate each component.

DIO = ($400,000 / $3,500,000) x 365 = **41.7 days**
DSO = ($300,000 / $5,000,000) x 365 = **21.9 days**
DPO = ($250,000 / $3,500,000) x 365 = **26.1 days**

**Step 2**: Calculate CCC.

CCC = 41.7 + 21.9 - 26.1 = **37.5 days**

**Interpretation**: On average, there are 37.5 days between when the firm pays for inventory and when it collects cash from the sale. During this gap, the firm needs financing (either from its own cash reserves or from short-term borrowing).

### Industry Benchmarks

| Industry | Typical CCC | Key Driver |
|----------|-------------|-----------|
| Grocery retail | Negative to 5 days | Fast inventory turnover, quick collection, normal payables |
| Technology (hardware) | 30-60 days | Long inventory cycle for components |
| Manufacturing | 40-80 days | Long production cycle |
| Construction | 60-120 days | Very long project timelines |
| Subscription software | Negative | Customers pay upfront (negative DSO effect) |

**Negative CCC**: Some businesses (like Amazon and Dell at various points) achieve a negative CCC, meaning they collect cash from customers before paying suppliers. This is highly advantageous -- the business is effectively financed by its suppliers.

## Inventory Management

### Economic Order Quantity (EOQ)

The order quantity that minimizes total inventory costs (ordering costs + holding costs).

> **EOQ = sqrt(2 x D x S / H)**

Where:
- D = Annual demand (units)
- S = Fixed cost per order (ordering/setup cost)
- H = Annual holding cost per unit

### Worked Example: EOQ

A company sells 10,000 units per year. Each order costs $50 to place and process. Holding one unit in inventory for a year costs $2.

EOQ = sqrt(2 x 10,000 x $50 / $2) = sqrt(500,000) = **707 units per order**

Number of orders per year = 10,000 / 707 = approximately 14 orders
Average inventory = 707 / 2 = 354 units

### Just-in-Time (JIT) Inventory

Minimize inventory by receiving goods only when needed in the production process.

**Advantages**: Lower holding costs, less waste, less capital tied up in inventory
**Risks**: Highly dependent on reliable suppliers; supply chain disruptions can halt production (as demonstrated during COVID-19 supply chain crises)

## Accounts Receivable Management

### Credit Policy Components

1. **Credit standards**: Who gets credit? (Credit scoring, financial analysis of customers)
2. **Credit terms**: How long do customers have to pay? (e.g., "2/10, net 30")
3. **Collection policy**: How aggressively do we pursue late payments?

### Credit Terms: "2/10, net 30"

This means: "Take a 2% discount if you pay within 10 days; otherwise, the full amount is due in 30 days."

**Implied annual interest rate of forgoing the discount**:

> **Annualized Cost = (Discount% / (1 - Discount%)) x (365 / (Full Period - Discount Period))**

For 2/10, net 30:

Cost = (0.02 / 0.98) x (365 / 20) = 0.0204 x 18.25 = **37.2% per year**

This is extremely expensive. A rational buyer should almost always take the discount and borrow short-term if necessary (short-term rates are far below 37%).

### Aging Schedule

A tool for monitoring receivables quality:

| Days Outstanding | Amount | % of Total |
|-----------------|--------|-----------|
| 0-30 days | $200,000 | 50% |
| 31-60 days | $120,000 | 30% |
| 61-90 days | $60,000 | 15% |
| 90+ days | $20,000 | 5% |

If the 90+ category is growing, collection problems are worsening.

## Accounts Payable Management

### Stretching Payables

Firms can improve cash flow by delaying payments to suppliers. However, this has costs:
- Loss of early payment discounts (see the 37.2% example above)
- Damaged supplier relationships
- Potential supply disruptions
- Reputational damage

### Trade Credit as Financing

Trade credit (buying goods on account) is one of the largest sources of short-term financing, especially for small businesses. When a supplier offers "net 30" terms, they are effectively lending the buyer money for 30 days at 0% interest.

## Short-Term Financing Options

When the CCC creates a cash gap, firms have several financing options:

| Source | Cost | Availability | Best For |
|--------|------|-------------|----------|
| **Line of credit** | Prime + 1-3% | Pre-arranged with bank | Seasonal fluctuations |
| **Commercial paper** | Slightly below prime | Large, creditworthy firms only | Short-term (1-270 days) |
| **Factoring** | 2-5% of receivables | Available to most firms | Immediate cash from receivables |
| **Trade credit** | Free (if no discount) or expensive (if forgoing discount) | From suppliers | Day-to-day operations |
| **Inventory financing** | Prime + 2-5% | Requires pledgeable inventory | Firms with significant inventory |

## Working Capital Ratios

### Current Ratio

> **Current Ratio = Current Assets / Current Liabilities**

General benchmark: 1.5-2.0 is considered healthy. Below 1.0 means current liabilities exceed current assets (potentially concerning).

### Quick Ratio (Acid Test)

> **Quick Ratio = (Current Assets - Inventory) / Current Liabilities**

More conservative than the current ratio because it excludes inventory (which may be hard to liquidate quickly). Benchmark: > 1.0.

### Cash Ratio

> **Cash Ratio = (Cash + Cash Equivalents) / Current Liabilities**

The most conservative liquidity measure. Only counts the most liquid assets.

### Worked Example: Liquidity Ratios

A firm has:
- Cash: $50,000
- Accounts Receivable: $150,000
- Inventory: $200,000
- Accounts Payable: $120,000
- Short-term Debt: $80,000

Current Assets = $50,000 + $150,000 + $200,000 = $400,000
Current Liabilities = $120,000 + $80,000 = $200,000

Current Ratio = $400,000 / $200,000 = **2.0**
Quick Ratio = ($400,000 - $200,000) / $200,000 = **1.0**
Cash Ratio = $50,000 / $200,000 = **0.25**

**Interpretation**: The firm has adequate liquidity by the current ratio standard. The quick ratio of 1.0 is borderline -- removing inventory leaves just enough to cover current liabilities. The cash ratio shows the firm has limited immediate cash coverage.

## Common Mistakes

1. **Assuming higher NWC is always better**: Excess working capital means capital is tied up unproductively. A firm with $50 million sitting in receivables could invest that money elsewhere.

2. **Ignoring the cost of forgoing discounts**: "2/10, net 30" seems like a small discount, but the annualized cost of not taking it is over 37%. Always calculate the implied rate.

3. **Treating CCC as just a number**: The CCC should be tracked over time and compared to industry peers. A rising CCC may signal deteriorating collections or excess inventory.

4. **Confusing profitability with liquidity**: A firm can be profitable and still run out of cash. Fast-growing firms are particularly vulnerable because growth requires increasing investment in working capital.

5. **Ignoring seasonal patterns**: Many businesses have highly seasonal working capital needs. A retailer's inventory peaks before the holiday season and receivables peak afterward.

## Practice Problems

**Problem 1**: A company has COGS of $2 million, revenue of $3 million, average inventory of $300,000, average receivables of $250,000, and average payables of $200,000. Calculate DIO, DSO, DPO, and CCC. Interpret the result.

**Problem 2**: A supplier offers terms of "3/15, net 45." Calculate the annualized cost of forgoing the discount. Should a firm that can borrow at 8% take the discount?

**Problem 3**: A firm's CCC has increased from 35 days to 52 days over the past two years, while revenue has grown 20%. What questions would you ask to diagnose the cause?

## Key References

- Berk, J. & DeMarzo, P. (2020). *Corporate Finance*, 5th ed., Pearson. Chapter 27.
- Ross, S.A., Westerfield, R.W. & Jordan, B.D. (2022). *Fundamentals of Corporate Finance*, 13th ed., McGraw-Hill. Chapters 19-20.
- Brealey, R.A., Myers, S.C. & Allen, F. (2020). *Principles of Corporate Finance*, 13th ed., McGraw-Hill. Chapters 29-30.
