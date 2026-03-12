# QuantLib Python Basics

QuantLib is a comprehensive library for quantitative finance, covering bond pricing, yield curve construction, interest rate modeling, and options pricing. The Python bindings (`QuantLib-Python`) provide access to the full C++ library.

## Installation

```bash
pip install QuantLib-Python
```

Note: The package name on PyPI is `QuantLib-Python`, but the import is `QuantLib`.

## Key Concepts

QuantLib requires explicit handling of dates, day count conventions, and calendars. This precision is what makes it suitable for production-grade financial calculations.

```python
import QuantLib as ql

# Date construction
today = ql.Date(15, ql.March, 2024)  # Day, Month, Year
# Or from ISO string
today = ql.Date(15, 3, 2024)

# Set the global evaluation date
ql.Settings.instance().evaluationDate = today

# Calendars
us_calendar = ql.UnitedStates(ql.UnitedStates.GovernmentBond)
uk_calendar = ql.UnitedKingdom()

# Check if a date is a business day
is_business_day = us_calendar.isBusinessDay(today)

# Advance by business days
next_settle = us_calendar.advance(today, ql.Period(2, ql.Days))

# Day count conventions
dc_actual360 = ql.Actual360()
dc_actual365 = ql.Actual365Fixed()
dc_30360 = ql.Thirty360(ql.Thirty360.BondBasis)
dc_actact = ql.ActualActual(ql.ActualActual.ISDA)

# Year fraction between two dates
d1 = ql.Date(1, ql.January, 2024)
d2 = ql.Date(1, ql.July, 2024)
yf = dc_actact.yearFraction(d1, d2)
print(f"Year fraction: {yf:.6f}")
```

## Bond Pricing

### Fixed-Rate Bond

```python
import QuantLib as ql

# Setup
today = ql.Date(15, ql.March, 2024)
ql.Settings.instance().evaluationDate = today

# Bond parameters
issue_date = ql.Date(15, ql.March, 2024)
maturity_date = ql.Date(15, ql.March, 2034)
coupon_rate = 0.045  # 4.5% annual coupon
face_value = 100.0

# Schedule (semi-annual payments, US calendar)
schedule = ql.Schedule(
    issue_date,
    maturity_date,
    ql.Period(ql.Semiannual),
    ql.UnitedStates(ql.UnitedStates.GovernmentBond),
    ql.Unadjusted,         # Business day convention
    ql.Unadjusted,
    ql.DateGeneration.Backward,
    False                   # End of month
)

# Create the bond
bond = ql.FixedRateBond(
    2,                      # Settlement days
    face_value,
    schedule,
    [coupon_rate],          # Coupon rates (can vary by period)
    ql.ActualActual(ql.ActualActual.Bond),
)

# Price with a flat yield curve
flat_rate = ql.SimpleQuote(0.04)  # 4% yield
rate_handle = ql.QuoteHandle(flat_rate)
term_structure = ql.FlatForward(today, rate_handle, ql.ActualActual(ql.ActualActual.Bond))
ts_handle = ql.YieldTermStructureHandle(term_structure)

# Set the pricing engine
bond_engine = ql.DiscountingBondEngine(ts_handle)
bond.setPricingEngine(bond_engine)

# Results
print(f"Clean Price: {bond.cleanPrice():.4f}")
print(f"Dirty Price: {bond.dirtyPrice():.4f}")
print(f"Accrued Interest: {bond.accruedAmount():.4f}")
print(f"Yield (from price): {bond.bondYield(bond.cleanPrice(), ql.ActualActual(ql.ActualActual.Bond), ql.Compounded, ql.Semiannual):.4%}")

# Cash flows
for cf in bond.cashflows():
    print(f"  {cf.date()}: ${cf.amount():.2f}")
```

### Yield-to-Maturity from Market Price

```python
market_price = 98.50  # Bond trading at a discount

ytm = bond.bondYield(
    market_price,
    ql.ActualActual(ql.ActualActual.Bond),
    ql.Compounded,
    ql.Semiannual,
)
print(f"YTM: {ytm:.4%}")
```

### Duration and Convexity

```python
ytm_quote = ql.InterestRate(
    ytm,
    ql.ActualActual(ql.ActualActual.Bond),
    ql.Compounded,
    ql.Semiannual,
)

# Macaulay Duration
mac_duration = ql.BondFunctions.duration(
    bond, ytm_quote, ql.Duration.Macaulay
)

# Modified Duration
mod_duration = ql.BondFunctions.duration(
    bond, ytm_quote, ql.Duration.Modified
)

# Convexity
convexity = ql.BondFunctions.convexity(bond, ytm_quote)

print(f"Macaulay Duration: {mac_duration:.4f} years")
print(f"Modified Duration: {mod_duration:.4f}")
print(f"Convexity: {convexity:.4f}")

# Price sensitivity estimate
dy = 0.0001  # 1 basis point
dp_duration = -mod_duration * dy * 100  # Price change from duration
dp_convexity = 0.5 * convexity * (dy ** 2) * 100  # Convexity adjustment
print(f"Price change per 1bp (duration): {dp_duration:.4f}")
print(f"Price change per 1bp (duration + convexity): {dp_duration + dp_convexity:.4f}")
```

## Yield Curve Construction

### Bootstrapping from Market Instruments

```python
import QuantLib as ql

today = ql.Date(15, ql.March, 2024)
ql.Settings.instance().evaluationDate = today
calendar = ql.UnitedStates(ql.UnitedStates.GovernmentBond)

# Market data: deposit rates (short end)
deposit_helpers = [
    ql.DepositRateHelper(
        ql.QuoteHandle(ql.SimpleQuote(rate)),
        ql.Period(tenor),
        2,  # Settlement days
        calendar,
        ql.ModifiedFollowing,
        False,
        ql.Actual360(),
    )
    for rate, tenor in [
        (0.0525, ql.Period(1, ql.Months)),
        (0.0530, ql.Period(3, ql.Months)),
        (0.0535, ql.Period(6, ql.Months)),
    ]
]

# Market data: swap rates (long end)
swap_helpers = [
    ql.SwapRateHelper(
        ql.QuoteHandle(ql.SimpleQuote(rate)),
        ql.Period(tenor, ql.Years),
        calendar,
        ql.Annual,
        ql.Unadjusted,
        ql.Thirty360(ql.Thirty360.BondBasis),
        ql.Euribor6M(),  # Floating leg index
    )
    for rate, tenor in [
        (0.0480, 2),
        (0.0460, 3),
        (0.0445, 5),
        (0.0440, 7),
        (0.0435, 10),
        (0.0430, 20),
        (0.0425, 30),
    ]
]

# Build the curve
helpers = deposit_helpers + swap_helpers
curve = ql.PiecewiseLogCubicDiscount(today, helpers, ql.Actual365Fixed())
curve.enableExtrapolation()

# Extract zero rates and discount factors
ts_handle = ql.YieldTermStructureHandle(curve)
tenors = [0.25, 0.5, 1, 2, 3, 5, 7, 10, 20, 30]
for t in tenors:
    date = calendar.advance(today, ql.Period(int(t * 12), ql.Months))
    zero = curve.zeroRate(date, ql.Actual365Fixed(), ql.Continuous).rate()
    discount = curve.discount(date)
    print(f"  {t:5.2f}Y: Zero={zero:.4%}  DF={discount:.6f}")
```

## Options Pricing

### Black-Scholes (European Options)

```python
import QuantLib as ql

today = ql.Date(15, ql.March, 2024)
ql.Settings.instance().evaluationDate = today

# Option parameters
spot_price = 150.0
strike_price = 155.0
maturity_date = ql.Date(20, ql.September, 2024)
volatility = 0.25       # 25% implied vol
risk_free_rate = 0.05   # 5%
dividend_yield = 0.01   # 1%

# Market data handles
spot_handle = ql.QuoteHandle(ql.SimpleQuote(spot_price))
vol_handle = ql.BlackVolTermStructureHandle(
    ql.BlackConstantVol(today, ql.NullCalendar(), volatility, ql.Actual365Fixed())
)
rate_handle = ql.YieldTermStructureHandle(
    ql.FlatForward(today, risk_free_rate, ql.Actual365Fixed())
)
dividend_handle = ql.YieldTermStructureHandle(
    ql.FlatForward(today, dividend_yield, ql.Actual365Fixed())
)

# BSM process
bsm_process = ql.BlackScholesMertonProcess(
    spot_handle, dividend_handle, rate_handle, vol_handle
)

# European call option
payoff = ql.PlainVanillaPayoff(ql.Option.Call, strike_price)
exercise = ql.EuropeanExercise(maturity_date)
option = ql.VanillaOption(payoff, exercise)

# Analytic Black-Scholes engine
option.setPricingEngine(ql.AnalyticEuropeanEngine(bsm_process))

print(f"Option Price: ${option.NPV():.4f}")
print(f"Delta: {option.delta():.4f}")
print(f"Gamma: {option.gamma():.4f}")
print(f"Theta: {option.theta():.4f}")
print(f"Vega:  {option.vega():.4f}")
print(f"Rho:   {option.rho():.4f}")
```

### Binomial Tree (American Options)

```python
# American put option (can exercise early)
payoff = ql.PlainVanillaPayoff(ql.Option.Put, strike_price)
exercise = ql.AmericanExercise(today, maturity_date)
american_option = ql.VanillaOption(payoff, exercise)

# Binomial engine (Cox-Ross-Rubinstein)
steps = 200
american_option.setPricingEngine(
    ql.BinomialVanillaEngine(bsm_process, "crr", steps)
)

print(f"American Put Price: ${american_option.NPV():.4f}")
print(f"Delta: {american_option.delta():.4f}")

# Compare with European put to see early exercise premium
euro_put_payoff = ql.PlainVanillaPayoff(ql.Option.Put, strike_price)
euro_put_exercise = ql.EuropeanExercise(maturity_date)
euro_put = ql.VanillaOption(euro_put_payoff, euro_put_exercise)
euro_put.setPricingEngine(ql.AnalyticEuropeanEngine(bsm_process))

early_exercise_premium = american_option.NPV() - euro_put.NPV()
print(f"Early Exercise Premium: ${early_exercise_premium:.4f}")
```

### Monte Carlo Options Pricing

```python
# Monte Carlo engine for European option
mc_engine = ql.MCEuropeanEngine(
    bsm_process,
    "pseudorandom",       # RNG type
    timeSteps=100,
    requiredSamples=100_000,
    seed=42,
)

# Re-use the European call from earlier
option_mc = ql.VanillaOption(
    ql.PlainVanillaPayoff(ql.Option.Call, strike_price),
    ql.EuropeanExercise(maturity_date),
)
option_mc.setPricingEngine(mc_engine)

print(f"MC Price: ${option_mc.NPV():.4f}")
print(f"MC Error: ${option_mc.errorEstimate():.4f}")
```

## Interest Rate Models

### Short-Rate Models

```python
# Hull-White one-factor model
hw_model = ql.HullWhite(rate_handle, a=0.1, sigma=0.01)

# Calibrate to swaptions (simplified example)
# In practice, you would calibrate to market swaption volatilities

# Use the model for pricing
hw_engine = ql.TreeSwaptionEngine(hw_model, 100)
```

## Day Count Conventions Reference

| Convention         | QuantLib Class                          | Common Use              |
| ------------------ | --------------------------------------- | ----------------------- |
| Actual/360         | `ql.Actual360()`                        | Money market, LIBOR     |
| Actual/365 Fixed   | `ql.Actual365Fixed()`                   | UK gilts, general       |
| 30/360 Bond Basis  | `ql.Thirty360(ql.Thirty360.BondBasis)`  | US corporate bonds      |
| Actual/Actual ISDA | `ql.ActualActual(ql.ActualActual.ISDA)` | US Treasury bonds       |
| Actual/Actual Bond | `ql.ActualActual(ql.ActualActual.Bond)` | Bond yield calculations |

## Common Pitfalls

1. **Evaluation date**: Always set `ql.Settings.instance().evaluationDate` before any calculation. QuantLib does not automatically use the system date.

2. **Handle vs object**: QuantLib uses a Handle pattern (similar to smart pointers). Wrap quotes and term structures in their appropriate Handle types, or you will get type errors.

3. **Calendar mismatches**: Using the wrong calendar causes settlement date errors. US Treasuries use `ql.UnitedStates(ql.UnitedStates.GovernmentBond)`, while US equities use `ql.UnitedStates(ql.UnitedStates.NYSE)`.

4. **Day count matters**: Using `Actual360` instead of `Actual365Fixed` for annualization changes results. Always match the day count convention to the instrument type.

5. **Memory management**: QuantLib's Python bindings wrap C++ objects. Some objects hold references to others (e.g., engines reference processes). Keep all objects alive for the duration of calculations.

## Cross-References

- See **[numpy-financial](numpy-financial.md)** for simpler TVM calculations (NPV, IRR, PMT)
- See **[pandas-finance](pandas-finance.md)** for preparing market data inputs
- See **[01-financial-instruments/fixed-income](../01-financial-instruments/SKILL.md)** for bond fundamentals
- See **[01-financial-instruments/derivatives](../01-financial-instruments/SKILL.md)** for options concepts (Greeks, put-call parity)
- See **[04-risk-management](../04-risk-management/SKILL.md)** for using duration/convexity in portfolio risk management
