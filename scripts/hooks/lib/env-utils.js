/**
 * Shared utility: Environment variable parsing and API key validation.
 *
 * Used by session-start.js and user-prompt-rules-reminder.js.
 * Academic finance — validates data API keys students might use for research.
 */

const fs = require("fs");
const path = require("path");

// =========================================================================
// Data API Key definitions (student-relevant providers only)
// =========================================================================

/**
 * Known API keys for finance data providers that students might use.
 * Each entry defines the env var name, display label, and category.
 */
const KNOWN_API_KEYS = [
  {
    key: "FRED_API_KEY",
    provider: "FRED (Federal Reserve)",
    category: "economic-data",
    description: "Economic and macroeconomic data from the Federal Reserve",
  },
  {
    key: "POLYGON_API_KEY",
    provider: "Polygon.io",
    category: "market-data",
    description: "Real-time and historical market data",
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

  // Generate minimal template for FNCE academic project
  const template = [
    "# Auto-generated .env template for FNCE (Academic Finance Education)",
    "# Fill in API keys below if your research requires data access",
    "",
    "# ── Economic Data (FRED) ─────────────────────────────────────",
    "# Free API key from https://fred.stlouisfed.org/docs/api/api_key.html",
    "# FRED_API_KEY=your-fred-key-here",
    "",
    "# ── Market Data (Polygon.io) ────────────────────────────────",
    "# Free tier available at https://polygon.io/",
    "# POLYGON_API_KEY=your-polygon-key-here",
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
 * @param {{ validations: Array }} discovery
 * @returns {string}
 */
function buildCompactSummary(env, discovery) {
  const parts = [];

  // Count configured keys by category
  const configured = discovery.validations.filter((v) => v.status === "ok");
  const marketData = configured.filter((v) => v.category === "market-data");
  const economicData = configured.filter((v) => v.category === "economic-data");

  const summaryParts = [];
  if (marketData.length > 0)
    summaryParts.push(`${marketData.length} market data`);
  if (economicData.length > 0)
    summaryParts.push(`${economicData.length} economic data`);

  if (summaryParts.length > 0) {
    parts.push(`API Keys: ${summaryParts.join(", ")}`);
  }

  // Key status line
  const failures = discovery.validations.filter(
    (v) => v.status === "MISSING_KEY",
  );
  if (failures.length > 0) {
    parts.push(`Not configured: ${failures.map((f) => f.key).join(", ")}`);
  } else if (discovery.validations.length > 0) {
    parts.push("All data API keys configured");
  }

  return parts.join(" | ");
}

module.exports = {
  KNOWN_API_KEYS,
  checkApiKeys,
  parseEnvFile,
  ensureEnvFile,
  buildCompactSummary,
};
