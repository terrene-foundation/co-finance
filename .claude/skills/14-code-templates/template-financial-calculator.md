---
name: template-financial-calculator
description: "Reusable financial calculator class template with Decimal precision, input validation, and type hints. Use when requesting 'calculator template', 'financial calculator', 'calculation class', 'monetary calculation', or 'finance calculator boilerplate'."
---

# Financial Calculator Template

Template for a reusable financial calculator class with Decimal-based monetary precision and proper validation.

> **Skill Metadata**
> Category: `cross-cutting` (code-generation)
> Priority: `MEDIUM`

## Basic Financial Calculator

```python
"""Financial Calculator with Decimal Precision and Validation"""

from decimal import Decimal, ROUND_HALF_UP, InvalidOperation
from typing import Union, List, Optional
import numpy as np
import numpy_financial as npf


class FinancialCalculator:
    """Reusable financial calculator with proper precision.

    Uses Decimal for monetary amounts and float64 for returns/ratios.
    All monetary inputs are validated before calculation.
    """

    TRADING_DAYS_PER_YEAR = 252
    MONTHS_PER_YEAR = 12

    # --- Monetary Calculations (Decimal) ---

    @staticmethod
    def total_cost(price: Union[str, Decimal], quantity: Union[str, Decimal],
                   commission: Union[str, Decimal] = "0") -> Decimal:
        """Calculate total cost of a trade including commission.

        Args:
            price: Price per unit (must be positive)
            quantity: Number of units (must be positive)
            commission: Flat commission fee (default 0)

        Returns:
            Total cost as Decimal

        Raises:
            ValueError: If price or quantity is not positive
        """
        price = Decimal(str(price))
        quantity = Decimal(str(quantity))
        commission = Decimal(str(commission))

        if price <= 0:
            raise ValueError(f"Price must be positive, got {price}")
        if quantity <= 0:
            raise ValueError(f"Quantity must be positive, got {quantity}")
        if commission < 0:
            raise ValueError(f"Commission must be non-negative, got {commission}")

        total = (price * quantity + commission).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )
        return total

    @staticmethod
    def weighted_average_cost(
        existing_qty: Union[str, Decimal],
        existing_avg: Union[str, Decimal],
        new_qty: Union[str, Decimal],
        new_price: Union[str, Decimal],
    ) -> Decimal:
        """Calculate weighted average cost after a new purchase.

        Args:
            existing_qty: Current position quantity
            existing_avg: Current average cost per unit
            new_qty: New purchase quantity
            new_price: New purchase price per unit

        Returns:
            New weighted average cost as Decimal
        """
        eq = Decimal(str(existing_qty))
        ea = Decimal(str(existing_avg))
        nq = Decimal(str(new_qty))
        np_ = Decimal(str(new_price))

        total_cost = eq * ea + nq * np_
        total_qty = eq + nq

        if total_qty == 0:
            raise ValueError("Total quantity cannot be zero")

        return (total_cost / total_qty).quantize(
            Decimal("0.0001"), rounding=ROUND_HALF_UP
        )

    # --- Return Calculations (float64) ---

    @staticmethod
    def simple_return(start_price: float, end_price: float) -> float:
        """Calculate simple return: (end - start) / start.

        Args:
            start_price: Starting price (must be positive)
            end_price: Ending price (must be non-negative)

        Returns:
            Simple return as float

        Raises:
            ValueError: If start_price is not positive
        """
        if start_price <= 0:
            raise ValueError(f"Start price must be positive, got {start_price}")
        if end_price < 0:
            raise ValueError(f"End price must be non-negative, got {end_price}")
        return (end_price - start_price) / start_price

    @staticmethod
    def log_return(start_price: float, end_price: float) -> float:
        """Calculate logarithmic return: ln(end / start).

        Args:
            start_price: Starting price (must be positive)
            end_price: Ending price (must be positive)

        Returns:
            Log return as float
        """
        if start_price <= 0 or end_price <= 0:
            raise ValueError("Both prices must be positive for log returns")
        return np.log(end_price / start_price)

    @staticmethod
    def annualize_return(periodic_return: float, periods_per_year: int = 252) -> float:
        """Annualize a periodic return.

        Args:
            periodic_return: Return for one period
            periods_per_year: Number of periods in a year (252 for daily, 12 for monthly)

        Returns:
            Annualized return
        """
        return (1 + periodic_return) ** periods_per_year - 1

    @staticmethod
    def annualize_volatility(periodic_vol: float, periods_per_year: int = 252) -> float:
        """Annualize periodic volatility.

        Args:
            periodic_vol: Standard deviation for one period
            periods_per_year: Number of periods in a year

        Returns:
            Annualized volatility
        """
        return periodic_vol * np.sqrt(periods_per_year)

    # --- Risk Metrics ---

    @staticmethod
    def sharpe_ratio(returns: np.ndarray, risk_free_rate: float = 0.0,
                     periods_per_year: int = 252) -> float:
        """Calculate annualized Sharpe ratio.

        Args:
            returns: Array of periodic returns
            risk_free_rate: Annual risk-free rate (default 0)
            periods_per_year: Trading periods per year

        Returns:
            Annualized Sharpe ratio
        """
        if len(returns) < 2:
            raise ValueError("Need at least 2 return observations")

        excess = returns - risk_free_rate / periods_per_year
        if np.std(excess) == 0:
            return 0.0
        return np.mean(excess) / np.std(excess, ddof=1) * np.sqrt(periods_per_year)

    @staticmethod
    def max_drawdown(prices: np.ndarray) -> float:
        """Calculate maximum drawdown from a price series.

        Args:
            prices: Array of prices (not returns)

        Returns:
            Maximum drawdown as a negative float (e.g., -0.25 for 25% drawdown)
        """
        if len(prices) < 2:
            raise ValueError("Need at least 2 price observations")

        peak = np.maximum.accumulate(prices)
        drawdown = (prices - peak) / peak
        return float(np.min(drawdown))

    @staticmethod
    def value_at_risk(returns: np.ndarray, confidence: float = 0.95,
                      method: str = "historical") -> float:
        """Calculate Value at Risk.

        Args:
            returns: Array of returns
            confidence: Confidence level (e.g., 0.95 for 95%)
            method: 'historical' or 'parametric'

        Returns:
            VaR as a negative float
        """
        if method == "historical":
            return float(np.percentile(returns, (1 - confidence) * 100))
        elif method == "parametric":
            from scipy import stats
            return float(stats.norm.ppf(1 - confidence, np.mean(returns), np.std(returns)))
        else:
            raise ValueError(f"Unknown method: {method}. Use 'historical' or 'parametric'.")

    # --- Time Value of Money ---

    @staticmethod
    def npv(rate: float, cashflows: List[float]) -> float:
        """Net Present Value.

        Args:
            rate: Discount rate per period
            cashflows: List of cash flows (first is typically negative / investment)

        Returns:
            Net present value
        """
        return float(npf.npv(rate, cashflows))

    @staticmethod
    def irr(cashflows: List[float]) -> Optional[float]:
        """Internal Rate of Return.

        Args:
            cashflows: List of cash flows (must have at least one sign change)

        Returns:
            IRR as float, or None if no solution
        """
        result = npf.irr(cashflows)
        if np.isnan(result):
            return None
        return float(result)

    @staticmethod
    def monthly_payment(annual_rate: float, years: int, principal: float) -> Decimal:
        """Calculate fixed monthly loan payment.

        Args:
            annual_rate: Annual interest rate (e.g., 0.05 for 5%)
            years: Loan term in years
            principal: Loan amount

        Returns:
            Monthly payment as Decimal (positive value)
        """
        monthly_rate = annual_rate / 12
        n_payments = years * 12
        pmt = npf.pmt(monthly_rate, n_payments, -principal)
        return Decimal(str(round(pmt, 2)))
```

## Usage Example

```python
calc = FinancialCalculator()

# Monetary precision
cost = calc.total_cost("149.99", "100", "9.95")
print(f"Total cost: ${cost}")  # $15,008.95

# Returns
ret = calc.simple_return(100.0, 112.50)
print(f"Return: {ret:.2%}")  # 12.50%

# Risk
import numpy as np
returns = np.random.normal(0.0004, 0.015, 252)
sharpe = calc.sharpe_ratio(returns, risk_free_rate=0.04)
print(f"Sharpe: {sharpe:.2f}")

# TVM
npv = calc.npv(0.10, [-1000, 300, 400, 400, 200])
print(f"NPV: ${npv:.2f}")

payment = calc.monthly_payment(0.065, 30, 400000)
print(f"Monthly payment: ${payment}")
```

## Quick Tips

- Use Decimal for any calculation involving money (prices, commissions, balances)
- Use float64 for returns, ratios, and statistical measures
- Always validate inputs before calculating
- Include docstrings with Args, Returns, and Raises sections
- Cite the formula source in comments for complex calculations

<!-- Trigger Keywords: calculator template, financial calculator, calculation class, monetary calculation, finance calculator boilerplate, reusable calculator, financial class -->
