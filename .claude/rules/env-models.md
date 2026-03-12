---
paths:
  - "**/*.py"
  - "**/*.ts"
  - "**/*.js"
  - ".env*"
---

# Environment Variables & Finance API Keys

## Scope

These rules apply to ALL operations involving API keys, data provider credentials, or environment configuration.

## ABSOLUTE RULES (BLOCKING - Exit Code 2)

### 1. .env Is The Single Source of Truth

ALL API keys MUST be read from `.env`. NEVER hardcode them.

> Also enforced by `security.md` Rule 1 (No Hardcoded Secrets).

**Before ANY data fetch or AI operation**: Check `.env` for current API keys.

### 2. NEVER Hardcode API Keys

MUST NOT use hardcoded API key strings anywhere in the codebase.

**Detection Patterns:**

```
BLOCKED: api_key = "pk_abc123..."
BLOCKED: POLYGON_API_KEY = "aB3x..."
BLOCKED: headers = {"Authorization": "Bearer sk-..."}
BLOCKED: fred_key = "abcdef1234567890"
```

**Correct Pattern (Python):**

```python
import os
from dotenv import load_dotenv
load_dotenv()

polygon_key = os.environ.get("POLYGON_API_KEY")
fred_key = os.environ.get("FRED_API_KEY")
```

**Correct Pattern (TypeScript):**

```typescript
const polygonKey = process.env.POLYGON_API_KEY;
const fredKey = process.env.FRED_API_KEY;
```

**Enforced by**: validate-workflow.js hook (BLOCKS Python, WARNS JS/TS)
**Violation**: BLOCK — must fix before proceeding

### 3. ALWAYS Load .env Before Operations

Every Python script, test, or service that uses environment variables MUST load .env first.

**Correct Pattern:**

```python
from dotenv import load_dotenv
load_dotenv()  # MUST be before any os.environ access
```

**For pytest**: Root `conftest.py` auto-loads `.env` (no manual setup needed).

**Enforced by**: session-start.js hook, validate-workflow.js hook
**Violation**: BLOCK test/script execution

### 4. API Key Pairings

Each data provider and AI service requires a matching API key in `.env`:

| Service                 | Required Key            | Notes                                    |
| ----------------------- | ----------------------- | ---------------------------------------- |
| Yahoo Finance           | _(no key needed)_       | Uses `yfinance` — free, no auth required |
| Polygon.io              | `POLYGON_API_KEY`       | Real-time and historical market data     |
| Alpha Vantage           | `ALPHA_VANTAGE_API_KEY` | Stock, forex, crypto data                |
| FRED                    | `FRED_API_KEY`          | Federal Reserve economic data            |
| Quandl / Nasdaq         | `QUANDL_API_KEY`        | Alternative and financial datasets       |
| OpenAI (AI features)    | `OPENAI_API_KEY`        | For AI-powered analysis features         |
| Anthropic (AI features) | `ANTHROPIC_API_KEY`     | For AI-powered analysis features         |

If a script or module references a data provider but the corresponding key is missing from `.env`, the session-start hook will WARN and validate-workflow will BLOCK Python writes.

**Example `.env`:**

```bash
# Market Data Providers
POLYGON_API_KEY=your_polygon_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
FRED_API_KEY=your_fred_key_here
QUANDL_API_KEY=your_quandl_key_here

# AI Services (optional — only needed for AI features)
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

**Example `.env.example` (committed to repo — no real values):**

```bash
# Market Data Providers
POLYGON_API_KEY=
ALPHA_VANTAGE_API_KEY=
FRED_API_KEY=
QUANDL_API_KEY=

# AI Services
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

**Enforced by**: lib/env-utils.js (shared by all hooks)

## Exceptions

NO EXCEPTIONS. This rule is absolute. If `.env` doesn't have the key, fix the `.env` — don't hardcode.
