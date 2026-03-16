# Bond Valuation

A bond is a debt contract: the issuer borrows money and promises to repay it with interest. Bond valuation applies the time value of money to a known (or estimable) stream of cash flows -- coupon payments and the return of principal at maturity.

## Why Bond Valuation Matters

Bonds are the largest asset class in the world, exceeding the total value of global equity markets. Understanding how bonds are priced is essential for:
- Corporate finance (firms issue bonds to fund operations)
- Portfolio management (bonds provide income and diversification)
- Monetary policy (central banks influence the economy through interest rates, which directly affect bond prices)

The single most important insight: **bond prices move inversely to interest rates**. When rates rise, existing bond prices fall; when rates fall, bond prices rise.

## Bond Pricing Fundamentals

A standard coupon bond makes periodic coupon payments and returns the face value (par) at maturity.

> **P = sum from t=1 to n of: C / (1 + y)^t + F / (1 + y)^n**

Which simplifies to:

> **P = C x [(1 - (1 + y)^(-n)) / y] + F / (1 + y)^n**

Where:
- P = Bond price
- C = Coupon payment per period (= Coupon Rate x Face Value / number of payments per year)
- F = Face value (par value, typically $1,000)
- y = Yield per period (YTM / number of payments per year)
- n = Total number of coupon periods remaining

The first term is the present value of an annuity (the coupon stream). The second term is the present value of a lump sum (the face value at maturity).

### Worked Example: Bond Pricing

A 10-year bond has a face value of $1,000, a coupon rate of 6% paid semi-annually, and a yield to maturity of 8%.

Step 1: Identify the variables.
- C = $1,000 x 0.06 / 2 = $30 per period
- y = 0.08 / 2 = 0.04 per period
- n = 10 x 2 = 20 periods
- F = $1,000

Step 2: Calculate the price.
P = $30 x [(1 - (1.04)^(-20)) / 0.04] + $1,000 / (1.04)^20
P = $30 x [(1 - 0.4564) / 0.04] + $1,000 / 2.1911
P = $30 x 13.590 + $456.39
P = $407.71 + $456.39
P = **$864.10**

The bond trades at a **discount** (below par) because the coupon rate (6%) is less than the market yield (8%).

### Price-Yield Relationship

| Condition | Bond Trades At | Reason |
|-----------|---------------|--------|
| Coupon Rate = YTM | Par ($1,000) | Bond pays exactly the market rate |
| Coupon Rate > YTM | Premium (> $1,000) | Bond pays more than the market rate -- investors pay extra |
| Coupon Rate < YTM | Discount (< $1,000) | Bond pays less than the market rate -- investors demand a discount |

### Zero-Coupon Bond

A bond that pays no coupons -- only the face value at maturity.

> **P = F / (1 + y)^n**

**Worked Example**: A 5-year zero-coupon bond with face value $1,000 and YTM of 5%.

P = $1,000 / (1.05)^5 = $1,000 / 1.2763 = **$783.53**

## Yield to Maturity (YTM)

The YTM is the discount rate that equates the bond's price to the present value of its cash flows. It is the bond equivalent of IRR.

> **P = sum from t=1 to n of: C / (1 + y)^t + F / (1 + y)^n**

Solving for y requires iteration (or a financial calculator).

**Interpretation**: If you buy the bond at price P, hold it to maturity, and reinvest all coupons at rate y, your annualized return will be y.

### Worked Example: Solving for YTM

A bond with face value $1,000, coupon rate 5% (annual), 3 years to maturity, currently trades at $960. What is the YTM?

Set up the equation:
$960 = $50/(1+y)^1 + $50/(1+y)^2 + $1,050/(1+y)^3

By trial and error or a calculator: y = **6.45%**

Verify: $50/1.0645 + $50/(1.0645)^2 + $1,050/(1.0645)^3 = $46.97 + $44.13 + $868.90 = $960.00

### Other Yield Measures

| Measure | Formula | Use |
|---------|---------|-----|
| **Current Yield** | Annual Coupon / Current Price | Quick yield estimate; ignores capital gain/loss |
| **YTM** | IRR of all cash flows | Most comprehensive; assumes reinvestment at YTM |
| **Yield to Call (YTC)** | IRR assuming bond is called at first call date | Relevant for callable bonds |
| **Bond Equivalent Yield (BEY)** | 2 x semi-annual yield | Annualizes semi-annual yield without compounding |

## Duration

Duration measures a bond's sensitivity to interest rate changes. It is the weighted average time until cash flows are received, where the weights are the present values of each cash flow.

### Macaulay Duration

> **D_Mac = (1/P) x sum from t=1 to n of: t x [C / (1 + y)^t] + n x [F / (1 + y)^n] x (1/P)**

More compactly:

> **D_Mac = sum from t=1 to n of: t x w_t**

Where w_t = PV(CF_t) / P is the weight of cash flow t.

**Units**: Years. Macaulay duration is measured in the same units as the payment periods.

### Modified Duration

Measures the percentage price change for a 1% (100 basis point) change in yield.

> **D_Mod = D_Mac / (1 + y/m)**

Where m = number of coupon periods per year.

**Price sensitivity approximation**:

> **Delta P / P = -D_Mod x Delta y**

### Worked Example: Duration and Price Sensitivity

A bond has Macaulay duration of 7.5 years, YTM of 6% (semi-annual compounding), and is priced at $1,050.

Modified duration:
D_Mod = 7.5 / (1 + 0.06/2) = 7.5 / 1.03 = **7.28 years**

If yields rise by 50 basis points (0.50%):
Delta P / P = -7.28 x 0.0050 = -0.0364 = **-3.64%**

New price = $1,050 x (1 - 0.0364) = $1,050 x 0.9636 = **$1,011.78**

### Duration Properties

1. **Zero-coupon bonds**: Duration = maturity (all cash flow arrives at the end)
2. **Coupon bonds**: Duration < maturity (earlier coupons pull the weighted average forward)
3. **Higher coupon**: Lower duration (more cash flow arrives early)
4. **Higher yield**: Lower duration (present value of distant cash flows falls more)
5. **Longer maturity**: Higher duration (cash flows extend further into the future)

## Convexity

Duration is a linear approximation. For large yield changes, the actual price-yield curve is convex (curved), and duration alone overstates the price decline and understates the price increase.

> **Convexity = (1/P) x sum from t=1 to n of: [t x (t+1) x CF_t / (1 + y)^(t+2)]**

**Price change with convexity adjustment**:

> **Delta P / P = -D_Mod x Delta y + (1/2) x Convexity x (Delta y)^2**

The convexity term is always positive, which means:
- When yields fall, convexity makes the price rise **more** than duration alone predicts
- When yields rise, convexity makes the price fall **less** than duration alone predicts

**Implication**: All else equal, higher convexity is desirable. Investors prefer bonds with greater convexity because they benefit more from rate decreases and suffer less from rate increases.

## Term Structure of Interest Rates

The term structure (yield curve) describes the relationship between bond yields and maturities.

### Yield Curve Shapes

| Shape | Description | Typical Interpretation |
|-------|-------------|----------------------|
| **Normal (upward-sloping)** | Longer maturities have higher yields | Markets expect economic growth and/or future rate increases |
| **Inverted (downward-sloping)** | Shorter maturities have higher yields | Markets expect economic slowdown; historically precedes recessions |
| **Flat** | Similar yields across all maturities | Transition between normal and inverted; uncertainty about future rates |
| **Humped** | Medium-term yields are highest | Combines elements of normal and inverted expectations |

### Theories of the Term Structure

1. **Expectations Hypothesis**: Long-term rates are the geometric average of expected future short-term rates. The forward rate equals the expected future spot rate.

2. **Liquidity Preference Theory**: Investors demand a premium for holding longer-term bonds (liquidity premium). Long rates = expected short rates + premium. Explains why the yield curve is normally upward-sloping.

3. **Market Segmentation Theory**: Different investor groups (banks, pension funds, insurers) prefer different maturities. Supply and demand in each segment determine rates independently.

### Spot Rates and Forward Rates

**Spot rate** (z_n): The yield on a zero-coupon bond maturing in n periods.

**Forward rate** (f): The rate implied for a future period by today's spot rates.

> **(1 + z_2)^2 = (1 + z_1) x (1 + f_(1,2))**

Solving for the one-year forward rate one year from now:

> **f_(1,2) = [(1 + z_2)^2 / (1 + z_1)] - 1**

**Worked Example**: The 1-year spot rate is 3% and the 2-year spot rate is 3.5%. What is the implied 1-year forward rate one year from now?

f_(1,2) = [(1.035)^2 / (1.03)] - 1 = [1.07123 / 1.03] - 1 = 1.04002 - 1 = **4.00%**

## Credit Risk

Not all bonds are equally safe. Credit risk (default risk) is the risk that the issuer will fail to make promised payments.

### Credit Ratings

| Rating (S&P/Moody's) | Grade | Description |
|----------------------|-------|-------------|
| AAA / Aaa | Investment grade | Highest quality; minimal default risk |
| AA / Aa | Investment grade | High quality; very low default risk |
| A / A | Investment grade | Upper medium grade; low default risk |
| BBB / Baa | Investment grade | Medium grade; moderate default risk |
| BB / Ba | Speculative (junk) | Speculative; substantial default risk |
| B / B | Speculative | Highly speculative |
| CCC / Caa | Speculative | Very high default risk |
| D / C | Default | In default |

### Credit Spread

> **Credit Spread = Yield on risky bond - Yield on risk-free bond of same maturity**

Credit spreads widen during economic downturns (investors demand more compensation for default risk) and narrow during expansions.

## Common Mistakes

1. **Forgetting semi-annual compounding**: Most US corporate and government bonds pay coupons semi-annually. You must halve the annual coupon rate and YTM and double the number of periods. This is the most common bond calculation error.

2. **Confusing coupon rate and yield**: The coupon rate is set at issuance and does not change. The yield changes daily as the bond price fluctuates in the market.

3. **Using duration for large rate changes without convexity**: Duration is a first-order approximation. For rate changes greater than 100 basis points, the convexity adjustment becomes material.

4. **Ignoring reinvestment risk in YTM**: YTM assumes all coupons are reinvested at the YTM. In practice, reinvestment rates may differ, especially for long-maturity bonds.

5. **Applying the wrong day-count convention**: Treasury bonds use actual/actual, corporate bonds typically use 30/360. Using the wrong convention produces incorrect accrued interest calculations.

6. **Confusing clean and dirty prices**: The quoted price (clean price) excludes accrued interest. The invoice price (dirty price) includes it. Dirty price = Clean price + Accrued interest.

## Practice Problems

**Problem 1**: A 5-year bond has a face value of $1,000, a coupon rate of 4% (semi-annual), and a YTM of 6%. What is its price? Does it trade at a premium or discount?

**Problem 2**: A bond with annual coupons of $80, face value of $1,000, and 4 years to maturity is priced at $1,032. Estimate the YTM.

**Problem 3**: A bond has a modified duration of 6.2 years and convexity of 45. If yields increase by 150 basis points, estimate the percentage price change using (a) duration only and (b) duration plus convexity.

**Problem 4**: The 1-year, 2-year, and 3-year spot rates are 2.0%, 2.5%, and 3.2%. What are the implied one-year forward rates for Years 2 and 3?

## Key References

- Bodie, Z., Kane, A. & Marcus, A.J. (2021). *Investments*, 12th ed., McGraw-Hill. Chapters 14-16.
- Fabozzi, F.J. (2021). *Bond Markets, Analysis, and Strategies*, 10th ed., Pearson. Chapters 2-4, 7.
- Berk, J. & DeMarzo, P. (2020). *Corporate Finance*, 5th ed., Pearson. Chapters 6, 30.
- Tuckman, B. & Serrat, A. (2022). *Fixed Income Securities*, 4th ed., Wiley. Chapters 1-5.
