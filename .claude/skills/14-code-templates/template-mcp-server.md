---
name: template-api-server
description: "Generate a financial data API server template using FastAPI. Use when requesting 'API server template', 'create API server', 'financial API boilerplate', 'FastAPI template', or 'data server example'."
---

# Financial API Server Template

Production-ready API server template for serving financial data and calculations using FastAPI.

> **Skill Metadata**
> Category: `cross-cutting` (code-generation)
> Priority: `MEDIUM`

## Basic Financial API Template

```python
"""Basic Financial Data API Server using FastAPI"""

import os
from datetime import date
from decimal import Decimal
from typing import Optional, List

import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field

app = FastAPI(
    title="Financial Data API",
    description="API for market data and financial calculations",
    version="1.0.0",
)

TRADING_DAYS_PER_YEAR = 252
DISCLAIMER = (
    "This API provides data for educational purposes only. "
    "It does not constitute investment advice."
)


# --- Models ---

class PriceResponse(BaseModel):
    symbol: str
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int

class ReturnsResponse(BaseModel):
    symbol: str
    period: str
    annualized_return: float
    annualized_volatility: float
    sharpe_ratio: Optional[float]
    observations: int
    disclaimer: str = DISCLAIMER

class CalculationRequest(BaseModel):
    principal: float = Field(gt=0, description="Principal amount")
    annual_rate: float = Field(ge=0, le=1, description="Annual rate as decimal")
    years: int = Field(gt=0, le=50, description="Term in years")


# --- Endpoints ---

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "disclaimer": DISCLAIMER}

@app.get("/prices/{symbol}", response_model=List[PriceResponse])
async def get_prices(
    symbol: str,
    start: date = Query(default=None, description="Start date (YYYY-MM-DD)"),
    end: date = Query(default=None, description="End date (YYYY-MM-DD)"),
):
    """Get historical price data for a symbol."""
    try:
        import yfinance as yf
        ticker = yf.Ticker(symbol.upper())
        df = ticker.history(start=start, end=end)

        if df.empty:
            raise HTTPException(status_code=404, detail=f"No data for {symbol}")

        return [
            PriceResponse(
                symbol=symbol.upper(),
                date=idx.strftime("%Y-%m-%d"),
                open=row["Open"],
                high=row["High"],
                low=row["Low"],
                close=row["Close"],
                volume=int(row["Volume"]),
            )
            for idx, row in df.iterrows()
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/returns/{symbol}", response_model=ReturnsResponse)
async def get_returns(
    symbol: str,
    period: str = Query(default="1y", description="Period: 1m, 3m, 6m, 1y, 5y"),
    risk_free_rate: float = Query(default=0.05, description="Annual risk-free rate"),
):
    """Calculate return and risk metrics for a symbol."""
    try:
        import yfinance as yf
        ticker = yf.Ticker(symbol.upper())
        df = ticker.history(period=period)

        if df.empty or len(df) < 2:
            raise HTTPException(status_code=404, detail=f"Insufficient data for {symbol}")

        returns = df["Close"].pct_change().dropna().values
        daily_rf = risk_free_rate / TRADING_DAYS_PER_YEAR

        mean_return = np.mean(returns)
        volatility = np.std(returns, ddof=1)
        annual_return = (1 + mean_return) ** TRADING_DAYS_PER_YEAR - 1
        annual_vol = volatility * np.sqrt(TRADING_DAYS_PER_YEAR)

        excess = returns - daily_rf
        sharpe = np.mean(excess) / np.std(excess, ddof=1) * np.sqrt(TRADING_DAYS_PER_YEAR)

        return ReturnsResponse(
            symbol=symbol.upper(),
            period=period,
            annualized_return=round(annual_return, 6),
            annualized_volatility=round(annual_vol, 6),
            sharpe_ratio=round(sharpe, 4) if not np.isnan(sharpe) else None,
            observations=len(returns),
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Run with: uvicorn your_module:app --reload
```

## Production API Template

```python
"""Production Financial API with Rate Limiting and Caching"""

import os
import logging
from functools import lru_cache
from datetime import datetime, timedelta

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Financial Data API (Production)")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("ALLOWED_ORIGINS", "*").split(","),
    allow_methods=["GET"],
    allow_headers=["*"],
)

# Simple in-memory cache
_cache: dict = {}
CACHE_TTL = timedelta(minutes=15)

def get_cached(key: str):
    """Get value from cache if fresh."""
    if key in _cache:
        value, timestamp = _cache[key]
        if datetime.now() - timestamp < CACHE_TTL:
            return value
    return None

def set_cached(key: str, value):
    """Store value in cache."""
    _cache[key] = (value, datetime.now())


@app.get("/prices/{symbol}")
async def get_prices_cached(symbol: str, period: str = "1y"):
    """Get prices with caching."""
    cache_key = f"{symbol}_{period}"
    cached = get_cached(cache_key)
    if cached:
        logger.info("Cache hit for %s", cache_key)
        return cached

    logger.info("Cache miss for %s, fetching fresh data", cache_key)
    # ... fetch and return data ...
    result = {"symbol": symbol, "period": period, "data": []}
    set_cached(cache_key, result)
    return result
```

## Quick Tips

- Always include a disclaimer in financial API responses
- Cache market data to reduce API calls to upstream providers
- Use Pydantic models for request/response validation
- Set API keys via environment variables, never hardcode
- Include rate limiting for production deployments
- Log all requests for auditing

<!-- Trigger Keywords: API server template, create API server, financial API boilerplate, FastAPI template, data server example, financial API, REST API template -->
