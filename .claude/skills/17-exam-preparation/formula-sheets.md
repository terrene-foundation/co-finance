# Creating Effective Formula Sheets

A formula sheet is not a miniature textbook. It is a quick-reference tool designed for rapid lookup during an exam (if allowed) or as a study consolidation exercise. The act of creating a formula sheet -- selecting, organizing, and connecting formulas -- is itself one of the most effective study techniques.

## Why Formula Sheet Creation Matters

Even if your exam does not permit a formula sheet, the process of creating one forces you to:
1. Identify the most important formulas (prioritization)
2. Understand how formulas relate to each other (connections)
3. Recognize which formulas you know well and which you do not (self-assessment)
4. Organize knowledge into a retrievable structure (encoding)

## Principles of Effective Formula Sheets

### 1. Group by Topic, Not by Chapter

Organize formulas by conceptual category, not by the order they appeared in lectures. During an exam, you think "I need a valuation formula," not "I need something from Week 7."

**Good grouping**:
- Time Value of Money
- Bond Valuation
- Stock Valuation
- Risk and Return
- Portfolio Math

### 2. Show Relationships Between Formulas

Formulas do not exist in isolation. Show how they connect.

**Example: TVM family**:
```
PV = FV / (1+r)^n          [single cash flow]
  |
  +--> Annuity PV = PMT x [(1-(1+r)^-n)/r]    [equal payments]
  |       |
  |       +--> Perpetuity PV = PMT/r           [n -> infinity]
  |               |
  |               +--> Growing Perpetuity = PMT/(r-g)   [Gordon Model]
  |
  +--> Growing Annuity PV = PMT x [1/(r-g)] x [1-((1+g)/(1+r))^n]
```

This visual shows that the perpetuity is a special case of the annuity (n goes to infinity), and the Gordon Growth Model is a growing perpetuity.

### 3. Define Every Variable

A formula is useless during an exam if you cannot remember what the variables mean.

**Bad**:
> Sharpe = (Rp - Rf) / sigma_p

**Good**:
> **Sharpe Ratio = (R_p - R_f) / sigma_p**
> R_p = portfolio return, R_f = risk-free rate, sigma_p = portfolio standard deviation
> Higher = better risk-adjusted performance

### 4. Include Units and Sign Conventions

**Example for NPV**:
> NPV = -C_0 + sum of C_t/(1+r)^t
> C_0 is **negative** (cash outflow at time 0)
> r is a **decimal** (10% = 0.10)
> Result in **same currency units** as cash flows

### 5. Add One-Line Intuition

A brief plain-language note helps you remember what the formula does, especially under exam pressure.

**Example**:
> **CAPM: E(R_i) = R_f + beta_i x [E(R_m) - R_f]**
> *"Required return = time value of money + price of systematic risk"*

### 6. Note Common Pitfalls

Flag the most common errors directly on the formula sheet.

**Example**:
> **Gordon Growth Model: P_0 = D_1 / (r - g)**
> WARNING: Use D_1 (next dividend), NOT D_0 (just paid). D_1 = D_0 x (1+g).
> WARNING: r must be > g, otherwise formula is invalid.

## Template: One-Page Finance Formula Sheet

### Time Value of Money
- FV = PV x (1+r)^n
- PV = FV / (1+r)^n
- Annuity PV = PMT x [(1-(1+r)^(-n))/r]
- Annuity FV = PMT x [((1+r)^n - 1)/r]
- Perpetuity PV = PMT/r
- Growing Perpetuity PV = PMT/(r-g), requires r > g
- EAR = (1+r/m)^m - 1

### Bond Valuation
- Bond Price = C x [(1-(1+y)^(-n))/y] + F/(1+y)^n
- Current Yield = Annual Coupon / Price
- Macaulay Duration = sum(t x w_t), where w_t = PV(CF_t)/P
- Modified Duration = D_Mac / (1+y/m)
- Price change: Delta P/P = -D_Mod x Delta y + 0.5 x Convexity x (Delta y)^2

### Stock Valuation
- Gordon Growth: P_0 = D_1/(r-g), where D_1 = D_0 x (1+g)
- Required return: r = D_1/P_0 + g
- P/E = Payout Ratio / (r-g)
- EV = Market Cap + Debt - Cash

### Risk and Return
- E(R) = sum(p_i x R_i)
- Var(R) = sum(p_i x (R_i - E(R))^2)
- sigma = sqrt(Var)
- **CAPM: E(R_i) = R_f + beta_i x (E(R_m) - R_f)**
- beta_i = Cov(R_i,R_m) / Var(R_m)
- Sharpe = (R_p - R_f) / sigma_p

### Portfolio Math (Two Assets)
- E(R_p) = w_A x E(R_A) + w_B x E(R_B)
- sigma_p^2 = w_A^2 x sigma_A^2 + w_B^2 x sigma_B^2 + 2 x w_A x w_B x sigma_A x sigma_B x rho
- beta_p = sum(w_i x beta_i)

### Key Constants
- Trading days per year: 252
- Months per year: 12
- Rule of 72: Doubling time = 72 / r (%)

## Process for Building Your Own Formula Sheet

### Step 1: Gather All Formulas

Go through every chapter, lecture, and problem set. Write down every formula you encountered.

### Step 2: Categorize

Sort into topic groups. Look for formulas that are special cases of others.

### Step 3: Prioritize

For a one-page formula sheet, you cannot include everything. Ask:
- Which formulas appear most frequently on past exams?
- Which formulas can I derive from others? (Include the base formula, leave out the derived one.)
- Which formulas do I struggle to remember? (These need to be on the sheet.)

### Step 4: Add Context

For each formula, add variable definitions, units, common pitfalls, and a one-line intuition.

### Step 5: Test It

Take a practice exam using only your formula sheet. Can you find what you need quickly? Is anything missing? Is anything redundant?

## Common Mistakes

1. **Including too much**: A cluttered formula sheet is as useless as no formula sheet. You need to find the right formula in 10 seconds under exam pressure. White space and clear organization matter.

2. **Copying formulas without understanding them**: If you do not understand a formula, having it on your sheet will not help. You will not know when to use it or what to plug in.

3. **Not including variable definitions**: Under exam stress, you may forget what sigma_p means. Always define every variable.

4. **Missing the connections**: Isolated formulas are harder to recall. Show how they relate to each other.

5. **Not practicing with the formula sheet**: Build your sheet early enough to test it on practice problems. Revise it based on what works.

6. **Forgetting sign conventions and units**: NPV requires negative initial outflows. EAR requires the rate as a decimal. Duration is in years. These details matter.

## Key References

- See [../19-formula-reference/](../19-formula-reference/SKILL.md) for complete formula reference sheets organized by course.
- Brown, P.C., Roediger, H.L. & McDaniel, M.A. (2014). *Make It Stick: The Science of Successful Learning*. Harvard University Press.
- Dunlosky, J. et al. (2013). "Improving Students' Learning With Effective Learning Techniques." *Psychological Science in the Public Interest*, 14(1), 4-58.
