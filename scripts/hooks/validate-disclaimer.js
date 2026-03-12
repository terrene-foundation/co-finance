#!/usr/bin/env node
/**
 * Hook: validate-disclaimer
 * Event: PostToolUse
 * Matcher: Edit|Write
 * Purpose: Warn when user-facing content files contain financial terms
 *          (return, performance, profit, gain, yield, recommendation)
 *          without appropriate disclaimer text.
 *
 * Only checks content/documentation files (md, html, txt).
 * Does NOT trigger on Python source code files.
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
  console.error("[HOOK TIMEOUT] validate-disclaimer exceeded 5s limit");
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
    const result = validateDisclaimer(data);
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

function validateDisclaimer(data) {
  const filePath = data.tool_input?.file_path || "";
  const ext = path.extname(filePath).toLowerCase();

  // Only check content/documentation files
  const contentExts = [".md", ".html", ".htm", ".txt", ".rst", ".adoc"];
  if (!contentExts.includes(ext)) {
    return { messages: ["Not a content file -- skipped"] };
  }

  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch {
    return { messages: ["Could not read file"] };
  }

  const messages = [];
  const contentLower = content.toLowerCase();

  // Financial terms that suggest user-facing financial content
  const financialTerms = [
    "return",
    "returns",
    "performance",
    "profit",
    "profits",
    "gain",
    "gains",
    "yield",
    "yields",
    "recommendation",
    "recommendations",
    "investment advice",
    "buy",
    "sell",
    "outperform",
    "underperform",
    "alpha",
    "beat the market",
    "guaranteed",
    "risk-free",
    "backtested",
    "backtest results",
    "historical performance",
    "projected returns",
    "expected returns",
  ];

  // Disclaimer phrases that indicate proper disclosure
  const disclaimerPhrases = [
    "not financial advice",
    "not investment advice",
    "educational purposes",
    "educational use",
    "for educational",
    "for informational purposes",
    "informational purposes only",
    "hypothetical",
    "does not constitute",
    "not a recommendation",
    "past performance",
    "no guarantee",
    "not guaranteed",
    "consult a financial",
    "consult your financial",
    "seek professional",
    "at your own risk",
    "disclaimer",
    "simulated results",
    "hypothetical results",
    "paper trading",
    "not real money",
    "do your own research",
  ];

  // Check if the content contains financial terms
  const foundTerms = financialTerms.filter((term) =>
    contentLower.includes(term),
  );

  if (foundTerms.length === 0) {
    return { messages: ["No financial terms detected -- skipped"] };
  }

  // Check if disclaimer text is present
  const hasDisclaimer = disclaimerPhrases.some((phrase) =>
    contentLower.includes(phrase),
  );

  if (!hasDisclaimer) {
    const basename = path.basename(filePath);
    const termList = foundTerms.slice(0, 5).join(", ");
    const suffix =
      foundTerms.length > 5 ? `, +${foundTerms.length - 5} more` : "";

    messages.push(
      `WARNING: ${basename} contains financial terms (${termList}${suffix}) ` +
        `but no disclaimer text was found. Consider adding a disclaimer such as ` +
        `"for educational purposes only" or "not financial advice".`,
    );
  }

  if (messages.length === 0) {
    messages.push("Financial content has appropriate disclaimers");
  }

  return { messages };
}
