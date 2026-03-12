---
name: error-library-versions
description: "Fix library version conflicts and breaking API changes. Use when encountering 'ImportError', 'AttributeError', 'ModuleNotFoundError', 'deprecated function', or library compatibility issues."
---

# Error: Library Version Conflicts

Fix version incompatibilities, deprecated API usage, and import errors across Python finance libraries.

> **Skill Metadata**
> Category: `cross-cutting` (error-resolution)
> Priority: `MEDIUM`

## Symptoms

- `ImportError: cannot import name 'X' from 'Y'`
- `AttributeError: module 'X' has no attribute 'Y'`
- `ModuleNotFoundError: No module named 'X'`
- `DeprecationWarning` on previously working code
- Different results between environments

## Common Version Issues

### Issue 1: numpy.financial removed from numpy

```python
# BAD: Removed in numpy 1.20+
import numpy as np
npv = np.npv(0.10, cashflows)  # AttributeError!

# GOOD: Use numpy-financial
import numpy_financial as npf
npv = npf.npv(0.10, cashflows)

# Install: pip install numpy-financial
```

### Issue 2: pandas deprecation warnings

```python
import pandas as pd

# BAD: Deprecated in pandas 2.0+
df.append(other_df)  # FutureWarning, then removed

# GOOD: Use pd.concat
df = pd.concat([df, other_df], ignore_index=True)

# BAD: Deprecated datetime parsing
pd.Timestamp("2024-01-02", format="%Y-%m-%d")

# GOOD: Direct parsing (pandas handles ISO format)
pd.Timestamp("2024-01-02")
```

### Issue 3: backtrader Python 3.12+ compatibility

```python
# BAD: backtrader may fail on Python 3.12+
# Due to removed distutils dependency

# FIX: Install setuptools first
# pip install setuptools
# pip install backtrader

# ALTERNATIVE: Use backtrader2 fork
# pip install backtrader2
```

### Issue 4: scipy stats API changes

```python
from scipy import stats

# BAD: Old API (scipy < 1.9)
result = stats.norm.rvs(loc=0, scale=1, size=1000, random_state=42)

# GOOD: Works across versions
rng = np.random.default_rng(42)
result = stats.norm.rvs(loc=0, scale=1, size=1000, random_state=rng)
```

### Issue 5: yfinance API changes

```python
import yfinance as yf

# BAD: Old API (yfinance < 0.2.0)
data = yf.download("AAPL", start="2024-01-01")
close = data["Close"]  # May fail with multi-level columns

# GOOD: Handle both old and new API
data = yf.download("AAPL", start="2024-01-01")
if isinstance(data.columns, pd.MultiIndex):
    close = data[("Close", "AAPL")]
else:
    close = data["Close"]
```

## Recommended Version Pins

```text
# requirements.txt - pin major.minor for stability
pandas>=2.0,<3.0
numpy>=1.24,<2.0
numpy-financial>=1.0,<2.0
scipy>=1.10,<2.0
matplotlib>=3.7,<4.0
mplfinance>=0.12,<1.0
backtrader>=1.9,<2.0
requests>=2.28,<3.0
pyarrow>=12.0,<16.0
```

## Diagnosing Version Issues

```python
# Check installed versions
import pandas as pd
import numpy as np
import sys

print(f"Python: {sys.version}")
print(f"pandas: {pd.__version__}")
print(f"numpy: {np.__version__}")

# Check if optional package is available
try:
    import numpy_financial as npf
    print(f"numpy-financial: {npf.__version__}")
except ImportError:
    print("numpy-financial: NOT INSTALLED")
    print("  Install with: pip install numpy-financial")
```

## Virtual Environment Best Practice

```bash
# Always use virtual environments
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
# .venv\Scripts\activate   # Windows

# Install from pinned requirements
pip install -r requirements.txt

# Freeze current versions
pip freeze > requirements-lock.txt
```

## Prevention Checklist

- [ ] Using virtual environment (not system Python)
- [ ] requirements.txt with version pins
- [ ] Lock file for exact reproducibility
- [ ] numpy-financial installed separately from numpy
- [ ] Tested with target Python version
- [ ] CI runs tests against pinned versions

## Quick Tips

- `pip list | grep pandas` to check installed version
- `pip install --upgrade pandas` to update
- `pip install pandas==2.1.0` to install specific version
- Use `try/except ImportError` for optional dependencies
- Pin major.minor versions, allow patch updates

<!-- Trigger Keywords: ImportError, AttributeError, ModuleNotFoundError, deprecated function, library compatibility, version conflict, version error, import error, module not found, deprecated API -->
