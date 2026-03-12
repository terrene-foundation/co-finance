---
name: fixed-income
description: "Fixed income securities reference covering bond types, yield calculations, duration, convexity, credit ratings, and bond pricing. Use when asking about 'bonds', 'fixed income', 'yield to maturity', 'YTM', 'duration', 'convexity', 'credit ratings', 'treasury bonds', 'corporate bonds', 'municipal bonds', 'zero-coupon bonds', 'yield curve', 'bond pricing', 'coupon rate', or 'yield spread'."
---

# Fixed Income Securities

Comprehensive reference for bonds and fixed income instruments including pricing, yield calculations, risk measures, and Python implementations.

## Bond Types

### Treasury Bonds (Government)

Issued by national governments; considered risk-free in their home currency.

| Type                     | Maturity        | Coupon                      | Key Feature                       |
| ------------------------ | --------------- | --------------------------- | --------------------------------- |
| Treasury Bills (T-Bills) | < 1 year        | Zero-coupon (discount)      | Most liquid, benchmark short rate |
| Treasury Notes (T-Notes) | 2-10 years      | Semi-annual                 | Benchmark medium-term rate        |
| Treasury Bonds (T-Bonds) | 20-30 years     | Semi-annual                 | Long-term benchmark               |
| TIPS                     | 5, 10, 30 years | Semi-annual + inflation adj | Inflation protection              |
| I-Bonds                  | 30 years        | Fixed + inflation           | Retail savings, purchase limits   |

### Corporate Bonds

Issued by corporations to raise capital.

- **Investment Grade**: BBB-/Baa3 or higher. Lower yields, lower default risk.
- **High Yield (Junk)**: BB+/Ba1 or lower. Higher yields, higher default risk.
- **Callable bonds**: Issuer can redeem early (usually at a premium).
- **Putable bonds**: Holder can force early redemption at par.
- **Convertible bonds**: Can be converted to equity at a specified ratio.

### Municipal Bonds

Issued by state and local governments.

- **General Obligation (GO)**: Backed by taxing power of the issuer.
- **Revenue bonds**: Backed by specific project revenue (tolls, utilities).
- **Tax advantage**: Interest is typically exempt from federal income tax, and often state/local tax for residents.

### Zero-Coupon Bonds

Issued at a discount, pay face value at maturity, no periodic interest payments.

```python
import numpy as np

def zero_coupon_price(face_value: float, ytm: float, years_to_maturity: float) -> float:
    """Price a zero-coupon bond.

    Args:
        face_value: Par/face value of the bond
        ytm: Yield to maturity (annual, as decimal)
        years_to_maturity: Time to maturity in years

    Returns:
        Current price of the bond
    """
    return face_value / (1 + ytm) ** years_to_maturity

# Example: 10-year zero-coupon bond, $1000 face, 5% YTM
price = zero_coupon_price(1000, 0.05, 10)
print(f"Zero-coupon price: ${price:.2f}")  # $613.91
```

## Yield Calculations

### Current Yield

Simple ratio of annual coupon to current price.

```python
def current_yield(annual_coupon: float, current_price: float) -> float:
    """Calculate current yield."""
    return annual_coupon / current_price

# Example: 5% coupon on $1000 par, trading at $950
cy = current_yield(50, 950)
print(f"Current Yield: {cy:.2%}")  # 5.26%
```

### Yield to Maturity (YTM)

The internal rate of return if the bond is held to maturity.

```python
import numpy_financial as npf

def yield_to_maturity(face_value: float, coupon_rate: float,
                       current_price: float, years_to_maturity: int,
                       payments_per_year: int = 2) -> float:
    """Calculate yield to maturity using numpy-financial.

    Args:
        face_value: Par value of the bond
        coupon_rate: Annual coupon rate (as decimal)
        current_price: Current market price
        years_to_maturity: Years until maturity
        payments_per_year: Coupon frequency (default 2 for semi-annual)

    Returns:
        Annual yield to maturity (as decimal)
    """
    coupon_payment = face_value * coupon_rate / payments_per_year
    n_periods = years_to_maturity * payments_per_year

    # npf.rate: solve for periodic rate
    # nper, pmt, pv, fv
    periodic_rate = npf.rate(
        nper=n_periods,
        pmt=coupon_payment,
        pv=-current_price,  # negative because it's a cash outflow
        fv=face_value
    )

    return periodic_rate * payments_per_year

# Example: $1000 par, 5% coupon, semi-annual, 10 years, trading at $950
ytm = yield_to_maturity(1000, 0.05, 950, 10)
print(f"YTM: {ytm:.4%}")  # ~5.66%
```

### Yield Spread

The difference between a bond's yield and a benchmark yield (usually Treasury of same maturity).

```python
def yield_spread(bond_ytm: float, benchmark_ytm: float) -> float:
    """Calculate yield spread in basis points."""
    return (bond_ytm - benchmark_ytm) * 10000

# Example: Corporate bond yielding 6.5%, 10-year Treasury at 4.2%
spread = yield_spread(0.065, 0.042)
print(f"Yield Spread: {spread:.0f} bps")  # 230 bps
```

### Yield Curve

```python
import matplotlib.pyplot as plt
import numpy as np

def plot_yield_curve(maturities: list, yields: list, label: str = "Yield Curve"):
    """Plot a yield curve from maturity/yield data."""
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(maturities, [y * 100 for y in yields], 'b-o', linewidth=2)
    ax.set_xlabel("Maturity (Years)")
    ax.set_ylabel("Yield (%)")
    ax.set_title(label)
    ax.grid(True, alpha=0.3)
    return fig, ax

# Example: typical normal yield curve
maturities = [0.25, 0.5, 1, 2, 3, 5, 7, 10, 20, 30]
yields = [0.042, 0.043, 0.044, 0.041, 0.040, 0.039, 0.040, 0.042, 0.045, 0.044]

fig, ax = plot_yield_curve(maturities, yields, "US Treasury Yield Curve")
plt.tight_layout()
plt.savefig("yield_curve.png", dpi=150)
plt.close()
```

## Duration and Convexity

### Macaulay Duration

Weighted average time to receive cash flows, where weights are present values.

```python
import numpy as np

def macaulay_duration(face_value: float, coupon_rate: float, ytm: float,
                       years_to_maturity: int, payments_per_year: int = 2) -> float:
    """Calculate Macaulay duration.

    Returns:
        Duration in years
    """
    coupon = face_value * coupon_rate / payments_per_year
    n_periods = years_to_maturity * payments_per_year
    periodic_rate = ytm / payments_per_year

    # Calculate present value of each cash flow weighted by time
    weighted_pv_sum = 0
    price = 0

    for t in range(1, n_periods + 1):
        cf = coupon
        if t == n_periods:
            cf += face_value
        pv = cf / (1 + periodic_rate) ** t
        weighted_pv_sum += (t / payments_per_year) * pv
        price += pv

    return weighted_pv_sum / price

# Example: 5% coupon, 5% YTM, 10 years, semi-annual
mac_dur = macaulay_duration(1000, 0.05, 0.05, 10)
print(f"Macaulay Duration: {mac_dur:.2f} years")  # ~7.99 years
```

### Modified Duration

Measures the percentage price change for a 1% change in yield.

```python
def modified_duration(macaulay_dur: float, ytm: float,
                       payments_per_year: int = 2) -> float:
    """Calculate modified duration from Macaulay duration."""
    return macaulay_dur / (1 + ytm / payments_per_year)

mod_dur = modified_duration(mac_dur, 0.05)
print(f"Modified Duration: {mod_dur:.2f}")

# Price change estimate for a 50bp yield increase
yield_change = 0.005
price_change_pct = -mod_dur * yield_change * 100
print(f"Estimated price change for +50bp: {price_change_pct:.2f}%")
```

### Convexity

Second-order measure of bond price sensitivity to yield changes.

```python
def bond_convexity(face_value: float, coupon_rate: float, ytm: float,
                    years_to_maturity: int, payments_per_year: int = 2) -> float:
    """Calculate bond convexity.

    Returns:
        Convexity in years squared
    """
    coupon = face_value * coupon_rate / payments_per_year
    n_periods = years_to_maturity * payments_per_year
    periodic_rate = ytm / payments_per_year

    convexity_sum = 0
    price = 0

    for t in range(1, n_periods + 1):
        cf = coupon
        if t == n_periods:
            cf += face_value
        pv = cf / (1 + periodic_rate) ** t
        convexity_sum += t * (t + 1) * pv
        price += pv

    return convexity_sum / (price * (1 + periodic_rate) ** 2 * payments_per_year ** 2)

conv = bond_convexity(1000, 0.05, 0.05, 10)
print(f"Convexity: {conv:.2f}")

# Improved price change estimate with convexity adjustment
yield_change = 0.01  # 100 bps
mod_dur_val = modified_duration(mac_dur, 0.05)
price_change = (-mod_dur_val * yield_change + 0.5 * conv * yield_change**2) * 100
print(f"Price change for +100bp (with convexity): {price_change:.2f}%")
```

## Credit Ratings

| Rating Agency | Investment Grade | Speculative Grade    |
| ------------- | ---------------- | -------------------- |
| S&P / Fitch   | AAA, AA, A, BBB  | BB, B, CCC, CC, C, D |
| Moody's       | Aaa, Aa, A, Baa  | Ba, B, Caa, Ca, C    |

**Rating modifiers:**

- S&P/Fitch: + or - (e.g., AA+, A-)
- Moody's: 1, 2, 3 (e.g., Aa1, Baa3)

**Key thresholds:**

- BBB-/Baa3: Lowest investment grade (many funds mandate this minimum)
- BB+/Ba1: Highest speculative grade ("fallen angel" if downgraded from IG)

## Bond Pricing

### Full Bond Pricing Function

```python
import numpy as np
import numpy_financial as npf

def bond_price(face_value: float, coupon_rate: float, ytm: float,
               years_to_maturity: int, payments_per_year: int = 2) -> float:
    """Calculate the price of a coupon-paying bond.

    Args:
        face_value: Par/face value
        coupon_rate: Annual coupon rate (as decimal)
        ytm: Yield to maturity (annual, as decimal)
        years_to_maturity: Years until maturity
        payments_per_year: Coupon frequency

    Returns:
        Bond price
    """
    coupon = face_value * coupon_rate / payments_per_year
    n_periods = years_to_maturity * payments_per_year
    periodic_rate = ytm / payments_per_year

    # Present value of coupon annuity + present value of face value
    pv_coupons = coupon * (1 - (1 + periodic_rate) ** -n_periods) / periodic_rate
    pv_face = face_value / (1 + periodic_rate) ** n_periods

    return pv_coupons + pv_face

# Using numpy-financial for the same calculation
def bond_price_npf(face_value: float, coupon_rate: float, ytm: float,
                    years_to_maturity: int, payments_per_year: int = 2) -> float:
    """Calculate bond price using numpy-financial."""
    coupon = face_value * coupon_rate / payments_per_year
    n_periods = years_to_maturity * payments_per_year
    periodic_rate = ytm / payments_per_year

    return -npf.pv(rate=periodic_rate, nper=n_periods, pmt=coupon, fv=face_value)

# Example: $1000 par, 5% coupon, semi-annual, 10 years
for ytm_val in [0.04, 0.05, 0.06]:
    p = bond_price(1000, 0.05, ytm_val, 10)
    label = "par" if ytm_val == 0.05 else ("premium" if ytm_val < 0.05 else "discount")
    print(f"YTM={ytm_val:.0%}: ${p:.2f} ({label})")
```

### Price-Yield Relationship Visualization

```python
import numpy as np
import matplotlib.pyplot as plt

def plot_price_yield(face_value, coupon_rate, years_to_maturity):
    """Visualize the inverse relationship between bond price and yield."""
    ytm_range = np.linspace(0.01, 0.12, 100)
    prices = [bond_price(face_value, coupon_rate, y, years_to_maturity)
              for y in ytm_range]

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(ytm_range * 100, prices, 'b-', linewidth=2)
    ax.axhline(y=face_value, color='gray', linestyle='--', alpha=0.5, label='Par Value')
    ax.axvline(x=coupon_rate * 100, color='red', linestyle='--', alpha=0.5,
               label=f'Coupon Rate ({coupon_rate:.0%})')
    ax.set_xlabel("Yield to Maturity (%)")
    ax.set_ylabel("Bond Price ($)")
    ax.set_title(f"Price-Yield Curve: {coupon_rate:.0%} Coupon, {years_to_maturity}Y Bond")
    ax.legend()
    ax.grid(True, alpha=0.3)
    return fig, ax

fig, ax = plot_price_yield(1000, 0.05, 10)
plt.tight_layout()
plt.savefig("price_yield.png", dpi=150)
plt.close()
```

## Common Pitfalls

1. **Confusing current yield with YTM**: Current yield ignores capital gains/losses from price convergence to par. YTM is the complete return measure.

2. **Forgetting semi-annual compounding**: Most US bonds pay semi-annual coupons. Divide annual rates by 2 and double the number of periods.

3. **Ignoring accrued interest**: Bond prices are quoted "clean" (without accrued interest) but settle "dirty" (clean price + accrued interest). You pay the dirty price.

4. **Treating duration as static**: Duration changes as yields change and as time passes. It must be recalculated regularly.

5. **Ignoring callable bond risk**: Callable bonds have negative convexity at low yields -- the issuer will refinance, capping your upside.

6. **Mixing up day count conventions**: Different bond markets use different conventions (30/360, actual/actual, actual/360). This affects accrued interest calculations.

## Cross-References

- **[equities](equities.md)** - For comparing bonds vs stocks
- **[derivatives](derivatives.md)** - For interest rate derivatives
- **[04-risk-management/var-methods](../04-risk-management/var-methods.md)** - For fixed income risk measurement
- **[05-financial-data-apis/fred-guide](../05-financial-data-apis/fred-guide.md)** - For Treasury yield data from FRED
- **[03-portfolio-theory/mpt-basics](../03-portfolio-theory/mpt-basics.md)** - For bonds in portfolio context
