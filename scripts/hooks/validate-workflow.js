#!/usr/bin/env node
/**
 * Hook: validate-workflow
 * Event: PostToolUse
 * Matcher: Edit|Write
 * Purpose: Validate Python finance code patterns. Check for:
 *   - Proper imports of financial libraries
 *   - Use of Decimal for money
 *   - Named constants for financial parameters
 *   - Hardcoded API keys
 *   - Stubs/TODOs in production code
 *
 * All issues are warnings (exit 0) unless a hardcoded API key is found (exit 2).
 *
 * Exit Codes:
 *   0 = success / warn-only
 *   2 = blocking error (hardcoded secret)
 *   other = non-blocking error
 */

const fs = require("fs");
const path = require("path");
const { parseEnvFile } = require("./lib/env-utils");
const {
  logObservation: logLearningObservation,
} = require("./lib/learning-utils");

const TIMEOUT_MS = 5000;
const timeout = setTimeout(() => {
  console.error("[HOOK TIMEOUT] validate-workflow exceeded 5s limit");
  console.log(JSON.stringify({ continue: true }));
  process.exit(1);
}, TIMEOUT_MS);

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  clearTimeout(timeout);
  try {
    const data = JSON.parse(input);
    const result = validateFile(data);
    console.log(
      JSON.stringify({
        continue: result.continue,
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          validation: result.messages,
        },
      }),
    );
    process.exit(result.exitCode);
  } catch (error) {
    console.error(`[HOOK ERROR] ${error.message}`);
    console.log(JSON.stringify({ continue: true }));
    process.exit(1);
  }
});

// =====================================================================
// Main dispatcher
// =====================================================================

function validateFile(data) {
  const filePath = data.tool_input?.file_path || "";
  const cwd = data.cwd || process.cwd();

  const ext = path.extname(filePath).toLowerCase();

  const pyExts = [".py"];
  const jsExts = [".ts", ".tsx", ".js", ".jsx"];
  const configExts = [".yaml", ".yml", ".json", ".env", ".sh", ".toml"];

  const isPython = pyExts.includes(ext);
  const isJs = jsExts.includes(ext);
  const isConfig = configExts.includes(ext);

  if (!isPython && !isJs && !isConfig) {
    return {
      continue: true,
      exitCode: 0,
      messages: ["Not a code or config file -- skipped"],
    };
  }

  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch {
    return { continue: true, exitCode: 0, messages: ["Could not read file"] };
  }

  // Load .env once for key-validation
  const envPath = path.join(cwd, ".env");
  const env = fs.existsSync(envPath) ? parseEnvFile(envPath) : {};

  const messages = [];
  let shouldBlock = false;

  // -- Python finance-specific checks (.py only) ---------------------------
  if (isPython && !isTestFile(filePath)) {
    checkFinancialImports(content, filePath, messages);
    checkDecimalForMoney(content, filePath, messages);
    checkNamedConstants(content, filePath, messages);
  }

  // -- Hardcoded API key detection (all file types) ------------------------
  if (isPython || isJs || isConfig) {
    const keyResult = checkHardcodedKeys(content, filePath);
    messages.push(...keyResult.messages);
    if (keyResult.block) shouldBlock = true;
  }

  // -- Stub/TODO detection (code files only) -------------------------------
  if (isPython || isJs) {
    checkStubsAndTodos(content, filePath, messages);
  }

  if (messages.length === 0) {
    messages.push("All patterns validated");
  }

  // --- Observation logging ------------------------------------------------
  try {
    logFileObservations(content, filePath, cwd, messages);
  } catch {}

  return {
    continue: !shouldBlock,
    exitCode: shouldBlock ? 2 : 0,
    messages,
  };
}

// =====================================================================
// Financial import checks (Python only)
// =====================================================================

/**
 * Check that finance-related Python files import the right libraries.
 * Warns if a file appears to do financial calculations but is missing
 * common financial library imports.
 */
function checkFinancialImports(content, filePath, messages) {
  const basename = path.basename(filePath);

  // Detect financial context from content
  const financialIndicators = [
    /\b(sharpe|sortino|drawdown|volatility|returns?_?\w*)\b/i,
    /\b(portfolio|backtest|rebalance|hedge|pnl)\b/i,
    /\b(black.?scholes|monte.?carlo|var\b|cvar)\b/i,
    /\b(moving_average|bollinger|rsi|macd)\b/i,
  ];

  const isFinancialFile = financialIndicators.some((p) => p.test(content));
  if (!isFinancialFile) return;

  // Check for recommended imports
  const hasNumpy = /import numpy|from numpy/.test(content);
  const hasPandas = /import pandas|from pandas/.test(content);
  const hasDecimal = /from decimal import|import decimal/.test(content);

  if (!hasNumpy && !hasPandas) {
    messages.push(
      `WARNING: ${basename} appears to contain financial calculations but does not import numpy or pandas. ` +
        `Consider using these libraries for numerical computation.`,
    );
  }

  // Check for Decimal usage in files with monetary operations
  const hasMonetaryOps =
    /\b(price|amount|balance|cost|fee|total|payment)\b/i.test(content);
  if (hasMonetaryOps && !hasDecimal) {
    messages.push(
      `WARNING: ${basename} handles monetary values but does not import Decimal. ` +
        `Use decimal.Decimal for currency to avoid floating-point errors.`,
    );
  }
}

// =====================================================================
// Decimal for money checks
// =====================================================================

function checkDecimalForMoney(content, filePath, messages) {
  const basename = path.basename(filePath);
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Detect float type hints on monetary variables
    if (
      /(?:price|amount|balance|cost|fee|revenue|profit|payment|total)\s*:\s*float\b/i.test(
        trimmed,
      )
    ) {
      messages.push(
        `WARNING: float type on monetary variable at ${basename}:${i + 1}. ` +
          `Use Decimal instead of float for currency values.`,
      );
    }
  }
}

// =====================================================================
// Named constants for financial parameters
// =====================================================================

function checkNamedConstants(content, filePath, messages) {
  const basename = path.basename(filePath);
  const lines = content.split("\n");

  // Well-known financial magic numbers
  const magicNumbers = new Map([
    ["252", "TRADING_DAYS_PER_YEAR"],
    ["365", "CALENDAR_DAYS_PER_YEAR"],
    ["360", "DAYS_PER_YEAR_BANKING"],
    ["1.96", "Z_SCORE_95PCT"],
    ["2.576", "Z_SCORE_99PCT"],
    ["10000", "BASIS_POINTS_PER_UNIT"],
  ]);

  const constantDefPattern = /^\s*[A-Z][A-Z0-9_]+\s*=/;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      constantDefPattern.test(trimmed) ||
      trimmed.startsWith("import ") ||
      trimmed.startsWith("from ")
    ) {
      continue;
    }

    for (const [num, suggestion] of magicNumbers) {
      const numEscaped = num.replace(".", "\\.");
      const pattern = new RegExp(
        `(?<![a-zA-Z0-9_])${numEscaped}(?![a-zA-Z0-9_.])`,
      );
      if (pattern.test(trimmed)) {
        messages.push(
          `WARNING: Magic number ${num} at ${basename}:${i + 1}. ` +
            `Use a named constant like ${suggestion}.`,
        );
        break;
      }
    }
  }
}

// =====================================================================
// Hardcoded API key detection
// =====================================================================

function checkHardcodedKeys(content, filePath) {
  const messages = [];
  let block = false;

  if (isTestFile(filePath)) {
    return { messages, block };
  }

  // Order matters: more specific prefixes first
  const keyPatterns = [
    [/["'`]?sk-ant-[a-zA-Z0-9_-]{20,}["'`]?/, "Anthropic API key"],
    [/["'`]?ant-api[a-zA-Z0-9_-]{20,}["'`]?/, "Anthropic API key"],
    [/["'`]?sk-proj-[a-zA-Z0-9_-]{20,}["'`]?/, "OpenAI API key"],
    [/["'`]?sk-[a-zA-Z0-9_-]{20,}["'`]?/, "OpenAI API key"],
    [/["'`]?pplx-[a-zA-Z0-9_-]{20,}["'`]?/, "Perplexity API key"],
    [/["'`]?AIzaSy[a-zA-Z0-9_-]{30,}["'`]?/, "Google API key"],
    [/["'`]?AKIA[0-9A-Z]{16}["'`]?/, "AWS Access Key"],
    [/["'`]?ghp_[a-zA-Z0-9]{36,}["'`]?/, "GitHub Personal Access Token"],
    [/["'`]?gho_[a-zA-Z0-9]{36,}["'`]?/, "GitHub OAuth Token"],
    [/["'`]?github_pat_[a-zA-Z0-9_]{22,}["'`]?/, "GitHub Fine-grained Token"],
    [/["'`]?sk_live_[a-zA-Z0-9]{20,}["'`]?/, "Stripe Live Key"],
    [/["'`]?sk_test_[a-zA-Z0-9]{20,}["'`]?/, "Stripe Test Key"],
    [/["'`]?xoxb-[a-zA-Z0-9-]{20,}["'`]?/, "Slack Bot Token"],
  ];

  const seen = new Set();
  for (const [pattern, name] of keyPatterns) {
    if (pattern.test(content) && !seen.has(name)) {
      seen.add(name);
      messages.push(
        `CRITICAL: Hardcoded ${name} detected! Use os.environ.get() or load from .env.`,
      );
      block = true;
    }
  }

  return { messages, block };
}

// =====================================================================
// Stub / TODO detection
// =====================================================================

function checkStubsAndTodos(content, filePath, messages) {
  if (isTestFile(filePath)) return;

  const lines = content.split("\n");

  const stubPatterns = [
    [/\bTODO\b/i, "TODO marker"],
    [/\bFIXME\b/i, "FIXME marker"],
    [/\bHACK\b/i, "HACK marker"],
    [/\bSTUB\b/i, "STUB marker"],
    [/\bXXX\b/, "XXX marker"],
    [
      /raise\s+NotImplementedError/,
      "NotImplementedError (implement the method)",
    ],
    [
      /\b(simulated?|fake|dummy|placeholder)\s*(data|response|result|value)/i,
      "simulated data",
    ],
    [/except\s*:\s*pass/, "bare except with pass (silent fallback)"],
    [/catch\s*\([^)]*\)\s*\{\s*\}/, "empty catch block (silent fallback)"],
  ];

  const found = new Set();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments
    if (trimmed.startsWith("#") || trimmed.startsWith("//")) continue;

    for (const [pattern, label] of stubPatterns) {
      if (pattern.test(line) && !found.has(label)) {
        found.add(label);
        messages.push(
          `WARNING: ${label} at ${path.basename(filePath)}:${i + 1}. ` +
            `Implement fully -- don't leave stubs in production code.`,
        );
      }
    }
  }
}

// =====================================================================
// Observation logging for the learning system
// =====================================================================

function logFileObservations(content, filePath, cwd, messages) {
  const basename = path.basename(filePath);

  // Financial library usage
  if (/import pandas|import numpy|from decimal/.test(content)) {
    logLearningObservation(cwd, "financial_pattern", {
      pattern_type: "financial_library_usage",
      file: basename,
    });
  }

  // Stubs/TODOs detected
  if (
    messages.some((m) =>
      /TODO marker|FIXME marker|STUB marker|NotImplementedError/.test(m),
    )
  ) {
    logLearningObservation(cwd, "error_occurrence", {
      error_type: "stub_detected",
      file: basename,
    });
  }

  // Hardcoded key detected
  if (messages.some((m) => /Hardcoded/.test(m))) {
    logLearningObservation(cwd, "error_occurrence", {
      error_type: "hardcoded_key",
      file: basename,
    });
  }
}

// =====================================================================
// Helpers
// =====================================================================

function isTestFile(filePath) {
  const basename = path.basename(filePath).toLowerCase();
  return (
    /^test_|_test\.|\.test\.|\.spec\.|__tests__/.test(basename) ||
    filePath.includes("__tests__") ||
    filePath.includes("/tests/") ||
    filePath.includes("/test/")
  );
}
