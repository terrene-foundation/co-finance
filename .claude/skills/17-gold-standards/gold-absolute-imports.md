---
name: gold-absolute-imports
description: "Absolute imports standard requiring full module paths, never relative imports, with proper import ordering for finance projects. Use when asking 'absolute imports', 'import standards', 'import validation', 'no relative imports', or 'import rules'."
---

# Gold Standard: Absolute Imports

> **Skill Metadata**
> Category: `gold-standards`
> Priority: `HIGH`

## Core Rule

ALWAYS use absolute imports. NEVER use relative imports.

## Correct Pattern

```python
# CORRECT: Absolute imports
from myproject.calculations.returns import calculate_returns
from myproject.risk.metrics import sharpe_ratio, max_drawdown
from myproject.data.loaders import load_csv_prices
from myproject.utils.constants import TRADING_DAYS_PER_YEAR

import pandas as pd
import numpy as np
import numpy_financial as npf
```

## Wrong Pattern

```python
# WRONG: Relative imports
from ..calculations.returns import calculate_returns
from .risk import metrics
from ...data import loaders
```

## Why Absolute Imports?

1. **Prevents import errors during refactoring** - Moving files does not break sibling imports
2. **Enables clear dependency tracking** - You can see exactly where each import comes from
3. **Works consistently** - No confusion about which package level `..` refers to
4. **Better IDE support** - Auto-completion and go-to-definition work reliably

## Import Ordering for Finance Projects

```python
# 1. Standard library
import os
import logging
from datetime import date, datetime
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

# 2. Third-party libraries (alphabetical)
import numpy as np
import numpy_financial as npf
import pandas as pd
import yfinance as yf
from scipy.optimize import minimize

# 3. Project imports (absolute)
from myproject.calculations.returns import simple_return, log_return
from myproject.calculations.risk import sharpe_ratio, value_at_risk
from myproject.data.loaders import load_csv_prices
from myproject.data.validators import validate_ohlcv
from myproject.utils.constants import TRADING_DAYS_PER_YEAR
```

## Common Finance Project Layout

```python
# Given this structure:
# myproject/
#   calculations/
#     returns.py
#     risk.py
#     portfolio.py
#   data/
#     loaders.py
#     validators.py
#   utils/
#     constants.py

# CORRECT imports from anywhere in the project:
from myproject.calculations.returns import simple_return, log_return
from myproject.calculations.risk import sharpe_ratio, value_at_risk
from myproject.data.loaders import load_csv_prices
from myproject.data.validators import validate_ohlcv
from myproject.utils.constants import TRADING_DAYS_PER_YEAR
```

## Enforcement

```bash
# Use isort to enforce import ordering
pip install isort
isort --check-only --diff src/

# Use ruff for import linting
ruff check --select I src/
```

<!-- Trigger Keywords: absolute imports, import standards, import validation, no relative imports, import rules, import ordering -->
