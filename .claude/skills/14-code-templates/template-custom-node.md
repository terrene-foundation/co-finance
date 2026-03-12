---
name: template-custom-calculation
description: "Generate a custom financial calculation class template. Use when requesting 'custom calculation template', 'create calculation class', 'extend calculator', 'calculation development', or 'custom function boilerplate'."
---

# Custom Calculation Class Template

Template for creating reusable financial calculation classes with proper validation, type hints, and documentation.

> **Skill Metadata**
> Category: `cross-cutting` (code-generation)
> Priority: `MEDIUM`
> Related Skills: [`template-financial-calculator`](template-financial-calculator.md)
> Related Subagents: `finance-pattern-expert` (advanced calculation patterns)

## Basic Custom Calculation Template

```python
"""Custom Financial Calculation Module"""

from decimal import Decimal, ROUND_HALF_UP
from typing import Union, List, Optional, Dict, Any
import numpy as np
import pandas as pd
import logging

logger = logging.getLogger(__name__)

TRADING_DAYS_PER_YEAR = 252


class CustomCalculation:
    """Custom calculation class for [specific purpose].

    Uses Decimal for monetary amounts and float64 for returns/ratios.
    All inputs are validated before calculation.
    """

    def __init__(self, precision: str = "0.0001"):
        """Initialize with precision setting.

        Args:
            precision: Decimal precision for results (e.g., '0.01' for cents)
        """
        self.precision = Decimal(precision)

    def calculate(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the calculation.

        Args:
            input_data: Dictionary with required inputs

        Returns:
            Dictionary with calculation results

        Raises:
            ValueError: If inputs are invalid
        """
        # Validate inputs
        self._validate_inputs(input_data)

        # Extract parameters
        prices = np.array(input_data["prices"], dtype=np.float64)
        period = input_data.get("period", TRADING_DAYS_PER_YEAR)

        # Calculate
        returns = np.diff(prices) / prices[:-1]
        mean_return = np.mean(returns)
        volatility = np.std(returns, ddof=1)
        annualized_return = (1 + mean_return) ** period - 1
        annualized_vol = volatility * np.sqrt(period)

        return {
            "mean_return": float(mean_return),
            "volatility": float(volatility),
            "annualized_return": float(annualized_return),
            "annualized_volatility": float(annualized_vol),
            "observations": len(returns),
        }

    def _validate_inputs(self, data: Dict[str, Any]) -> None:
        """Validate inputs before calculation."""
        if "prices" not in data:
            raise ValueError("Missing required input: 'prices'")

        prices = data["prices"]
        if len(prices) < 2:
            raise ValueError("Need at least 2 price observations")

        if any(p <= 0 for p in prices):
            raise ValueError("All prices must be positive")

        if any(np.isnan(p) for p in prices):
            raise ValueError("NaN values not allowed in prices")
```

## Usage Example

```python
calc = CustomCalculation()

result = calc.calculate({
    "prices": [100, 102, 101, 105, 103, 107, 110],
})

print(f"Annualized Return: {result['annualized_return']:.2%}")
print(f"Annualized Volatility: {result['annualized_volatility']:.2%}")
```

## Advanced Template with Monetary Precision

```python
from decimal import Decimal, ROUND_HALF_UP
from pydantic import BaseModel, Field
from typing import Dict, Any

class CalculationContract(BaseModel):
    """Input contract for validation."""
    principal: Decimal = Field(gt=0, description="Principal amount")
    rate: float = Field(ge=0, le=1, description="Annual rate as decimal")
    years: int = Field(gt=0, le=50, description="Term in years")

class LoanCalculation:
    """Loan calculation with Pydantic validation."""

    def calculate(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate loan payments with validation."""
        # Validate with Pydantic
        validated = CalculationContract(**inputs)

        # Calculate monthly payment
        monthly_rate = validated.rate / 12
        n_payments = validated.years * 12

        if monthly_rate == 0:
            payment = validated.principal / n_payments
        else:
            payment = validated.principal * (
                monthly_rate * (1 + monthly_rate) ** n_payments
            ) / ((1 + monthly_rate) ** n_payments - 1)

        payment_decimal = Decimal(str(payment)).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )

        total_paid = payment_decimal * n_payments
        total_interest = total_paid - validated.principal

        return {
            "monthly_payment": payment_decimal,
            "total_paid": total_paid,
            "total_interest": total_interest,
            "n_payments": n_payments,
        }
```

## Related Patterns

- **Financial calculator**: [`template-financial-calculator`](template-financial-calculator.md)
- **Gold standard**: [`gold-custom-nodes`](../../17-gold-standards/gold-custom-nodes.md)

## When to Escalate

Use `finance-pattern-expert` when:

- Complex multi-step financial calculations
- Performance optimization needed
- Advanced validation requirements

## Quick Tips

- Use Decimal for monetary amounts, float64 for returns
- Always validate inputs before calculating
- Use Pydantic for complex input validation
- Add docstrings with Args, Returns, and Raises sections
- Cite formula sources in comments

<!-- Trigger Keywords: custom calculation template, create calculation class, extend calculator, calculation development, custom function boilerplate, reusable calculation -->
