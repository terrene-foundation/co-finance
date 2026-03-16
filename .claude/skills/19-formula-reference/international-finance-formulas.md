# International Finance Formula Reference

## Exchange Rates

| Formula | Expression |
|---------|-----------|
| Cross Rate | A/B = (A/C) / (B/C) |
| Forward Premium/Discount | (F - S) / S x (360/n) x 100% |
| Bid-Ask Spread (%) | (Ask - Bid) / Ask x 100% |
| Real Exchange Rate | q = S x (P_f / P_d) |

Where: F = forward rate, S = spot rate, n = days to maturity.

## Parity Conditions

| Parity | Formula | Approximate Form |
|--------|---------|-----------------|
| Covered Interest Rate Parity | F/S = (1 + r_d) / (1 + r_f) | (F-S)/S = r_d - r_f |
| Uncovered Interest Rate Parity | E(S_1)/S_0 = (1 + r_d) / (1 + r_f) | E(%Delta S) = r_d - r_f |
| Relative PPP | E(S_1)/S_0 = (1 + pi_d) / (1 + pi_f) | %Delta S = pi_d - pi_f |
| International Fisher Effect | E(S_1)/S_0 = (1 + r_d) / (1 + r_f) | Same as UIP |
| Forward Parity | F = E(S_1) | Forward rate = expected spot |
| Fisher Equation | (1+r) = (1+r_real)(1+pi) | r = r_real + pi (approx.) |

Where: r_d = domestic rate, r_f = foreign rate, pi = inflation rate, S = spot rate, F = forward rate.

## Balance of Payments

| Formula | Expression |
|---------|-----------|
| BOP Identity | Current Account + Capital Account + Financial Account = 0 |
| Current Account | Trade Balance + Services + Primary Income + Secondary Income |
| CA from National Accounts | CA = S - I = (S_private - I) + (T - G) |
| Guidotti-Greenspan Rule | Short-term Debt / Reserves < 1.0 |
| Import Cover | Reserves / Monthly Imports (months) |

## Currency Crisis Indicators

| Indicator | Warning Level |
|-----------|--------------|
| CA Deficit / GDP | > 4-5% |
| Real Exchange Rate Appreciation | > 15-20% above trend |
| Short-term Debt / Reserves | > 1.0 |
| M2 / Reserves | Rising rapidly |
| Credit Growth | > 20% per year |

## Key Relationships

- If domestic inflation > foreign inflation --> domestic currency depreciates (PPP)
- If domestic interest rate > foreign interest rate --> domestic currency at forward discount (CIP)
- Impossible Trinity: Cannot have all three: fixed FX + free capital flows + independent monetary policy
