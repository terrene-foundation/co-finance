/**
 * Shared utility: Environment variable parsing and API key validation.
 *
 * Used by session-start.js, validate-workflow.js, and user-prompt-rules-reminder.js.
 * Finance-focused — validates finance data API keys and AI provider keys.
 */

const fs = require("fs");
const path = require("path");

// =========================================================================
// Finance & AI API Key definitions
// =========================================================================

/**
 * Known API keys for finance data providers and AI services.
 * Each entry defines the env var name, display label, and detection pattern.
 */
const KNOWN_API_KEYS = [
  {
    key: "POLYGON_API_KEY",
    provider: "Polygon.io",
    category: "market-data",
    description: "Real-time and historical market data",
  },
  {
    key: "ALPHA_VANTAGE_API_KEY",
    provider: "Alpha Vantage",
    category: "market-data",
    description: "Stock, forex, and crypto data",
  },
  {
    key: "FRED_API_KEY",
    provider: "FRED (Federal Reserve)",
    category: "economic-data",
    description: "Economic and macroeconomic data",
  },
  {
    key: "QUANDL_API_KEY",
    provider: "Quandl/Nasdaq Data Link",
    category: "market-data",
    description: "Financial and alternative data",
  },
  {
    key: "OPENAI_API_KEY",
    provider: "OpenAI",
    category: "ai",
    description: "AI features (GPT models)",
  },
  {
    key: "ANTHROPIC_API_KEY",
    provider: "Anthropic",
    category: "ai",
    description: "AI features (Claude models)",
  },
];

/**
 * Check which known API keys are present in a parsed env config.
 *
 * @param {Object} env - Parsed env object
 * @returns {{ configured: Array, missing: Array }}
 */
function checkApiKeys(env) {
  const configured = [];
  const missing = [];

  for (const entry of KNOWN_API_KEYS) {
    const value = env[entry.key];
    const isPresent = value && value.length > 5 && !value.includes("your-key");

    if (isPresent) {
      configured.push({
        key: entry.key,
        provider: entry.provider,
        category: entry.category,
        status: "ok",
      });
    } else {
      missing.push({
        key: entry.key,
        provider: entry.provider,
        category: entry.category,
        status: value ? "placeholder" : "missing",
      });
    }
  }

  return { configured, missing };
}

// =========================================================================
// .env file parsing
// =========================================================================

/**
 * Parse a .env file into a key-value object.
 * Handles comments, quoted values, and blank lines.
 *
 * @param {string} envPath - Absolute path to .env file
 * @returns {Object<string, string>}
 */
function parseEnvFile(envPath) {
  const config = {};
  try {
    const content = fs.readFileSync(envPath, "utf8");
    for (const raw of content.split("\n")) {
      let line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      // Handle `export VAR=value` syntax
      if (line.startsWith("export ")) {
        line = line.substring(7).trim();
      }
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.substring(0, eq).trim();
      let val = line.substring(eq + 1).trim();
      // Strip surrounding quotes
      const isQuoted =
        (val.startsWith('"') && val.endsWith('"') && val.length >= 2) ||
        (val.startsWith("'") && val.endsWith("'") && val.length >= 2);
      if (isQuoted) {
        val = val.slice(1, -1);
      } else {
        // Strip inline comments for unquoted values (e.g. "value # comment")
        const commentIdx = val.indexOf(" #");
        if (commentIdx > -1) val = val.substring(0, commentIdx).trim();
      }
      config[key] = val;
    }
  } catch {
    // Silently return empty if file can't be read
  }
  return config;
}

// =========================================================================
// Discover API keys from parsed env
// =========================================================================

/**
 * Scan env config for all API keys (both known finance keys and others).
 *
 * @param {Object} env - Parsed env object
 * @returns {{ keys: Object, validations: Array }}
 */
function discoverModelsAndKeys(env) {
  const models = {};
  const keys = {};

  for (const [k, v] of Object.entries(env)) {
    if (k.endsWith("_MODEL") || k === "DEFAULT_LLM_MODEL") {
      models[k] = v;
    }
    if (k.endsWith("_API_KEY") || k.endsWith("_SECRET")) {
      keys[k] = v ? "present" : "empty";
    }
  }

  // Validate known finance/AI API keys
  const validations = [];
  const apiKeyCheck = checkApiKeys(env);

  for (const entry of apiKeyCheck.configured) {
    validations.push({
      key: entry.key,
      provider: entry.provider,
      category: entry.category,
      hasKey: true,
      status: "ok",
      message: `${entry.provider} key configured (${entry.key})`,
    });
  }

  for (const entry of apiKeyCheck.missing) {
    validations.push({
      key: entry.key,
      provider: entry.provider,
      category: entry.category,
      hasKey: false,
      status: "MISSING_KEY",
      message: `MISSING: ${entry.key} (${entry.provider})`,
    });
  }

  return { models, keys, validations };
}

// =========================================================================
// .env creation from .env.example
// =========================================================================

/**
 * If .env does not exist, create one from .env.example or generate a minimal template.
 *
 * @param {string} cwd - Project working directory
 * @returns {{ created: boolean, source: string }}
 */
function ensureEnvFile(cwd) {
  const envPath = path.join(cwd, ".env");
  if (fs.existsSync(envPath)) {
    return { created: false, source: "existing" };
  }

  // Try copying from .env.example
  const examplePath = path.join(cwd, ".env.example");
  if (fs.existsSync(examplePath)) {
    try {
      fs.copyFileSync(examplePath, envPath);
      return { created: true, source: ".env.example" };
    } catch {
      // Fall through to template creation
    }
  }

  // Generate minimal template for FMI project
  const template = [
    "# Auto-generated .env template for FMI (Financial Market Intelligence)",
    "# Fill in your API keys below",
    "",
    "# ── Market Data Providers ──────────────────────────────────────",
    "# POLYGON_API_KEY=your-polygon-key-here",
    "# ALPHA_VANTAGE_API_KEY=your-alpha-vantage-key-here",
    "",
    "# ── Economic Data ────────────────────────────────────────────",
    "# FRED_API_KEY=your-fred-key-here",
    "# QUANDL_API_KEY=your-quandl-key-here",
    "",
    "# ── AI Services ──────────────────────────────────────────────",
    "# OPENAI_API_KEY=sk-your-openai-key-here",
    "# ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here",
    "",
    "# ── Database ─────────────────────────────────────────────────",
    "# DATABASE_URL=postgresql://user:pass@localhost:5432/fmi",
    "",
  ].join("\n");

  try {
    fs.writeFileSync(envPath, template);
    return { created: true, source: "template" };
  } catch {
    return { created: false, source: "failed" };
  }
}

// =========================================================================
// Compact summary for hook output (survives context compression)
// =========================================================================

/**
 * Build a terse summary string for injection into conversation context.
 *
 * @param {Object} env - Parsed env
 * @param {{ keys: Object, validations: Array }} discovery
 * @returns {string}
 */
function buildCompactSummary(env, discovery) {
  const parts = [];

  // Count configured keys by category
  const configured = discovery.validations.filter((v) => v.status === "ok");
  const marketData = configured.filter((v) => v.category === "market-data");
  const economicData = configured.filter((v) => v.category === "economic-data");
  const aiKeys = configured.filter((v) => v.category === "ai");

  const summaryParts = [];
  if (marketData.length > 0)
    summaryParts.push(`${marketData.length} market data`);
  if (economicData.length > 0)
    summaryParts.push(`${economicData.length} economic data`);
  if (aiKeys.length > 0) summaryParts.push(`${aiKeys.length} AI`);

  if (summaryParts.length > 0) {
    parts.push(`API Keys: ${summaryParts.join(", ")}`);
  }

  // Key status line
  const failures = discovery.validations.filter(
    (v) => v.status === "MISSING_KEY",
  );
  if (failures.length > 0) {
    parts.push(`MISSING: ${failures.map((f) => f.key).join(", ")}`);
  } else if (discovery.validations.length > 0) {
    parts.push("All API keys configured");
  }

  return parts.join(" | ");
}

// =========================================================================
// Backward-compatible exports
// =========================================================================

/**
 * getModelProvider is kept for backward compatibility but returns null
 * since we no longer do model-provider mapping in the finance context.
 */
function getModelProvider(modelName) {
  return null;
}

module.exports = {
  KNOWN_API_KEYS,
  checkApiKeys,
  getModelProvider,
  parseEnvFile,
  discoverModelsAndKeys,
  ensureEnvFile,
  buildCompactSummary,
};
