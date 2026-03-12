---
name: derivatives
description: "Derivatives reference covering options, futures, swaps, forwards, Greeks, put-call parity, and Black-Scholes pricing. Use when asking about 'options', 'calls', 'puts', 'futures', 'swaps', 'forwards', 'derivatives', 'Black-Scholes', 'Greeks', 'delta', 'gamma', 'theta', 'vega', 'rho', 'put-call parity', 'American options', 'European options', 'options pricing', or 'strike price'."
---

# Derivative Instruments

Comprehensive reference for derivatives including options, futures, swaps, and forwards with pricing models and Greek calculations.

## Options

### Fundamentals

An option gives the holder the right (but not the obligation) to buy or sell an underlying asset at a specified price (strike) on or before a specified date (expiration).

| Property         | Call Option                   | Put Option                   |
| ---------------- | ----------------------------- | ---------------------------- |
| Right            | Buy the underlying            | Sell the underlying          |
| Buyer pays       | Premium                       | Premium                      |
| Max loss (buyer) | Premium paid                  | Premium paid                 |
| Max gain (buyer) | Unlimited                     | Strike - Premium             |
| Obligation       | Seller must sell if exercised | Seller must buy if exercised |

### American vs European Options

| Feature        | American                      | European                  |
| -------------- | ----------------------------- | ------------------------- |
| Exercise       | Any time before expiration    | Only at expiration        |
| Premium        | >= European equivalent        | Baseline                  |
| Where traded   | Most US equity options        | Index options, FX options |
| Early exercise | Optimal sometimes (dividends) | Not applicable            |

### Intrinsic and Time Value

```python
def option_intrinsic_value(spot: float, strike: float, option_type: str) -> float:
    """Calculate intrinsic value of an option."""
    if option_type.lower() == "call":
        return max(spot - strike, 0)
    elif option_type.lower() == "put":
        return max(strike - spot, 0)
    raise ValueError("option_type must be 'call' or 'put'")

def option_time_value(premium: float, intrinsic: float) -> float:
    """Time value = Premium - Intrinsic value."""
    return premium - intrinsic

# Example
spot = 150.0
strike = 145.0
call_premium = 8.50

intrinsic = option_intrinsic_value(spot, strike, "call")
time_val = option_time_value(call_premium, intrinsic)
print(f"Intrinsic value: ${intrinsic:.2f}")  # $5.00
print(f"Time value: ${time_val:.2f}")         # $3.50
```

### Options Payoff Diagrams

```python
import numpy as np
import matplotlib.pyplot as plt

def plot_option_payoff(strike: float, premium: float, option_type: str,
                       position: str = "long"):
    """Plot payoff diagram for an option position."""
    spot_range = np.linspace(strike * 0.5, strike * 1.5, 200)

    if option_type.lower() == "call":
        payoff = np.maximum(spot_range - strike, 0)
    else:
        payoff = np.maximum(strike - spot_range, 0)

    if position.lower() == "long":
        profit = payoff - premium
    else:
        profit = premium - payoff

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(spot_range, profit, 'b-', linewidth=2)
    ax.axhline(y=0, color='black', linewidth=0.5)
    ax.axvline(x=strike, color='gray', linestyle='--', alpha=0.5, label=f'Strike: ${strike}')
    ax.fill_between(spot_range, profit, 0, where=(profit > 0), alpha=0.1, color='green')
    ax.fill_between(spot_range, profit, 0, where=(profit < 0), alpha=0.1, color='red')
    ax.set_xlabel("Underlying Price at Expiration")
    ax.set_ylabel("Profit/Loss")
    ax.set_title(f"{position.capitalize()} {option_type.capitalize()} (K=${strike}, Premium=${premium})")
    ax.legend()
    ax.grid(True, alpha=0.3)
    return fig, ax

fig, ax = plot_option_payoff(strike=100, premium=5, option_type="call", position="long")
plt.tight_layout()
plt.savefig("call_payoff.png", dpi=150)
plt.close()
```

## Black-Scholes Model

### Formula

For a European call option:

- C = S*N(d1) - K*e^(-rT)\*N(d2)
- P = K*e^(-rT)*N(-d2) - S\*N(-d1)

Where:

- d1 = [ln(S/K) + (r + sigma^2/2)*T] / (sigma\*sqrt(T))
- d2 = d1 - sigma\*sqrt(T)

```python
import numpy as np
from scipy.stats import norm

def black_scholes(S: float, K: float, T: float, r: float, sigma: float,
                  option_type: str = "call") -> float:
    """Calculate Black-Scholes option price.

    Args:
        S: Current stock price
        K: Strike price
        T: Time to expiration in years
        r: Risk-free interest rate (annual, as decimal)
        sigma: Volatility (annual, as decimal)
        option_type: 'call' or 'put'

    Returns:
        Option price
    """
    if T <= 0:
        # At expiration, return intrinsic value
        if option_type.lower() == "call":
            return max(S - K, 0)
        return max(K - S, 0)

    d1 = (np.log(S / K) + (r + sigma**2 / 2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)

    if option_type.lower() == "call":
        return S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
    elif option_type.lower() == "put":
        return K * np.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)
    else:
        raise ValueError("option_type must be 'call' or 'put'")

# Example: Stock at $100, strike $100, 1 year, 5% rate, 20% volatility
call_price = black_scholes(S=100, K=100, T=1.0, r=0.05, sigma=0.20, option_type="call")
put_price = black_scholes(S=100, K=100, T=1.0, r=0.05, sigma=0.20, option_type="put")
print(f"Call price: ${call_price:.2f}")  # ~$10.45
print(f"Put price:  ${put_price:.2f}")   # ~$5.57
```

### Implied Volatility

```python
from scipy.optimize import brentq

def implied_volatility(market_price: float, S: float, K: float, T: float,
                        r: float, option_type: str = "call") -> float:
    """Calculate implied volatility using Brent's method.

    Args:
        market_price: Observed market price of the option
        S, K, T, r: Black-Scholes parameters
        option_type: 'call' or 'put'

    Returns:
        Implied volatility (annual, as decimal)
    """
    def objective(sigma):
        return black_scholes(S, K, T, r, sigma, option_type) - market_price

    try:
        iv = brentq(objective, 1e-6, 5.0, xtol=1e-8)
        return iv
    except ValueError:
        return np.nan  # No solution found

# Example: Call trading at $12.00
iv = implied_volatility(market_price=12.00, S=100, K=100, T=1.0, r=0.05, option_type="call")
print(f"Implied Volatility: {iv:.2%}")
```

## The Greeks

### Analytical Greeks from Black-Scholes

```python
def bs_greeks(S: float, K: float, T: float, r: float, sigma: float,
              option_type: str = "call") -> dict:
    """Calculate all major Greeks for a European option.

    Returns:
        Dictionary with delta, gamma, theta, vega, rho
    """
    if T <= 0:
        intrinsic = max(S - K, 0) if option_type == "call" else max(K - S, 0)
        return {"delta": 1.0 if intrinsic > 0 else 0.0, "gamma": 0.0,
                "theta": 0.0, "vega": 0.0, "rho": 0.0}

    d1 = (np.log(S / K) + (r + sigma**2 / 2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)

    # Common terms
    n_d1 = norm.pdf(d1)  # Standard normal PDF at d1
    sqrt_T = np.sqrt(T)
    exp_rT = np.exp(-r * T)

    if option_type.lower() == "call":
        delta = norm.cdf(d1)
        theta = (-(S * n_d1 * sigma) / (2 * sqrt_T)
                 - r * K * exp_rT * norm.cdf(d2)) / 365  # Per day
        rho = K * T * exp_rT * norm.cdf(d2) / 100  # Per 1% rate change
    else:
        delta = norm.cdf(d1) - 1
        theta = (-(S * n_d1 * sigma) / (2 * sqrt_T)
                 + r * K * exp_rT * norm.cdf(-d2)) / 365
        rho = -K * T * exp_rT * norm.cdf(-d2) / 100

    gamma = n_d1 / (S * sigma * sqrt_T)
    vega = S * n_d1 * sqrt_T / 100  # Per 1% vol change

    return {
        "delta": delta,
        "gamma": gamma,
        "theta": theta,   # Daily
        "vega": vega,      # Per 1% vol change
        "rho": rho,        # Per 1% rate change
    }

# Example
greeks = bs_greeks(S=100, K=100, T=0.5, r=0.05, sigma=0.20, option_type="call")
for name, value in greeks.items():
    print(f"{name.capitalize():>6}: {value:+.4f}")
```

### Greek Interpretations

| Greek | Measures                        | Range (Call)     | Range (Put)      | Key Insight                                    |
| ----- | ------------------------------- | ---------------- | ---------------- | ---------------------------------------------- |
| Delta | Price sensitivity to underlying | 0 to +1          | -1 to 0          | Also approximates probability of finishing ITM |
| Gamma | Rate of delta change            | Always positive  | Always positive  | Highest for ATM options near expiration        |
| Theta | Time decay per day              | Usually negative | Usually negative | Accelerates as expiration approaches           |
| Vega  | Sensitivity to volatility       | Always positive  | Always positive  | Highest for ATM, long-dated options            |
| Rho   | Sensitivity to interest rates   | Positive         | Negative         | Usually smallest Greek for short-dated options |

## Put-Call Parity

For European options on a non-dividend-paying stock:

**C - P = S - K \* e^(-rT)**

```python
def verify_put_call_parity(S: float, K: float, T: float, r: float, sigma: float):
    """Verify put-call parity for European options."""
    call = black_scholes(S, K, T, r, sigma, "call")
    put = black_scholes(S, K, T, r, sigma, "put")

    lhs = call - put
    rhs = S - K * np.exp(-r * T)

    print(f"Call - Put     = {lhs:.4f}")
    print(f"S - K*e^(-rT)  = {rhs:.4f}")
    print(f"Difference     = {abs(lhs - rhs):.2e}")
    print(f"Parity holds: {np.isclose(lhs, rhs)}")

verify_put_call_parity(S=100, K=100, T=1.0, r=0.05, sigma=0.20)
```

## Futures Contracts

### Key Concepts

A futures contract obligates the buyer to purchase (and the seller to sell) an asset at a predetermined price on a specific future date.

| Feature           | Futures                 | Forwards                |
| ----------------- | ----------------------- | ----------------------- |
| Trading venue     | Exchange-traded         | Over-the-counter (OTC)  |
| Standardization   | Standardized            | Customizable            |
| Counterparty risk | Clearinghouse guarantee | Direct counterparty     |
| Margin            | Daily mark-to-market    | Typically at settlement |
| Liquidity         | Generally high          | Varies                  |

### Futures Pricing

```python
def futures_price(spot: float, risk_free_rate: float, time_to_expiry: float,
                  storage_cost: float = 0.0, convenience_yield: float = 0.0,
                  dividend_yield: float = 0.0) -> float:
    """Calculate theoretical futures price (cost of carry model).

    Args:
        spot: Current spot price
        risk_free_rate: Annual risk-free rate
        time_to_expiry: Time to expiry in years
        storage_cost: Annual storage cost as percentage of spot
        convenience_yield: Annual convenience yield as percentage
        dividend_yield: Annual continuous dividend yield

    Returns:
        Theoretical futures price
    """
    carry = risk_free_rate + storage_cost - convenience_yield - dividend_yield
    return spot * np.exp(carry * time_to_expiry)

# Stock index future (S&P 500)
f_price = futures_price(spot=5000, risk_free_rate=0.05,
                         time_to_expiry=0.25, dividend_yield=0.015)
print(f"Index futures price: ${f_price:.2f}")

# Commodity future with storage costs
f_commodity = futures_price(spot=80, risk_free_rate=0.05,
                             time_to_expiry=0.5, storage_cost=0.02,
                             convenience_yield=0.01)
print(f"Commodity futures price: ${f_commodity:.2f}")
```

## Swaps

### Interest Rate Swap

An agreement to exchange fixed-rate payments for floating-rate payments.

```python
import numpy as np

def price_interest_rate_swap(notional: float, fixed_rate: float,
                              floating_rates: list, discount_factors: list,
                              payment_frequency: float = 0.5) -> float:
    """Price a plain vanilla interest rate swap (from fixed payer's perspective).

    Args:
        notional: Notional principal
        fixed_rate: Fixed rate per period
        floating_rates: List of floating rates for each period
        discount_factors: Discount factor for each payment date
        payment_frequency: Payment interval in years

    Returns:
        Swap value from fixed payer's perspective
    """
    n_periods = len(floating_rates)

    fixed_leg = sum(
        notional * fixed_rate * payment_frequency * df
        for df in discount_factors
    )

    floating_leg = sum(
        notional * fr * payment_frequency * df
        for fr, df in zip(floating_rates, discount_factors)
    )

    # Fixed payer receives floating, pays fixed
    return floating_leg - fixed_leg

# Example: 2-year swap, semi-annual, $10M notional
notional = 10_000_000
fixed_rate = 0.04
floating_rates = [0.035, 0.038, 0.042, 0.045]  # SOFR projections
discount_factors = [0.98, 0.96, 0.94, 0.92]

swap_value = price_interest_rate_swap(notional, fixed_rate, floating_rates,
                                       discount_factors)
print(f"Swap value (fixed payer): ${swap_value:,.2f}")
```

## Forwards

A forward is a customized, OTC contract to buy/sell an asset at a future date.

```python
def forward_price(spot: float, risk_free_rate: float,
                   time_to_delivery: float) -> float:
    """Calculate forward price under continuous compounding."""
    return spot * np.exp(risk_free_rate * time_to_delivery)

def forward_value(forward_price_orig: float, current_forward_price: float,
                   risk_free_rate: float, time_remaining: float) -> float:
    """Value of an existing long forward position."""
    return (current_forward_price - forward_price_orig) * np.exp(-risk_free_rate * time_remaining)

# Enter forward at $100 spot, 5% rate, 1 year delivery
fwd_price = forward_price(100, 0.05, 1.0)
print(f"Forward price: ${fwd_price:.2f}")

# 6 months later, spot is $110
new_fwd = forward_price(110, 0.05, 0.5)
value = forward_value(fwd_price, new_fwd, 0.05, 0.5)
print(f"Forward value after 6mo: ${value:.2f}")
```

## Common Pitfalls

1. **Using Black-Scholes for American options**: Black-Scholes assumes European exercise. For American options, especially puts or calls on dividend-paying stocks, use binomial trees or numerical methods.

2. **Ignoring dividends in options pricing**: Discrete dividends reduce call values and increase put values. Use the adjusted Black-Scholes or subtract the PV of dividends from the spot price.

3. **Confusing delta with probability of exercise**: Delta approximates the risk-neutral probability, not the real-world probability. Real-world probability of finishing in-the-money is different.

4. **Treating Greeks as constants**: Greeks change continuously with the underlying price, time, and volatility. They must be recomputed frequently for hedging.

5. **Forgetting futures margin**: Futures require daily margin settlement. A position can be liquidated on a margin call even if the eventual outcome would have been profitable.

6. **Mixing up forward/futures prices**: For most practical purposes they are similar, but with stochastic interest rates, futures prices differ from forward prices due to the daily settlement correlation effect.

## Cross-References

- **[equities](equities.md)** - Underlying assets for equity derivatives
- **[04-risk-management/options-greeks](../04-risk-management/options-greeks.md)** - Advanced Greek-based risk management
- **[04-risk-management/hedging-strategies](../04-risk-management/hedging-strategies.md)** - Hedging with derivatives
- **[02-market-analysis/technical-indicators](../02-market-analysis/technical-indicators.md)** - Technical analysis of derivatives markets
- **[05-financial-data-apis/yfinance-guide](../05-financial-data-apis/yfinance-guide.md)** - Retrieving options chain data
