#!/usr/bin/env node
/**
 * Hook: validate-financial-code-style
 * Event: PostToolUse
 * Matcher: Edit|Write
 * Purpose: Enforce financial code style conventions in Python files.
 *
 * Checks for:
 *   - Magic numbers in financial calculations (should be named constants)
 *   - Using float for currency (should use Decimal)
 *   - Division without checking denominator (common formula anti-pattern)
 *   - Missing docstrings on financial calculation functions
 *
 * All issues are warnings (never blocks).
 *
 * Exit Codes:
 *   0 = success / warn-only
 */

const fs = require("fs");
const path = require("path");

const TIMEOUT_MS = 5000;
const timeout = setTimeout(() => {
  console.error(
    "[HOOK TIMEOUT] validate-financial-code-style exceeded 5s limit",
  );
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
    const result = validateFinancialStyle(data);
    console.log(
      JSON.stringify({
        continue: true,
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          validation: result.messages,
        },
      }),
    );
    process.exit(0);
  } catch (error) {
    console.error(`[HOOK ERROR] ${error.message}`);
    console.log(JSON.stringify({ continue: true }));
    process.exit(1);
  }
});

// =====================================================================
// Main validator
// =====================================================================

function validateFinancialStyle(data) {
  const filePath = data.tool_input?.file_path || "";
  const ext = path.extname(filePath).toLowerCase();

  // Only check Python files
  if (ext !== ".py") {
    return { messages: ["Not a Python file -- skipped"] };
  }

  // Skip test files
  if (isTestFile(filePath)) {
    return { messages: ["Test file -- skipped"] };
  }

  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch {
    return { messages: ["Could not read file"] };
  }

  const messages = [];
  const lines = content.split("\n");

  checkMagicNumbers(lines, filePath, messages);
  checkFloatForCurrency(lines, filePath, messages);
  checkDivisionWithoutGuard(lines, filePath, messages);
  checkMissingDocstrings(lines, filePath, messages);

  if (messages.length === 0) {
    messages.push("Financial code style validated");
  }

  return { messages };
}

// =====================================================================
// Magic number detection
// =====================================================================

/**
 * Common financial magic numbers that should be named constants.
 * Maps the number to a suggested constant name.
 */
const KNOWN_MAGIC_NUMBERS = {
  252: "TRADING_DAYS_PER_YEAR",
  253: "TRADING_DAYS_PER_YEAR",
  251: "TRADING_DAYS_PER_YEAR",
  365: "CALENDAR_DAYS_PER_YEAR",
  365.25: "CALENDAR_DAYS_PER_YEAR",
  360: "DAYS_PER_YEAR_BANKING",
  12: "MONTHS_PER_YEAR",
  52: "WEEKS_PER_YEAR",
  0.01: "BASIS_POINT or CENT",
  0.0001: "BASIS_POINT",
  100: "PERCENT_MULTIPLIER",
  1.96: "Z_SCORE_95PCT",
  2.576: "Z_SCORE_99PCT",
  2.33: "Z_SCORE_99PCT",
  0.05: "SIGNIFICANCE_LEVEL_5PCT",
  0.01: "SIGNIFICANCE_LEVEL_1PCT",
  10000: "BASIS_POINTS_PER_UNIT",
};

function checkMagicNumbers(lines, filePath, messages) {
  const basename = path.basename(filePath);

  // Skip lines that are constant definitions themselves (ALL_CAPS = number)
  const constantDefPattern = /^\s*[A-Z][A-Z0-9_]+\s*=/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments, blank lines, and constant definitions
    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      constantDefPattern.test(trimmed)
    ) {
      continue;
    }

    // Skip import lines
    if (trimmed.startsWith("import ") || trimmed.startsWith("from ")) {
      continue;
    }

    for (const [num, suggestion] of Object.entries(KNOWN_MAGIC_NUMBERS)) {
      // Match the number as a standalone token (not part of a variable name)
      // Use word boundary or surrounding operators/parens
      const numEscaped = num.replace(".", "\\.");
      const pattern = new RegExp(
        `(?<![a-zA-Z0-9_])${numEscaped}(?![a-zA-Z0-9_])`,
      );
      if (pattern.test(trimmed)) {
        messages.push(
          `WARNING: Magic number ${num} at ${basename}:${i + 1}. ` +
            `Consider using a named constant like ${suggestion}.`,
        );
        break; // One warning per line is enough
      }
    }
  }
}

// =====================================================================
// Float for currency detection
// =====================================================================

function checkFloatForCurrency(lines, filePath, messages) {
  const basename = path.basename(filePath);

  // Patterns suggesting float usage for monetary values
  const floatCurrencyPatterns = [
    [
      /(?:price|amount|balance|cost|fee|revenue|profit|salary|wage|payment|total|subtotal|tax|discount|interest)\s*[:=]\s*(?:float\b|\d+\.\d+(?!\d*e))/i,
      "float assigned to monetary variable",
    ],
    [
      /(?:price|amount|balance|cost|fee|revenue|profit|salary|wage|payment|total|subtotal|tax|discount|interest)\s*:\s*float/i,
      "float type annotation on monetary variable",
    ],
    [
      /round\s*\(\s*(?:price|amount|balance|cost|fee|total|payment|revenue|profit)/i,
      "round() on monetary value (use Decimal.quantize instead)",
    ],
  ];

  const seen = new Set();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    for (const [pattern, label] of floatCurrencyPatterns) {
      if (pattern.test(trimmed) && !seen.has(label)) {
        seen.add(label);
        messages.push(
          `WARNING: ${label} at ${basename}:${i + 1}. ` +
            `Use decimal.Decimal for currency to avoid floating-point errors.`,
        );
      }
    }
  }
}

// =====================================================================
// Division without denominator check
// =====================================================================

function checkDivisionWithoutGuard(lines, filePath, messages) {
  const basename = path.basename(filePath);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    // Detect division by a variable (not a literal number)
    // Pattern: something / variable_name (not / 2, / 100, etc.)
    const divByVarPattern = /\/\s*([a-zA-Z_][a-zA-Z0-9_]*)/;
    const match = divByVarPattern.exec(trimmed);

    if (match) {
      const denominator = match[1];

      // Skip common safe denominators (constants, len, count, etc.)
      if (
        /^[A-Z][A-Z0-9_]+$/.test(denominator) || // ALL_CAPS constants
        denominator === "len" ||
        denominator === "count" ||
        denominator === "size" ||
        denominator === "True" ||
        denominator === "False" ||
        denominator === "None"
      ) {
        continue;
      }

      // Check if there's a guard in the surrounding lines (2 lines before)
      const contextStart = Math.max(0, i - 2);
      const context = lines.slice(contextStart, i).join("\n");

      const hasGuard =
        context.includes(`if ${denominator}`) ||
        context.includes(`${denominator} != 0`) ||
        context.includes(`${denominator} > 0`) ||
        context.includes(`${denominator} == 0`) ||
        context.includes(`${denominator} is not`) ||
        context.includes(`ZeroDivisionError`) ||
        trimmed.includes("try:") ||
        (i > 0 && lines[i - 1].trim().startsWith("try:"));

      if (!hasGuard) {
        messages.push(
          `WARNING: Division by '${denominator}' at ${basename}:${i + 1} without visible zero-check. ` +
            `Consider guarding against ZeroDivisionError.`,
        );
      }
    }
  }
}

// =====================================================================
// Missing docstrings on financial functions
// =====================================================================

function checkMissingDocstrings(lines, filePath, messages) {
  const basename = path.basename(filePath);

  // Financial function name patterns
  const financialFuncPattern =
    /^\s*def\s+(calc|compute|calculate|estimate|forecast|project|price|value|discount|compound|amortize|annualize|interpolat|backtest|rebalance|hedge|optimize_portfolio|sharpe|sortino|drawdown|volatil|covariance|correlation|beta|alpha|return_|pnl|profit|loss|margin|leverage|risk|var_|cvar|expected_shortfall)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (financialFuncPattern.test(line)) {
      // Check if next non-blank line is a docstring
      let hasDocstring = false;
      for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
        const nextTrimmed = lines[j].trim();
        if (!nextTrimmed) continue;
        if (
          nextTrimmed.startsWith('"""') ||
          nextTrimmed.startsWith("'''") ||
          nextTrimmed.startsWith('r"""') ||
          nextTrimmed.startsWith("r'''")
        ) {
          hasDocstring = true;
        }
        break;
      }

      if (!hasDocstring) {
        const funcMatch = line.match(/def\s+(\w+)/);
        const funcName = funcMatch ? funcMatch[1] : "unknown";
        messages.push(
          `WARNING: Financial function '${funcName}' at ${basename}:${i + 1} has no docstring. ` +
            `Document the formula, parameters, and assumptions.`,
        );
      }
    }
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
