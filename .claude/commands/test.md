# /test - Testing Strategies Quick Reference

## Purpose

Load the testing strategies skill for 3-tier testing with NO MOCKING policy enforcement in Tier 2-3.

## Step 0: Detect Project Testing Stack

Before loading test patterns, check what the project uses:

- Look at `requirements.txt`, `pyproject.toml`, `setup.py` for `pytest`, `unittest`
- Look at `package.json` for `jest`, `vitest`, `mocha`, `playwright`
- Look for existing test directories (`tests/`, `test/`, `__tests__/`, `spec/`)

Adapt examples to the project's testing framework. The 3-tier strategy and NO MOCKING policy apply universally regardless of framework.

## Quick Reference

| Command       | Action                                      |
| ------------- | ------------------------------------------- |
| `/test`       | Load testing patterns and tier strategy     |
| `/test tier1` | Show unit test patterns (mocking allowed)   |
| `/test tier2` | Show integration test patterns (NO MOCKING) |
| `/test tier3` | Show E2E test patterns (NO MOCKING)         |

## What You Get

- 3-tier testing strategy
- NO MOCKING enforcement (Tier 2-3)
- Real infrastructure patterns
- Coverage requirements

## 3-Tier Strategy

| Tier   | Type        | Mocking        | Focus                  |
| ------ | ----------- | -------------- | ---------------------- |
| Tier 1 | Unit Tests  | ALLOWED        | Isolated functions     |
| Tier 2 | Integration | **PROHIBITED** | Component interactions |
| Tier 3 | E2E         | **PROHIBITED** | Full user journeys     |

## Quick Pattern

```python
# Tier 1: Unit test for a financial calculation
def test_compound_interest():
    """Test compound interest formula with known values."""
    from decimal import Decimal
    principal = Decimal("1000")
    rate = Decimal("0.05")
    years = 10
    result = calculate_compound_interest(principal, rate, years)
    expected = Decimal("1628.89")
    assert result == expected

# Tier 2: Integration test with real database
@pytest.fixture
def db():
    """Use real infrastructure, not mocks."""
    conn = sqlite3.connect(":memory:")
    conn.execute("CREATE TABLE portfolio_holdings (id INTEGER PRIMARY KEY, ticker TEXT, shares REAL, cost_basis REAL)")
    yield conn
    conn.close()

def test_portfolio_valuation(db):
    # NO MOCKING - real database operations
    db.execute("INSERT INTO portfolio_holdings (ticker, shares, cost_basis) VALUES (?, ?, ?)", ("AAPL", 10, 150.00))
    result = db.execute("SELECT * FROM portfolio_holdings WHERE ticker = ?", ("AAPL",)).fetchone()
    assert result is not None
    assert result[2] == 10  # shares
```

### Testing Financial Data Pipelines

```python
# Tier 2: Integration test for a data pipeline
def test_price_history_pipeline(tmp_path):
    """Test that price data is ingested, cleaned, and stored correctly."""
    raw_data = [
        {"date": "2024-01-02", "close": 185.50, "volume": 1000000},
        {"date": "2024-01-03", "close": None, "volume": 500000},  # missing close
        {"date": "2024-01-04", "close": 187.25, "volume": 750000},
    ]
    result = process_price_history(raw_data)
    # Verify missing data was handled (forward-filled or excluded)
    assert all(r["close"] is not None for r in result)
    assert len(result) >= 2
```

## Critical Rule - NO MOCKING in Tier 2-3

```python
# PROHIBITED in integration/e2e tests (any framework)
@patch('module.function')
MagicMock()
unittest.mock
from mock import Mock
mocker.patch()
jest.mock()
jest.spyOn()
vi.mock()
```

## Agent Teams

When writing tests, deploy these agents as a team:

- **testing-specialist** — 3-tier strategy, test architecture, coverage requirements
- **tdd-implementer** — Test-first methodology, red-green-refactor cycle
- **intermediate-reviewer** — Review test quality after writing
- **quantitative-analyst** — Numerical validation, precision checks, edge cases in financial calculations

For E2E tests, additionally deploy:

- **e2e-runner** — Playwright/Marionette test generation
- **value-auditor** — Validate from user/buyer perspective, not just technical assertions

## Related Commands

- `/validate` - Project compliance checks
- `/finance` - Financial calculation patterns
- `/data` - Market data API patterns
- `/portfolio` - Portfolio construction and risk

## Skill Reference

This command loads: `.claude/skills/12-testing-strategies/SKILL.md`
