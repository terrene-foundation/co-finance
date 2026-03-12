---
name: gold-standards
description: "Mandatory best practices and gold standards for Python finance development including absolute imports, function signatures, error handling, testing policies (NO MOCKING in Tiers 2-3), calculation design, calculation classes, data handling, security, documentation, and test creation. Use when asking about 'best practices', 'standards', 'gold standards', 'mandatory rules', 'required patterns', 'absolute imports', 'NO MOCKING', 'testing policy', 'error handling standards', 'security best practices', 'documentation standards', 'data handling', or 'calculation design'."
---

# Gold Standards - Mandatory Best Practices

Mandatory best practices and standards for all Python finance development. These are **required** patterns that must be followed.

## Overview

Gold standards are **mandatory** practices for:

- Absolute imports (no relative imports)
- Typed function signatures
- Error handling strategies
- Testing policies (NO MOCKING in Tiers 2-3)
- Calculation pipeline design (Load -> Validate -> Calculate -> Report)
- Reusable calculation classes
- Data handling (timezones, splits, NaN, Decimal)
- Security requirements
- Documentation standards
- Test creation guidelines

**IMPORTANT**: These are not suggestions - they are **required standards** that prevent bugs, ensure consistency, and maintain code quality.

## Reference Documentation

### Code Organization

#### Absolute Imports (MANDATORY)

- **[gold-absolute-imports](gold-absolute-imports.md)** - Absolute import requirement
  - **Rule**: ALWAYS use absolute imports, NEVER relative
  - **Reason**: Prevents import errors, enables refactoring
  - **Pattern**: `from myproject.calculations.returns import calculate_returns`
  - **Never**: `from ..calculations import returns`

#### Function Signatures (MANDATORY)

- **[gold-function-signatures](gold-function-signatures.md)** - Typed function signature standards
  - **Rule**: Use explicit typed parameters with defaults
  - **Pattern**: `def sharpe_ratio(returns: pd.Series, risk_free_rate: float = 0.04) -> float:`
  - **Rule**: Return typed results (dict, NamedTuple, or dataclass)
  - **Never**: `def calc(data, **kwargs)` with no types

### Testing Standards

#### NO MOCKING Policy (MANDATORY)

- **[gold-mocking-policy](gold-mocking-policy.md)** - NO MOCKING in Tiers 2-3
  - **Rule**: NO mocking in integration (Tier 2) or E2E (Tier 3) tests
  - **Reason**: Mocking hides real-world issues
  - **Required**: Use real files, real databases, real calculations
  - **Allowed**: Mocking ONLY in Tier 1 unit tests

#### Testing Standards (MANDATORY)

- **[gold-testing](gold-testing.md)** - Testing requirements
  - **Rule**: Follow 3-tier strategy (Unit, Integration, E2E)
  - **Rule**: Tiers 2-3 use real infrastructure
  - **Rule**: Validate against CFA benchmark values
  - **Rule**: Use `pytest.approx` with explicit tolerances

#### Test Creation (MANDATORY)

- **[gold-test-creation](gold-test-creation.md)** - Test creation standards
  - **Rule**: Write tests BEFORE implementation (TDD)
  - **Rule**: One assertion focus per test
  - **Rule**: Use AAA pattern (Arrange, Act, Assert)
  - **Rule**: Descriptive test names

### Error Handling

#### Error Handling (MANDATORY)

- **[gold-error-handling](gold-error-handling.md)** - Error handling requirements
  - **Rule**: Always handle errors explicitly
  - **Rule**: Never swallow exceptions silently
  - **Rule**: Provide actionable error messages
  - **Rule**: Define domain exception hierarchy
  - **Rule**: Log errors with financial context

### Calculation Design

#### Calculation Pipeline (MANDATORY)

- **[gold-calculation-design](gold-calculation-design.md)** - Pipeline standards
  - **Rule**: Follow Load -> Validate -> Calculate -> Report pattern
  - **Rule**: Use named constants (TRADING_DAYS_PER_YEAR = 252)
  - **Rule**: Single responsibility per function
  - **Rule**: Separate data loading from calculation logic

#### Calculation Classes (MANDATORY)

- **[gold-calculation-classes](gold-calculation-classes.md)** - Reusable calculator standards
  - **Rule**: Validate all inputs
  - **Rule**: Use Decimal for money, float64 for returns
  - **Rule**: Handle edge cases gracefully
  - **Rule**: Document parameters and formula sources
  - **Rule**: Return consistent output format (dataclass)

### Data Handling

#### Data Standards (MANDATORY)

- **[gold-data-handling](gold-data-handling.md)** - Data handling requirements
  - **Rule**: All dates timezone-aware
  - **Rule**: Use adjusted close prices (split/dividend adjusted)
  - **Rule**: Handle NaN explicitly
  - **Rule**: Use Decimal for monetary amounts
  - **Rule**: Cache API responses to avoid rate limits
  - **Rule**: Validate OHLCV data before use

### Security & Documentation

#### Security (MANDATORY)

- **[gold-security](gold-security.md)** - Security requirements
  - **Rule**: NEVER hardcode secrets
  - **Rule**: Use environment variables for credentials
  - **Rule**: Validate all user inputs
  - **Rule**: Prevent SQL injection
  - **Rule**: Use HTTPS for API calls

#### Documentation (MANDATORY)

- **[gold-documentation](gold-documentation.md)** - Documentation standards
  - **Rule**: Document all public APIs with docstrings
  - **Rule**: Cite formula sources (CFA, Hull, Bodie)
  - **Rule**: State assumptions explicitly
  - **Rule**: Include code examples in docstrings
  - **Rule**: Explain WHY, not just WHAT

## Critical Gold Standards Summary

### 1. Absolute Imports ALWAYS

```python
# CORRECT
from myproject.calculations.returns import calculate_returns

# WRONG
from ..calculations.returns import calculate_returns
```

### 2. NO MOCKING in Tiers 2-3

```python
# CORRECT (Tier 2)
def test_csv_pipeline(tmp_path):
    csv_path = tmp_path / "prices.csv"
    df.to_csv(csv_path, index=False)
    result = run_pipeline(str(csv_path))
    assert result["sharpe_ratio"] > 0

# WRONG
def test_csv_pipeline():
    with patch("pandas.read_csv") as mock:  # NO MOCKING in Tier 2!
        mock.return_value = fake_df
```

### 3. Typed Function Signatures ALWAYS

```python
# CORRECT
def annualized_return(daily_returns: pd.Series, trading_days: int = 252) -> float:
    mean_daily = daily_returns.mean()
    return (1 + mean_daily) ** trading_days - 1

# WRONG
def calc(data, n=252):
    return (1 + data.mean()) ** n - 1
```

### 4. Named Constants ALWAYS

```python
# CORRECT
TRADING_DAYS_PER_YEAR = 252
annual_vol = daily_vol * np.sqrt(TRADING_DAYS_PER_YEAR)

# WRONG
annual_vol = daily_vol * np.sqrt(252)  # Magic number!
```

### 5. Decimal for Money, Float for Returns

```python
# CORRECT
trade_cost = Decimal("149.99") * Decimal("100")  # Monetary
daily_return = (close - prev_close) / prev_close  # float64 OK

# WRONG
trade_cost = 149.99 * 100  # Float for money!
```

### 6. Environment Variables for Secrets

```python
# CORRECT
api_key = os.environ["POLYGON_API_KEY"]

# WRONG
api_key = "pk_abc123"  # Hardcoded!
```

### 7. Timezone-Aware Dates

```python
# CORRECT
dates = pd.to_datetime(["2024-01-02"]).tz_localize("America/New_York")

# WRONG
dates = pd.to_datetime(["2024-01-02"])  # Naive datetime!
```

### 8. Explicit Error Handling

```python
# CORRECT
try:
    df = pd.read_csv(file_path, parse_dates=["date"])
except FileNotFoundError:
    logger.error("Price file not found: %s", file_path)
    raise

# WRONG
try:
    df = pd.read_csv(file_path)
except:
    pass
```

## Compliance Checklist

### Before Every Commit

- [ ] All imports are absolute
- [ ] All functions have type hints
- [ ] No hardcoded secrets
- [ ] Error handling present
- [ ] Tests written (TDD)
- [ ] No mocking in Tier 2-3 tests
- [ ] Documentation updated
- [ ] Named constants used (no magic numbers)
- [ ] Dates are timezone-aware
- [ ] Decimal for money, float for returns

## Enforcement

```bash
# Run gold standards checks
python -m pytest tests/ -v --tb=short
python -m mypy src/ --strict
python -m ruff check src/
python -m bandit -r src/
```

## Related Skills

- **[16-validation-patterns](../16-validation-patterns/SKILL.md)** - Validation tools
- **[15-error-troubleshooting](../15-error-troubleshooting/SKILL.md)** - Error patterns
- **[12-testing-strategies](../12-testing-strategies/SKILL.md)** - Testing strategies
- **[06-cheatsheets](../06-cheatsheets/SKILL.md)** - Quick reference

<!-- Trigger Keywords: best practices, standards, gold standards, mandatory rules, required patterns, absolute imports, NO MOCKING, testing policy, error handling standards, security best practices, documentation standards, calculation design, data handling -->
