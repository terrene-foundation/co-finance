---
name: gold-calculation-classes
description: "Gold standard for building reusable financial calculation classes with input validation, Decimal precision, and consistent output formats. Use when asking 'calculation class', 'financial calculator', 'reusable calculation', 'calculator design', or 'calculation module'."
---

# Gold Standard: Calculation Classes

> **Skill Metadata**
> Category: `gold-standards`
> Priority: `HIGH`

## Core Rules

1. Validate ALL inputs before calculation
2. Use Decimal for monetary amounts, float64 for returns
3. Return consistent output formats (dict, NamedTuple, or dataclass)
4. Document parameters, formulas, and sources
5. Handle edge cases (empty data, NaN, division by zero)

## Gold Standard Template

```python
from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_UP
import numpy as np
import pandas as pd
import logging

logger = logging.getLogger(__name__)

TRADING_DAYS_PER_YEAR = 252


@dataclass
class RiskMetrics:
    """Output container for risk calculations."""
    sharpe_ratio: float
    annualized_volatility: float
    max_drawdown: float
    value_at_risk_95: float


class RiskCalculator:
    """Calculate portfolio risk metrics.

    All calculations follow CFA Institute conventions:
    - Annualization uses 252 trading days
    - Sharpe ratio uses excess return over risk-free rate
    - VaR uses historical simulation at 95% confidence

    Source: CFA Level I Quantitative Methods
    """

    def __init__(self, risk_free_rate: float = 0.04):
        if not 0.0 <= risk_free_rate <= 0.20:
            raise ValueError(
                f"Risk-free rate {risk_free_rate} outside reasonable range [0, 0.20]"
            )
        self.risk_free_rate = risk_free_rate
        self.daily_rf = (1 + risk_free_rate) ** (1 / TRADING_DAYS_PER_YEAR) - 1

    def calculate(self, daily_returns: pd.Series) -> RiskMetrics:
        """Calculate all risk metrics from daily returns.

        Args:
            daily_returns: Series of daily simple returns (not log returns).
                           Must have at least 30 observations.

        Returns:
            RiskMetrics dataclass with all calculated values.

        Raises:
            ValueError: If returns are empty or too short.
            TypeError: If returns is not a pandas Series.
        """
        self._validate_returns(daily_returns)

        return RiskMetrics(
            sharpe_ratio=self._sharpe(daily_returns),
            annualized_volatility=self._annualized_vol(daily_returns),
            max_drawdown=self._max_drawdown(daily_returns),
            value_at_risk_95=self._var_95(daily_returns),
        )

    def _validate_returns(self, returns: pd.Series) -> None:
        """Validate return series before calculation."""
        if not isinstance(returns, pd.Series):
            raise TypeError(f"Expected pd.Series, got {type(returns).__name__}")

        clean = returns.dropna()
        if len(clean) < 30:
            raise ValueError(
                f"Need at least 30 observations, got {len(clean)}"
            )

        if (clean.abs() > 1.0).any():
            logger.warning(
                "Returns > 100%% detected. Verify data is in decimal form "
                "(0.05 for 5%%, not 5.0)"
            )

    def _sharpe(self, returns: pd.Series) -> float:
        """Annualized Sharpe ratio."""
        excess = returns - self.daily_rf
        if excess.std() == 0:
            return 0.0
        return float(excess.mean() / excess.std() * np.sqrt(TRADING_DAYS_PER_YEAR))

    def _annualized_vol(self, returns: pd.Series) -> float:
        """Annualized volatility."""
        return float(returns.std() * np.sqrt(TRADING_DAYS_PER_YEAR))

    def _max_drawdown(self, returns: pd.Series) -> float:
        """Maximum drawdown from peak."""
        cumulative = (1 + returns).cumprod()
        running_max = cumulative.cummax()
        drawdown = (cumulative - running_max) / running_max
        return float(drawdown.min())

    def _var_95(self, returns: pd.Series) -> float:
        """Historical VaR at 95% confidence."""
        return float(returns.quantile(0.05))
```

## Anti-Patterns

```python
# WRONG: No input validation
class BadCalculator:
    def sharpe(self, data):  # No type hints, no validation
        return data.mean() / data.std() * 252**0.5  # Magic number

# WRONG: Inconsistent output
class InconsistentCalc:
    def risk(self, data):
        return data.std()  # Sometimes float

    def metrics(self, data):
        return {"vol": data.std()}  # Sometimes dict

# WRONG: Float for money
class FloatMoney:
    def portfolio_value(self, prices, shares):
        return sum(p * s for p, s in zip(prices, shares))  # Float math!
```

## Monetary Calculation Pattern

```python
from decimal import Decimal, ROUND_HALF_UP

class PortfolioValuation:
    """Portfolio valuation using Decimal for monetary precision."""

    def total_value(
        self, holdings: list[dict]
    ) -> Decimal:
        """Calculate total portfolio value.

        Args:
            holdings: List of {"symbol": str, "shares": int, "price": str}
                      Price must be string for Decimal conversion.
        """
        total = Decimal("0.00")
        for h in holdings:
            price = Decimal(str(h["price"]))
            shares = Decimal(str(h["shares"]))
            total += (price * shares).quantize(
                Decimal("0.01"), rounding=ROUND_HALF_UP
            )
        return total
```

## Checklist

- [ ] All inputs validated with clear error messages
- [ ] Type hints on all methods
- [ ] Docstrings with Args, Returns, Raises sections
- [ ] Formula source cited in class or method docstring
- [ ] Decimal for money, float64 for returns
- [ ] Named constants (no magic numbers)
- [ ] Edge cases handled (empty data, NaN, zero division)
- [ ] Output uses dataclass, NamedTuple, or typed dict
- [ ] Unit tests with CFA benchmark values
- [ ] Logging for warnings (not errors that should raise)

<!-- Trigger Keywords: calculation class, financial calculator, reusable calculation, calculator design, calculation module, custom calculation -->
