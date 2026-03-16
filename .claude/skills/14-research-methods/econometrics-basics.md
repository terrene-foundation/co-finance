# Econometrics Basics

Econometrics applies statistical methods to economic and financial data. It is the primary tool for testing hypotheses in empirical finance research -- from whether markets are efficient, to whether corporate governance affects firm value, to whether monetary policy moves asset prices.

## Why Econometrics Matters for Finance Students

Finance theories generate testable predictions. CAPM predicts that expected returns are linearly related to beta. The signaling hypothesis predicts that dividend increases cause positive stock price reactions. Econometrics provides the tools to test these predictions with real data.

## Ordinary Least Squares (OLS) Regression

OLS is the foundation of empirical finance. It estimates the linear relationship between a dependent variable (what you are trying to explain) and one or more independent variables (the explanatory factors).

### The Model

> **Y_i = beta_0 + beta_1 x X_(1,i) + beta_2 x X_(2,i) + ... + beta_k x X_(k,i) + epsilon_i**

Where:
- Y_i = Dependent variable for observation i
- X_(j,i) = Independent variable j for observation i
- beta_0 = Intercept (the value of Y when all X's are zero)
- beta_j = Slope coefficient (the change in Y for a one-unit change in X_j, holding all other X's constant)
- epsilon_i = Error term (everything that affects Y but is not captured by the X's)

### OLS Estimator

OLS minimizes the sum of squared residuals:

> **min sum of (Y_i - Y_hat_i)^2**

The resulting coefficient estimates (in matrix notation):

> **beta_hat = (X'X)^(-1) X'Y**

### Worked Example: Single Regression

**Question**: Is firm size (log of market cap) related to stock returns?

Model: R_i = beta_0 + beta_1 x ln(MktCap_i) + epsilon_i

**Regression output**:

| Variable | Coefficient | Std. Error | t-statistic | p-value |
|----------|-------------|------------|-------------|---------|
| Intercept | 0.15 | 0.03 | 5.00 | <0.001 |
| ln(MktCap) | -0.008 | 0.002 | -4.00 | <0.001 |

**Interpretation**: A one-unit increase in log market capitalization is associated with a 0.8 percentage point decrease in returns, controlling for nothing else. This is the well-known "size effect" -- smaller firms tend to have higher average returns.

### OLS Assumptions (Gauss-Markov)

For OLS estimates to be BLUE (Best Linear Unbiased Estimator):

1. **Linearity**: The relationship between Y and X is linear in parameters
2. **No perfect multicollinearity**: No independent variable is a perfect linear function of another
3. **Exogeneity**: E(epsilon | X) = 0 -- the error term is uncorrelated with the regressors
4. **Homoscedasticity**: Var(epsilon | X) = sigma^2 -- constant error variance
5. **No autocorrelation**: Cov(epsilon_i, epsilon_j) = 0 for i != j
6. **Normality** (for inference): Errors are normally distributed (needed for t-tests and F-tests in small samples)

## Hypothesis Testing

### t-Test for Individual Coefficients

Tests whether a single coefficient is statistically different from zero (or another hypothesized value).

> **t = (beta_hat - beta_0) / SE(beta_hat)**

Where beta_0 is the hypothesized value (usually 0) and SE is the standard error of the coefficient.

**Decision rule**: Reject H_0 if |t| > t_critical (approximately 1.96 for 95% confidence with large samples).

### Significance Levels

| Symbol | p-value | Interpretation |
|--------|---------|---------------|
| * | p < 0.10 | Marginally significant |
| ** | p < 0.05 | Significant (conventional threshold) |
| *** | p < 0.01 | Highly significant |

**Important**: Statistical significance does not imply economic significance. A coefficient of 0.0001 can be statistically significant with a large enough sample but economically meaningless.

### F-Test for Joint Significance

Tests whether a group of coefficients are jointly different from zero.

> **F = [(R^2_unrestricted - R^2_restricted) / q] / [(1 - R^2_unrestricted) / (n - k - 1)]**

Where q = number of restrictions, n = observations, k = regressors.

## R-Squared (R^2)

The proportion of variation in Y explained by the model.

> **R^2 = 1 - (SS_residual / SS_total) = 1 - [sum(Y_i - Y_hat_i)^2 / sum(Y_i - Y_bar)^2]**

**Interpretation**: R^2 = 0.25 means the model explains 25% of the variation in Y.

### Adjusted R-Squared

Penalizes for adding more variables (prevents overfitting).

> **R^2_adj = 1 - [(1 - R^2)(n - 1) / (n - k - 1)]**

**Typical R^2 values in finance**:
- Cross-sectional stock returns: 0.02-0.10 (explaining individual stock returns is hard)
- Portfolio returns (Fama-French): 0.70-0.95
- Macro forecasting: 0.30-0.80

**Low R^2 does not mean the model is useless**: In cross-sectional return regressions, even R^2 of 0.03 can be economically significant if the associated trading strategy is profitable.

## Common Econometric Problems in Finance

### Multicollinearity

**Problem**: Two or more independent variables are highly correlated, making it difficult to isolate their individual effects.

**Detection**:
- Variance Inflation Factor (VIF): VIF > 10 indicates serious multicollinearity

> **VIF_j = 1 / (1 - R^2_j)**

where R^2_j is from regressing X_j on all other independent variables.

- High pairwise correlations (> 0.8) in the correlation matrix

**Solutions**: Drop one of the correlated variables, use principal component analysis, or accept wider standard errors if both variables are theoretically important.

### Heteroscedasticity

**Problem**: The variance of the error term is not constant across observations. Common in finance because larger firms tend to have larger (or smaller) residuals.

**Detection**: Breusch-Pagan test or White test.

**Consequence**: OLS coefficients are still unbiased, but standard errors are wrong -- leading to incorrect t-statistics and p-values.

**Solution**: Use heteroscedasticity-robust standard errors (White standard errors):

> **Robust SE = sqrt(diagonal elements of (X'X)^(-1) X' diag(e_i^2) X (X'X)^(-1))**

In practice: always report robust standard errors in finance research.

### Autocorrelation

**Problem**: Error terms are correlated across observations. Common in time-series data (today's stock return is related to yesterday's).

**Detection**: Durbin-Watson test (for first-order autocorrelation).

> **DW = sum from t=2 to T of: (e_t - e_(t-1))^2 / sum from t=1 to T of: e_t^2**

DW near 2: no autocorrelation. DW near 0: positive autocorrelation. DW near 4: negative autocorrelation.

**Solution**: Newey-West standard errors (HAC -- Heteroscedasticity and Autocorrelation Consistent).

### Endogeneity

**Problem**: The independent variable is correlated with the error term, violating the exogeneity assumption. This means your OLS estimate is biased.

**Three sources**:
1. **Omitted variable bias**: A variable that affects both X and Y is not included
2. **Reverse causality**: Y affects X (e.g., does governance affect performance, or does performance affect governance?)
3. **Measurement error**: Your proxy for X contains noise that is correlated with Y

**Solutions**:
- **Instrumental Variables (IV/2SLS)**: Find a variable (instrument) that affects X but does not directly affect Y
- **Fixed Effects**: Control for time-invariant unobserved heterogeneity
- **Difference-in-Differences**: Exploit a natural experiment
- **Regression Discontinuity**: Exploit a cutoff that creates quasi-random assignment

## Event Studies

A core methodology in finance research for measuring the market's reaction to an event.

### The Method

1. **Define the event**: Dividend announcement, merger announcement, regulatory change
2. **Define the event window**: Typically [-1, +1] or [-5, +5] trading days around the event
3. **Estimate expected returns**: Using the market model over an estimation window (e.g., [-250, -20])

> **R_it = alpha_i + beta_i x R_mt + epsilon_it** (estimated over the estimation window)

4. **Calculate abnormal returns**: AR_it = R_it - (alpha_hat + beta_hat x R_mt) over the event window
5. **Aggregate**: Cumulative Abnormal Return (CAR) = sum of AR over the event window
6. **Test significance**: t-statistic = CAR / SE(CAR)

### Worked Example: Event Study

**Event**: Dividend increase announcement on Day 0.

Estimation window: Day -250 to Day -20.
Market model estimates: alpha = 0.0002, beta = 1.1

| Day | Actual Return | Market Return | Expected Return | Abnormal Return |
|-----|--------------|---------------|-----------------|-----------------|
| -1 | 0.8% | 0.3% | 0.05% | 0.75% |
| 0 | 2.1% | 0.1% | 0.13% | 1.97% |
| +1 | 0.5% | -0.2% | -0.20% | 0.70% |

CAR[-1,+1] = 0.75% + 1.97% + 0.70% = **3.42%**

If SE(CAR) = 0.80%, then t = 3.42 / 0.80 = **4.28** (highly significant).

**Interpretation**: The market reacted positively to the dividend increase, with a cumulative abnormal return of 3.42% over three days.

## Common Mistakes

1. **Not using robust standard errors**: In finance, heteroscedasticity is the norm. Always use White (or clustered) standard errors.

2. **Ignoring endogeneity**: Most interesting relationships in finance are endogenous. At minimum, discuss the concern and what you have done to address it.

3. **Confusing statistical and economic significance**: Report both. A coefficient of 0.001 with t = 5.0 is statistically significant but may be economically trivial.

4. **Data mining without correction**: Testing 100 variables and reporting the 5 that are significant will produce false positives. Use Bonferroni correction or out-of-sample testing.

5. **Misinterpreting R-squared**: A low R^2 does not mean the regression is useless. In cross-sectional returns, R^2 of 0.03 can represent substantial economic value.

6. **Choosing the wrong event window**: Too narrow misses the full reaction; too wide includes confounding events. Justify your choice and test robustness with alternative windows.

## Key References

- Wooldridge, J.M. (2020). *Introductory Econometrics: A Modern Approach*, 7th ed., Cengage. Chapters 1-8.
- Brooks, C. (2019). *Introductory Econometrics for Finance*, 4th ed., Cambridge University Press.
- MacKinlay, A.C. (1997). "Event Studies in Economics and Finance." *Journal of Economic Literature*, 35(1), 13-39.
- Angrist, J.D. & Pischke, J.S. (2009). *Mostly Harmless Econometrics*, Princeton University Press.
- Petersen, M.A. (2009). "Estimating Standard Errors in Finance Panel Data Sets: Comparing Approaches." *Review of Financial Studies*, 22(1), 435-480.
