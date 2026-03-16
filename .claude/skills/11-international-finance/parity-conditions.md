# Parity Conditions in International Finance

The parity conditions are a set of theoretical relationships linking exchange rates, interest rates, and inflation rates across countries. They form the theoretical backbone of international finance and are essential for understanding how currencies are priced and how international investment decisions should be made.

## Overview: How the Parities Connect

All five parity conditions are interconnected. If any four hold, the fifth must hold as well.

- **PPP** links exchange rates to inflation differentials
- **IRP** links forward rates to interest rate differentials
- **IFE** links expected exchange rate changes to interest rate differentials
- **Forward parity** links forward rates to expected future spot rates
- **Real interest rate parity** links real interest rates across countries

## 1. Purchasing Power Parity (PPP)

### Absolute PPP (Law of One Price)

Identical goods should cost the same in all countries when expressed in a common currency.

> **S = P_d / P_f**

Where:
- S = Spot exchange rate (domestic currency per unit of foreign currency)
- P_d = Domestic price level
- P_f = Foreign price level

**The Big Mac Index**: The Economist's Big Mac Index is a lighthearted test of absolute PPP. If a Big Mac costs $5.69 in the US and 4.65 euros in the Eurozone, PPP implies USD/EUR = 5.69/4.65 = 1.22. If the actual rate is 1.10, the euro is "undervalued" by about 10% according to Big Mac PPP.

### Relative PPP

The rate of change in the exchange rate should equal the inflation differential between two countries.

> **E(S_1)/S_0 = (1 + pi_d) / (1 + pi_f)**

Or approximately:

> **%Delta S = pi_d - pi_f**

Where pi_d and pi_f are domestic and foreign inflation rates.

### Worked Example: Relative PPP

US inflation: 3% per year. Eurozone inflation: 1% per year. Current USD/EUR spot rate: 1.10.

Expected exchange rate in one year:
E(S_1) = 1.10 x (1.03/1.01) = 1.10 x 1.0198 = **1.1218**

The dollar is expected to depreciate from 1.10 to 1.12 per euro because US inflation is higher. This makes sense: the dollar buys less at home due to higher inflation, so it should also buy less abroad.

Approximate: %Delta S = 3% - 1% = 2% depreciation of USD.

### Empirical Evidence

- **Short run**: PPP performs poorly. Exchange rates are far more volatile than price levels, and deviations from PPP can persist for years.
- **Long run**: PPP holds reasonably well over horizons of 10-20 years. Real exchange rates tend to revert to PPP-implied values, but slowly (half-life of deviations is 3-5 years).

## 2. Interest Rate Parity (IRP)

### Covered Interest Rate Parity (CIP)

The return on a domestic investment must equal the return on a foreign investment when the exchange rate risk is hedged with a forward contract.

> **F/S = (1 + r_d) / (1 + r_f)**

Or equivalently:

> **F = S x (1 + r_d) / (1 + r_f)**

Where:
- F = Forward exchange rate
- S = Spot exchange rate
- r_d = Domestic interest rate (for the period)
- r_f = Foreign interest rate (for the period)

### Worked Example: Covered Interest Rate Parity

Spot rate (USD/GBP): 1.2800
US 1-year interest rate: 5.0%
UK 1-year interest rate: 4.0%

F = 1.2800 x (1.05/1.04) = 1.2800 x 1.00962 = **1.2923**

The forward rate of 1.2923 means the GBP is at a forward premium (it costs more dollars to buy a pound forward than spot). This reflects the fact that US rates are higher than UK rates.

**Why CIP must hold**: If CIP did not hold, risk-free arbitrage would be possible (covered interest arbitrage). Borrow in the low-rate currency, invest in the high-rate currency, and hedge the exchange rate risk with a forward contract.

### Covered Interest Arbitrage Example

Suppose the actual forward rate quoted in the market is 1.2850 (below the CIP-implied 1.2923).

**Arbitrage strategy**:
1. Borrow $1,280,000 at 5% in the US (owe $1,344,000 in 1 year)
2. Convert to GBP at spot: $1,280,000 / 1.2800 = GBP 1,000,000
3. Invest in UK at 4%: receive GBP 1,040,000 in 1 year
4. Sell GBP forward at 1.2850: GBP 1,040,000 x 1.2850 = $1,336,400
5. Repay US loan: $1,344,000
6. **Loss** = $1,336,400 - $1,344,000 = -$7,600

Wait -- in this case, the arbitrage goes the other direction. You would borrow in GBP, invest in USD, and sell USD forward for GBP. The point is: market forces quickly close any gap.

### Uncovered Interest Rate Parity (UIP)

The expected change in the exchange rate equals the interest rate differential. Unlike CIP, UIP involves exchange rate risk (no forward hedge).

> **E(S_1)/S_0 = (1 + r_d) / (1 + r_f)**

Or approximately:

> **E(%Delta S) = r_d - r_f**

**Empirical evidence**: UIP is frequently violated. The "forward premium puzzle" shows that high-interest-rate currencies tend to appreciate rather than depreciate (contrary to UIP). This is the basis of the "carry trade" strategy.

## 3. International Fisher Effect (IFE)

Combines the Fisher equation (nominal rate = real rate + expected inflation) across countries. If real interest rates are equal across countries, then:

> **E(S_1)/S_0 = (1 + r_d) / (1 + r_f)**

This is identical in form to UIP. The IFE says interest rate differentials reflect expected inflation differentials (Fisher) and expected exchange rate changes (PPP).

**Logic chain**: Higher nominal rates --> higher expected inflation --> expected currency depreciation.

### Worked Example: International Fisher Effect

Japanese 1-year rate: 0.5%. US 1-year rate: 5.0%. Current USD/JPY rate: 150.

IFE predicts the yen will appreciate (dollar will depreciate) by approximately:
%Delta S = 0.5% - 5.0% = -4.5% (in USD/JPY terms, the rate should fall)

Expected rate: 150 x (1.005/1.05) = 150 x 0.9571 = **143.6**

The higher US rate reflects higher US inflation expectations; PPP predicts the dollar will depreciate to offset this inflation advantage.

## 4. Forward Parity (Unbiased Forward Rate)

The forward rate is an unbiased predictor of the future spot rate.

> **F = E(S_1)**

If forward parity holds, the forward rate does not systematically over- or under-predict the future spot rate.

**Empirical evidence**: Like UIP, forward parity is frequently violated. The forward rate is a poor predictor of the future spot rate, though it is unbiased in the sense that forecast errors are approximately zero on average over long periods.

## 5. Real Exchange Rate and Real Interest Rate Parity

### Real Exchange Rate

> **q = S x (P_f / P_d)**

Where:
- q = Real exchange rate
- S = Nominal spot rate
- P_f = Foreign price level
- P_d = Domestic price level

If PPP holds, q = 1 (or constant). Changes in q reflect deviations from PPP and measure changes in international competitiveness.

- q increases: Real depreciation of domestic currency (domestic goods become cheaper relative to foreign goods -- more competitive)
- q decreases: Real appreciation (domestic goods become more expensive -- less competitive)

### Real Interest Rate Parity

Real interest rates should be equal across countries if capital is perfectly mobile.

> **r_d - pi_d = r_f - pi_f**

Or: real rate at home = real rate abroad.

## Summary: The Five Parities

| Parity | Links | Formula (approximate) | Empirical |
|--------|-------|----------------------|-----------|
| PPP | Exchange rates and inflation | %Delta S = pi_d - pi_f | Good long-run, poor short-run |
| CIP | Forward rate and interest rates | (F-S)/S = r_d - r_f | Holds well (arbitrage-enforced) |
| UIP | Expected spot change and interest rates | E(%Delta S) = r_d - r_f | Frequently violated |
| IFE | Exchange rates and interest rates | E(%Delta S) = r_d - r_f | Mixed evidence |
| Forward parity | Forward rate and expected spot rate | F = E(S_1) | Poor short-run predictor |

## Common Mistakes

1. **Confusing CIP and UIP**: CIP uses the forward rate and is virtually always satisfied (arbitrage-enforced). UIP uses expected spot rates and is frequently violated. They look similar mathematically but are fundamentally different.

2. **Applying PPP to short-run forecasting**: PPP is a long-run equilibrium concept. Using it to forecast exchange rates over weeks or months will produce poor results.

3. **Forgetting to annualize rates**: If you have a 90-day interest rate, convert it to the same horizon as the forward contract. Do not mix annual rates with 90-day forward rates.

4. **Assuming the carry trade is risk-free**: Borrowing in low-rate currencies and investing in high-rate currencies exploits UIP violations, but carries the risk of sudden exchange rate moves (carry trade unwinds, as seen in the 2008 crisis and the 2024 yen carry trade unwind).

5. **Treating PPP-implied rates as arbitrage bounds**: Goods are not costlessly tradable (unlike financial assets), so PPP deviations do not create arbitrage opportunities.

## Practice Problems

**Problem 1**: The USD/EUR spot rate is 1.08. US inflation is 4% and Eurozone inflation is 2%. What does relative PPP predict for the exchange rate in one year?

**Problem 2**: The GBP/USD spot rate is 0.7800 (pounds per dollar). The UK 6-month interest rate is 4.5% (annualized) and the US 6-month rate is 5.0% (annualized). Calculate the 6-month forward rate implied by CIP.

**Problem 3**: If Japanese interest rates are 0.25% and Australian interest rates are 4.5%, what does UIP predict for the AUD/JPY exchange rate over the next year? Why might a carry trader bet against this prediction?

## Key References

- Eun, C.S. & Resnick, B.G. (2021). *International Financial Management*, 9th ed., McGraw-Hill. Chapters 6-7.
- Shapiro, A.C. (2019). *Multinational Financial Management*, 11th ed., Wiley. Chapters 4-5.
- Taylor, M.P. & Taylor, A.M. (2004). "The Purchasing Power Parity Debate." *Journal of Economic Perspectives*, 18(4), 135-158.
- Froot, K.A. & Thaler, R.H. (1990). "Anomalies: Foreign Exchange." *Journal of Economic Perspectives*, 4(3), 179-192.
