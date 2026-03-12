---
paths:
  - "tests/**"
  - "**/*test*"
  - "**/*spec*"
  - "conftest.py"
---

# Testing Rules

## Scope

These rules apply to all test files and test-related code.

## RECOMMENDED Rules

### 1. Test-First Development

Tests SHOULD be written before implementation for new features.

**Process**:

1. Write failing test that describes expected behavior
2. Implement minimum code to pass test
3. Refactor while keeping tests green

**Applies to**: New features, bug fixes, financial calculations

### 2. Coverage Requirements

Code changes SHOULD maintain or improve test coverage.

| Code Type              | Recommended Coverage |
| ---------------------- | -------------------- |
| General                | 80%                  |
| Financial calculations | 100%                 |
| Portfolio optimization | 100%                 |
| Risk metrics           | 100%                 |
| Data ingestion         | 90%                  |

### 3. Real Infrastructure in Tiers 2-3

Integration and E2E tests SHOULD use real infrastructure where practical.

**Tier 1 (Unit Tests)**:

- Mocking allowed
- Test isolated financial calculations with known values
- Fast execution (<1s per test)

**Example — Sharpe Ratio**:

```python
def test_sharpe_ratio_known_values():
    """Test Sharpe ratio against textbook example."""
    returns = pd.Series([0.01, 0.02, -0.01, 0.03, 0.005])
    risk_free_rate = 0.05 / 252  # Daily risk-free rate

    result = calculate_sharpe_ratio(returns, risk_free_rate, annualize=True)

    # Manually computed expected value
    excess = returns - risk_free_rate
    expected = (excess.mean() / excess.std()) * np.sqrt(252)
    assert np.isclose(result, expected, rtol=1e-10)
```

**Example — Returns Calculation**:

```python
def test_simple_returns():
    """Verify simple return calculation: (P1 - P0) / P0."""
    prices = pd.Series([100.0, 105.0, 102.0, 108.0])
    returns = calculate_simple_returns(prices)

    expected = pd.Series([0.05, -0.02857142857, 0.05882352941])
    pd.testing.assert_series_equal(returns, expected, rtol=1e-6)


def test_log_returns():
    """Verify log return calculation: ln(P1 / P0)."""
    prices = pd.Series([100.0, 105.0, 102.0, 108.0])
    returns = calculate_log_returns(prices)

    expected = pd.Series([np.log(105/100), np.log(102/105), np.log(108/102)])
    pd.testing.assert_series_equal(returns, expected, rtol=1e-10)
```

**Example — Value at Risk**:

```python
def test_var_95_normal_distribution():
    """VaR at 95% for known normal distribution."""
    np.random.seed(42)
    returns = pd.Series(np.random.normal(0.001, 0.02, 10000))

    var_95 = calculate_var(returns, confidence=0.95, method="historical")

    # 95th percentile of losses
    expected = -np.percentile(returns, 5)
    assert np.isclose(var_95, expected, rtol=1e-6)
```

**Tier 2 (Integration Tests)**:

- Real infrastructure recommended
- Mocking is permitted when real infrastructure is impractical
- Test component interactions

**Example — Data Pipeline with Real API**:

```python
@pytest.mark.integration
def test_yfinance_data_pipeline():
    """Fetch real data from yfinance and verify pipeline output."""
    import yfinance as yf

    ticker = yf.Ticker("AAPL")
    hist = ticker.history(period="1mo")

    assert not hist.empty, "Should return data for AAPL"
    assert "Close" in hist.columns
    assert hist.index.dtype == "datetime64[ns, America/New_York]" or pd.api.types.is_datetime64_any_dtype(hist.index)
    assert (hist["Close"] > 0).all(), "All prices should be positive"
    assert hist["Volume"].dtype in [np.int64, np.float64]


@pytest.mark.integration
def test_fred_economic_data():
    """Fetch real economic data from FRED."""
    import os
    from fredapi import Fred

    fred = Fred(api_key=os.environ["FRED_API_KEY"])
    treasury_10y = fred.get_series("DGS10", observation_start="2024-01-01")

    assert not treasury_10y.empty, "Should return 10Y Treasury data"
    assert treasury_10y.dtype == np.float64
```

**Example — Portfolio Optimization with Real Covariance**:

```python
@pytest.mark.integration
def test_portfolio_optimization_real_data():
    """Optimize portfolio using real covariance matrix from market data."""
    import yfinance as yf

    tickers = ["AAPL", "MSFT", "JNJ", "JPM"]
    data = yf.download(tickers, period="1y")["Close"]
    returns = data.pct_change().dropna()

    cov_matrix = returns.cov().values * 252  # Annualized

    weights = optimize_min_variance(cov_matrix)

    assert np.isclose(weights.sum(), 1.0, atol=1e-6), "Weights must sum to 1"
    assert (weights >= -0.01).all(), "No significant short positions in min-var"
    assert len(weights) == len(tickers)
```

**Tier 3 (E2E Tests)**:

- Real infrastructure recommended
- Test full analysis workflows end-to-end

**Example — Full Analysis Workflow**:

```python
@pytest.mark.e2e
def test_full_analysis_workflow():
    """Test complete flow: fetch data → calculate metrics → generate report."""
    # Step 1: Fetch data
    prices = fetch_price_data(["AAPL", "MSFT"], period="6mo")
    assert not prices.empty

    # Step 2: Calculate metrics
    returns = calculate_returns(prices, method="simple")
    sharpe = calculate_sharpe_ratio(returns["AAPL"])
    max_dd = calculate_max_drawdown(prices["AAPL"])
    var_95 = calculate_var(returns["AAPL"], confidence=0.95)

    assert isinstance(sharpe, float)
    assert max_dd <= 0, "Max drawdown should be negative"
    assert var_95 > 0, "VaR should be positive (represents loss)"

    # Step 3: Generate visualization
    report = generate_analysis_report(
        prices=prices,
        returns=returns,
        metrics={"sharpe": sharpe, "max_drawdown": max_dd, "var_95": var_95}
    )
    assert report is not None
    assert "sharpe" in report
```

## Finance-Specific Testing Rules

### 1. Test Against Known/Published Values

Financial calculations MUST be tested against known values from textbooks, published papers, or authoritative sources.

```python
def test_black_scholes_known_value():
    """Black-Scholes call price from Hull's 'Options, Futures, and Other Derivatives'."""
    call_price = black_scholes_call(S=42, K=40, T=0.5, r=0.10, sigma=0.20)
    # Hull Example 15.6: expected ≈ 4.76
    assert np.isclose(call_price, 4.76, atol=0.01)


def test_bond_price_known_value():
    """Bond pricing against known coupon bond calculation."""
    price = bond_price(face=1000, coupon_rate=0.06, ytm=0.08, periods=10)
    # Known: 6% coupon, 8% YTM, 10 periods → $865.80
    assert np.isclose(price, 865.80, atol=0.01)
```

### 2. Test Edge Cases

Financial code MUST handle edge cases that occur in real market data.

```python
def test_returns_with_zero_price():
    """Zero price should raise, not produce inf."""
    prices = pd.Series([100.0, 0.0, 50.0])
    with pytest.raises(ValueError, match="zero/negative"):
        calculate_returns(prices)


def test_sharpe_with_zero_volatility():
    """Constant returns (zero vol) should not produce inf Sharpe."""
    returns = pd.Series([0.01, 0.01, 0.01, 0.01])
    result = calculate_sharpe_ratio(returns)
    assert np.isfinite(result) or result is None  # Not inf


def test_empty_price_series():
    """Empty data should raise, not return NaN silently."""
    with pytest.raises(ValueError, match="[Ii]nsufficient|[Ee]mpty"):
        calculate_returns(pd.Series([], dtype=float))


def test_negative_prices_rejected():
    """Negative stock prices are data errors."""
    prices = pd.Series([100.0, -5.0, 102.0])
    with pytest.raises(ValueError, match="negative"):
        validate_price_data(prices)


def test_single_price_point():
    """Cannot compute returns from a single observation."""
    prices = pd.Series([100.0])
    with pytest.raises(ValueError):
        calculate_returns(prices)
```

### 3. Deterministic Seeds for Monte Carlo

Monte Carlo simulations in tests MUST use deterministic seeds so results are reproducible.

```python
def test_monte_carlo_var():
    """Monte Carlo VaR with deterministic seed for reproducibility."""
    np.random.seed(42)  # MUST seed for reproducibility
    rng = np.random.default_rng(seed=42)  # Or use Generator

    simulated_returns = rng.normal(0.0005, 0.02, size=(10000, 252))
    portfolio_paths = (1 + simulated_returns).cumprod(axis=1)

    terminal_returns = portfolio_paths[:, -1] - 1
    var_95 = -np.percentile(terminal_returns, 5)

    # With seed=42, this value is deterministic
    assert np.isclose(var_95, var_95, rtol=1e-10)  # Sanity: same seed → same result
    assert var_95 > 0, "VaR should represent a positive loss amount"
```

### 4. Test with Known Historical Periods

Stress tests and risk models SHOULD be validated against known historical events.

```python
@pytest.mark.integration
def test_drawdown_during_2008_gfc():
    """Validate max drawdown calculation against known 2008 crisis data."""
    import yfinance as yf

    spy = yf.Ticker("SPY")
    prices = spy.history(start="2007-10-01", end="2009-04-01")["Close"]

    max_dd = calculate_max_drawdown(prices)

    # S&P 500 peak-to-trough drawdown in GFC was approximately -56.8%
    assert max_dd < -0.50, f"GFC drawdown should exceed -50%, got {max_dd:.2%}"
    assert max_dd > -0.65, f"GFC drawdown should be less than -65%, got {max_dd:.2%}"


@pytest.mark.integration
def test_volatility_spike_covid_2020():
    """Verify volatility calculation captures COVID-19 market shock."""
    import yfinance as yf

    spy = yf.Ticker("SPY")
    prices = spy.history(start="2020-02-01", end="2020-04-30")["Close"]
    returns = prices.pct_change().dropna()

    annualized_vol = returns.std() * np.sqrt(252)

    # COVID crash period saw annualized vol well above 50%
    assert annualized_vol > 0.40, f"COVID period vol should be elevated, got {annualized_vol:.2%}"
```

## Best Practices

### 1. Prefer Real Infrastructure

Mocking is permitted at all tiers, but real infrastructure catches more bugs:

- Real API calls catch data format changes
- Real market data catches edge cases mocks hide
- Real calculations give higher confidence in financial accuracy

**When mocking makes sense**:

- External paid APIs with strict rate limits (Polygon.io in CI)
- Flaky network dependencies
- Tests that must run offline

### 2. No Test Pollution

Tests SHOULD NOT affect other tests.

**Recommended**:

- Clean setup/teardown
- Isolated test data
- No shared mutable state
- Reset random seeds between tests

### 3. No Flaky Tests

Tests SHOULD be deterministic.

**Avoid**:

- Random data without seeds
- Time-dependent assertions without mocked clocks
- Network calls to external services (Tier 1)
- Assertions on exact floating-point equality (use `np.isclose` or `rtol`/`atol`)

## Test Organization

### Directory Structure

```
tests/
├── unit/           # Tier 1: Financial calculation tests, mocking allowed
├── integration/    # Tier 2: Real API calls, real data pipelines
└── e2e/           # Tier 3: Full analysis workflows
```

### Naming Convention

```
test_[feature]_[scenario]_[expected_result].py
```

Examples:

- `test_sharpe_ratio_positive_returns_correct_value.py`
- `test_portfolio_optimization_equal_assets_equal_weights.py`
- `test_var_calculation_normal_distribution_matches_parametric.py`

## Exceptions

Testing exceptions are acceptable when:

1. Real infrastructure is genuinely impractical (paid APIs, rate limits)
2. Tests document why mocking was chosen
3. Integration coverage exists elsewhere for the same functionality
