# Capital Budgeting

How firms decide which long-term investments to undertake. Capital budgeting is arguably the most important function of corporate finance -- it determines where the firm allocates its resources and, ultimately, whether it creates or destroys value.

## Why Capital Budgeting Matters

Every dollar a firm invests in a new factory, product, or acquisition is a dollar that cannot be returned to shareholders or invested elsewhere. Capital budgeting provides the tools to evaluate whether an investment is worth making -- whether the expected returns justify the risk and the cost of capital.

Think of it as a filter: of all the possible projects a firm could pursue, capital budgeting helps identify the ones that create value.

## Net Present Value (NPV)

The NPV is the sum of the present values of all cash flows associated with a project, including the initial investment.

> **NPV = -C_0 + sum from t=1 to n of: C_t / (1 + r)^t**

Where:
- C_0 = Initial investment (cash outflow, hence negative)
- C_t = Cash flow in period t
- r = Discount rate (typically WACC)
- n = Number of periods

**Decision rule**: Accept if NPV > 0; reject if NPV < 0.

**Why NPV is the gold standard**: NPV directly measures the dollar amount of value created. An NPV of $5 million means the project is expected to make the firm $5 million richer in today's dollars, after accounting for the time value of money and risk.

### Worked Example: NPV

A firm is considering a project that requires an initial investment of $500,000 and is expected to generate the following cash flows. The WACC is 10%.

| Year | Cash Flow |
|------|-----------|
| 0 | -$500,000 |
| 1 | $150,000 |
| 2 | $180,000 |
| 3 | $200,000 |
| 4 | $150,000 |

NPV = -500,000 + 150,000/(1.10)^1 + 180,000/(1.10)^2 + 200,000/(1.10)^3 + 150,000/(1.10)^4

NPV = -500,000 + 136,364 + 148,760 + 150,263 + 102,452

NPV = **$37,839**

Since NPV > 0, the project creates value and should be accepted.

## Internal Rate of Return (IRR)

The IRR is the discount rate that makes the NPV equal to zero.

> **0 = -C_0 + sum from t=1 to n of: C_t / (1 + IRR)^t**

**Decision rule**: Accept if IRR > WACC (the hurdle rate); reject if IRR < WACC.

**Intuition**: The IRR is the "effective rate of return" on the project. If the project returns 15% and the firm's cost of capital is 10%, the project earns more than it costs -- creating value.

### Worked Example: IRR

Using the same cash flows as the NPV example above:

0 = -500,000 + 150,000/(1+IRR)^1 + 180,000/(1+IRR)^2 + 200,000/(1+IRR)^3 + 150,000/(1+IRR)^4

Solving iteratively (or with a financial calculator), IRR = **12.8%**

Since 12.8% > 10% (WACC), the project should be accepted -- consistent with the positive NPV result.

### When IRR Fails

IRR has several well-known problems:

1. **Multiple IRRs**: If cash flows change sign more than once (e.g., initial outflow, then inflows, then another outflow for cleanup), the equation can have multiple solutions.

2. **Mutually exclusive projects**: IRR can rank projects incorrectly when projects differ in scale or timing. A project with IRR of 50% on a $1,000 investment creates less value than a project with IRR of 20% on a $1,000,000 investment.

3. **Non-conventional cash flows**: IRR assumes intermediate cash flows can be reinvested at the IRR itself, which is often unrealistic.

**Solution**: When IRR gives ambiguous results, always defer to NPV.

## Payback Period

The time it takes for cumulative cash flows to recover the initial investment.

> **Payback Period = Years before full recovery + (Unrecovered cost at start of recovery year / Cash flow during recovery year)**

**Decision rule**: Accept if payback period < cutoff (set by management).

### Worked Example: Payback Period

Using the same cash flows:

| Year | Cash Flow | Cumulative |
|------|-----------|-----------|
| 0 | -$500,000 | -$500,000 |
| 1 | $150,000 | -$350,000 |
| 2 | $180,000 | -$170,000 |
| 3 | $200,000 | $30,000 |

Payback = 2 + (170,000 / 200,000) = 2 + 0.85 = **2.85 years**

### Discounted Payback Period

Same concept, but uses discounted cash flows instead of nominal cash flows. More theoretically sound because it accounts for the time value of money.

### Limitations of Payback

- Ignores cash flows after the payback period (a project might have enormous cash flows in Year 5 that payback ignores)
- Ignores the time value of money (unless using discounted payback)
- The cutoff is arbitrary

**Why firms still use it**: Simplicity and liquidity focus. Payback answers: "How quickly do we get our money back?" This matters when cash is tight or uncertainty is high.

## Profitability Index (PI)

The ratio of the present value of future cash flows to the initial investment.

> **PI = PV of future cash flows / Initial Investment = (NPV + C_0) / C_0**

**Decision rule**: Accept if PI > 1.

### Worked Example: Profitability Index

PV of future cash flows = 136,364 + 148,760 + 150,263 + 102,452 = $537,839

PI = 537,839 / 500,000 = **1.076**

Since PI > 1, accept the project. A PI of 1.076 means every dollar invested generates $1.076 in present value -- a 7.6% return above the required return.

**When PI is most useful**: Capital rationing -- when the firm has more good projects than it can fund. Rank projects by PI to maximize total NPV per dollar invested.

## Real Options

Traditional capital budgeting treats a project as a "now or never" decision. Real options recognize that managers have flexibility to adapt as new information arrives.

### Types of Real Options

| Option Type | Description | Example |
|-------------|-------------|---------|
| **Option to expand** | Right to scale up if the project succeeds | Building a small pilot plant with the ability to expand capacity |
| **Option to abandon** | Right to shut down if the project fails | Investing in stages; stopping after Phase 1 if results are poor |
| **Option to defer** | Right to wait before investing | Owning a mining lease; waiting for commodity prices to rise |
| **Option to switch** | Right to change inputs or outputs | A power plant that can switch between gas and coal |
| **Option to stage** | Right to invest in phases | A pharmaceutical company proceeding through clinical trial phases |

### Why Real Options Matter

Traditional NPV can undervalue projects with significant flexibility. A project with NPV = -$2 million might actually be worth pursuing if it contains a valuable option to expand that is worth $5 million.

> **Expanded NPV = Traditional NPV + Value of Real Options**

### Valuation of Real Options

Real options can be valued using:
- **Decision tree analysis** (simplest; appropriate for discrete scenarios)
- **Black-Scholes model** (adapted from financial options; for continuous uncertainty)
- **Binomial lattice** (flexible; handles American-style options well)

## Comparison of Capital Budgeting Methods

| Method | Strengths | Weaknesses | Best For |
|--------|-----------|------------|----------|
| **NPV** | Theoretically correct; measures value creation in dollars | Requires accurate WACC and cash flow estimates | Primary decision criterion |
| **IRR** | Intuitive percentage return; easy to communicate | Multiple IRRs; misleading for mutually exclusive projects | Supplement to NPV |
| **Payback** | Simple; focuses on liquidity | Ignores TVM and cash flows after payback | Quick screening |
| **PI** | Good for capital rationing | Cannot rank mutually exclusive projects of different sizes | Limited budget situations |
| **Real Options** | Captures managerial flexibility | Complex; requires option pricing models | High-uncertainty, staged projects |

## Estimating Project Cash Flows

### Relevant Cash Flows

Only **incremental** cash flows matter -- the difference between the firm's cash flows with and without the project.

**Include**:
- Incremental revenue and costs
- Changes in working capital (increased inventory, receivables)
- Opportunity costs (e.g., using a warehouse the firm already owns -- include its rental value)
- Side effects on existing products (cannibalization)
- Salvage value at the end of the project

**Exclude**:
- Sunk costs (money already spent, regardless of whether the project proceeds)
- Financing costs (already captured in the discount rate/WACC)
- Allocated overhead (unless it truly changes with the project)

### Free Cash Flow Formula

> **FCF = EBIT x (1 - T_c) + Depreciation - Capital Expenditures - Change in Net Working Capital**

Or equivalently:

> **FCF = (Revenue - Costs - Depreciation) x (1 - T_c) + Depreciation - CapEx - Delta NWC**

## Common Mistakes

1. **Using accounting profits instead of cash flows**: Depreciation is not a cash flow. Start with accounting income but adjust for non-cash items.

2. **Including sunk costs**: "We already spent $2 million on research" is irrelevant. That money is gone regardless.

3. **Forgetting working capital**: A growing project typically requires increasing investment in inventory and receivables.

4. **Ignoring salvage value and terminal value**: What happens to the project's assets at the end? They usually have some residual value.

5. **Using the wrong discount rate**: Use the project's risk-appropriate rate, not necessarily the firm's overall WACC.

6. **Ignoring inflation consistently**: Either use nominal cash flows with a nominal discount rate, or real cash flows with a real discount rate. Never mix them.

## Practice Problems

**Problem 1**: A project costs $1,000,000 and generates annual cash flows of $300,000 for 5 years. The WACC is 12%. Calculate (a) NPV, (b) IRR, (c) payback period, and (d) profitability index. Should the firm accept?

**Problem 2**: A firm has a budget of $2 million and three mutually exclusive projects. Project A costs $2M with NPV = $400K. Project B costs $1M with NPV = $250K. Project C costs $1.2M with NPV = $280K. Which project(s) should the firm choose? Would your answer change if projects B and C were independent (not mutually exclusive)?

**Problem 3**: Explain why a pharmaceutical company might invest in a drug that has a negative NPV based on traditional analysis, using the real options framework.

## Key References

- Berk, J. & DeMarzo, P. (2020). *Corporate Finance*, 5th ed., Pearson. Chapters 7-9.
- Ross, S.A., Westerfield, R.W. & Jordan, B.D. (2022). *Fundamentals of Corporate Finance*, 13th ed., McGraw-Hill. Chapters 9-10.
- Brealey, R.A., Myers, S.C. & Allen, F. (2020). *Principles of Corporate Finance*, 13th ed., McGraw-Hill. Chapters 5-6, 22.
- Dixit, A.K. & Pindyck, R.S. (1994). *Investment Under Uncertainty*, Princeton University Press.
