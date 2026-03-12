---
name: gold-security
description: "Gold standard for security practices in Python finance applications. Use when asking 'security standard', 'security best practices', or 'secure coding'."
---

# Gold Standard: Security

> **Skill Metadata**
> Category: `gold-standards`
> Priority: `HIGH`

## Security Principles

### 1. Secrets Management

```python
# GOOD: Environment variables
import os

api_key = os.environ["POLYGON_API_KEY"]
db_url = os.environ["DATABASE_URL"]

# BAD: Hard-coded secrets
# api_key = "pk_abc123..."
# db_url = "postgres://user:pass@localhost/db"
```

### 2. SQL Injection Prevention

```python
import sqlite3

# GOOD: Parameterized queries
conn = sqlite3.connect("market_data.db")
cursor = conn.execute(
    "SELECT * FROM prices WHERE symbol = ? AND date >= ?",
    (symbol, start_date),
)

# BAD: String concatenation
# cursor = conn.execute(f"SELECT * FROM prices WHERE symbol = '{symbol}'")
```

### 3. Input Validation

```python
from pydantic import BaseModel, Field
from datetime import date

# GOOD: Validate all inputs with Pydantic
class PriceRequest(BaseModel):
    symbol: str = Field(min_length=1, max_length=10, pattern=r"^[A-Z]+$")
    start_date: date
    end_date: date
    limit: int = Field(default=100, ge=1, le=10000)
```

### 4. API Rate Limiting

```python
import time
from functools import wraps

def rate_limit(calls_per_minute: int = 60):
    """Rate limit decorator for API calls."""
    interval = 60.0 / calls_per_minute
    last_call = [0.0]

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            elapsed = time.time() - last_call[0]
            if elapsed < interval:
                time.sleep(interval - elapsed)
            last_call[0] = time.time()
            return func(*args, **kwargs)
        return wrapper
    return decorator
```

### 5. Audit Logging

```python
import logging

logger = logging.getLogger("audit")

# GOOD: Log all data access operations
def fetch_prices(symbol: str, user_id: str) -> pd.DataFrame:
    """Fetch prices with audit trail."""
    logger.info(
        "Data access: user=%s, action=fetch_prices, symbol=%s",
        user_id, symbol,
    )
    # ... fetch data ...
```

## Security Checklist

- [ ] No hard-coded secrets
- [ ] Parameterized SQL queries
- [ ] Input validation for all user data
- [ ] API rate limiting configured
- [ ] Audit logging for data access
- [ ] HTTPS for all API calls
- [ ] API keys stored in environment variables
- [ ] .env in .gitignore
- [ ] Security tests in test suite

<!-- Trigger Keywords: security standard, security best practices, secure coding, security gold standard -->
