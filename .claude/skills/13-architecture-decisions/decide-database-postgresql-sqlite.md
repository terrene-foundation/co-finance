---
name: decide-database-postgresql-sqlite
description: "Choose between PostgreSQL and SQLite for financial data storage based on requirements. Use when asking 'PostgreSQL vs SQLite', 'database choice', 'which database', 'database selection', 'time series storage', or 'financial data DB'."
---

# Decision: Database Selection for Financial Data

Choose the right database for storing financial data: time series, portfolio holdings, trade history, and reference data.

> **Skill Metadata**
> Category: `cross-cutting`
> Priority: `MEDIUM`

## Quick Reference

- **Primary Use**: Financial data storage selection
- **Category**: cross-cutting
- **Priority**: MEDIUM
- **Trigger Keywords**: PostgreSQL vs SQLite, database choice, which database, financial data storage

## Decision Matrix

| Use Case                        | Choose                   | Why                                 |
| ------------------------------- | ------------------------ | ----------------------------------- |
| **Production multi-user app**   | PostgreSQL               | Concurrency, ACID, scalability      |
| **Local analysis / notebooks**  | SQLite                   | Zero setup, single file, portable   |
| **High-frequency tick data**    | PostgreSQL + TimescaleDB | Hypertables, compression, retention |
| **Backtesting data cache**      | SQLite or Parquet        | Fast reads, no server needed        |
| **Portfolio management system** | PostgreSQL               | Transactions, constraints, triggers |
| **Research prototype**          | SQLite                   | Embed in project, no dependencies   |

## PostgreSQL for Financial Data

**When to Choose:**

- Multi-user portfolio tracking or trading platform
- Storing large volumes of OHLCV data (millions of rows)
- Need for concurrent writes (multiple data feeds)
- Complex queries with joins (prices + fundamentals + holdings)
- Production deployment with reliability requirements

**Financial-Specific Advantages:**

```sql
-- TimescaleDB hypertable for time series
CREATE TABLE ohlcv (
    time        TIMESTAMPTZ NOT NULL,
    symbol      TEXT NOT NULL,
    open        NUMERIC(12, 4),
    high        NUMERIC(12, 4),
    low         NUMERIC(12, 4),
    close       NUMERIC(12, 4),
    volume      BIGINT
);
SELECT create_hypertable('ohlcv', 'time');

-- Efficient time-range queries
SELECT symbol, time_bucket('1 day', time) AS day,
       first(open, time), max(high), min(low), last(close, time),
       sum(volume)
FROM ohlcv
WHERE time > NOW() - INTERVAL '1 year'
GROUP BY symbol, day;

-- NUMERIC type for exact monetary calculations
CREATE TABLE positions (
    id          SERIAL PRIMARY KEY,
    symbol      TEXT NOT NULL,
    quantity    NUMERIC(18, 8),
    avg_cost    NUMERIC(12, 4),
    market_value NUMERIC(18, 4)
);
```

**Python Integration:**

```python
import psycopg2
import pandas as pd

conn = psycopg2.connect("postgresql://user:pass@localhost/findb")

# Load OHLCV data directly into pandas
df = pd.read_sql(
    "SELECT * FROM ohlcv WHERE symbol = %s AND time >= %s",
    conn, params=("AAPL", "2024-01-01")
)
df.set_index("time", inplace=True)
```

## SQLite for Financial Data

**When to Choose:**

- Local backtesting and research
- Jupyter notebook data cache
- Single-user portfolio tracker
- Embedding data in a project (portable)
- Prototyping before scaling to PostgreSQL

**Financial-Specific Advantages:**

```python
import sqlite3
import pandas as pd

# Create local price database
conn = sqlite3.connect("market_data.db")

# Store prices from API
prices_df.to_sql("daily_prices", conn, if_exists="append", index=False)

# Query for analysis
df = pd.read_sql("""
    SELECT date, close, volume
    FROM daily_prices
    WHERE symbol = ? AND date >= ?
    ORDER BY date
""", conn, params=("AAPL", "2024-01-01"))

# SQLite handles monetary values as TEXT or INTEGER (cents)
# to avoid floating-point issues
conn.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY,
        date TEXT NOT NULL,
        symbol TEXT NOT NULL,
        quantity REAL,
        price_cents INTEGER,  -- Store as cents for precision
        total_cents INTEGER
    )
""")
```

## Comparison Table

| Feature                | PostgreSQL                     | SQLite                    |
| ---------------------- | ------------------------------ | ------------------------- |
| **Setup**              | Server required                | Zero config, single file  |
| **Concurrency**        | Full MVCC                      | WAL mode (limited writes) |
| **Time series**        | TimescaleDB extension          | Manual partitioning       |
| **Monetary precision** | NUMERIC type (exact)           | No native NUMERIC         |
| **Data volume**        | Terabytes                      | Practical limit ~50GB     |
| **Full-text search**   | Built-in tsvector              | FTS5 extension            |
| **JSON support**       | JSONB (indexed)                | JSON1 extension           |
| **Backup**             | pg_dump, streaming replication | Copy the file             |
| **Best for**           | Production, multi-user         | Local analysis, notebooks |

## Alternative: Parquet Files

For read-heavy analytical workloads, consider parquet files:

```python
import pandas as pd

# Write historical data
prices.to_parquet("prices_2024.parquet", engine="pyarrow")

# Read with column pruning (fast)
df = pd.read_parquet("prices_2024.parquet", columns=["date", "close", "volume"])

# Partitioned storage for large datasets
prices.to_parquet("prices/", partition_cols=["year", "symbol"], engine="pyarrow")
```

**Use parquet when:**

- Data is write-once, read-many
- You need columnar access patterns
- Sharing data files across team/projects
- Working with tools like DuckDB or Apache Arrow

## Migration Path

Start with SQLite for prototyping, migrate to PostgreSQL for production:

```python
# Same pandas interface, different connection
import sqlite3
import psycopg2

# Development
dev_conn = sqlite3.connect("dev_data.db")
df = pd.read_sql("SELECT * FROM prices WHERE symbol = ?", dev_conn, params=("AAPL",))

# Production (change connection only)
prod_conn = psycopg2.connect("postgresql://user:pass@prod-host/findb")
df = pd.read_sql("SELECT * FROM prices WHERE symbol = %s", prod_conn, params=("AAPL",))
```

## Quick Tips

- Use PostgreSQL NUMERIC type for all monetary amounts (never FLOAT)
- Use SQLite with INTEGER cents for monetary precision in local projects
- Consider TimescaleDB for any serious time-series workload
- Parquet files outperform both databases for bulk analytical reads
- Always use parameterized queries regardless of database choice

<!-- Trigger Keywords: PostgreSQL vs SQLite, database choice, which database, database selection, financial data storage, time series database, tick data storage -->
