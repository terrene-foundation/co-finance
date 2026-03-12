---
name: error-date-timezone
description: "Fix date and timezone errors in financial data. Use when encountering 'off-by-one day', 'timezone mismatch', 'wrong trading hours', 'date alignment error', 'naive datetime', or 'market timezone' issues."
---

# Error: Date and Timezone Issues

Fix timezone mismatches, off-by-one day errors, and date alignment issues in financial market data.

> **Skill Metadata**
> Category: `cross-cutting` (error-resolution)
> Priority: `HIGH`

## Symptoms

- Off-by-one day errors in price lookups
- Data misalignment between US and non-US markets
- Wrong trading session boundaries
- `TypeError: can't compare offset-naive and offset-aware datetimes`
- Duplicate or missing data near midnight UTC

## Quick Fixes

### BAD: Naive datetimes

```python
import pandas as pd

# BAD: No timezone information
start = pd.Timestamp("2024-01-02")
# Is this midnight UTC? Midnight local? Market open?
```

### GOOD: Timezone-aware datetimes

```python
import pandas as pd

# GOOD: Explicit timezone
start = pd.Timestamp("2024-01-02", tz="America/New_York")

# GOOD: Convert between timezones
utc_time = pd.Timestamp("2024-01-02 14:30", tz="UTC")
ny_time = utc_time.tz_convert("America/New_York")  # 9:30 AM ET
```

### GOOD: Market-aware date handling

```python
import pandas as pd

def to_market_time(dt: pd.Timestamp, market: str = "US") -> pd.Timestamp:
    """Convert timestamp to market timezone.

    Args:
        dt: Input timestamp (naive or aware)
        market: Market identifier

    Returns:
        Timezone-aware timestamp in market's local time
    """
    market_tz = {
        "US": "America/New_York",
        "UK": "Europe/London",
        "JP": "Asia/Tokyo",
        "HK": "Asia/Hong_Kong",
    }

    tz = market_tz.get(market)
    if tz is None:
        raise ValueError(f"Unknown market: {market}")

    if dt.tz is None:
        return dt.tz_localize(tz)
    return dt.tz_convert(tz)
```

## Common Date/Timezone Errors

### Error 1: Mixing naive and aware datetimes

```python
# BAD: Comparison fails
naive = pd.Timestamp("2024-01-02")
aware = pd.Timestamp("2024-01-02", tz="UTC")
# naive == aware  # TypeError!

# GOOD: Make both aware
naive_fixed = naive.tz_localize("UTC")
assert naive_fixed == aware
```

### Error 2: Off-by-one from UTC conversion

```python
# BAD: "2024-01-02" at UTC midnight = "2024-01-01" in US markets
utc_midnight = pd.Timestamp("2024-01-02 00:00", tz="UTC")
ny_time = utc_midnight.tz_convert("America/New_York")
# 2024-01-01 19:00 EST - still previous day!

# GOOD: Use market-local dates
market_date = pd.Timestamp("2024-01-02", tz="America/New_York")
```

### Error 3: Business day vs calendar day

```python
# BAD: Calendar days include weekends
dates = pd.date_range("2024-01-01", periods=5, freq="D")
# Includes Sat, Sun - no market data for those days

# GOOD: Business days only
dates = pd.bdate_range("2024-01-02", periods=5)
# Skips weekends automatically
```

### Error 4: Holiday handling

```python
# Markets are closed on holidays - data is missing
# BAD: Assume every business day has data
expected_days = len(pd.bdate_range("2024-01-01", "2024-12-31"))
# Overestimates - doesn't account for market holidays

# GOOD: Use pandas_market_calendars (if available)
# or maintain a holiday list
US_HOLIDAYS_2024 = {
    "2024-01-01",  # New Year's Day
    "2024-01-15",  # MLK Day
    "2024-02-19",  # Presidents' Day
    "2024-03-29",  # Good Friday
    "2024-05-27",  # Memorial Day
    "2024-06-19",  # Juneteenth
    "2024-07-04",  # Independence Day
    "2024-09-02",  # Labor Day
    "2024-11-28",  # Thanksgiving
    "2024-12-25",  # Christmas
}
```

## Market Timezone Reference

| Market               | Exchange | Timezone         | Trading Hours (Local) |
| -------------------- | -------- | ---------------- | --------------------- |
| **US (NYSE/NASDAQ)** | NYSE     | America/New_York | 9:30-16:00 ET         |
| **UK (LSE)**         | LSE      | Europe/London    | 8:00-16:30 GMT        |
| **Japan (TSE)**      | TSE      | Asia/Tokyo       | 9:00-15:00 JST        |
| **Hong Kong (HKEX)** | HKEX     | Asia/Hong_Kong   | 9:30-16:00 HKT        |
| **Germany (XETRA)**  | XETRA    | Europe/Berlin    | 9:00-17:30 CET        |

## Prevention Checklist

- [ ] All timestamps are timezone-aware (never naive)
- [ ] Using market-local timezone for date filtering
- [ ] Business day frequency for trading data (`freq="B"`)
- [ ] Holidays accounted for in expected data counts
- [ ] UTC used for storage, market-local for display/filtering
- [ ] Date range boundaries checked (start <= date <= end)

## Quick Tips

- Store in UTC, display in market-local time
- Use `pd.bdate_range()` for trading day sequences
- `tz_localize()` adds timezone to naive datetime
- `tz_convert()` converts between timezones
- Always specify timezone when creating Timestamps for financial data

<!-- Trigger Keywords: off-by-one day, timezone mismatch, wrong trading hours, date alignment error, naive datetime, market timezone, timezone error, date error, UTC conversion, business day -->
