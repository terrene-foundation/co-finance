---
name: error-connection-timeout
description: "Fix database and API connection timeouts in financial applications. Use when encountering 'ConnectionError', 'TimeoutError', 'connection pool exhausted', 'database timeout', or 'requests timeout'."
---

# Error: Connection and Timeout Errors

Fix database connection failures, API timeouts, and connection pool exhaustion in financial data applications.

> **Skill Metadata**
> Category: `cross-cutting` (error-resolution)
> Priority: `HIGH`

## Symptoms

- `requests.ConnectionError` or `requests.Timeout`
- `sqlite3.OperationalError: database is locked`
- `psycopg2.OperationalError: connection timed out`
- Slow queries hanging indefinitely
- Connection pool exhaustion under load

## Quick Fixes

### BAD: No timeout on requests

```python
import requests

# BAD: Hangs forever if server is down
response = requests.get("https://api.example.com/prices")
```

### GOOD: Always set timeout

```python
import requests

# GOOD: Timeout prevents infinite hang
response = requests.get(
    "https://api.example.com/prices",
    timeout=30,  # 30 seconds max
)
```

### GOOD: Session with connection pooling

```python
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def create_session(max_retries: int = 3, timeout: int = 30) -> requests.Session:
    """Create a requests session with retry and timeout.

    Args:
        max_retries: Number of retries for failed requests
        timeout: Default timeout in seconds

    Returns:
        Configured Session object
    """
    session = requests.Session()

    retry = Retry(
        total=max_retries,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    session.mount("http://", adapter)

    # Set default timeout for all requests
    session.request = lambda method, url, **kwargs: (
        requests.Session.request(
            session, method, url,
            timeout=kwargs.pop("timeout", timeout),
            **kwargs,
        )
    )

    return session

# Usage
session = create_session()
response = session.get("https://api.example.com/prices/AAPL")
```

### GOOD: SQLite with timeout

```python
import sqlite3

# BAD: Default timeout too short for concurrent access
conn = sqlite3.connect("market_data.db")

# GOOD: Longer timeout for concurrent access
conn = sqlite3.connect("market_data.db", timeout=30)

# GOOD: WAL mode for concurrent reads
conn.execute("PRAGMA journal_mode=WAL")
conn.execute("PRAGMA busy_timeout=30000")  # 30 seconds
```

### GOOD: PostgreSQL with connection pool

```python
import psycopg2
from psycopg2 import pool

# Create connection pool (do once at startup)
connection_pool = pool.ThreadedConnectionPool(
    minconn=2,
    maxconn=10,
    host="localhost",
    database="market_data",
    user="analyst",
    password="password",
    connect_timeout=10,
    options="-c statement_timeout=30000",  # 30s query timeout
)

def query_prices(symbol: str, start: str, end: str):
    """Query prices with pooled connection."""
    conn = connection_pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM prices WHERE symbol = %s AND date BETWEEN %s AND %s",
                (symbol, start, end),
            )
            return cur.fetchall()
    finally:
        connection_pool.putconn(conn)
```

## Common Connection Issues

| Issue               | Cause                     | Fix                                |
| ------------------- | ------------------------- | ---------------------------------- |
| **Request hangs**   | No timeout set            | Add `timeout=30`                   |
| **Database locked** | SQLite concurrent writes  | Use WAL mode or PostgreSQL         |
| **Pool exhausted**  | Too many open connections | Increase pool or close connections |
| **DNS timeout**     | Network issue             | Add DNS timeout, use IP fallback   |
| **SSL error**       | Certificate issue         | Update certifi, check proxy        |

## Prevention Checklist

- [ ] Timeout set on every `requests.get/post()` call
- [ ] Database connections closed in `finally` blocks
- [ ] Connection pooling for repeated database access
- [ ] SQLite using WAL mode for concurrent access
- [ ] Retry logic for transient failures
- [ ] Health check before long operations

## Quick Tips

- Always set `timeout` on HTTP requests (30s is a good default)
- Use `requests.Session()` for repeated calls to the same host
- Close database connections in `finally` blocks
- Use WAL mode for SQLite when multiple processes read/write
- Monitor connection counts in production

<!-- Trigger Keywords: ConnectionError, TimeoutError, connection pool exhausted, database timeout, requests timeout, connection error, database locked, pool exhaustion, timeout error, connection refused -->
