---
name: options-greeks
description: "Options Greeks reference covering delta, gamma, theta, vega, rho with intuition, calculation, visualization, Greek-based risk management, gamma scalping, and vega-neutral portfolios. Use when asking about 'options Greeks', 'delta', 'gamma', 'theta', 'vega', 'rho', 'gamma scalping', 'vega neutral', 'Greek risk management', 'options risk', 'theta decay', 'gamma exposure', 'delta neutral', 'Greek visualization', or 'Black-Scholes Greeks'."
---

# Options Greeks for Risk Management

Deep reference for options Greeks including intuition, analytical derivation, visualization, and risk management applications.

## Greek Summary

| Greek | Symbol | Measures  | First-Order Effect                |
| ----- | ------ | --------- | --------------------------------- |
| Delta | D      | dV/dS     | Price sensitivity to underlying   |
| Gamma | G      | d2V/dS2   | Rate of change of delta           |
| Theta | Q      | dV/dt     | Time decay per day                |
| Vega  | v      | dV/dsigma | Sensitivity to implied volatility |
| Rho   | r      | dV/dr     | Sensitivity to interest rates     |

## Analytical Greeks (Black-Scholes)

```python
import numpy as np
from scipy.stats import norm
import matplotlib.pyplot as plt

class BSOption:
    """Black-Scholes option with full Greek calculations."""

    def __init__(self, S: float, K: float, T: float, r: float,
                 sigma: float, option_type: str = "call"):
        self.S = S
        self.K = K
        self.T = max(T, 1e-10)  # Avoid division by zero
        self.r = r
        self.sigma = sigma
        self.option_type = option_type.lower()

        # Pre-compute d1, d2
        self.d1 = (np.log(S / K) + (r + sigma**2 / 2) * self.T) / (sigma * np.sqrt(self.T))
        self.d2 = self.d1 - sigma * np.sqrt(self.T)

    def price(self) -> float:
        if self.option_type == "call":
            return self.S * norm.cdf(self.d1) - self.K * np.exp(-self.r * self.T) * norm.cdf(self.d2)
        return self.K * np.exp(-self.r * self.T) * norm.cdf(-self.d2) - self.S * norm.cdf(-self.d1)

    def delta(self) -> float:
        if self.option_type == "call":
            return norm.cdf(self.d1)
        return norm.cdf(self.d1) - 1

    def gamma(self) -> float:
        return norm.pdf(self.d1) / (self.S * self.sigma * np.sqrt(self.T))

    def theta(self) -> float:
        """Theta per calendar day."""
        common = -(self.S * norm.pdf(self.d1) * self.sigma) / (2 * np.sqrt(self.T))
        if self.option_type == "call":
            return (common - self.r * self.K * np.exp(-self.r * self.T) * norm.cdf(self.d2)) / 365
        return (common + self.r * self.K * np.exp(-self.r * self.T) * norm.cdf(-self.d2)) / 365

    def vega(self) -> float:
        """Vega per 1% change in implied volatility."""
        return self.S * norm.pdf(self.d1) * np.sqrt(self.T) / 100

    def rho(self) -> float:
        """Rho per 1% change in interest rate."""
        if self.option_type == "call":
            return self.K * self.T * np.exp(-self.r * self.T) * norm.cdf(self.d2) / 100
        return -self.K * self.T * np.exp(-self.r * self.T) * norm.cdf(-self.d2) / 100

    def all_greeks(self) -> dict:
        return {
            "price": self.price(),
            "delta": self.delta(),
            "gamma": self.gamma(),
            "theta": self.theta(),
            "vega": self.vega(),
            "rho": self.rho(),
        }

# Example
opt = BSOption(S=100, K=100, T=0.25, r=0.05, sigma=0.20, option_type="call")
greeks = opt.all_greeks()
for name, value in greeks.items():
    print(f"{name:>6}: {value:+.4f}")
```

## Greek Intuition

### Delta

- **Call delta**: 0 (deep OTM) to 1 (deep ITM). ATM calls have delta near 0.5.
- **Put delta**: -1 (deep ITM) to 0 (deep OTM). ATM puts have delta near -0.5.
- **Hedge interpretation**: Delta tells you how many shares to hold to hedge one option.
- **Probability proxy**: Delta roughly approximates the risk-neutral probability of finishing ITM.

### Gamma

- **Highest ATM**: Gamma peaks when the option is at-the-money.
- **Increases near expiration**: ATM gamma spikes as expiration approaches.
- **Long gamma**: Bought options benefit from large moves in either direction.
- **Short gamma**: Sold options lose from large moves (risk of being "gamma squeezed").

### Theta

- **Always negative for long options**: Time decay erodes option value.
- **Accelerates near expiration**: Theta increases as time to expiration decreases.
- **Highest ATM**: ATM options lose the most time value per day.
- **Theta-gamma tradeoff**: Long gamma = negative theta. Short gamma = positive theta.

### Vega

- **Highest ATM and long-dated**: Sensitivity to volatility is greatest for ATM options with more time.
- **All options have positive vega**: Both calls and puts benefit from higher volatility.
- **Decreases near expiration**: Short-dated options are less sensitive to vol changes.

## Greek Visualization

```python
def plot_greeks_vs_spot(K: float, T: float, r: float, sigma: float):
    """Plot all Greeks as a function of the underlying price."""
    spot_range = np.linspace(K * 0.7, K * 1.3, 200)

    fig, axes = plt.subplots(2, 3, figsize=(16, 10))

    for opt_type, color in [("call", "blue"), ("put", "red")]:
        prices, deltas, gammas, thetas, vegas, rhos = [], [], [], [], [], []

        for S in spot_range:
            opt = BSOption(S, K, T, r, sigma, opt_type)
            prices.append(opt.price())
            deltas.append(opt.delta())
            gammas.append(opt.gamma())
            thetas.append(opt.theta())
            vegas.append(opt.vega())
            rhos.append(opt.rho())

        label = opt_type.capitalize()
        axes[0, 0].plot(spot_range, prices, color=color, label=label)
        axes[0, 1].plot(spot_range, deltas, color=color, label=label)
        axes[0, 2].plot(spot_range, gammas, color=color, label=label)
        axes[1, 0].plot(spot_range, thetas, color=color, label=label)
        axes[1, 1].plot(spot_range, vegas, color=color, label=label)
        axes[1, 2].plot(spot_range, rhos, color=color, label=label)

    titles = ["Price", "Delta", "Gamma", "Theta (daily)", "Vega (per 1%)", "Rho (per 1%)"]
    for ax, title in zip(axes.flat, titles):
        ax.set_title(title)
        ax.axvline(x=K, color="gray", linestyle="--", alpha=0.3)
        ax.legend()
        ax.grid(True, alpha=0.3)
        ax.set_xlabel("Spot Price")

    fig.suptitle(f"Options Greeks (K={K}, T={T:.2f}y, sigma={sigma:.0%})", fontsize=14)
    plt.tight_layout()
    return fig, axes

fig, axes = plot_greeks_vs_spot(K=100, T=0.25, r=0.05, sigma=0.20)
plt.savefig("greeks_vs_spot.png", dpi=150)
plt.close()
```

### Greeks vs Time to Expiration

```python
def plot_greeks_vs_time(S: float, K: float, r: float, sigma: float):
    """Plot Greeks as time to expiration decreases."""
    time_range = np.linspace(1.0, 0.01, 200)  # 1 year to near-expiry

    fig, axes = plt.subplots(2, 2, figsize=(12, 10))

    for moneyness, ls in [(S, "-"), (S * 0.95, "--"), (S * 1.05, ":")]:
        deltas, gammas, thetas, vegas = [], [], [], []

        for T in time_range:
            opt = BSOption(moneyness, K, T, r, sigma, "call")
            deltas.append(opt.delta())
            gammas.append(opt.gamma())
            thetas.append(opt.theta())
            vegas.append(opt.vega())

        label = f"S={moneyness:.0f}"
        axes[0, 0].plot(time_range, deltas, ls, label=label)
        axes[0, 1].plot(time_range, gammas, ls, label=label)
        axes[1, 0].plot(time_range, thetas, ls, label=label)
        axes[1, 1].plot(time_range, vegas, ls, label=label)

    for ax, title in zip(axes.flat, ["Delta", "Gamma", "Theta", "Vega"]):
        ax.set_title(title)
        ax.set_xlabel("Time to Expiration (years)")
        ax.legend()
        ax.grid(True, alpha=0.3)
        ax.invert_xaxis()

    plt.suptitle(f"Greeks vs Time (K={K}, sigma={sigma:.0%})", fontsize=14)
    plt.tight_layout()
    return fig, axes
```

## Greek-Based Risk Management

### Portfolio Greeks

```python
def portfolio_greeks(positions: list) -> dict:
    """Calculate aggregate Greeks for a portfolio of options.

    Args:
        positions: List of dicts with 'option' (BSOption), 'quantity',
                  and 'multiplier' (typically 100)

    Returns:
        Aggregate portfolio Greeks
    """
    total = {"delta": 0, "gamma": 0, "theta": 0, "vega": 0, "rho": 0}

    for pos in positions:
        opt = pos["option"]
        qty = pos["quantity"] * pos.get("multiplier", 100)

        total["delta"] += opt.delta() * qty
        total["gamma"] += opt.gamma() * qty
        total["theta"] += opt.theta() * qty
        total["vega"] += opt.vega() * qty
        total["rho"] += opt.rho() * qty

    return total

# Example: Portfolio with mixed positions
positions = [
    {"option": BSOption(100, 100, 0.25, 0.05, 0.20, "call"), "quantity": 10},    # Long 10 ATM calls
    {"option": BSOption(100, 105, 0.25, 0.05, 0.20, "call"), "quantity": -5},     # Short 5 OTM calls
    {"option": BSOption(100, 95, 0.25, 0.05, 0.20, "put"), "quantity": 5},        # Long 5 OTM puts
]

port_greeks = portfolio_greeks(positions)
print("Portfolio Greeks:")
for name, value in port_greeks.items():
    print(f"  {name:>6}: {value:+.2f}")
```

### Gamma Scalping

Gamma scalping profits from delta-hedging a long gamma position. The strategy earns money from large price moves while paying theta.

```python
def gamma_scalping_pnl(gamma: float, spot_move: float,
                        theta_daily: float, days: int = 1) -> dict:
    """Estimate gamma scalping P&L.

    Gamma P&L = 0.5 * gamma * (dS)^2
    Theta cost = theta * days

    Args:
        gamma: Portfolio gamma (per share)
        spot_move: Expected daily spot move (in dollars)
        theta_daily: Daily theta cost (negative for long gamma)
        days: Number of days

    Returns:
        P&L breakdown
    """
    gamma_pnl = 0.5 * gamma * spot_move**2 * days
    theta_cost = theta_daily * days  # Already negative

    return {
        "gamma_pnl": gamma_pnl,
        "theta_cost": theta_cost,
        "net_pnl": gamma_pnl + theta_cost,
        "breakeven_move": np.sqrt(-2 * theta_daily / gamma) if gamma > 0 else np.nan,
    }

# Long gamma position
result = gamma_scalping_pnl(gamma=50, spot_move=2.0, theta_daily=-150)
print(f"Gamma P&L: ${result['gamma_pnl']:,.0f}")
print(f"Theta cost: ${result['theta_cost']:,.0f}")
print(f"Net P&L: ${result['net_pnl']:,.0f}")
print(f"Breakeven move: ${result['breakeven_move']:.2f}")
```

### Vega-Neutral Portfolio

A vega-neutral portfolio is insensitive to changes in implied volatility.

```python
def vega_neutral_hedge(current_vega: float, hedge_option: BSOption,
                        hedge_multiplier: int = 100) -> dict:
    """Calculate positions needed to make a portfolio vega-neutral.

    Args:
        current_vega: Current portfolio vega
        hedge_option: Option to use for hedging
        hedge_multiplier: Contract multiplier

    Returns:
        Number of contracts to trade
    """
    hedge_vega_per_contract = hedge_option.vega() * hedge_multiplier

    if abs(hedge_vega_per_contract) < 1e-10:
        return {"error": "Hedge option has near-zero vega"}

    contracts_needed = -current_vega / hedge_vega_per_contract

    # After vega hedge, delta may change
    delta_impact = contracts_needed * hedge_option.delta() * hedge_multiplier

    return {
        "contracts_needed": contracts_needed,
        "round_contracts": int(round(contracts_needed)),
        "delta_impact": delta_impact,
        "action": "buy" if contracts_needed > 0 else "sell",
        "residual_vega": current_vega + contracts_needed * hedge_vega_per_contract,
    }

hedge_opt = BSOption(100, 100, 0.5, 0.05, 0.20, "call")
result = vega_neutral_hedge(current_vega=500, hedge_option=hedge_opt)
print(f"Vega-neutral hedge: {result['action']} {abs(result['round_contracts'])} contracts")
print(f"Delta impact: {result['delta_impact']:+.1f} shares")
```

## Numerical Greeks

When analytical formulas are not available (e.g., exotic options), use finite differences.

```python
def numerical_greeks(pricing_func, S: float, K: float, T: float,
                      r: float, sigma: float, option_type: str = "call",
                      dS: float = 0.01, dT: float = 1/365,
                      dsigma: float = 0.001, dr: float = 0.0001) -> dict:
    """Calculate Greeks numerically using central finite differences.

    Args:
        pricing_func: Function(S, K, T, r, sigma, option_type) -> price
        S, K, T, r, sigma: Option parameters
        option_type: 'call' or 'put'
        dS, dT, dsigma, dr: Perturbation sizes

    Returns:
        Numerically estimated Greeks
    """
    price = pricing_func(S, K, T, r, sigma, option_type)

    # Delta: dV/dS
    delta = (pricing_func(S + dS, K, T, r, sigma, option_type) -
             pricing_func(S - dS, K, T, r, sigma, option_type)) / (2 * dS)

    # Gamma: d2V/dS2
    gamma = (pricing_func(S + dS, K, T, r, sigma, option_type) -
             2 * price +
             pricing_func(S - dS, K, T, r, sigma, option_type)) / (dS**2)

    # Theta: -dV/dT (per day)
    theta = -(pricing_func(S, K, T + dT, r, sigma, option_type) -
              pricing_func(S, K, T - dT, r, sigma, option_type)) / (2 * dT) / 365

    # Vega: dV/dsigma (per 1%)
    vega = (pricing_func(S, K, T, r, sigma + dsigma, option_type) -
            pricing_func(S, K, T, r, sigma - dsigma, option_type)) / (2 * dsigma) / 100

    # Rho: dV/dr (per 1%)
    rho = (pricing_func(S, K, T, r + dr, sigma, option_type) -
           pricing_func(S, K, T, r - dr, sigma, option_type)) / (2 * dr) / 100

    return {
        "delta": delta,
        "gamma": gamma,
        "theta": theta,
        "vega": vega,
        "rho": rho,
    }

# Verify numerical vs analytical
def bs_price(S, K, T, r, sigma, opt_type):
    return BSOption(S, K, T, r, sigma, opt_type).price()

num_greeks = numerical_greeks(bs_price, 100, 100, 0.25, 0.05, 0.20)
ana_greeks = BSOption(100, 100, 0.25, 0.05, 0.20).all_greeks()

print(f"{'Greek':<8} {'Analytical':>12} {'Numerical':>12} {'Diff':>12}")
for g in ["delta", "gamma", "theta", "vega", "rho"]:
    print(f"{g:<8} {ana_greeks[g]:>12.6f} {num_greeks[g]:>12.6f} "
          f"{abs(ana_greeks[g] - num_greeks[g]):>12.2e}")
```

## Common Pitfalls

1. **Ignoring gamma near expiration**: ATM gamma explodes near expiration. A delta-neutral position can become wildly directional with a small price move. This is the most dangerous period for short gamma positions.

2. **Treating vega as constant across strikes**: Implied volatility varies by strike (the volatility smile/skew). Each option in a portfolio has different implied vol and different vega exposure. Aggregate vega is an approximation.

3. **Confusing daily and annual theta**: Theta is often quoted in different units. Always verify whether the value is per day or per year before making trading decisions.

4. **Hedging with stale Greeks**: Greeks change continuously. Using yesterday's delta for today's hedge introduces tracking error. Recalculate Greeks before rebalancing.

5. **Forgetting second-order effects**: A delta-neutral, vega-neutral portfolio may still have gamma, vanna (d-delta/d-vol), or volga (d-vega/d-vol) exposure. These second-order effects matter in volatile markets.

6. **Not accounting for discrete dividends**: Black-Scholes Greeks assume continuous dividends. For stocks with discrete dividends, delta can jump on ex-dividend dates, and early exercise of American calls may be optimal.

## Cross-References

- **[hedging-strategies](hedging-strategies.md)** - Applying Greeks to hedging
- **[var-methods](var-methods.md)** - Greek-based VaR for options portfolios
- **[01-financial-instruments/derivatives](../01-financial-instruments/derivatives.md)** - Options pricing and Black-Scholes model
- **[02-market-analysis/technical-indicators](../02-market-analysis/technical-indicators.md)** - Combining Greeks with technical analysis
- **[05-financial-data-apis/yfinance-guide](../05-financial-data-apis/yfinance-guide.md)** - Retrieving options data
