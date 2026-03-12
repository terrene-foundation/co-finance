---
name: hedging-strategies
description: "Hedging strategies reference covering delta hedging, protective puts, covered calls, collar strategies, portfolio insurance, cross-hedging, and basis risk. Use when asking about 'hedging', 'delta hedging', 'protective put', 'covered call', 'collar strategy', 'portfolio insurance', 'cross hedging', 'basis risk', 'hedge ratio', 'options hedging', 'tail risk hedging', or 'downside protection'."
---

# Hedging Strategies

Reference for hedging strategies using derivatives with Python implementations and examples.

## Delta Hedging

Delta hedging neutralizes the directional exposure of an options position by holding a offsetting position in the underlying.

### Concept

For a portfolio with delta = D, hold -D shares of the underlying to make the portfolio delta-neutral (insensitive to small price moves).

```python
import numpy as np
from scipy.stats import norm

def black_scholes_delta(S: float, K: float, T: float, r: float,
                         sigma: float, option_type: str = "call") -> float:
    """Calculate Black-Scholes delta."""
    if T <= 0:
        if option_type == "call":
            return 1.0 if S > K else 0.0
        return -1.0 if S < K else 0.0

    d1 = (np.log(S / K) + (r + sigma**2 / 2) * T) / (sigma * np.sqrt(T))

    if option_type == "call":
        return norm.cdf(d1)
    return norm.cdf(d1) - 1

def delta_hedge_position(option_delta: float, n_contracts: int,
                          contract_multiplier: int = 100) -> dict:
    """Calculate the shares needed for a delta-neutral hedge.

    Args:
        option_delta: Delta per option
        n_contracts: Number of option contracts
        contract_multiplier: Shares per contract (usually 100)

    Returns:
        Hedge details
    """
    total_delta = option_delta * n_contracts * contract_multiplier
    shares_needed = -total_delta  # Negative to offset

    return {
        "option_delta": option_delta,
        "total_delta": total_delta,
        "shares_to_hedge": shares_needed,
        "direction": "sell" if shares_needed < 0 else "buy",
        "shares_abs": abs(shares_needed),
    }

# Example: Short 10 call contracts, delta = 0.55
hedge = delta_hedge_position(0.55, -10)
print(f"Total position delta: {hedge['total_delta']:.0f}")
print(f"Hedge: {hedge['direction']} {hedge['shares_abs']:.0f} shares")
```

### Dynamic Delta Hedging Simulation

```python
def simulate_delta_hedge(S0: float, K: float, T: float, r: float,
                          sigma: float, n_steps: int = 252,
                          option_type: str = "call") -> dict:
    """Simulate dynamic delta hedging over the life of an option.

    Args:
        S0: Initial stock price
        K: Strike price
        T: Time to expiration (years)
        r: Risk-free rate
        sigma: Volatility
        n_steps: Number of rebalancing steps

    Returns:
        Hedging simulation results
    """
    dt = T / n_steps
    np.random.seed(42)

    # Simulate stock price path (GBM)
    prices = [S0]
    for _ in range(n_steps):
        dW = np.random.normal(0, np.sqrt(dt))
        S_new = prices[-1] * np.exp((r - 0.5 * sigma**2) * dt + sigma * dW)
        prices.append(S_new)

    prices = np.array(prices)

    # Track hedging P&L
    cash = 0
    shares_held = 0
    hedge_costs = []

    for i in range(n_steps):
        t_remaining = T - i * dt
        delta = black_scholes_delta(prices[i], K, t_remaining, r, sigma, option_type)

        # Rebalance to delta
        shares_to_trade = delta * 100 - shares_held  # 1 contract = 100 shares
        trade_cost = shares_to_trade * prices[i]

        cash -= trade_cost  # Buy shares costs money
        shares_held += shares_to_trade
        hedge_costs.append(abs(trade_cost))

    # Final settlement
    final_price = prices[-1]
    if option_type == "call":
        option_payoff = max(final_price - K, 0) * 100
    else:
        option_payoff = max(K - final_price, 0) * 100

    portfolio_value = shares_held * final_price + cash
    hedge_pnl = portfolio_value - option_payoff

    return {
        "initial_price": S0,
        "final_price": final_price,
        "option_payoff": option_payoff,
        "portfolio_value": portfolio_value,
        "hedge_pnl": hedge_pnl,
        "total_trading_cost": sum(hedge_costs),
        "n_rebalances": n_steps,
        "prices": prices,
    }

sim = simulate_delta_hedge(100, 100, 0.5, 0.05, 0.20)
print(f"Delta Hedge Simulation:")
print(f"  Final stock price: ${sim['final_price']:.2f}")
print(f"  Option payoff: ${sim['option_payoff']:.2f}")
print(f"  Hedge P&L: ${sim['hedge_pnl']:.2f}")
```

## Protective Put

Buying a put option to protect a long stock position against downside risk. Effectively creates a floor on losses.

```python
def protective_put(stock_price: float, put_strike: float,
                    put_premium: float, n_shares: int = 100) -> dict:
    """Analyze a protective put strategy.

    Args:
        stock_price: Current stock price
        put_strike: Put option strike price
        put_premium: Put option premium per share
        n_shares: Number of shares held

    Returns:
        Strategy analysis
    """
    total_cost = put_premium * n_shares
    breakeven = stock_price + put_premium
    max_loss = (stock_price - put_strike + put_premium) * n_shares

    # Calculate P&L at various prices
    price_range = np.linspace(stock_price * 0.7, stock_price * 1.3, 100)
    stock_pnl = (price_range - stock_price) * n_shares
    put_pnl = np.maximum(put_strike - price_range, 0) * n_shares - total_cost
    combined_pnl = stock_pnl + put_pnl

    return {
        "cost_of_protection": total_cost,
        "breakeven": breakeven,
        "max_loss": max_loss,
        "max_loss_price": put_strike,
        "price_range": price_range,
        "stock_pnl": stock_pnl,
        "put_pnl": put_pnl,
        "combined_pnl": combined_pnl,
    }

pp = protective_put(stock_price=150, put_strike=140, put_premium=3.50)
print(f"Protective Put Analysis:")
print(f"  Cost of protection: ${pp['cost_of_protection']:,.2f}")
print(f"  Breakeven: ${pp['breakeven']:.2f}")
print(f"  Maximum loss: ${pp['max_loss']:,.2f} (at ${pp['max_loss_price']:.2f} or below)")
```

## Covered Call

Selling a call option against a long stock position. Generates premium income but caps upside.

```python
def covered_call(stock_price: float, call_strike: float,
                  call_premium: float, n_shares: int = 100) -> dict:
    """Analyze a covered call strategy.

    Args:
        stock_price: Current stock price
        call_strike: Call option strike price
        call_premium: Call option premium received per share
        n_shares: Number of shares

    Returns:
        Strategy analysis
    """
    premium_received = call_premium * n_shares
    breakeven = stock_price - call_premium
    max_profit = (call_strike - stock_price + call_premium) * n_shares

    # If called away: sell at strike + keep premium
    if_called = {
        "stock_pnl": (call_strike - stock_price) * n_shares,
        "premium": premium_received,
        "total": (call_strike - stock_price + call_premium) * n_shares,
        "return": (call_strike - stock_price + call_premium) / stock_price,
    }

    # P&L at various prices
    price_range = np.linspace(stock_price * 0.7, stock_price * 1.3, 100)
    stock_pnl = (price_range - stock_price) * n_shares
    call_pnl = -np.maximum(price_range - call_strike, 0) * n_shares + premium_received
    combined_pnl = stock_pnl + call_pnl

    return {
        "premium_received": premium_received,
        "breakeven": breakeven,
        "max_profit": max_profit,
        "max_profit_price": call_strike,
        "if_called": if_called,
        "price_range": price_range,
        "combined_pnl": combined_pnl,
    }

cc = covered_call(stock_price=150, call_strike=160, call_premium=4.00)
print(f"Covered Call Analysis:")
print(f"  Premium received: ${cc['premium_received']:,.2f}")
print(f"  Breakeven: ${cc['breakeven']:.2f}")
print(f"  Max profit: ${cc['max_profit']:,.2f} (if called at ${cc['max_profit_price']:.2f})")
print(f"  If called return: {cc['if_called']['return']:.1%}")
```

## Collar Strategy

Combines a protective put and a covered call. Limits both downside and upside, often at zero or low net cost.

```python
def collar_strategy(stock_price: float, put_strike: float, put_premium: float,
                     call_strike: float, call_premium: float,
                     n_shares: int = 100) -> dict:
    """Analyze a collar strategy (protective put + covered call).

    Args:
        stock_price: Current stock price
        put_strike: Put strike (floor)
        put_premium: Put premium paid
        call_strike: Call strike (cap)
        call_premium: Call premium received
        n_shares: Number of shares

    Returns:
        Strategy analysis
    """
    net_premium = (call_premium - put_premium) * n_shares  # Positive = credit
    max_loss = (stock_price - put_strike - (call_premium - put_premium)) * n_shares
    max_profit = (call_strike - stock_price + (call_premium - put_premium)) * n_shares

    price_range = np.linspace(stock_price * 0.6, stock_price * 1.4, 100)
    stock_pnl = (price_range - stock_price) * n_shares
    put_pnl = np.maximum(put_strike - price_range, 0) * n_shares - put_premium * n_shares
    call_pnl = -np.maximum(price_range - call_strike, 0) * n_shares + call_premium * n_shares
    combined_pnl = stock_pnl + put_pnl + call_pnl

    return {
        "net_premium": net_premium,
        "net_premium_label": "credit" if net_premium >= 0 else "debit",
        "max_loss": abs(max_loss),
        "max_profit": max_profit,
        "floor": put_strike,
        "cap": call_strike,
        "price_range": price_range,
        "combined_pnl": combined_pnl,
    }

collar = collar_strategy(
    stock_price=150, put_strike=140, put_premium=3.50,
    call_strike=160, call_premium=4.00,
)
print(f"Collar Strategy:")
print(f"  Net premium: ${collar['net_premium']:,.2f} ({collar['net_premium_label']})")
print(f"  Floor: ${collar['floor']:.2f}")
print(f"  Cap: ${collar['cap']:.2f}")
print(f"  Max loss: ${collar['max_loss']:,.2f}")
print(f"  Max profit: ${collar['max_profit']:,.2f}")
```

## Portfolio Insurance

Using index puts to protect an entire portfolio against market decline.

```python
def portfolio_insurance(portfolio_value: float, beta: float,
                         index_level: float, put_strike_pct: float,
                         put_premium_pct: float) -> dict:
    """Calculate portfolio insurance using index puts.

    Args:
        portfolio_value: Total portfolio value
        beta: Portfolio beta vs the index
        index_level: Current index level
        put_strike_pct: Put strike as percentage of index (e.g., 0.95 for 5% OTM)
        put_premium_pct: Put cost as percentage of notional

    Returns:
        Insurance strategy details
    """
    # Number of puts needed (adjust for beta)
    contract_multiplier = 100  # SPX options multiplier
    notional_per_contract = index_level * contract_multiplier
    n_contracts = int(np.ceil(
        portfolio_value * beta / notional_per_contract
    ))

    put_strike = index_level * put_strike_pct
    premium_per_contract = index_level * put_premium_pct * contract_multiplier
    total_cost = n_contracts * premium_per_contract
    cost_as_pct = total_cost / portfolio_value

    # Protection level
    unhedged_loss_at_strike = (1 - put_strike_pct) * beta * portfolio_value
    hedged_max_loss = unhedged_loss_at_strike + total_cost

    return {
        "contracts_needed": n_contracts,
        "put_strike": put_strike,
        "premium_per_contract": premium_per_contract,
        "total_cost": total_cost,
        "cost_as_pct_portfolio": cost_as_pct,
        "protection_starts_at": f"{(1 - put_strike_pct) * 100:.0f}% index decline",
        "max_portfolio_loss": hedged_max_loss,
        "max_loss_as_pct": hedged_max_loss / portfolio_value,
    }

insurance = portfolio_insurance(
    portfolio_value=5_000_000,
    beta=1.1,
    index_level=5000,
    put_strike_pct=0.95,
    put_premium_pct=0.02,
)
print(f"Portfolio Insurance:")
print(f"  Contracts needed: {insurance['contracts_needed']}")
print(f"  Put strike: {insurance['put_strike']:.0f}")
print(f"  Total cost: ${insurance['total_cost']:,.0f} ({insurance['cost_as_pct_portfolio']:.2%} of portfolio)")
print(f"  Protection starts at: {insurance['protection_starts_at']}")
```

## Cross-Hedging and Basis Risk

Cross-hedging uses a correlated but different instrument to hedge. Basis risk is the risk that the hedge instrument and the exposure do not move perfectly together.

```python
import yfinance as yf
import statsmodels.api as sm

def optimal_hedge_ratio(asset_returns: pd.Series,
                         hedge_returns: pd.Series) -> dict:
    """Calculate the optimal hedge ratio using OLS regression.

    The optimal hedge ratio minimizes the variance of the hedged position.

    h* = Cov(asset, hedge) / Var(hedge) = beta from regression

    Args:
        asset_returns: Returns of the asset to hedge
        hedge_returns: Returns of the hedging instrument

    Returns:
        Optimal hedge ratio and basis risk metrics
    """
    import pandas as pd

    # Align series
    common = asset_returns.index.intersection(hedge_returns.index)
    y = asset_returns.loc[common]
    X = sm.add_constant(hedge_returns.loc[common])

    model = sm.OLS(y, X).fit()

    hedge_ratio = model.params.iloc[1]
    r_squared = model.rsquared

    # Hedging effectiveness
    unhedged_var = y.var()
    hedged_returns = y - hedge_ratio * hedge_returns.loc[common]
    hedged_var = hedged_returns.var()
    variance_reduction = 1 - hedged_var / unhedged_var

    return {
        "hedge_ratio": hedge_ratio,
        "r_squared": r_squared,
        "variance_reduction": variance_reduction,
        "unhedged_volatility": np.sqrt(unhedged_var * 252),
        "hedged_volatility": np.sqrt(hedged_var * 252),
        "basis_risk": np.sqrt((1 - r_squared) * unhedged_var * 252),
    }

# Example: Hedge XOM (Exxon) with USO (oil ETF)
data = yf.download(["XOM", "USO"], period="3y", auto_adjust=True)["Close"]
returns = data.pct_change().dropna()

hedge = optimal_hedge_ratio(returns["XOM"], returns["USO"])
print(f"Optimal Hedge Ratio: {hedge['hedge_ratio']:.3f}")
print(f"R-squared: {hedge['r_squared']:.3f}")
print(f"Variance reduction: {hedge['variance_reduction']:.1%}")
print(f"Unhedged vol: {hedge['unhedged_volatility']:.2%}")
print(f"Hedged vol: {hedge['hedged_volatility']:.2%}")
```

## Strategy Comparison

```python
def compare_hedging_strategies(stock_price: float, n_shares: int = 100) -> None:
    """Compare different hedging strategies at a glance."""
    strategies = {
        "No Hedge": {"max_loss": "Unlimited", "max_gain": "Unlimited", "cost": "$0"},
        "Protective Put": {"max_loss": "Limited (to put strike)", "max_gain": "Unlimited", "cost": "Put premium"},
        "Covered Call": {"max_loss": "Unlimited (reduced by premium)", "max_gain": "Capped at strike", "cost": "Receive premium"},
        "Collar": {"max_loss": "Limited (to put strike)", "max_gain": "Capped at call strike", "cost": "Low/zero net"},
        "Portfolio Insurance": {"max_loss": "Limited below strike", "max_gain": "Unlimited", "cost": "Put premium"},
    }

    print(f"{'Strategy':<20} {'Max Loss':<30} {'Max Gain':<25} {'Cost':<20}")
    print("-" * 95)
    for name, s in strategies.items():
        print(f"{name:<20} {s['max_loss']:<30} {s['max_gain']:<25} {s['cost']:<20}")

compare_hedging_strategies(150)
```

## Common Pitfalls

1. **Over-hedging**: Hedging too much of the portfolio can eliminate upside potential. Consider partial hedges that reduce risk without capping all gains.

2. **Ignoring hedging costs**: Options premiums, bid-ask spreads, and rebalancing costs can significantly erode returns. The cost of protection must be weighed against the probability and magnitude of the risk being hedged.

3. **Rolling hedge costs**: Protection that expires worthless is often considered a waste. Budget for ongoing hedge costs as an insurance premium rather than a one-time expense.

4. **Basis risk in cross-hedging**: Using an imperfect hedge (e.g., hedging individual stock risk with index puts) leaves residual idiosyncratic risk. The lower the correlation, the higher the basis risk.

5. **Delta hedge rebalancing frequency**: Too infrequent rebalancing leaves the portfolio unhedged between adjustments. Too frequent rebalancing incurs excessive transaction costs. The optimal frequency depends on gamma exposure and transaction costs.

6. **Forgetting about gamma risk**: A delta-neutral position is only hedged for small moves. Large moves (high gamma) require immediate rebalancing. Short gamma positions (sold options) are particularly dangerous.

## Cross-References

- **[options-greeks](options-greeks.md)** - Understanding Greeks for hedge design
- **[var-methods](var-methods.md)** - Measuring the risk being hedged
- **[stress-testing](stress-testing.md)** - Testing hedge effectiveness under stress
- **[01-financial-instruments/derivatives](../01-financial-instruments/derivatives.md)** - Options and futures fundamentals
- **[03-portfolio-theory/portfolio-optimization](../03-portfolio-theory/portfolio-optimization.md)** - Incorporating hedges into portfolio optimization
