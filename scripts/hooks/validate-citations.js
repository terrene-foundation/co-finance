#!/usr/bin/env node
/**
 * Hook: validate-citations
 * Event: PostToolUse
 * Matcher: Edit|Write
 * Purpose: Warn when academic writing lacks citations.
 *          Checks markdown files for academic indicators (thesis, analysis,
 *          conclusion, evidence, research, argues, demonstrates) and warns
 *          if no citation patterns are found (parenthetical citations like
 *          (Author, Year), footnotes, or reference sections).
 *
 * Only triggers on .md files.
 * All issues are warnings (never blocks).
 *
 * Exit Codes:
 *   0 = success / warn-only
 */

const fs = require("fs");
const path = require("path");

const TIMEOUT_MS = 5000;
const timeout = setTimeout(() => {
  console.error("[HOOK TIMEOUT] validate-citations exceeded 5s limit");
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
    const result = validateCitations(data);
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

function validateCitations(data) {
  const filePath = data.tool_input?.file_path || "";
  const ext = path.extname(filePath).toLowerCase();

  // Only check markdown files
  if (ext !== ".md") {
    return { messages: ["Not a markdown file -- skipped"] };
  }

  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch {
    return { messages: ["Could not read file"] };
  }

  const messages = [];
  const contentLower = content.toLowerCase();

  // Academic indicators that suggest the content is academic writing
  const academicIndicators = [
    "thesis",
    "literature review",
    "methodology",
    "hypothesis",
    "analysis",
    "conclusion",
    "evidence suggests",
    "research",
    "argues that",
    "demonstrates that",
    "findings indicate",
    "according to",
    "empirical",
    "theoretical framework",
    "implications",
    "furthermore",
    "moreover",
    "in contrast",
    "significantly",
    "correlat",
    "regression",
    "p-value",
    "statistically significant",
  ];

  // Check if the content contains academic indicators
  // Require at least 3 matches to reduce false positives on non-academic files
  const foundIndicators = academicIndicators.filter((term) =>
    contentLower.includes(term),
  );

  if (foundIndicators.length < 3) {
    return { messages: ["Not academic content -- skipped"] };
  }

  // Citation patterns to look for
  const citationPatterns = [
    // Parenthetical citations: (Author, Year) or (Author Year) or (Author et al., Year)
    /\([A-Z][a-z]+(?:\s+(?:&|and)\s+[A-Z][a-z]+)*(?:\s+et\s+al\.?)?,?\s*\d{4}[a-z]?\)/,
    // Numbered citations: [1], [2,3], [1-5]
    /\[\d+(?:[,\-]\s*\d+)*\]/,
    // Footnote markers: [^1], [^note]
    /\[\^[\w]+\]/,
    // Reference/Bibliography section header
    /^#{1,3}\s*(?:references|bibliography|works cited|sources)/im,
    // Inline author-year: Author (Year) pattern
    /[A-Z][a-z]+\s+\(\d{4}[a-z]?\)/,
    // DOI links
    /doi\.org/i,
    // Common citation prefixes
    /(?:see|cf\.|e\.g\.,|i\.e\.,)\s+[A-Z][a-z]+/,
  ];

  const hasCitations = citationPatterns.some((pattern) => pattern.test(content));

  if (!hasCitations) {
    const basename = path.basename(filePath);
    const indicatorList = foundIndicators.slice(0, 4).join(", ");
    const suffix =
      foundIndicators.length > 4
        ? `, +${foundIndicators.length - 4} more`
        : "";

    messages.push(
      `WARNING: ${basename} appears to be academic writing (contains: ${indicatorList}${suffix}) ` +
        `but no citation patterns were found. Academic writing should include citations ` +
        `such as (Author, Year) parenthetical references, numbered references [1], ` +
        `or a References/Bibliography section.`,
    );
  }

  if (messages.length === 0) {
    messages.push("Academic content has citations present");
  }

  return { messages };
}
