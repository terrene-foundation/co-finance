# Statistics Formula Reference for Finance

## Descriptive Statistics

| Formula | Expression |
|---------|-----------|
| Population Mean | mu = (1/N) x sum(x_i) |
| Sample Mean | x_bar = (1/n) x sum(x_i) |
| Population Variance | sigma^2 = (1/N) x sum((x_i - mu)^2) |
| Sample Variance | s^2 = (1/(n-1)) x sum((x_i - x_bar)^2) |
| Standard Deviation | sigma = sqrt(Variance) |
| Skewness | (1/n) x sum(((x_i - x_bar)/s)^3) |
| Kurtosis | (1/n) x sum(((x_i - x_bar)/s)^4) |
| Coefficient of Variation | CV = sigma / mu |

## Covariance and Correlation

| Formula | Expression |
|---------|-----------|
| Covariance (population) | Cov(X,Y) = (1/N) x sum((x_i - mu_x)(y_i - mu_y)) |
| Covariance (sample) | Cov(X,Y) = (1/(n-1)) x sum((x_i - x_bar)(y_i - y_bar)) |
| Correlation | rho = Cov(X,Y) / (sigma_X x sigma_Y) |

Range of correlation: -1 <= rho <= +1. rho = 0 means no linear relationship.

## Regression (OLS)

| Formula | Expression |
|---------|-----------|
| Simple Regression | Y = alpha + beta x X + epsilon |
| Beta (slope) | beta = Cov(X,Y) / Var(X) |
| Alpha (intercept) | alpha = Y_bar - beta x X_bar |
| R-squared | R^2 = 1 - SS_res/SS_tot = (Explained variation)/(Total variation) |
| Adjusted R-squared | R^2_adj = 1 - (1-R^2)(n-1)/(n-k-1) |
| Standard Error of beta | SE(beta) = sqrt(s^2 / sum((x_i - x_bar)^2)) |
| t-statistic | t = beta_hat / SE(beta_hat) |
| F-statistic | F = (R^2/k) / ((1-R^2)/(n-k-1)) |

Where: k = number of independent variables, n = sample size.

## Hypothesis Testing

| Test | Null Hypothesis | Test Statistic | Decision Rule |
|------|----------------|---------------|---------------|
| t-test (coefficient) | H_0: beta = 0 | t = beta_hat / SE | Reject if \|t\| > t_critical |
| F-test (overall) | H_0: all betas = 0 | F statistic | Reject if F > F_critical |
| Breusch-Pagan | H_0: homoscedasticity | Chi-squared | Reject if chi^2 > critical |
| Durbin-Watson | H_0: no autocorrelation | DW statistic | DW near 2 = no autocorrelation |
| Hausman | H_0: RE consistent | Chi-squared | Reject = use FE |
| VIF | Multicollinearity | VIF = 1/(1-R^2_j) | VIF > 10 is problematic |

## Significance Levels

| Symbol | p-value | Meaning |
|--------|---------|---------|
| * | p < 0.10 | Marginally significant |
| ** | p < 0.05 | Significant |
| *** | p < 0.01 | Highly significant |

## Critical Values (Common)

| Confidence Level | z-value (two-tailed) | t-value (approx., large n) |
|-----------------|---------------------|---------------------------|
| 90% | 1.645 | 1.645 |
| 95% | 1.960 | 1.960 |
| 99% | 2.576 | 2.576 |

## Probability Rules

| Rule | Formula |
|------|---------|
| Addition (mutually exclusive) | P(A or B) = P(A) + P(B) |
| Addition (general) | P(A or B) = P(A) + P(B) - P(A and B) |
| Multiplication (independent) | P(A and B) = P(A) x P(B) |
| Conditional | P(A\|B) = P(A and B) / P(B) |
| Bayes' Theorem | P(A\|B) = P(B\|A) x P(A) / P(B) |
| Normal distribution | 68% within 1 sigma, 95% within 2 sigma, 99.7% within 3 sigma |
