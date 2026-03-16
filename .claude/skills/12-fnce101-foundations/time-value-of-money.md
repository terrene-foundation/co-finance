# Time Value of Money (TVM)

The single most important concept in finance: a dollar today is worth more than a dollar tomorrow. Every valuation, every investment decision, and every loan calculation rests on this principle.

## Why Money Has Time Value

Three reasons why receiving $100 today is better than receiving $100 in one year:
1. **Opportunity cost**: You can invest $100 today and have more than $100 next year
2. **Inflation**: $100 buys less next year as prices rise
3. **Uncertainty**: The future payment might not arrive (default risk)

## Present Value (PV) and Future Value (FV)

### Future Value: Compounding

> **FV = PV x (1 + r)^n**

Where: r = interest rate per period, n = number of periods.

**Worked Example**: You invest $1,000 at 8% per year for 5 years.

FV = $1,000 x (1.08)^5 = $1,000 x 1.4693 = **$1,469.33**

### Present Value: Discounting

> **PV = FV / (1 + r)^n**

**Worked Example**: What is $10,000 received in 10 years worth today if the discount rate is 6%?

PV = $10,000 / (1.06)^10 = $10,000 / 1.7908 = **$5,583.95**

**Intuition**: If you invest $5,583.95 today at 6%, you will have exactly $10,000 in 10 years.

## Compounding Frequency

Interest can compound annually, semi-annually, quarterly, monthly, or continuously.

> **FV = PV x (1 + r/m)^(m x n)**

Where: m = compounding frequency per year.

| Frequency | m | $1,000 at 12% for 1 year |
|-----------|---|--------------------------|
| Annual | 1 | $1,120.00 |
| Semi-annual | 2 | $1,123.60 |
| Quarterly | 4 | $1,125.51 |
| Monthly | 12 | $1,126.83 |
| Daily | 365 | $1,127.47 |
| Continuous | -- | $1,127.50 |

### Continuous Compounding

> **FV = PV x e^(r x n)**

Where e = 2.71828... (Euler's number).

### Effective Annual Rate (EAR)

Converts any compounding frequency to an equivalent annual rate.

> **EAR = (1 + r/m)^m - 1**

**Worked Example**: A bank offers 12% compounded monthly. What is the effective annual rate?

EAR = (1 + 0.12/12)^12 - 1 = (1.01)^12 - 1 = 1.1268 - 1 = **12.68%**

## Annuities

An annuity is a series of equal payments made at regular intervals.

### Ordinary Annuity (payments at end of period)

**Present Value**:
> **PV = PMT x [(1 - (1 + r)^(-n)) / r]**

**Future Value**:
> **FV = PMT x [((1 + r)^n - 1) / r]**

### Annuity Due (payments at beginning of period)

Multiply the ordinary annuity formula by (1 + r):

> **PV_due = PV_ordinary x (1 + r)**

### Worked Example: Ordinary Annuity PV

You will receive $5,000 per year for 10 years, with the first payment one year from now. Discount rate is 7%.

PV = $5,000 x [(1 - (1.07)^(-10)) / 0.07]
PV = $5,000 x [(1 - 0.5083) / 0.07]
PV = $5,000 x [0.4917 / 0.07]
PV = $5,000 x 7.0236
PV = **$35,118**

### Worked Example: Saving for Retirement (FV of Annuity)

You save $500 per month for 30 years at 8% annual (0.667% monthly). How much will you have?

FV = $500 x [((1.00667)^360 - 1) / 0.00667]
FV = $500 x [(10.9357 - 1) / 0.00667]
FV = $500 x 1,490.36
FV = **$745,180**

## Perpetuities

A perpetuity is an annuity that pays forever.

### Standard Perpetuity

> **PV = PMT / r**

**Worked Example**: An investment pays $100 per year forever. Discount rate is 5%.

PV = $100 / 0.05 = **$2,000**

### Growing Perpetuity

Payments grow at a constant rate g forever (g must be less than r).

> **PV = PMT / (r - g)**

**Worked Example**: An investment pays $100 next year, growing at 3% per year forever. Discount rate is 8%.

PV = $100 / (0.08 - 0.03) = $100 / 0.05 = **$2,000**

Note: This is the Gordon Growth Model -- used extensively in stock valuation.

## Growing Annuity

A finite series of payments growing at rate g.

> **PV = PMT x [1/(r - g)] x [1 - ((1 + g)/(1 + r))^n]**

**Worked Example**: Your starting salary is $60,000, growing at 3% per year for 40 years. Discount rate is 8%. What is the present value of your lifetime earnings?

PV = $60,000 x [1/(0.08 - 0.03)] x [1 - (1.03/1.08)^40]
PV = $60,000 x 20 x [1 - (0.9537)^40]
PV = $60,000 x 20 x [1 - 0.1504]
PV = $60,000 x 20 x 0.8496
PV = **$1,019,520**

## Solving for Unknown Variables

The TVM framework has four variables (PV, FV, PMT, r, n). Given any four, you can solve for the fifth.

### Solving for Rate (r)

How long does it take to double your money at rate r?

From FV = PV x (1 + r)^n: If FV = 2 x PV, then 2 = (1 + r)^n.

**Rule of 72** (quick approximation):

> **Doubling time (years) = 72 / r (as a percentage)**

At 8%: 72/8 = **9 years** (exact: 9.006 years).

### Solving for PMT (loan payment)

> **PMT = PV x [r / (1 - (1 + r)^(-n))]**

**Worked Example**: Mortgage of $300,000 at 6% annual (0.5% monthly) for 30 years (360 months).

PMT = $300,000 x [0.005 / (1 - (1.005)^(-360))]
PMT = $300,000 x [0.005 / (1 - 0.1660)]
PMT = $300,000 x [0.005 / 0.8340]
PMT = $300,000 x 0.005996
PMT = **$1,798.65 per month**

Total paid over 30 years: $1,798.65 x 360 = $647,514. Of that, $347,514 is interest.

## Uneven Cash Flows

When cash flows are not equal, discount each individually:

> **PV = C_1/(1+r)^1 + C_2/(1+r)^2 + ... + C_n/(1+r)^n**

This is the basis of NPV analysis in capital budgeting.

## Common Mistakes

1. **Mismatching rate and period**: If payments are monthly, use the monthly rate (annual rate / 12) and the number of months (not years). Never use an annual rate with monthly periods.

2. **Confusing ordinary annuity and annuity due**: Most formulas assume ordinary annuities (end-of-period payments). Lease payments and insurance premiums are typically annuity due (beginning-of-period).

3. **Using nominal rates when real rates are needed**: If cash flows are in real terms (inflation-adjusted), use the real discount rate. If cash flows are nominal, use the nominal rate. Never mix them.

4. **Ignoring the power of compounding**: $1,000 at 10% for 50 years becomes $117,391 -- not $6,000 (which is simple interest). Compounding is exponential.

5. **Forgetting that PV decreases as the discount rate increases**: A higher discount rate means future cash flows are worth less today.

## Practice Problems

**Problem 1**: You deposit $2,500 per year into a retirement account earning 9% per year. How much will you have after 35 years?

**Problem 2**: A zero-coupon bond pays $1,000 in 20 years. If the required return is 5%, what should you pay for it today?

**Problem 3**: Your car loan is $25,000 at 4.5% APR compounded monthly for 5 years. What is the monthly payment? How much total interest will you pay?

**Problem 4**: A stock pays a dividend of $3.00 next year, growing at 5% forever. If your required return is 10%, what is the stock worth today?

## Key References

- Berk, J. & DeMarzo, P. (2020). *Corporate Finance*, 5th ed., Pearson. Chapters 3-4.
- Ross, S.A., Westerfield, R.W. & Jordan, B.D. (2022). *Fundamentals of Corporate Finance*, 13th ed., McGraw-Hill. Chapters 5-6.
- Brigham, E.F. & Houston, J.F. (2021). *Fundamentals of Financial Management*, 16th ed., Cengage. Chapters 4-5.
