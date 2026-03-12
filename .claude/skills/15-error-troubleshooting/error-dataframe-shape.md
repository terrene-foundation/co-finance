---
name: error-dataframe-shape
description: "Fix DataFrame column mismatches, index alignment issues, and wrong merge results. Use when encountering 'KeyError', 'column not found', 'alignment error', 'wrong join result', 'DataFrame shape mismatch', or 'merge error'."
---

# Error: DataFrame Shape Mismatches

Fix column name errors, index alignment issues, and incorrect merge/join results in financial DataFrames.

> **Skill Metadata**
> Category: `cross-cutting` (error-resolution)
> Priority: `HIGH`

## Symptoms

- `KeyError: 'Close'` (wrong column name capitalization)
- Unexpected NaN after merge/join
- Wrong number of rows after operations
- Index alignment producing zeros instead of values
- Duplicate rows after merge

## Quick Fixes

### BAD: Assume column names

```python
# BAD: Column might be "Close", "close", "CLOSE", or "Adj Close"
close_prices = df["Close"]  # KeyError if lowercase
```

### GOOD: Normalize column names

```python
# GOOD: Normalize before accessing
df.columns = df.columns.str.lower().str.strip().str.replace(" ", "_")

# Validate expected columns exist
required = {"date", "open", "high", "low", "close", "volume"}
missing = required - set(df.columns)
if missing:
    raise ValueError(
        f"Missing columns: {missing}. "
        f"Available: {df.columns.tolist()}"
    )

close_prices = df["close"]
```

## Common DataFrame Errors

### Error 1: Column name case mismatch

```python
# Different sources use different conventions:
# Yahoo Finance: "Close", "Adj Close", "Volume"
# Alpha Vantage: "4. close", "5. volume"
# Custom CSV: "close", "CLOSE"

# GOOD: Normalize immediately after loading
def normalize_ohlcv(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize OHLCV column names to lowercase."""
    rename_map = {}
    for col in df.columns:
        lower = col.lower().strip()
        if "close" in lower and "adj" not in lower:
            rename_map[col] = "close"
        elif "adj" in lower and "close" in lower:
            rename_map[col] = "adj_close"
        elif "open" in lower:
            rename_map[col] = "open"
        elif "high" in lower:
            rename_map[col] = "high"
        elif "low" in lower:
            rename_map[col] = "low"
        elif "vol" in lower:
            rename_map[col] = "volume"
        elif "date" in lower:
            rename_map[col] = "date"

    return df.rename(columns=rename_map)
```

### Error 2: Index alignment surprises

```python
import pandas as pd

# BAD: Indexes don't align, produces NaN
s1 = pd.Series([1, 2, 3], index=["a", "b", "c"])
s2 = pd.Series([4, 5, 6], index=["b", "c", "d"])
result = s1 + s2
# a    NaN  (s2 has no "a")
# b    6.0
# c    8.0
# d    NaN  (s1 has no "d")

# GOOD: Align explicitly or use common index
common = s1.index.intersection(s2.index)
result = s1.loc[common] + s2.loc[common]
# b    6
# c    8
```

### Error 3: Merge producing duplicates

```python
# BAD: Duplicate dates in one DataFrame cause row multiplication
df1 = pd.DataFrame({"date": ["2024-01-02", "2024-01-02"], "price": [100, 101]})
df2 = pd.DataFrame({"date": ["2024-01-02"], "volume": [1000]})
merged = df1.merge(df2, on="date")  # 2 rows! (one per df1 duplicate)

# GOOD: Deduplicate before merging
df1 = df1.drop_duplicates(subset=["date"], keep="last")
merged = df1.merge(df2, on="date")  # 1 row
```

### Error 4: Wrong merge type

```python
# BAD: Outer join introduces NaN for non-overlapping dates
combined = aapl.merge(msft, on="date", how="outer", suffixes=("_aapl", "_msft"))
# Dates only in AAPL will have NaN for MSFT columns

# GOOD: Inner join for analysis requiring both
combined = aapl.merge(msft, on="date", how="inner", suffixes=("_aapl", "_msft"))
# Only dates with data for both symbols

# Verify no data loss
original_overlap = set(aapl["date"]) & set(msft["date"])
assert len(combined) == len(original_overlap)
```

### Error 5: Date column as string vs datetime

```python
# BAD: String dates don't sort correctly
df = pd.DataFrame({"date": ["2024-1-2", "2024-1-10", "2024-1-3"]})
df_sorted = df.sort_values("date")
# Sorts alphabetically: "2024-1-10" < "2024-1-2" < "2024-1-3"

# GOOD: Parse dates before sorting
df["date"] = pd.to_datetime(df["date"])
df_sorted = df.sort_values("date")
# Now sorts chronologically
```

## DataFrame Validation Function

```python
def validate_ohlcv_dataframe(df: pd.DataFrame, symbol: str = "") -> None:
    """Validate OHLCV DataFrame structure and quality.

    Args:
        df: DataFrame to validate
        symbol: Symbol name for error messages

    Raises:
        ValueError: If validation fails
    """
    # Check not empty
    if df.empty:
        raise ValueError(f"Empty DataFrame for {symbol}")

    # Check required columns
    required = {"date", "open", "high", "low", "close", "volume"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(
            f"{symbol}: Missing columns {missing}. "
            f"Available: {df.columns.tolist()}"
        )

    # Check date column is datetime
    if not pd.api.types.is_datetime64_any_dtype(df["date"]):
        raise ValueError(f"{symbol}: 'date' column is not datetime type")

    # Check for duplicates
    dupes = df["date"].duplicated().sum()
    if dupes > 0:
        raise ValueError(f"{symbol}: {dupes} duplicate dates found")

    # Check sorted
    if not df["date"].is_monotonic_increasing:
        raise ValueError(f"{symbol}: Dates are not sorted ascending")

    # Check numeric types
    for col in ["open", "high", "low", "close"]:
        if not pd.api.types.is_numeric_dtype(df[col]):
            raise ValueError(f"{symbol}: '{col}' is not numeric")
```

## Prevention Checklist

- [ ] Column names normalized immediately after loading
- [ ] Required columns validated before operations
- [ ] Dates parsed to datetime before sorting/filtering
- [ ] Duplicates removed before merging
- [ ] Merge type chosen intentionally (inner vs outer)
- [ ] Result shape verified after merge/join

## Quick Tips

- `df.columns.tolist()` shows actual column names
- `df.dtypes` reveals column type issues
- `df.duplicated().sum()` counts duplicate rows
- `pd.testing.assert_frame_equal()` for exact DataFrame comparison
- Always normalize column names immediately after loading

<!-- Trigger Keywords: KeyError, column not found, alignment error, wrong join result, DataFrame shape mismatch, merge error, column mismatch, index alignment, duplicate rows, DataFrame error -->
