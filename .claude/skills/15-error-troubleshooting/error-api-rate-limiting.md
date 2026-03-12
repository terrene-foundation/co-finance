---
name: error-api-rate-limiting
description: "Fix data API rate limiting and connection failures. Use when encountering 'HTTP 429', 'rate limited', 'API connection refused', 'too many requests', 'API timeout', or data provider errors."
---

# Error: API Rate Limiting and Connection Failures

Fix rate limiting, connection failures, and timeout issues when fetching market data from APIs.

> **Skill Metadata**
> Category: `cross-cutting` (error-resolution)
> Priority: `HIGH` (Most common data pipeline error)

## Symptoms

- HTTP 429 (Too Many Requests)
- ConnectionError or ConnectionRefused
- Empty responses from data provider
- Timeout after long wait
- "API key invalid" or "quota exceeded"

## Root Cause

Data providers (Alpha Vantage, Yahoo Finance, Polygon, etc.) impose rate limits. Exceeding them results in rejected requests or temporary bans.

## Quick Fix

### BAD: No rate limit handling

```python
import requests

# BAD: Fails silently on 429
response = requests.get(f"https://api.example.com/prices/{symbol}")
data = response.json()  # May be error response, not data
```

### GOOD: Retry with exponential backoff

```python
import time
import logging
import requests

logger = logging.getLogger(__name__)

def fetch_with_retry(url: str, params: dict = None,
                     max_retries: int = 3, timeout: int = 30) -> dict:
    """Fetch from API with retry and exponential backoff.

    Args:
        url: API endpoint URL
        params: Query parameters
        max_retries: Maximum retry attempts
        timeout: Request timeout in seconds

    Returns:
        Parsed JSON response

    Raises:
        ConnectionError: If all retries exhausted
    """
    last_error = None

    for attempt in range(max_retries):
        try:
            response = requests.get(url, params=params, timeout=timeout)

            if response.status_code == 429:
                # Rate limited - wait and retry
                retry_after = int(response.headers.get("Retry-After", 2 ** attempt))
                logger.warning(
                    "Rate limited (429). Waiting %ds before retry %d/%d",
                    retry_after, attempt + 1, max_retries,
                )
                time.sleep(retry_after)
                continue

            response.raise_for_status()
            return response.json()

        except requests.ConnectionError as e:
            last_error = e
            delay = 2 ** attempt
            logger.warning(
                "Connection failed: %s. Retrying in %ds (%d/%d)",
                e, delay, attempt + 1, max_retries,
            )
            time.sleep(delay)

        except requests.Timeout as e:
            last_error = e
            logger.warning("Request timed out after %ds", timeout)
            time.sleep(2 ** attempt)

    raise ConnectionError(
        f"Failed after {max_retries} retries: {last_error}"
    )
```

### GOOD: Cache to avoid unnecessary API calls

```python
import hashlib
import json
from pathlib import Path
from datetime import datetime, timedelta

def fetch_with_cache(url: str, params: dict = None,
                     cache_dir: str = "./cache",
                     cache_hours: int = 24) -> dict:
    """Fetch with local file cache to minimize API calls.

    Args:
        url: API endpoint URL
        params: Query parameters
        cache_dir: Directory for cache files
        cache_hours: Cache TTL in hours
    """
    # Generate cache key from URL + params
    cache_key = hashlib.md5(
        f"{url}{json.dumps(params or {}, sort_keys=True)}".encode()
    ).hexdigest()

    cache_path = Path(cache_dir) / f"{cache_key}.json"
    cache_path.parent.mkdir(parents=True, exist_ok=True)

    # Check cache freshness
    if cache_path.exists():
        mod_time = datetime.fromtimestamp(cache_path.stat().st_mtime)
        if datetime.now() - mod_time < timedelta(hours=cache_hours):
            return json.loads(cache_path.read_text())

    # Cache miss - fetch from API
    data = fetch_with_retry(url, params)

    # Save to cache
    cache_path.write_text(json.dumps(data))
    return data
```

## Common Provider Rate Limits

| Provider          | Free Tier Limit        | Strategy                           |
| ----------------- | ---------------------- | ---------------------------------- |
| **Alpha Vantage** | 5 calls/min, 500/day   | Cache aggressively, batch requests |
| **Yahoo Finance** | Unofficial, ~2000/hour | Use `yfinance` library with delays |
| **Polygon.io**    | 5 calls/min (free)     | Upgrade plan or cache locally      |
| **FRED**          | 120 calls/min          | Cache results, batch queries       |
| **IEX Cloud**     | 50k messages/month     | Monitor usage, cache               |

## Prevention Checklist

- [ ] API key set via environment variable (not hardcoded)
- [ ] Retry logic with exponential backoff on all API calls
- [ ] Local cache for frequently-requested data
- [ ] Rate limit tracking (don't exceed provider limits)
- [ ] Timeout set on all `requests.get()` calls
- [ ] Error handling for 4xx and 5xx responses
- [ ] Fallback data source if primary fails

## Environment Variable Pattern

```python
import os

# GOOD: API key from environment
api_key = os.environ.get("MARKET_DATA_API_KEY")
if not api_key:
    raise ValueError(
        "MARKET_DATA_API_KEY not set. "
        "Get a free key at https://www.alphavantage.co/support/#api-key"
    )
```

## Quick Tips

- Cache historical data locally (it rarely changes)
- Use Parquet for fast local reads of cached data
- Batch multiple symbol requests where the API supports it
- Add `time.sleep(0.5)` between sequential API calls
- Monitor API usage to stay within quotas

<!-- Trigger Keywords: HTTP 429, rate limited, API connection refused, too many requests, API timeout, rate limiting, API error, connection error, data provider error, quota exceeded -->
