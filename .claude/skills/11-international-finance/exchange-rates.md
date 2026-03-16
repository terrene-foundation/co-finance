# Exchange Rates

How currencies are quoted, traded, and determined. Exchange rates are the prices at which one currency can be exchanged for another -- they are fundamental to international trade, investment, and finance.

## Key Definitions

**Exchange rate**: The price of one currency expressed in terms of another. For example, USD/EUR = 1.10 means 1 euro costs 1.10 US dollars.

**Base currency**: The currency being purchased (denominator). **Quote currency**: The currency being used to pay (numerator).

**Important convention note**: Currency quotation conventions vary. "USD/EUR = 1.10" can mean different things depending on the convention used. In this guide, we use the convention where the quote tells you how much of the first currency you need to buy one unit of the second currency (i.e., price of the second currency in units of the first). Always clarify the convention when working with exchange rates.

## Spot vs. Forward Rates

### Spot Rate

The exchange rate for immediate delivery (settlement typically in 2 business days, T+2).

### Forward Rate

The exchange rate agreed today for delivery at a future date (30 days, 90 days, 1 year, etc.). Forward rates are determined by interest rate differentials, not by expectations of future spot rates (see parity conditions).

> **Forward Premium/Discount = (F - S) / S x (360 / n) x 100%**

Where:
- F = Forward rate
- S = Spot rate
- n = Number of days to maturity

If the forward rate is higher than the spot rate, the currency is trading at a **forward premium**. If lower, at a **forward discount**.

### Worked Example: Forward Premium

Spot rate (USD/GBP): 1.2800 (it costs $1.28 to buy one pound)
90-day forward rate: 1.2850

Forward premium = (1.2850 - 1.2800) / 1.2800 x (360/90) x 100%
= (0.0050 / 1.2800) x 4 x 100%
= 0.00391 x 4 x 100%
= **1.56% annualized**

The GBP is trading at a 1.56% annualized forward premium against the USD. This implies US interest rates are higher than UK rates (covered interest rate parity).

## Cross Rates

When you know the exchange rate of two currencies against a third (common) currency, you can calculate the rate between them.

> **Cross Rate: A/B = (A/C) / (B/C)**

### Worked Example: Cross Rate

Given:
- USD/EUR = 1.10 (1 euro costs $1.10)
- USD/GBP = 1.28 (1 pound costs $1.28)

GBP/EUR = USD/EUR / USD/GBP = 1.10 / 1.28 = **0.8594**

This means 1 euro costs 0.8594 pounds, or equivalently, 1 pound buys 1/0.8594 = 1.1636 euros.

### Triangular Arbitrage

If the actual market cross rate differs from the calculated cross rate, a risk-free profit opportunity exists (triangular arbitrage). In practice, these opportunities are fleeting and are quickly eliminated by high-frequency traders.

**Example**: If the calculated EUR/GBP rate is 0.8594 but the market quotes 0.8700, you could:
1. Start with USD
2. Buy EUR at USD/EUR = 1.10
3. Sell EUR for GBP at the overpriced EUR/GBP = 0.8700
4. Sell GBP for USD at USD/GBP = 1.28
5. If the round-trip yields more than you started with, you have an arbitrage profit.

## Bid-Ask Spread

Dealers quote two prices:
- **Bid**: The price at which the dealer will buy the base currency (you sell at the bid)
- **Ask (Offer)**: The price at which the dealer will sell the base currency (you buy at the ask)

> **Spread = Ask - Bid**

> **Percentage Spread = (Ask - Bid) / Ask x 100%**

The spread is the dealer's profit margin and reflects:
- **Liquidity**: Major pairs (EUR/USD, USD/JPY) have tiny spreads (1-3 pips); exotic pairs have wider spreads
- **Volatility**: Higher volatility widens spreads
- **Transaction size**: Very large or very small transactions may face wider spreads

### Worked Example: Bid-Ask

A dealer quotes USD/EUR: Bid 1.0980 / Ask 1.1020

- If you want to **buy euros** (sell dollars): You pay the ask price of 1.1020 (1 euro costs you $1.1020)
- If you want to **sell euros** (buy dollars): You receive the bid price of 1.0980 ($1.0980 per euro you sell)

Spread = 1.1020 - 1.0980 = $0.0040 = 40 pips
Percentage spread = 0.0040 / 1.1020 = **0.36%**

## Exchange Rate Determination

### Short Run: Financial Market Factors

- **Interest rate differentials**: Higher interest rates attract foreign capital, increasing demand for the currency
- **Risk appetite**: In "risk-on" environments, capital flows to emerging markets; in "risk-off," it flows to safe havens (USD, CHF, JPY)
- **Central bank intervention**: Direct buying/selling of currencies by central banks
- **Speculation**: Traders positioning based on expected future movements

### Medium Run: Monetary Models

The **Monetary Approach** argues exchange rates are determined by relative money supplies and real income levels:

> **S = f(M_d/M_f, Y_d/Y_f, i_d/i_f)**

An increase in domestic money supply (relative to foreign) depreciates the domestic currency.

### Long Run: Purchasing Power Parity (PPP)

In the long run, exchange rates should adjust so that identical goods cost the same in different countries (see [parity-conditions.md](parity-conditions.md)).

### The Asset Market Approach

Exchange rates are asset prices determined by the supply and demand for financial assets denominated in different currencies. The key factors are:
- Expected returns on domestic vs. foreign assets
- Relative risk of holding assets in different currencies
- Expected future exchange rate changes

## Exchange Rate Regimes

| Regime | Description | Examples |
|--------|-------------|---------|
| **Free float** | Market-determined; central bank does not intervene | USD, EUR, GBP, JPY |
| **Managed float** | Primarily market-determined, but central bank occasionally intervenes | Many emerging markets |
| **Crawling peg** | Currency is pegged but the peg is adjusted periodically | China (historically) |
| **Fixed peg** | Currency is pegged to another currency at a fixed rate | Hong Kong dollar pegged to USD |
| **Currency board** | Fixed peg backed by foreign reserves equal to the domestic monetary base | Hong Kong |
| **Dollarization** | Country adopts another country's currency | Ecuador, El Salvador (USD) |
| **Monetary union** | Multiple countries share a single currency | Eurozone (EUR) |

## Common Mistakes

1. **Confusing direct and indirect quotation**: A "direct quote" in the US is USD per unit of foreign currency (e.g., 1.10 USD/EUR). An "indirect quote" is foreign currency per USD (e.g., 0.91 EUR/USD). Always clarify.

2. **Using the wrong side of the bid-ask**: When you want to buy the base currency, use the ask. When you want to sell, use the bid. Getting this backwards is costly.

3. **Assuming forward rates predict future spot rates**: The forward rate reflects interest rate differentials, not market expectations of where the spot rate will be. These are different things.

4. **Ignoring transaction costs in arbitrage calculations**: Triangular arbitrage requires that the profit exceeds all transaction costs, including spreads and fees.

5. **Treating exchange rate changes symmetrically**: If a currency depreciates by 10%, it takes an 11.1% appreciation to return to the original level. Percentage changes are not symmetric.

## Practice Problems

**Problem 1**: The USD/EUR spot rate is 1.0850 and the USD/JPY spot rate is 149.50. Calculate the JPY/EUR cross rate (yen per euro).

**Problem 2**: The USD/AUD spot rate is 0.6500 and the 180-day forward rate is 0.6550. Is the AUD at a forward premium or discount? Calculate the annualized forward premium/discount.

**Problem 3**: A dealer quotes USD/CHF: Bid 0.8820 / Ask 0.8860. You need to convert $100,000 to Swiss francs and then back to dollars. How much do you lose to the bid-ask spread?

## Key References

- Eun, C.S. & Resnick, B.G. (2021). *International Financial Management*, 9th ed., McGraw-Hill. Chapters 5-6.
- Shapiro, A.C. (2019). *Multinational Financial Management*, 11th ed., Wiley. Chapters 2-4.
- Krugman, P., Obstfeld, M. & Melitz, M. (2022). *International Economics: Theory and Policy*, 12th ed., Pearson. Chapters 14-15.
